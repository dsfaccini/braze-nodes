import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
	ApplicationError,
} from 'n8n-workflow';

import { canvasOperations, canvasFields } from './BrazeCanvasDescription';
import { BrazeApi } from '../../credentials/BrazeApi.credentials';

export class BrazeCanvas implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Braze Canvas',
		name: 'brazeCanvas',
		icon: { light: 'file:braze-canvas.svg', dark: 'file:braze-canvas.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage and trigger Braze Canvas campaigns',
		defaults: {
			name: 'Braze Canvas',
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
						name: 'Canvas Analytics',
						value: 'canvasAnalytics',
						description: 'Get time-series analytics data for Canvas campaigns',
						action: 'Get canvas analytics',
					},
					{
						name: 'Canvas Details',
						value: 'canvasDetails',
						description: 'Get detailed information about Canvas campaigns',
						action: 'Get canvas details',
					},
					{
						name: 'Schedule Canvas',
						value: 'scheduleCanvas',
						description: 'Schedule Canvas messages for future delivery',
						action: 'Schedule canvas message',
					},
					{
						name: 'Send Canvas',
						value: 'sendCanvas',
						description: 'Send Canvas (multi-step campaign) messages via API',
						action: 'Send canvas message',
					},
				],
				default: 'sendCanvas',
			},
			...canvasOperations,
			...canvasFields,
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

				if (operation === 'sendCanvas') {
					// POST /canvas/trigger/send
					requestOptions.url = `${baseURL}/canvas/trigger/send`;
					requestOptions.method = 'POST';

					const canvasId = this.getNodeParameter('canvasId', i) as string;
					const sendId = this.getNodeParameter('sendId', i, undefined) as string;
					const broadcast = this.getNodeParameter('broadcast', i, false) as boolean;
					const externalUserIds = this.getNodeParameter('externalUserIds', i, '') as string;
					const segmentId = this.getNodeParameter('segmentId', i, undefined) as string;
					const triggerProperties = this.getNodeParameter('triggerProperties', i, '{}') as string;

					let parsedTriggerProperties = {};
					if (triggerProperties && triggerProperties.trim() !== '') {
						try {
							parsedTriggerProperties = JSON.parse(triggerProperties);
						} catch (error) {
							throw new ApplicationError(`Invalid JSON in trigger properties: ${error.message}`);
						}
					}

					const body: any = {
						canvas_id: canvasId,
						broadcast,
						canvas_entry_properties: parsedTriggerProperties,
					};

					if (sendId) {
						body.send_id = sendId;
					}

					if (!broadcast) {
						if (externalUserIds && externalUserIds.trim()) {
							const userIds = externalUserIds.split(',').map(id => id.trim()).filter(id => id);
							if (userIds.length > 0) {
								body.recipients = [{ external_user_ids: userIds }];
							}
						}
						if (segmentId) {
							body.audience = { segments_to_send: [segmentId] };
						}
					}

					requestOptions.body = body;

				} else if (operation === 'scheduleCanvas') {
					// POST /canvas/trigger/schedule/create
					requestOptions.url = `${baseURL}/canvas/trigger/schedule/create`;
					requestOptions.method = 'POST';

					const canvasId = this.getNodeParameter('canvasId', i) as string;
					const sendId = this.getNodeParameter('sendId', i, undefined) as string;
					const broadcast = this.getNodeParameter('broadcast', i, false) as boolean;
					const externalUserIds = this.getNodeParameter('externalUserIds', i, '') as string;
					const segmentId = this.getNodeParameter('segmentId', i, undefined) as string;
					const triggerProperties = this.getNodeParameter('triggerProperties', i, '{}') as string;
					const scheduleTime = this.getNodeParameter('scheduleTime', i) as string;
					const inLocalTime = this.getNodeParameter('inLocalTime', i, false) as boolean;
					const atOptimalTime = this.getNodeParameter('atOptimalTime', i, false) as boolean;

					let parsedTriggerProperties = {};
					if (triggerProperties && triggerProperties.trim() !== '') {
						try {
							parsedTriggerProperties = JSON.parse(triggerProperties);
						} catch (error) {
							throw new ApplicationError(`Invalid JSON in trigger properties: ${error.message}`);
						}
					}

					const body: any = {
						canvas_id: canvasId,
						broadcast,
						canvas_entry_properties: parsedTriggerProperties,
						schedule: {
							time: scheduleTime,
						},
					};

					if (inLocalTime) {
						body.schedule.in_local_time = inLocalTime;
					}
					if (atOptimalTime) {
						body.schedule.at_optimal_time = atOptimalTime;
					}

					if (sendId) {
						body.send_id = sendId;
					}

					if (!broadcast) {
						if (externalUserIds && externalUserIds.trim()) {
							const userIds = externalUserIds.split(',').map(id => id.trim()).filter(id => id);
							if (userIds.length > 0) {
								body.recipients = [{ external_user_ids: userIds }];
							}
						}
						if (segmentId) {
							body.audience = { segments_to_send: [segmentId] };
						}
					}

					requestOptions.body = body;

				} else if (operation === 'canvasAnalytics') {
					// GET /canvas/data_series
					requestOptions.method = 'GET';
					const canvasId = this.getNodeParameter('canvasId', i) as string;
					const length = this.getNodeParameter('length', i, 14) as number;
					const endingAt = this.getNodeParameter('endingAt', i, undefined) as string;

					const queryParams = [
						`canvas_id=${encodeURIComponent(canvasId)}`,
						`length=${length}`,
					];
					if (endingAt) {
						queryParams.push(`ending_at=${encodeURIComponent(endingAt)}`);
					}

					requestOptions.url = `${baseURL}/canvas/data_series?${queryParams.join('&')}`;

				} else if (operation === 'canvasDetails') {
					// GET /canvas/details
					requestOptions.method = 'GET';
					const canvasId = this.getNodeParameter('canvasId', i) as string;
					const postLaunchDraftVersion = this.getNodeParameter('postLaunchDraftVersion', i, false) as boolean;

					const queryParams = [`canvas_id=${encodeURIComponent(canvasId)}`];
					if (postLaunchDraftVersion) {
						queryParams.push(`post_launch_draft_version=${postLaunchDraftVersion}`);
					}

					requestOptions.url = `${baseURL}/canvas/details?${queryParams.join('&')}`;
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