import {
	ITriggerFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	ITriggerResponse,
	IHttpRequestMethods,
} from 'n8n-workflow';

export class CloudflareQueueTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare Queue Trigger',
		name: 'cloudflareQueueTrigger',
		icon: { light: 'file:cloudflare-queue.svg', dark: 'file:cloudflare-queue.svg' },
		group: ['trigger'],
		version: 1,
		description: 'Trigger on new messages from Cloudflare Queue',
		defaults: {
			name: 'Cloudflare Queue Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'cloudflareApi',
				displayName: 'Cloudflare API key connection',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Queue ID',
				name: 'queueId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the queue to monitor',
			},
			{
				displayName: 'Polling Interval',
				name: 'pollingInterval',
				type: 'number',
				default: 30,
				description: 'How often to check for new messages (in seconds)',
				typeOptions: {
					minValue: 5,
				},
			},
			{
				displayName: 'Batch Size',
				name: 'batchSize',
				type: 'number',
				default: 10,
				description: 'Maximum number of messages to pull at once (1-100)',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: 'Visibility Timeout',
				name: 'visibilityTimeout',
				type: 'number',
				default: 300,
				description: 'Time in seconds that messages are hidden from other consumers',
			},
			{
				displayName: 'Auto Acknowledge',
				name: 'autoAcknowledge',
				type: 'boolean',
				default: true,
				description:
					'Whether to automatically acknowledge messages after successful processing',
			},
			{
				displayName: 'Max Retries',
				name: 'maxRetries',
				type: 'number',
				default: 3,
				description: 'Maximum number of times to retry failed messages',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const queueId = this.getNodeParameter('queueId') as string;
		const pollingInterval = this.getNodeParameter('pollingInterval', 30) as number;
		const batchSize = this.getNodeParameter('batchSize', 10) as number;
		const visibilityTimeout = this.getNodeParameter('visibilityTimeout', 300) as number;
		const autoAcknowledge = this.getNodeParameter('autoAcknowledge', true) as boolean;
		const maxRetries = this.getNodeParameter('maxRetries', 3) as number;

		// Get credentials
		const credentials = await this.getCredentials('cloudflareApi');
		const accountId = credentials.accountId as string;
		const apiToken = credentials.apiToken as string;

		const baseURL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/queues/${queueId}`;

		let isActive = true;
		const messageRetries = new Map<string, number>();

		const pullMessages = async () => {
			if (!isActive) return;

			try {
				const requestOptions = {
					headers: {
						Authorization: `Bearer ${apiToken}`,
						'Content-Type': 'application/json',
					},
					method: 'POST' as IHttpRequestMethods,
					url: `${baseURL}/messages/pull`,
					json: true,
					body: {
						batch_size: batchSize,
						visibility_timeout_ms: visibilityTimeout * 1000,
					},
				};

				const response = await this.helpers.httpRequest(requestOptions);

				if (response.success && response.result && response.result.length > 0) {
					const messages = response.result;
					const processedLeaseIds: string[] = [];
					const failedLeaseIds: string[] = [];

					// Process each message
					for (const message of messages) {
						try {
							const executionData: INodeExecutionData[] = [
								{
									json: {
										id: message.id,
										body: message.body,
										timestamp: message.timestamp_ms,
										attempts: message.attempts,
										lease_id: message.lease_id,
									},
									meta: {
										lease_id: message.lease_id,
									},
								},
							];

							// Emit the message
							this.emit([executionData]);

							if (autoAcknowledge) {
								processedLeaseIds.push(message.lease_id);
							}
						} catch (error) {
							this.logger.error(`Error processing message ${message.id}:`, error);

							// Track retry count
							const retryCount = messageRetries.get(message.lease_id) || 0;
							if (retryCount < maxRetries) {
								messageRetries.set(message.lease_id, retryCount + 1);
								failedLeaseIds.push(message.lease_id);
							} else {
								// Max retries reached, acknowledge to prevent infinite retries
								processedLeaseIds.push(message.lease_id);
								messageRetries.delete(message.lease_id);
								this.logger.error(
									`Message ${message.id} exceeded max retries, acknowledging`,
								);
							}
						}
					}

					// Acknowledge successfully processed messages
					if (processedLeaseIds.length > 0) {
						try {
							await this.helpers.httpRequest({
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
								method: 'POST' as IHttpRequestMethods,
								url: `${baseURL}/messages/ack`,
								json: true,
								body: {
									acks: processedLeaseIds.map((leaseId) => ({
										lease_id: leaseId,
									})),
								},
							});
						} catch (error) {
							this.logger.error('Error acknowledging messages:', error);
						}
					}

					// Retry failed messages with exponential backoff
					if (failedLeaseIds.length > 0) {
						try {
							const retries = failedLeaseIds.map((leaseId) => {
								const retryCount = messageRetries.get(leaseId) || 0;
								const retryDelay = Math.min(300, Math.pow(2, retryCount) * 5); // Exponential backoff, max 5 minutes
								return {
									lease_id: leaseId,
									retry_delay_seconds: retryDelay,
								};
							});

							await this.helpers.httpRequest({
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
								method: 'POST' as IHttpRequestMethods,
								url: `${baseURL}/messages/ack`,
								json: true,
								body: {
									retries,
								},
							});
						} catch (error) {
							this.logger.error('Error retrying messages:', error);
						}
					}
				}
			} catch (error) {
				this.logger.error('Error polling queue:', error);
			}

			// Schedule next poll
			if (isActive) {
				setTimeout(pullMessages, pollingInterval * 1000);
			}
		};

		// Start polling
		pullMessages();

		// Manual trigger function for testing
		const manualTriggerFunction = async () => {
			await pullMessages();
		};

		// Close function to stop polling
		const closeFunction = async () => {
			isActive = false;
		};

		return {
			closeFunction,
			manualTriggerFunction,
		};
	}
}
