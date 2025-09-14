import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { campaignsOperations, campaignsFields } from './BrazeCampaignsDescription';
import { BrazeApi } from '../../credentials/BrazeApi.credentials';

export class BrazeCampaigns implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Braze Campaigns',
		name: 'brazeCampaigns',
		icon: { light: 'file:braze-campaigns.svg', dark: 'file:braze-campaigns.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage and trigger Braze campaigns',
		defaults: {
			name: 'Braze Campaigns',
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
						name: 'List',
						value: 'list',
						description: 'Get all campaigns with optional filtering',
						action: 'List campaigns',
					},
					{
						name: 'Details',
						value: 'details',
						description: 'Get detailed information about a specific campaign',
						action: 'Get campaign details',
					},
					{
						name: 'Trigger',
						value: 'trigger',
						description: 'Trigger sending of an API-triggered campaign',
						action: 'Trigger campaign',
					},
					{
						name: 'Analytics',
						value: 'analytics',
						description: 'Get campaign performance analytics',
						action: 'Get campaign analytics',
					},
				],
				default: 'list',
			},
			...campaignsOperations,
			...campaignsFields,
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

				if (operation === 'list') {
					// GET /campaigns/list
					requestOptions.url = `${baseURL}/campaigns/list`;

					const queryParams: string[] = [];

					const page = this.getNodeParameter('page', i, undefined) as number;
					if (page !== undefined) {
						queryParams.push(`page=${page}`);
					}

					const includeArchived = this.getNodeParameter('includeArchived', i, false) as boolean;
					if (includeArchived) {
						queryParams.push('include_archived=true');
					}

					const sortDirection = this.getNodeParameter('sortDirection', i, 'asc') as string;
					if (sortDirection && sortDirection !== 'asc') {
						queryParams.push(`sort_direction=${sortDirection}`);
					}

					const lastEditTime = this.getNodeParameter('lastEditTime', i, undefined) as string;
					if (lastEditTime) {
						queryParams.push(`last_edit.time[gt]=${encodeURIComponent(lastEditTime)}`);
					}

					if (queryParams.length > 0) {
						requestOptions.url += `?${queryParams.join('&')}`;
					}

				} else if (operation === 'details') {
					// GET /campaigns/details
					const campaignId = this.getNodeParameter('campaignId', i) as string;
					requestOptions.url = `${baseURL}/campaigns/details?campaign_id=${encodeURIComponent(campaignId)}`;

					const postLaunchDraft = this.getNodeParameter('postLaunchDraftVersion', i, false) as boolean;
					if (postLaunchDraft) {
						requestOptions.url += '&post_launch_draft_version=true';
					}

				} else if (operation === 'trigger') {
					// POST /campaigns/trigger/send
					const campaignId = this.getNodeParameter('campaignId', i) as string;
					const sendId = this.getNodeParameter('sendId', i, undefined) as string;
					const broadcast = this.getNodeParameter('broadcast', i, false) as boolean;
					const externalUserIdsString = this.getNodeParameter('externalUserIds', i, '') as string;
					const externalUserIds = externalUserIdsString ? externalUserIdsString.split(',').map(id => id.trim()).filter(id => id) : [];
					const segmentId = this.getNodeParameter('segmentId', i, undefined) as string;
					const triggerProperties = this.getNodeParameter('triggerProperties', i, {}) as object;

					requestOptions.method = 'POST';
					requestOptions.url = `${baseURL}/campaigns/trigger/send`;
					requestOptions.body = {
						campaign_id: campaignId,
						...(sendId && { send_id: sendId }),
						...(Object.keys(triggerProperties).length > 0 && { trigger_properties: triggerProperties }),
						broadcast,
						...(externalUserIds.length > 0 && { recipients: externalUserIds.map(id => ({ external_user_id: id })) }),
						...(segmentId && { audience: { AND: [{ segment: segmentId }] } }),
					};

				} else if (operation === 'analytics') {
					// GET /campaigns/data_series
					const campaignId = this.getNodeParameter('campaignId', i) as string;
					const length = this.getNodeParameter('length', i, 14) as number;
					const endingAt = this.getNodeParameter('endingAt', i, undefined) as string;

					const queryParams = [`campaign_id=${encodeURIComponent(campaignId)}`, `length=${length}`];
					if (endingAt) {
						queryParams.push(`ending_at=${encodeURIComponent(endingAt)}`);
					}

					requestOptions.url = `${baseURL}/campaigns/data_series?${queryParams.join('&')}`;
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