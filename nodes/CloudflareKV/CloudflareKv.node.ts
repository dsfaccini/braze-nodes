import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { kvOperations, kvFields } from './CloudflareKVDescription';

export class CloudflareKV implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare KV',
		name: 'cloudflareKv',
		icon: { light: 'file:cloudflare-kv.svg', dark: 'file:cloudflare-kv.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Store and retrieve data from Cloudflare Workers KV',
		defaults: {
			name: 'Cloudflare KV',
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
						name: 'Namespace',
						value: 'namespace',
					},
					{
						name: 'Key-Value',
						value: 'keyValue',
					},
				],
				default: 'keyValue',
			},
			...kvOperations,
			...kvFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('cloudflareApi');
		const accountId = credentials.accountId as string;
		const apiToken = credentials.apiToken as string;

		const baseURL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`;

		for (let i = 0; i < items.length; i++) {
			try {
				let response;
				const requestOptions: any = {
					headers: {
						Authorization: `Bearer ${apiToken}`,
						'Content-Type': 'application/json',
					},
					method: 'GET' as IHttpRequestMethods,
					json: true,
				};

				if (resource === 'namespace') {
					if (operation === 'list') {
						requestOptions.url = baseURL;
						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'create') {
						const title = this.getNodeParameter('namespaceTitle', i) as string;
						requestOptions.method = 'POST';
						requestOptions.url = baseURL;
						requestOptions.body = { title };
						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'delete') {
						const namespaceId = this.getNodeParameter('namespaceId', i) as string;
						requestOptions.method = 'DELETE';
						requestOptions.url = `${baseURL}/${namespaceId}`;
						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: {
								success: true,
								namespaceId,
							},
						});
					}
				} else if (resource === 'keyValue') {
					const namespaceId = this.getNodeParameter('namespaceId', i) as string;

					if (operation === 'get') {
						const key = this.getNodeParameter('key', i) as string;
						requestOptions.url = `${baseURL}/${namespaceId}/values/${encodeURIComponent(key)}`;
						// For KV get, we need to handle the response as text
						delete requestOptions.json;
						requestOptions.returnFullResponse = true;

						try {
							response = await this.helpers.httpRequest(requestOptions);
							const metadata = response.headers['cf-kv-metadata'];
							returnData.push({
								json: {
									key,
									value: response.body,
									metadata: metadata ? JSON.parse(metadata) : undefined,
								},
							});
						} catch (error: any) {
							if (error.statusCode === 404) {
								returnData.push({
									json: {
										key,
										value: null,
										error: 'Key not found',
									},
								});
							} else {
								throw error;
							}
						}
					} else if (operation === 'set') {
						const key = this.getNodeParameter('key', i) as string;
						const value = this.getNodeParameter('value', i) as string;
						const expiration = this.getNodeParameter('expiration', i, undefined) as
							| number
							| undefined;
						const expirationTtl = this.getNodeParameter(
							'expirationTtl',
							i,
							undefined,
						) as number | undefined;
						const metadata = this.getNodeParameter('metadata', i, {}) as object;

						requestOptions.method = 'PUT';
						requestOptions.url = `${baseURL}/${namespaceId}/values/${encodeURIComponent(key)}`;

						// Build query parameters
						const queryParams = new URLSearchParams();
						if (expiration) queryParams.append('expiration', expiration.toString());
						if (expirationTtl)
							queryParams.append('expiration_ttl', expirationTtl.toString());

						if (queryParams.toString()) {
							requestOptions.url += `?${queryParams.toString()}`;
						}

						// KV stores values as text, so we need to send raw body
						delete requestOptions.json;
						requestOptions.body = value;
						requestOptions.headers['Content-Type'] = 'text/plain';

						// Add metadata if provided
						if (Object.keys(metadata).length > 0) {
							requestOptions.headers['CF-KV-Metadata'] = JSON.stringify(metadata);
						}

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: {
								success: true,
								key,
								value,
								expiration,
								expirationTtl,
								metadata,
							},
						});
					} else if (operation === 'delete') {
						const key = this.getNodeParameter('key', i) as string;
						requestOptions.method = 'DELETE';
						requestOptions.url = `${baseURL}/${namespaceId}/values/${encodeURIComponent(key)}`;
						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: {
								success: true,
								key,
							},
						});
					} else if (operation === 'listKeys') {
						const prefix = this.getNodeParameter('prefix', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 1000) as number;
						const cursor = this.getNodeParameter('cursor', i, '') as string;

						const queryParams = new URLSearchParams();
						if (prefix) queryParams.append('prefix', prefix);
						queryParams.append('limit', limit.toString());
						if (cursor) queryParams.append('cursor', cursor);

						requestOptions.url = `${baseURL}/${namespaceId}/keys?${queryParams.toString()}`;
						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'getMultiple') {
						const keys = (this.getNodeParameter('keys', i) as string)
							.split(',')
							.map((k) => k.trim());
						const results: any[] = [];

						// KV doesn't have a bulk get endpoint, so we need to make multiple requests
						for (const key of keys) {
							requestOptions.url = `${baseURL}/${namespaceId}/values/${encodeURIComponent(key)}`;
							delete requestOptions.json;
							requestOptions.returnFullResponse = true;

							try {
								const keyResponse = await this.helpers.httpRequest(requestOptions);
								const metadata = keyResponse.headers['cf-kv-metadata'];
								results.push({
									key,
									value: keyResponse.body,
									metadata: metadata ? JSON.parse(metadata) : undefined,
								});
							} catch (error: any) {
								if (error.statusCode === 404) {
									results.push({
										key,
										value: null,
										error: 'Key not found',
									});
								} else {
									throw error;
								}
							}
						}

						returnData.push({
							json: {
								results,
							},
						});
					} else if (operation === 'setMultiple') {
						const pairs = this.getNodeParameter('keyValuePairs.pair', i, []) as Array<{
							key: string;
							value: string;
							expiration?: number;
							metadata?: object;
						}>;

						const bulkData = pairs.map((pair) => ({
							key: pair.key,
							value: pair.value,
							expiration: pair.expiration,
							metadata: pair.metadata || {},
						}));

						requestOptions.method = 'PUT';
						requestOptions.url = `${baseURL}/${namespaceId}/bulk`;
						requestOptions.body = bulkData;

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'deleteMultiple') {
						const keys = (this.getNodeParameter('keys', i) as string)
							.split(',')
							.map((k) => k.trim());

						requestOptions.method = 'DELETE';
						requestOptions.url = `${baseURL}/${namespaceId}/bulk`;
						requestOptions.body = keys;

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
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
