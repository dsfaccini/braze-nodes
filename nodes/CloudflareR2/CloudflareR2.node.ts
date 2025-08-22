import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeApiError,
	ApplicationError,
} from 'n8n-workflow';

import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { AwsSignatureV4 } from './awsSignatureV4';

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
				displayName: 'Cloudflare API key connection',
				required: true,
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

		// Validate credentials
		if (!r2Credentials.accessKeyId || !r2Credentials.secretAccessKey || !r2Credentials.endpoint) {
			throw new NodeApiError(this.getNode(), {
				message: 'R2 credentials are missing or invalid. Please check your Cloudflare API credentials configuration.',
				description: 'Missing R2 Access Key ID, Secret Access Key, or Account ID. Make sure to set Auth Mode to "R2 S3-Compatible" and provide both R2 credentials.',
			});
		}

		// Helper functions
		const node = this.getNode();

		// Custom HTTP request function for basic operations
		const makeR2Request = async (options: {
			method: string;
			path: string;
			credentials: any;
			headers?: Record<string, string>;
			body?: Buffer | string;
			returnRaw?: boolean;
		}): Promise<any> => {
			const { method, path, credentials, headers = {}, body, returnRaw } = options;
			const url = `${credentials.endpoint}${path}`;

			// Sign the request
			const signedHeaders = AwsSignatureV4.sign({
				method,
				url,
				headers,
				body,
				accessKeyId: credentials.accessKeyId,
				secretAccessKey: credentials.secretAccessKey,
				region: 'auto',
				service: 's3',
			});

			// Make the request
			const response = await fetch(url, {
				method,
				headers: signedHeaders,
				body,
			});

			if (!response.ok) {
				const errorText = await response.text();
				const error = parseErrorResponse(errorText);
				const errorMessage =
					error.message || `R2 Error: ${response.status} ${response.statusText}`;
				const errorData: any = {
					message: errorMessage,
					httpCode: response.status.toString(),
				};
				if (error.code) {
					errorData.description = error.code;
				}
				throw new NodeApiError(node, errorData);
			}

			if (returnRaw) {
				return response;
			}

			const text = await response.text();
			return { text, headers: response.headers };
		};

		// Parser functions
		const parseListBucketsResponse = (response: any): any => {
			// Parse XML response
			const bucketMatches = response.text.match(/<Bucket>[\s\S]*?<\/Bucket>/g) || [];
			const buckets = bucketMatches.map((bucketXml: string) => {
				const name = bucketXml.match(/<Name>(.*?)<\/Name>/)?.[1] || '';
				const creationDate =
					bucketXml.match(/<CreationDate>(.*?)<\/CreationDate>/)?.[1] || '';
				return { Name: name, CreationDate: creationDate };
			});

			const owner = response.text.match(/<Owner>[\s\S]*?<\/Owner>/)?.[0];
			let ownerData = null;
			if (owner) {
				const id = owner.match(/<ID>(.*?)<\/ID>/)?.[1] || '';
				const displayName = owner.match(/<DisplayName>(.*?)<\/DisplayName>/)?.[1] || '';
				ownerData = { ID: id, DisplayName: displayName };
			}

			return {
				buckets,
				owner: ownerData,
			};
		};

		const parseListObjectsV2Response = (response: any): any => {
			// Parse XML response
			const contentsMatches = response.text.match(/<Contents>[\s\S]*?<\/Contents>/g) || [];
			const objects = contentsMatches.map((contentXml: string) => {
				const key = contentXml.match(/<Key>(.*?)<\/Key>/)?.[1] || '';
				const lastModified =
					contentXml.match(/<LastModified>(.*?)<\/LastModified>/)?.[1] || '';
				const etag = contentXml.match(/<ETag>"?(.*?)"?<\/ETag>/)?.[1] || '';
				const size = contentXml.match(/<Size>(.*?)<\/Size>/)?.[1] || '0';
				const storageClass =
					contentXml.match(/<StorageClass>(.*?)<\/StorageClass>/)?.[1] || 'STANDARD';

				// Decode HTML entities and remove quotes
				const decodedEtag = etag
					.replace(/&quot;/g, '"')
					.replace(/&amp;/g, '&')
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&#39;/g, "'")
					.replace(/"/g, '');

				return {
					Key: key,
					LastModified: lastModified,
					ETag: decodedEtag,
					Size: parseInt(size, 10),
					StorageClass: storageClass,
				};
			});

			const name = response.text.match(/<Name>(.*?)<\/Name>/)?.[1] || '';
			const keyCount = response.text.match(/<KeyCount>(.*?)<\/KeyCount>/)?.[1] || '0';
			const isTruncated =
				response.text.match(/<IsTruncated>(.*?)<\/IsTruncated>/)?.[1] === 'true';

			return {
				name,
				objects,
				keyCount: parseInt(keyCount, 10),
				isTruncated,
			};
		};

		const parseCopyObjectResponse = (response: any): any => {
			const etag = response.text.match(/<ETag>"?(.*?)"?<\/ETag>/)?.[1] || '';
			const lastModified =
				response.text.match(/<LastModified>(.*?)<\/LastModified>/)?.[1] || '';

			// Decode HTML entities and remove quotes
			const decodedEtag = etag
				.replace(/&quot;/g, '"')
				.replace(/&amp;/g, '&')
				.replace(/&lt;/g, '<')
				.replace(/&gt;/g, '>')
				.replace(/&#39;/g, "'")
				.replace(/"/g, '');

			return {
				ETag: decodedEtag,
				LastModified: lastModified,
			};
		};

		const parseErrorResponse = (errorText: string): { code?: string; message?: string } => {
			const code = errorText.match(/<Code>(.*?)<\/Code>/)?.[1];
			const message = errorText.match(/<Message>(.*?)<\/Message>/)?.[1];

			return {
				code,
				message: message || errorText,
			};
		};

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'bucket') {
					if (operation === 'list') {
						const response = await makeR2Request({
							method: 'GET',
							path: '/',
							credentials: r2Credentials,
						});
						const buckets = parseListBucketsResponse(response);
						returnData.push({
							json: buckets,
						});
					} else if (operation === 'create') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						await makeR2Request({
							method: 'PUT',
							path: `/${bucketName}`,
							credentials: r2Credentials,
						});
						returnData.push({
							json: {
								success: true,
								bucket: bucketName,
							},
						});
					} else if (operation === 'delete') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						try {
							await makeR2Request({
								method: 'DELETE',
								path: `/${bucketName}`,
								credentials: r2Credentials,
							});
							returnData.push({
								json: {
									success: true,
									bucket: bucketName,
								},
							});
						} catch (error: any) {
							if (error.status === 409 || error.httpCode === '409' || error.message?.includes('409')) {
								throw new ApplicationError(`Cannot delete bucket '${bucketName}': Bucket must be completely empty before deletion. Please ensure all objects, including hidden files and incomplete multipart uploads, are removed first. You may need to check the bucket manually in the Cloudflare dashboard.`);
							}
							throw error;
						}
					} else if (operation === 'getInfo') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const response = await makeR2Request({
							method: 'GET',
							path: `/${bucketName}?list-type=2&max-keys=1`,
							credentials: r2Credentials,
						});
						const info = parseListObjectsV2Response(response);
						returnData.push({
							json: {
								bucket: bucketName,
								keyCount: info.keyCount || 0,
								name: info.name,
							},
						});
					}
				} else if (resource === 'object') {
					if (operation === 'list') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const prefix = this.getNodeParameter('prefix', i, '') as string;
						const maxKeys = this.getNodeParameter('maxKeys', i, 1000) as number;

						const queryParams = new URLSearchParams({
							'list-type': '2',
							'max-keys': maxKeys.toString(),
						});
						if (prefix) {
							queryParams.set('prefix', prefix);
						}

						const response = await makeR2Request({
							method: 'GET',
							path: `/${bucketName}?${queryParams.toString()}`,
							credentials: r2Credentials,
						});
						const result = parseListObjectsV2Response(response);
						returnData.push({
							json: result,
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
								await makeR2Request({
									method: 'GET',
									path: `/${bucketName}?list-type=2&max-keys=1`,
									credentials: r2Credentials,
								});
							} catch (error: any) {
								if (error.message.includes('NoSuchBucket')) {
									await makeR2Request({
										method: 'PUT',
										path: `/${bucketName}`,
										credentials: r2Credentials,
									});
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

						const response = await makeR2Request({
							method: 'PUT',
							path: `/${bucketName}/${objectKey}`,
							body: binaryData,
							headers: {
								'Content-Type': mimeType || 'application/octet-stream',
							},
							credentials: r2Credentials,
						});

						returnData.push({
							json: {
								success: true,
								bucket: bucketName,
								key: objectKey,
								etag: response.headers.get('etag') || undefined,
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

						const response = await makeR2Request({
							method: 'GET',
							path: `/${bucketName}/${objectKey}`,
							credentials: r2Credentials,
							returnRaw: true,
						});

						const buffer = Buffer.from(await response.arrayBuffer());
						const contentType =
							response.headers.get('content-type') || 'application/octet-stream';

						const binaryData = await this.helpers.prepareBinaryData(
							buffer,
							objectKey,
							contentType,
						);

						returnData.push({
							json: {
								bucket: bucketName,
								key: objectKey,
								contentType,
								contentLength: response.headers.get('content-length'),
								lastModified: response.headers.get('last-modified'),
								etag: response.headers.get('etag'),
							},
							binary: {
								[binaryPropertyName]: binaryData,
							},
						});
					} else if (operation === 'delete') {
						const bucketName = this.getNodeParameter('bucketName', i) as string;
						const objectKey = this.getNodeParameter('objectKey', i) as string;

						await makeR2Request({
							method: 'DELETE',
							path: `/${bucketName}/${objectKey}`,
							credentials: r2Credentials,
						});
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

						const response = await makeR2Request({
							method: 'PUT',
							path: `/${destinationBucket}/${destinationKey}`,
							headers: {
								'x-amz-copy-source': `/${sourceBucket}/${sourceKey}`,
							},
							credentials: r2Credentials,
						});

						const copyResult = parseCopyObjectResponse(response);
						returnData.push({
							json: {
								success: true,
								sourceBucket,
								sourceKey,
								destinationBucket,
								destinationKey,
								copyResult,
							},
						});
					} else if (operation === 'getPresignedUrl') {
						try {
							const bucketName = this.getNodeParameter('bucketName', i) as string;
							const objectKey = this.getNodeParameter('objectKey', i) as string;
							const urlOperation = this.getNodeParameter('urlOperation', i) as string;
							const expiresIn = this.getNodeParameter('expiresIn', i, 3600) as number;

							// Create S3Client only for presigned URLs
							const s3Client = new S3Client({
								region: 'auto',
								endpoint: r2Credentials.endpoint,
								credentials: {
									accessKeyId: r2Credentials.accessKeyId,
									secretAccessKey: r2Credentials.secretAccessKey,
								},
								forcePathStyle: true,
							});

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
						} catch (error: any) {
							throw new NodeApiError(node, {
								message: `R2 Get Presigned URL Error: ${error.message || 'Unknown error'}`,
								description: error.name || 'Presigned URL generation failed',
								httpCode: error.$metadata?.httpStatusCode?.toString() || '500',
							});
						}
					}
				}
			} catch (error: any) {
				// Extract Cloudflare API error message
				let errorMessage = error.response?.data?.errors?.[0]?.message || error.message;

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
							originalError: error.message,
							httpCode: error.httpCode,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}

				// Create enhanced error for throw
				const enhancedError = new Error(errorMessage);
				(enhancedError as any).httpCode = error.httpCode;
				(enhancedError as any).originalError = error.message;
				throw enhancedError;
			}
		}

		return [returnData];
	}
}
