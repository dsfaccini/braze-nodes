import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { sendMessageOperations, sendMessageFields } from './BrazeSendMessageDescription';
import { BrazeApi } from '../../credentials/BrazeApi.credentials';

export class BrazeSendMessage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Braze Send Message',
		name: 'brazeSendMessage',
		icon: { light: 'file:braze-send-message.svg', dark: 'file:braze-send-message.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Send immediate messages using Braze API',
		defaults: {
			name: 'Braze Send Message',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'brazeApi',
				displayName: 'Braze API connection',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send immediate messages to users (email, SMS, push)',
						action: 'Send message',
					},
					{
						name: 'Send Transactional',
						value: 'sendTransactional',
						description: 'Send transactional messages using pre-configured campaign',
						action: 'Send transactional message',
					},
				],
				default: 'send',
			},
			...sendMessageOperations,
			...sendMessageFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('brazeApi');
		const apiKey = credentials.apiKey as string;
		const instance = credentials.instance as string;

		// Get the correct endpoint URL based on instance
		const baseURL = BrazeApi.getInstanceEndpoint(instance);

		for (let i = 0; i < items.length; i++) {
			try {
				let response;
				const requestOptions: any = {
					headers: {
						Authorization: `Bearer ${apiKey}`,
						'Content-Type': 'application/json',
					},
					method: 'POST' as IHttpRequestMethods,
					json: true,
				};

				if (operation === 'send') {
					// POST /messages/send
					requestOptions.url = `${baseURL}/messages/send`;

					const broadcast = this.getNodeParameter('broadcast', i, false) as boolean;
					const externalUserIdsString = this.getNodeParameter('externalUserIds', i, '') as string;
					const externalUserIds = externalUserIdsString ? externalUserIdsString.split(',').map(id => id.trim()).filter(id => id) : [];
					const segmentId = this.getNodeParameter('segmentId', i, '') as string;
					const campaignId = this.getNodeParameter('campaignId', i, '') as string;
					const sendId = this.getNodeParameter('sendId', i, '') as string;
					const recipientSubscriptionState = this.getNodeParameter('recipientSubscriptionState', i, 'subscribed') as string;

					// Message configuration
					const messageChannel = this.getNodeParameter('messageChannel', i, 'email') as string;

					const messages: any = {};

					if (messageChannel === 'email') {
						const appId = this.getNodeParameter('emailAppId', i, '') as string;
						const subject = this.getNodeParameter('emailSubject', i, '') as string;
						const from = this.getNodeParameter('emailFrom', i, '') as string;
						const body = this.getNodeParameter('emailBody', i, '') as string;
						const plainTextBody = this.getNodeParameter('emailPlainTextBody', i, '') as string;
						const replyTo = this.getNodeParameter('emailReplyTo', i, '') as string;
						const preheader = this.getNodeParameter('emailPreheader', i, '') as string;

						messages.email = {
							app_id: appId,
							subject,
							from,
							body,
							...(plainTextBody && { plaintext_body: plainTextBody }),
							...(replyTo && { reply_to: replyTo }),
							...(preheader && { preheader }),
						};
					} else if (messageChannel === 'sms') {
						const appId = this.getNodeParameter('smsAppId', i, '') as string;
						const messageText = this.getNodeParameter('smsMessage', i, '') as string;
						const subscriptionGroupId = this.getNodeParameter('smsSubscriptionGroupId', i, '') as string;

						messages.sms = {
							app_id: appId,
							body: messageText,
							...(subscriptionGroupId && { subscription_group_id: subscriptionGroupId }),
						};
					} else if (messageChannel === 'push') {
						const appId = this.getNodeParameter('pushAppId', i, '') as string;
						const alert = this.getNodeParameter('pushAlert', i, '') as string;
						const title = this.getNodeParameter('pushTitle', i, '') as string;
						const pushType = this.getNodeParameter('pushType', i, 'apple_push') as string;

						messages[pushType] = {
							app_id: appId,
							alert,
							...(title && { title }),
						};
					}

					requestOptions.body = {
						broadcast,
						...(externalUserIds.length > 0 && { external_user_ids: externalUserIds }),
						...(segmentId && { segment_id: segmentId }),
						...(campaignId && { campaign_id: campaignId }),
						...(sendId && { send_id: sendId }),
						recipient_subscription_state: recipientSubscriptionState,
						messages,
					};

				} else if (operation === 'sendTransactional') {
					// POST /transactional/v1/campaigns/{campaign_id}/send
					const campaignId = this.getNodeParameter('transactionalCampaignId', i) as string;
					const externalUserId = this.getNodeParameter('transactionalExternalUserId', i) as string;
					const triggerProperties = this.getNodeParameter('transactionalTriggerProperties', i, '{}') as string;

					requestOptions.url = `${baseURL}/transactional/v1/campaigns/${campaignId}/send`;
					requestOptions.body = {
						external_user_id: externalUserId,
						...(triggerProperties && triggerProperties !== '{}' && {
							trigger_properties: JSON.parse(triggerProperties)
						}),
					};
				}

				response = await this.helpers.httpRequest(requestOptions);

				returnData.push({
					json: response,
					pairedItem: { item: i },
				});

			} catch (error: any) {
				// Extract Braze API error message according to their response structure
				let errorMessage = error.response?.data?.errors?.[0]?.message ||
								error.response?.data?.message ||
								error.message;

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
							originalError: error.message,
							httpCode: error.httpCode,
							brazeErrorCode: error.response?.data?.errors?.[0]?.code,
						},
						pairedItem: { item: i },
					});
					continue;
				}

				// Create enhanced error for throw
				const enhancedError = new Error(errorMessage);
				(enhancedError as any).httpCode = error.httpCode;
				(enhancedError as any).originalError = error.message;
				(enhancedError as any).brazeErrorCode = error.response?.data?.errors?.[0]?.code;
				throw enhancedError;
			}
		}

		return [returnData];
	}
}