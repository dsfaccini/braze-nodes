import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import {
	S3Client,
	ListBucketsCommand,
	CreateBucketCommand,
	DeleteBucketCommand,
	ListObjectsV2Command,
	GetObjectCommand,
	PutObjectCommand,
	DeleteObjectCommand,
	CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { bucketOperations, bucketFields } from './CloudflareR2BucketDescription';
import { objectOperations, objectFields } from './CloudflareR2ObjectDescription';

export class CloudflareR2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare R2',
		name: 'cloudflareR2',
		icon: { light: 'file:cloudflare-r2.svg', dark: 'file:cloudflare-r2.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Store and retrieve objects from Cloudflare R2',
		defaults: {
			name: 'Cloudflare R2',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'cloudflareApi',
				required: true,
				displayOptions: {
					show: {
						'@credentials.authMode': ['r2'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Bucket',
						value: 'bucket',
					},
					{
						name: 'Object',
						value: 'object',
					},
				],
				default: 'object',
			},
			...bucketOperations,
			...bucketFields,
			...objectOperations,
			...objectFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('cloudflareApi');

		// Import CloudflareApi to use the static method
		const { CloudflareApi } = await import('../../credentials/CloudflareApi.credentials');
		const r2Credentials = CloudflareApi.getR2Credentials(credentials);

		// Create S3 client with R2 credentials
		const s3Client = new S3Client({
			region: 'auto',
			endpoint: r2Credentials.endpoint,
			credentials: {
				accessKeyId: r2Credentials.accessKeyId,
				secretAccessKey: r2Credentials.secretAccessKey,
			},
		});

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'bucket') {
					if (operation === 'list') {
						const command = new ListBucketsCommand({});
						const response = await s3Client.send(command);
						returnData.push({
							json: {
								buckets: response.Buckets || [],
								owner: response.Owner,
							},
						});
					} else if (operation === 'create') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const command = new CreateBucketCommand({
							Bucket: bucketName,
						});
						await s3Client.send(command);
						returnData.push({
							json: {
								success: true,
								bucket: bucketName,
							},
						});
					} else if (operation === 'delete') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const command = new DeleteBucketCommand({
							Bucket: bucketName,
						});
						await s3Client.send(command);
						returnData.push({
							json: {
								success: true,
								bucket: bucketName,
							},
						});
					} else if (operation === 'getInfo') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						// List objects to get bucket info
						const command = new ListObjectsV2Command({
							Bucket: bucketName,
							MaxKeys: 1,
						});
						const response = await s3Client.send(command);
						returnData.push({
							json: {
								bucket: bucketName,
								keyCount: response.KeyCount || 0,
								name: response.Name,
							},
						});
					}
				} else if (resource === 'object') {
					if (operation === 'list') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const prefix = this.getNodeParameter('prefix', i, '') as string;
						const maxKeys = this.getNodeParameter('maxKeys', i, 1000) as number;

						const command = new ListObjectsV2Command({
							Bucket: bucketName,
							Prefix: prefix || undefined,
							MaxKeys: maxKeys,
						});
						const response = await s3Client.send(command);
						returnData.push({
							json: {
								objects: response.Contents || [],
								keyCount: response.KeyCount || 0,
								isTruncated: response.IsTruncated || false,
							},
						});
					} else if (operation === 'upload') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const objectKey = this.getNodeParameter('objectKey', i) as string;
						const binaryPropertyName = this.getNodeParameter(
							'binaryPropertyName',
							i,
						) as string;
						const createBucketIfNotExists = this.getNodeParameter(
							'createBucketIfNotExists',
							i,
							false,
						) as boolean;

						// Handle bucket creation if needed
						if (createBucketIfNotExists) {
							try {
								const listCommand = new ListObjectsV2Command({
									Bucket: bucketName,
									MaxKeys: 1,
								});
								await s3Client.send(listCommand);
							} catch (error: any) {
								if (error.name === 'NoSuchBucket') {
									const createCommand = new CreateBucketCommand({
										Bucket: bucketName,
									});
									await s3Client.send(createCommand);
								} else {
									throw error;
								}
							}
						}

						// Get binary data
						const binaryData = await this.helpers.getBinaryDataBuffer(
							i,
							binaryPropertyName,
						);
						const mimeType = items[i].binary![binaryPropertyName].mimeType;

						const command = new PutObjectCommand({
							Bucket: bucketName,
							Key: objectKey,
							Body: binaryData,
							ContentType: mimeType,
						});
						const response = await s3Client.send(command);
						returnData.push({
							json: {
								success: true,
								bucket: bucketName,
								key: objectKey,
								etag: response.ETag,
							},
						});
					} else if (operation === 'download') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const objectKey = this.getNodeParameter('objectKey', i) as string;
						const binaryPropertyName = this.getNodeParameter(
							'binaryPropertyName',
							i,
							'data',
						) as string;

						const command = new GetObjectCommand({
							Bucket: bucketName,
							Key: objectKey,
						});
						const response = await s3Client.send(command);

						// Convert stream to buffer
						const chunks: Uint8Array[] = [];
						for await (const chunk of response.Body as any) {
							chunks.push(chunk);
						}
						const buffer = Buffer.concat(chunks);

						const binaryData = await this.helpers.prepareBinaryData(
							buffer,
							objectKey,
							response.ContentType,
						);

						returnData.push({
							json: {
								bucket: bucketName,
								key: objectKey,
								contentType: response.ContentType,
								contentLength: response.ContentLength,
								lastModified: response.LastModified,
								etag: response.ETag,
							},
							binary: {
								[binaryPropertyName]: binaryData,
							},
						});
					} else if (operation === 'delete') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const objectKey = this.getNodeParameter('objectKey', i) as string;

						const command = new DeleteObjectCommand({
							Bucket: bucketName,
							Key: objectKey,
						});
						await s3Client.send(command);
						returnData.push({
							json: {
								success: true,
								bucket: bucketName,
								key: objectKey,
							},
						});
					} else if (operation === 'copy') {
						const sourceBucket = this.getNodeParameter('sourceBucket', i) as string;
						const sourceKey = this.getNodeParameter('sourceKey', i) as string;
						const destinationBucket = this.getNodeParameter(
							'destinationBucket',
							i,
						) as string;
						const destinationKey = this.getNodeParameter('destinationKey', i) as string;

						const command = new CopyObjectCommand({
							CopySource: `${sourceBucket}/${sourceKey}`,
							Bucket: destinationBucket,
							Key: destinationKey,
						});
						const response = await s3Client.send(command);
						returnData.push({
							json: {
								success: true,
								sourceBucket,
								sourceKey,
								destinationBucket,
								destinationKey,
								copyResult: response.CopyObjectResult,
							},
						});
					} else if (operation === 'getPresignedUrl') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const objectKey = this.getNodeParameter('objectKey', i) as string;
						const urlOperation = this.getNodeParameter('urlOperation', i) as string;
						const expiresIn = this.getNodeParameter('expiresIn', i, 3600) as number;

						let command;
						if (urlOperation === 'get') {
							command = new GetObjectCommand({
								Bucket: bucketName,
								Key: objectKey,
							});
						} else {
							command = new PutObjectCommand({
								Bucket: bucketName,
								Key: objectKey,
							});
						}

						const url = await getSignedUrl(s3Client, command, { expiresIn });
						returnData.push({
							json: {
								url,
								bucket: bucketName,
								key: objectKey,
								operation: urlOperation,
								expiresIn,
							},
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
