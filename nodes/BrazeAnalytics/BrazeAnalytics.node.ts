import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { analyticsOperations, analyticsFields } from './BrazeAnalyticsDescription';
import { BrazeApi } from '../../credentials/BrazeApi.credentials';

export class BrazeAnalytics implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Braze Analytics',
		name: 'brazeAnalytics',
		icon: { light: 'file:braze-analytics.svg', dark: 'file:braze-analytics.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Get analytics data from Braze campaigns and sends',
		defaults: {
			name: 'Braze Analytics',
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
						name: 'Campaign Analytics',
						value: 'campaignAnalytics',
						description: 'Get time-series campaign performance data',
						action: 'Get campaign analytics',
					},
					{
						name: 'Send Analytics',
						value: 'sendAnalytics',
						description: 'Get analytics data for specific sends',
						action: 'Get send analytics',
					},
					{
						name: 'Custom Events',
						value: 'customEvents',
						description: 'Get time-series custom event data',
						action: 'Get custom events analytics',
					},
					{
						name: 'Revenue Data',
						value: 'revenue',
						description: 'Get revenue tracking data over time',
						action: 'Get revenue analytics',
					},
				],
				default: 'campaignAnalytics',
			},
			...analyticsOperations,
			...analyticsFields,
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
					method: 'GET' as IHttpRequestMethods,
					json: true,
				};

				if (operation === 'campaignAnalytics') {
					// GET /campaigns/data_series
					const campaignId = this.getNodeParameter('campaignId', i) as string;
					const length = this.getNodeParameter('length', i, 14) as number;
					const endingAt = this.getNodeParameter('endingAt', i, undefined) as string;

					const queryParams = [`campaign_id=${encodeURIComponent(campaignId)}`, `length=${length}`];
					if (endingAt) {
						queryParams.push(`ending_at=${encodeURIComponent(endingAt)}`);
					}

					requestOptions.url = `${baseURL}/campaigns/data_series?${queryParams.join('&')}`;

				} else if (operation === 'sendAnalytics') {
					// GET /sends/data_series
					const campaignId = this.getNodeParameter('campaignId', i) as string;
					const sendId = this.getNodeParameter('sendId', i) as string;
					const length = this.getNodeParameter('length', i, 14) as number;
					const endingAt = this.getNodeParameter('endingAt', i, undefined) as string;

					const queryParams = [
						`campaign_id=${encodeURIComponent(campaignId)}`,
						`send_id=${encodeURIComponent(sendId)}`,
						`length=${length}`
					];
					if (endingAt) {
						queryParams.push(`ending_at=${encodeURIComponent(endingAt)}`);
					}

					requestOptions.url = `${baseURL}/sends/data_series?${queryParams.join('&')}`;

				} else if (operation === 'customEvents') {
					// GET /events/data_series
					const event = this.getNodeParameter('eventName', i) as string;
					const length = this.getNodeParameter('length', i, 14) as number;
					const unit = this.getNodeParameter('unit', i, 'day') as string;
					const endingAt = this.getNodeParameter('endingAt', i, undefined) as string;
					const appId = this.getNodeParameter('appId', i, undefined) as string;
					const segmentId = this.getNodeParameter('segmentId', i, undefined) as string;

					const queryParams = [`event=${encodeURIComponent(event)}`, `length=${length}`, `unit=${unit}`];
					if (endingAt) {
						queryParams.push(`ending_at=${encodeURIComponent(endingAt)}`);
					}
					if (appId) {
						queryParams.push(`app_id=${encodeURIComponent(appId)}`);
					}
					if (segmentId) {
						queryParams.push(`segment_id=${encodeURIComponent(segmentId)}`);
					}

					requestOptions.url = `${baseURL}/events/data_series?${queryParams.join('&')}`;

				} else if (operation === 'revenue') {
					// GET /purchases/revenue_series
					const length = this.getNodeParameter('length', i, 14) as number;
					const endingAt = this.getNodeParameter('endingAt', i, undefined) as string;
					const appId = this.getNodeParameter('appId', i, undefined) as string;
					const productId = this.getNodeParameter('productId', i, undefined) as string;

					const queryParams = [`length=${length}`];
					if (endingAt) {
						queryParams.push(`ending_at=${encodeURIComponent(endingAt)}`);
					}
					if (appId) {
						queryParams.push(`app_id=${encodeURIComponent(appId)}`);
					}
					if (productId) {
						queryParams.push(`product=${encodeURIComponent(productId)}`);
					}

					requestOptions.url = `${baseURL}/purchases/revenue_series?${queryParams.join('&')}`;
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