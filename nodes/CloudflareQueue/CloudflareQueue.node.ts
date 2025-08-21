import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { queueOperations, queueFields } from './CloudflareQueueDescription';

export class CloudflareQueue implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Queue',
		name: 'cloudflareQueue',
		icon: { light: 'file:cloudflare-queue.svg', dark: 'file:cloudflare-queue.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Send and receive messages using Cloudflare Queues',
		defaults: {
			name: 'Cloudflare Queue',
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
						'@credentials.authMode': ['standard'],
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
						name: 'Queue',
						value: 'queue',
					},
					{
						name: 'Message',
						value: 'message',
					},
				],
				default: 'message',
			},
			...queueOperations,
			...queueFields,
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

		const baseURL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/queues`;

		for (let i = 0; i < items.length; i++) {
			try {
				let response;
				const requestOptions: any = {
					headers: {
						Authorization: `Bearer ${apiToken}`,
						'Content-Type': 'application/json',
					},
					method: 'GET' as IHttpRequestMethods,
					uri: '',
					json: true,
				};

				if (resource === 'queue') {
					if (operation === 'list') {
						requestOptions.uri = baseURL;
						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'create') {
						const queueName = this.getNodeParameter('queueName', i) as string;
						const settings = this.getNodeParameter('settings', i, {}) as any;

						requestOptions.method = 'POST';
						requestOptions.uri = baseURL;
						requestOptions.body = {
							queue_name: queueName,
							...settings,
						};

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'update') {
						const queueId = this.getNodeParameter('queueId', i) as string;
						const settings = this.getNodeParameter('settings', i, {}) as any;

						requestOptions.method = 'PUT';
						requestOptions.uri = `${baseURL}/${queueId}`;
						requestOptions.body = settings;

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'delete') {
						const queueId = this.getNodeParameter('queueId', i) as string;

						requestOptions.method = 'DELETE';
						requestOptions.uri = `${baseURL}/${queueId}`;

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: {
								success: true,
								queueId,
							},
						});
					} else if (operation === 'getInfo') {
						const queueId = this.getNodeParameter('queueId', i) as string;

						requestOptions.uri = `${baseURL}/${queueId}`;
						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					}
				} else if (resource === 'message') {
					const queueId = this.getNodeParameter('queueId', i) as string;

					if (operation === 'send') {
						const messageBody = this.getNodeParameter('messageBody', i) as string;
						const delaySeconds = this.getNodeParameter('delaySeconds', i, 0) as number;

						requestOptions.method = 'POST';
						requestOptions.uri = `${baseURL}/${queueId}/messages`;

						const messageData: any = {
							body: messageBody,
						};

						if (delaySeconds > 0) {
							messageData.delay_seconds = delaySeconds;
						}

						requestOptions.body = [messageData];

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'sendBatch') {
						const messages = this.getNodeParameter('messages.message', i, []) as Array<{
							body: string;
							delaySeconds?: number;
						}>;

						requestOptions.method = 'POST';
						requestOptions.uri = `${baseURL}/${queueId}/messages`;

						const messagesData = messages.map((msg) => {
							const messageData: any = {
								body: msg.body,
							};
							if (msg.delaySeconds && msg.delaySeconds > 0) {
								messageData.delay_seconds = msg.delaySeconds;
							}
							return messageData;
						});

						requestOptions.body = messagesData;

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'pull') {
						const batchSize = this.getNodeParameter('batchSize', i, 10) as number;
						const visibilityTimeout = this.getNodeParameter(
							'visibilityTimeout',
							i,
							30,
						) as number;

						requestOptions.method = 'POST';
						requestOptions.uri = `${baseURL}/${queueId}/messages/pull`;
						requestOptions.body = {
							batch_size: batchSize,
							visibility_timeout_ms: visibilityTimeout * 1000, // Convert to milliseconds
						};

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'acknowledge') {
						const leaseIds = (this.getNodeParameter('leaseIds', i) as string)
							.split(',')
							.map((id) => id.trim())
							.filter((id) => id.length > 0);

						requestOptions.method = 'POST';
						requestOptions.uri = `${baseURL}/${queueId}/messages/ack`;
						requestOptions.body = {
							acks: leaseIds.map((leaseId) => ({ lease_id: leaseId })),
						};

						response = await this.helpers.httpRequest(requestOptions);
						returnData.push({
							json: response,
						});
					} else if (operation === 'retry') {
						const leaseIds = (this.getNodeParameter('leaseIds', i) as string)
							.split(',')
							.map((id) => id.trim())
							.filter((id) => id.length > 0);
						const retryDelaySeconds = this.getNodeParameter(
							'retryDelaySeconds',
							i,
							0,
						) as number;

						requestOptions.method = 'POST';
						requestOptions.uri = `${baseURL}/${queueId}/messages/ack`;

						const retries = leaseIds.map((leaseId) => {
							const retryData: any = { lease_id: leaseId };
							if (retryDelaySeconds > 0) {
								retryData.retry_delay_seconds = retryDelaySeconds;
							}
							return retryData;
						});

						requestOptions.body = {
							retries,
						};

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
