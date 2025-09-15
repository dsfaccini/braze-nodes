import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
	ApplicationError,
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
						name: 'Create Send ID',
						value: 'createSendId',
						description: 'Generate send identifiers for tracking and analytics',
						action: 'Create send ID',
					},
					{
						name: 'List Scheduled Messages',
						value: 'listScheduledMessages',
						description: 'View all scheduled messages and campaigns',
						action: 'List scheduled messages',
					},
					{
						name: 'Schedule',
						value: 'schedule',
						description: 'Schedule messages for future delivery',
						action: 'Schedule message',
					},
					{
						name: 'Schedule Canvas',
						value: 'scheduleCanvas',
						description: 'Schedule Canvas messages for future delivery',
						action: 'Schedule canvas message',
					},
					{
						name: 'Send',
						value: 'send',
						description: 'Send immediate messages to users (email, SMS, push)',
						action: 'Send message',
					},
					{
						name: 'Send Canvas',
						value: 'sendCanvas',
						description: 'Send Canvas (multi-step campaign) messages via API',
						action: 'Send canvas message',
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
					const targetingOptions = this.getNodeParameter(
						'targetingOptions',
						i,
						{},
					) as any;
					const campaignId = this.getNodeParameter('campaignId', i, '') as string;
					const sendId = this.getNodeParameter('sendId', i, '') as string;
					const recipientSubscriptionState = this.getNodeParameter(
						'recipientSubscriptionState',
						i,
						'subscribed',
					) as string;

					// Message configuration
					const messageChannel = this.getNodeParameter(
						'messageChannel',
						i,
						'email',
					) as string;

					const messages: any = {};

					if (messageChannel === 'email') {
						const appId = this.getNodeParameter('emailAppId', i, '') as string;
						const subject = this.getNodeParameter('emailSubject', i, '') as string;
						const from = this.getNodeParameter('emailFrom', i, '') as string;
						const emailContentType = this.getNodeParameter(
							'emailContentType',
							i,
							'custom',
						) as string;
						const additionalOptions = this.getNodeParameter(
							'additionalEmailOptions',
							i,
							{},
						) as any;

						// Build base email object
						const emailMessage: any = {
							app_id: appId,
							subject,
							from,
						};

						// Add content based on type
						if (emailContentType === 'template') {
							const templateId = this.getNodeParameter(
								'emailTemplateId',
								i,
								'',
							) as string;
							emailMessage.email_template_id = templateId;
						} else {
							const body = this.getNodeParameter('emailBody', i, '') as string;
							emailMessage.body = body;
						}

						// Add additional options if provided
						if (additionalOptions.plainTextBody) {
							emailMessage.plaintext_body = additionalOptions.plainTextBody;
						}
						if (additionalOptions.replyTo) {
							emailMessage.reply_to = additionalOptions.replyTo;
						}
						if (additionalOptions.preheader) {
							emailMessage.preheader = additionalOptions.preheader;
						}

						messages.email = emailMessage;
					} else if (messageChannel === 'sms') {
						const appId = this.getNodeParameter('smsAppId', i, '') as string;
						const messageText = this.getNodeParameter('smsMessage', i, '') as string;
						const subscriptionGroupId = this.getNodeParameter(
							'smsSubscriptionGroupId',
							i,
							'',
						) as string;

						messages.sms = {
							app_id: appId,
							body: messageText,
							...(subscriptionGroupId && {
								subscription_group_id: subscriptionGroupId,
							}),
						};
					} else if (messageChannel === 'push') {
						const appId = this.getNodeParameter('pushAppId', i, '') as string;
						const alert = this.getNodeParameter('pushAlert', i, '') as string;
						const title = this.getNodeParameter('pushTitle', i, '') as string;
						const pushType = this.getNodeParameter(
							'pushType',
							i,
							'apple_push',
						) as string;

						messages[pushType] = {
							app_id: appId,
							alert,
							...(title && { title }),
						};
					}

					// Build request body
					const requestBody: any = {
						broadcast,
						recipient_subscription_state: recipientSubscriptionState,
						messages,
						...(campaignId && { campaign_id: campaignId }),
						...(sendId && { send_id: sendId }),
					};

					// Add targeting - multiple targeting methods can be used together
					let hasTargeting = false;

					// External User IDs
					if (targetingOptions.externalUserIds) {
						const externalUserIds = targetingOptions.externalUserIds
							.split(',')
							.map((id: string) => id.trim())
							.filter((id: string) => id);
						if (externalUserIds.length > 0) {
							requestBody.external_user_ids = externalUserIds;
							hasTargeting = true;
						}
					}

					// User Aliases
					if (targetingOptions.userAliases) {
						try {
							const userAliases = JSON.parse(targetingOptions.userAliases);
							if (Array.isArray(userAliases) && userAliases.length > 0) {
								requestBody.user_aliases = userAliases;
								hasTargeting = true;
							}
						} catch (error) {
							throw new ApplicationError(
								`Invalid user aliases JSON: ${error.message}`,
								{
									cause: error,
								},
							);
						}
					}

					// Segment ID
					if (targetingOptions.segmentId) {
						requestBody.segment_id = targetingOptions.segmentId;
						hasTargeting = true;
					}

					// Audience Filter
					if (
						targetingOptions.audienceFilter &&
						targetingOptions.audienceFilter !== '{}'
					) {
						try {
							requestBody.audience = JSON.parse(targetingOptions.audienceFilter);
							hasTargeting = true;
						} catch (error) {
							throw new ApplicationError(
								`Invalid audience filter JSON: ${error.message}`,
								{
									cause: error,
								},
							);
						}
					}

					// Ensure at least one targeting method is provided
					if (!hasTargeting) {
						throw new ApplicationError(
							'At least one targeting option must be provided (External User IDs, User Aliases, Segment ID, or Audience Filter)',
						);
					}

					requestOptions.body = requestBody;
				} else if (operation === 'sendTransactional') {
					// POST /transactional/v1/campaigns/{campaign_id}/send
					const campaignId = this.getNodeParameter(
						'transactionalCampaignId',
						i,
					) as string;
					const externalUserId = this.getNodeParameter(
						'transactionalExternalUserId',
						i,
					) as string;
					const triggerProperties = this.getNodeParameter(
						'transactionalTriggerProperties',
						i,
						'{}',
					) as string;

					requestOptions.url = `${baseURL}/transactional/v1/campaigns/${campaignId}/send`;
					requestOptions.body = {
						external_user_id: externalUserId,
						...(triggerProperties &&
							triggerProperties !== '{}' && {
								trigger_properties: JSON.parse(triggerProperties),
							}),
					};
				} else if (operation === 'schedule') {
					// POST /messages/schedule/create
					requestOptions.url = `${baseURL}/messages/schedule/create`;

					const scheduleTime = this.getNodeParameter('scheduleTime', i) as string;
					const inLocalTime = this.getNodeParameter('inLocalTime', i, false) as boolean;
					const atOptimalTime = this.getNodeParameter('atOptimalTime', i, false) as boolean;

					const broadcast = this.getNodeParameter('broadcast', i, false) as boolean;
					const targetingOptions = this.getNodeParameter(
						'targetingOptions',
						i,
						{},
					) as any;
					const campaignId = this.getNodeParameter('campaignId', i, '') as string;
					const sendId = this.getNodeParameter('sendId', i, '') as string;
					const recipientSubscriptionState = this.getNodeParameter(
						'recipientSubscriptionState',
						i,
						'subscribed',
					) as string;

					// Message configuration (reuse same logic as send operation)
					const messageChannel = this.getNodeParameter(
						'messageChannel',
						i,
						'email',
					) as string;

					const messages: any = {};

					if (messageChannel === 'email') {
						const appId = this.getNodeParameter('emailAppId', i, '') as string;
						const subject = this.getNodeParameter('emailSubject', i, '') as string;
						const from = this.getNodeParameter('emailFrom', i, '') as string;
						const emailContentType = this.getNodeParameter(
							'emailContentType',
							i,
							'custom',
						) as string;
						const additionalOptions = this.getNodeParameter(
							'additionalEmailOptions',
							i,
							{},
						) as any;

						const emailMessage: any = {
							app_id: appId,
							subject,
							from,
						};

						if (emailContentType === 'template') {
							const templateId = this.getNodeParameter(
								'emailTemplateId',
								i,
								'',
							) as string;
							emailMessage.email_template_id = templateId;
						} else {
							const body = this.getNodeParameter('emailBody', i, '') as string;
							emailMessage.body = body;
						}

						if (additionalOptions.plainTextBody) {
							emailMessage.plaintext_body = additionalOptions.plainTextBody;
						}
						if (additionalOptions.replyTo) {
							emailMessage.reply_to = additionalOptions.replyTo;
						}
						if (additionalOptions.preheader) {
							emailMessage.preheader = additionalOptions.preheader;
						}

						messages.email = emailMessage;
					}

					// Build request body for schedule
					const requestBody: any = {
						broadcast,
						schedule: {
							time: scheduleTime,
							...(inLocalTime && { in_local_time: inLocalTime }),
							...(atOptimalTime && { at_optimal_time: atOptimalTime }),
						},
						messages,
						...(campaignId && { campaign_id: campaignId }),
						...(sendId && { send_id: sendId }),
						recipient_subscription_state: recipientSubscriptionState,
					};

					// Add targeting if not broadcasting
					if (!broadcast) {
						if (targetingOptions.externalUserIds) {
							const userIds = targetingOptions.externalUserIds
								.split(',')
								.map((id: string) => id.trim())
								.filter((id: string) => id);
							if (userIds.length > 0) {
								requestBody.external_user_ids = userIds;
							}
						}
						if (targetingOptions.segmentId) {
							requestBody.segment_id = targetingOptions.segmentId;
						}
						if (targetingOptions.userAliases) {
							requestBody.user_aliases = targetingOptions.userAliases;
						}
						if (targetingOptions.audienceFilter) {
							requestBody.audience = targetingOptions.audienceFilter;
						}
					}

					requestOptions.body = requestBody;
				} else if (operation === 'createSendId') {
					// POST /sends/id/create
					requestOptions.url = `${baseURL}/sends/id/create`;

					const campaignId = this.getNodeParameter('createSendIdCampaignId', i) as string;
					const customSendId = this.getNodeParameter('customSendId', i, '') as string;

					requestOptions.body = {
						campaign_id: campaignId,
						...(customSendId && { send_id: customSendId }),
					};
				} else if (operation === 'sendCanvas') {
					// POST /canvas/trigger/send
					requestOptions.url = `${baseURL}/canvas/trigger/send`;

					const canvasId = this.getNodeParameter('canvasId', i) as string;
					const sendId = this.getNodeParameter('sendId', i, '') as string;
					const broadcast = this.getNodeParameter('broadcast', i, false) as boolean;

					const externalUserIdsString = this.getNodeParameter(
						'externalUserIds',
						i,
						'',
					) as string;
					const externalUserIds = externalUserIdsString
						? externalUserIdsString
								.split(',')
								.map((id) => id.trim())
								.filter((id) => id)
						: [];
					const segmentId = this.getNodeParameter('segmentId', i, '') as string;
					const triggerProperties = this.getNodeParameter(
						'triggerProperties',
						i,
						{},
					) as object;

					requestOptions.body = {
						canvas_id: canvasId,
						...(sendId && { send_id: sendId }),
						...(Object.keys(triggerProperties).length > 0 && {
							trigger_properties: triggerProperties,
						}),
						broadcast,
						...(externalUserIds.length > 0 && {
							recipients: externalUserIds.map((id) => ({ external_user_id: id })),
						}),
						...(segmentId && { audience: { AND: [{ segment: segmentId }] } }),
					};
				} else if (operation === 'scheduleCanvas') {
					// POST /canvas/trigger/schedule/create
					requestOptions.url = `${baseURL}/canvas/trigger/schedule/create`;

					const canvasId = this.getNodeParameter('canvasId', i) as string;
					const sendId = this.getNodeParameter('sendId', i, '') as string;
					const scheduleTime = this.getNodeParameter('scheduleTime', i) as string;
					const inLocalTime = this.getNodeParameter('inLocalTime', i, false) as boolean;
					const atOptimalTime = this.getNodeParameter('atOptimalTime', i, false) as boolean;
					const broadcast = this.getNodeParameter('broadcast', i, false) as boolean;

					const externalUserIdsString = this.getNodeParameter(
						'externalUserIds',
						i,
						'',
					) as string;
					const externalUserIds = externalUserIdsString
						? externalUserIdsString
								.split(',')
								.map((id) => id.trim())
								.filter((id) => id)
						: [];
					const segmentId = this.getNodeParameter('segmentId', i, '') as string;
					const triggerProperties = this.getNodeParameter(
						'triggerProperties',
						i,
						{},
					) as object;

					requestOptions.body = {
						canvas_id: canvasId,
						...(sendId && { send_id: sendId }),
						schedule: {
							time: scheduleTime,
							...(inLocalTime && { in_local_time: inLocalTime }),
							...(atOptimalTime && { at_optimal_time: atOptimalTime }),
						},
						...(Object.keys(triggerProperties).length > 0 && {
							canvas_entry_properties: triggerProperties,
						}),
						broadcast,
						...(externalUserIds.length > 0 && {
							recipients: externalUserIds.map((id) => ({ external_user_id: id })),
						}),
						...(segmentId && { audience: { AND: [{ segment: segmentId }] } }),
					};
				} else if (operation === 'listScheduledMessages') {
					// GET /messages/scheduled_broadcasts
					const endTime = this.getNodeParameter('endTime', i) as string;

					requestOptions.method = 'GET';
					requestOptions.url = `${baseURL}/messages/scheduled_broadcasts?end_time=${encodeURIComponent(endTime)}`;
				}

				response = await this.helpers.httpRequest(requestOptions);

				returnData.push({
					json: response,
					pairedItem: { item: i },
				});
			} catch (error: any) {
				// Extract Braze API error message according to their response structure
				let errorMessage =
					error.response?.data?.errors?.[0]?.message ||
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
