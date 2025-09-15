import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { contentBlocksOperations, contentBlocksFields } from './BrazeContentBlocksDescription';
import { BrazeApi } from '../../credentials/BrazeApi.credentials';

export class BrazeContentBlocks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Braze Content Blocks',
		name: 'brazeContentBlocks',
		icon: { light: 'file:braze-content-blocks.svg', dark: 'file:braze-content-blocks.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage reusable content blocks for Braze email templates',
		defaults: {
			name: 'Braze Content Blocks',
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
						name: 'Create Content Block',
						value: 'createContentBlock',
						description: 'Create a new reusable content block',
						action: 'Create content block',
					},
					{
						name: 'Get Content Block Info',
						value: 'getContentBlockInfo',
						description: 'Get detailed information about a specific content block',
						action: 'Get content block info',
					},
					{
						name: 'List Content Blocks',
						value: 'listContentBlocks',
						description: 'Get all content blocks with filtering options',
						action: 'List content blocks',
					},
					{
						name: 'Update Content Block',
						value: 'updateContentBlock',
						description: 'Update an existing content block',
						action: 'Update content block',
					},
				],
				default: 'listContentBlocks',
			},
			...contentBlocksOperations,
			...contentBlocksFields,
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

				if (operation === 'getContentBlockInfo') {
					// GET /content_blocks/info
					const contentBlockId = this.getNodeParameter('contentBlockId', i) as string;
					const includeInclusionData = this.getNodeParameter('includeInclusionData', i, false) as boolean;

					const queryParams = [`content_block_id=${encodeURIComponent(contentBlockId)}`];
					if (includeInclusionData) {
						queryParams.push(`include_inclusion_data=${includeInclusionData}`);
					}

					requestOptions.url = `${baseURL}/content_blocks/info?${queryParams.join('&')}`;

				} else if (operation === 'listContentBlocks') {
					// GET /content_blocks/list
					requestOptions.url = `${baseURL}/content_blocks/list`;

					const queryParams = [];
					const modifiedAfter = this.getNodeParameter('modifiedAfter', i, undefined) as string;
					const modifiedBefore = this.getNodeParameter('modifiedBefore', i, undefined) as string;
					const limit = this.getNodeParameter('limit', i, undefined) as number;
					const offset = this.getNodeParameter('offset', i, undefined) as number;

					if (modifiedAfter) {
						queryParams.push(`modified_after=${encodeURIComponent(modifiedAfter)}`);
					}
					if (modifiedBefore) {
						queryParams.push(`modified_before=${encodeURIComponent(modifiedBefore)}`);
					}
					if (limit !== undefined) {
						queryParams.push(`limit=${limit}`);
					}
					if (offset !== undefined) {
						queryParams.push(`offset=${offset}`);
					}

					if (queryParams.length > 0) {
						requestOptions.url += `?${queryParams.join('&')}`;
					}

				} else if (operation === 'createContentBlock') {
					// POST /content_blocks/create
					requestOptions.method = 'POST';
					requestOptions.url = `${baseURL}/content_blocks/create`;

					const name = this.getNodeParameter('contentBlockName', i) as string;
					const content = this.getNodeParameter('contentBlockContent', i) as string;
					const description = this.getNodeParameter('contentBlockDescription', i, '') as string;
					const state = this.getNodeParameter('contentBlockState', i, 'active') as string;
					const tagsString = this.getNodeParameter('contentBlockTags', i, '') as string;

					const tags = tagsString
						? tagsString
								.split(',')
								.map((tag) => tag.trim())
								.filter((tag) => tag)
						: [];

					requestOptions.body = {
						name,
						content,
						state,
						...(description && { description }),
						...(tags.length > 0 && { tags }),
					};

				} else if (operation === 'updateContentBlock') {
					// POST /content_blocks/update
					requestOptions.method = 'POST';
					requestOptions.url = `${baseURL}/content_blocks/update`;

					const contentBlockId = this.getNodeParameter('contentBlockId', i) as string;
					const name = this.getNodeParameter('contentBlockName', i, '') as string;
					const content = this.getNodeParameter('contentBlockContent', i, '') as string;
					const description = this.getNodeParameter('contentBlockDescription', i, '') as string;
					const state = this.getNodeParameter('contentBlockState', i, 'active') as string;
					const tagsString = this.getNodeParameter('contentBlockTags', i, '') as string;

					const tags = tagsString
						? tagsString
								.split(',')
								.map((tag) => tag.trim())
								.filter((tag) => tag)
						: [];

					requestOptions.body = {
						content_block_id: contentBlockId,
						...(name && { name }),
						...(content && { content }),
						...(description && { description }),
						state,
						...(tags.length > 0 && { tags }),
					};
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