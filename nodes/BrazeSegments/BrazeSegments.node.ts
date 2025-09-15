import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { segmentsOperations, segmentsFields } from './BrazeSegmentsDescription';
import { BrazeApi } from '../../credentials/BrazeApi.credentials';

export class BrazeSegments implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Braze Segments',
		name: 'brazeSegments',
		icon: { light: 'file:braze-segments.svg', dark: 'file:braze-segments.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage and get analytics for Braze user segments',
		defaults: {
			name: 'Braze Segments',
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
						name: 'Segment Analytics',
						value: 'segmentAnalytics',
						description: 'Get time-series segment size analytics',
						action: 'Get segment analytics',
					},
					{
						name: 'Segment Details',
						value: 'segmentDetails',
						description: 'Get detailed information about specific segments',
						action: 'Get segment details',
					},
					{
						name: 'Segment List',
						value: 'segmentList',
						description: 'Get list of all segments for analytics filtering',
						action: 'Get segment list',
					},
				],
				default: 'segmentList',
			},
			...segmentsOperations,
			...segmentsFields,
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

				if (operation === 'segmentAnalytics') {
					// GET /segments/data_series
					const segmentId = this.getNodeParameter('segmentId', i) as string;
					const length = this.getNodeParameter('length', i, 14) as number;
					const endingAt = this.getNodeParameter('endingAt', i, undefined) as string;

					const queryParams = [
						`segment_id=${encodeURIComponent(segmentId)}`,
						`length=${length}`,
					];
					if (endingAt) {
						queryParams.push(`ending_at=${encodeURIComponent(endingAt)}`);
					}

					requestOptions.url = `${baseURL}/segments/data_series?${queryParams.join('&')}`;

				} else if (operation === 'segmentDetails') {
					// GET /segments/details
					const segmentId = this.getNodeParameter('segmentId', i) as string;

					requestOptions.url = `${baseURL}/segments/details?segment_id=${encodeURIComponent(segmentId)}`;

				} else if (operation === 'segmentList') {
					// GET /segments/list
					const page = this.getNodeParameter('page', i, undefined) as number;
					const sortDirection = this.getNodeParameter('sortDirection', i, 'asc') as string;

					const queryParams = [];
					if (page !== undefined) {
						queryParams.push(`page=${page}`);
					}
					if (sortDirection && sortDirection !== 'asc') {
						queryParams.push(`sort_direction=${sortDirection}`);
					}

					requestOptions.url = `${baseURL}/segments/list${queryParams.length > 0 ? '?' + queryParams.join('&') : ''}`;
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