import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { emailTemplateOperations, emailTemplateFields } from './BrazeEmailTemplateDescription';
import { BrazeApi } from '../../credentials/BrazeApi.credentials';

export class BrazeEmailTemplate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Braze Email Template',
		name: 'brazeEmailTemplate',
		icon: { light: 'file:braze-email-template.svg', dark: 'file:braze-email-template.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage email templates in Braze',
		defaults: {
			name: 'Braze Email Template',
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
						name: 'Create',
						value: 'create',
						description: 'Create a new email template',
						action: 'Create email template',
					},
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
						name: 'Get Info',
						value: 'info',
						description: 'Get detailed information about a specific email template',
						action: 'Get email template info',
					},
					{
						name: 'List',
						value: 'list',
						description: 'Get all email templates with filtering options',
						action: 'List email templates',
					},
					{
						name: 'List Content Blocks',
						value: 'listContentBlocks',
						description: 'Get all content blocks with filtering options',
						action: 'List content blocks',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an existing email template',
						action: 'Update email template',
					},
					{
						name: 'Update Content Block',
						value: 'updateContentBlock',
						description: 'Update an existing content block',
						action: 'Update content block',
					},
				],
				default: 'list',
			},
			...emailTemplateOperations,
			...emailTemplateFields,
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

				if (operation === 'create') {
					// POST /templates/email/create
					const templateName = this.getNodeParameter('templateName', i) as string;
					const subject = this.getNodeParameter('subject', i) as string;
					const body = this.getNodeParameter('body', i) as string;
					const plainTextBody = this.getNodeParameter('plainTextBody', i, '') as string;
					const preheader = this.getNodeParameter('preheader', i, '') as string;
					const tagsString = this.getNodeParameter('tags', i, '') as string;
					const shouldInlineCss = this.getNodeParameter(
						'shouldInlineCss',
						i,
						false,
					) as boolean;

					const tags = tagsString
						? tagsString
								.split(',')
								.map((tag) => tag.trim())
								.filter((tag) => tag)
						: [];

					requestOptions.method = 'POST';
					requestOptions.url = `${baseURL}/templates/email/create`;
					requestOptions.body = {
						template_name: templateName,
						subject,
						body,
						...(plainTextBody && { plaintext_body: plainTextBody }),
						...(preheader && { preheader }),
						...(tags.length > 0 && { tags }),
						...(shouldInlineCss && { should_inline_css: shouldInlineCss }),
					};
				} else if (operation === 'list') {
					// GET /templates/email/list
					requestOptions.url = `${baseURL}/templates/email/list`;

					const queryParams: string[] = [];

					const modifiedAfter = this.getNodeParameter(
						'modifiedAfter',
						i,
						undefined,
					) as string;
					if (modifiedAfter) {
						queryParams.push(`modified_after=${encodeURIComponent(modifiedAfter)}`);
					}

					const modifiedBefore = this.getNodeParameter(
						'modifiedBefore',
						i,
						undefined,
					) as string;
					if (modifiedBefore) {
						queryParams.push(`modified_before=${encodeURIComponent(modifiedBefore)}`);
					}

					const limit = this.getNodeParameter('limit', i, 100) as number;
					if (limit !== 100) {
						queryParams.push(`limit=${limit}`);
					}

					const offset = this.getNodeParameter('offset', i, 0) as number;
					if (offset > 0) {
						queryParams.push(`offset=${offset}`);
					}

					if (queryParams.length > 0) {
						requestOptions.url += `?${queryParams.join('&')}`;
					}
				} else if (operation === 'update') {
					// POST /templates/email/update
					const emailTemplateId = this.getNodeParameter('emailTemplateId', i) as string;
					const templateName = this.getNodeParameter('templateName', i, '') as string;
					const subject = this.getNodeParameter('subject', i, '') as string;
					const body = this.getNodeParameter('body', i, '') as string;
					const plainTextBody = this.getNodeParameter('plainTextBody', i, '') as string;
					const preheader = this.getNodeParameter('preheader', i, '') as string;
					const tagsString = this.getNodeParameter('tags', i, '') as string;
					const shouldInlineCss = this.getNodeParameter(
						'shouldInlineCss',
						i,
						undefined,
					) as boolean;

					const tags = tagsString
						? tagsString
								.split(',')
								.map((tag) => tag.trim())
								.filter((tag) => tag)
						: [];

					requestOptions.method = 'POST';
					requestOptions.url = `${baseURL}/templates/email/update`;
					requestOptions.body = {
						email_template_id: emailTemplateId,
						...(templateName && { template_name: templateName }),
						...(subject && { subject }),
						...(body && { body }),
						...(plainTextBody && { plaintext_body: plainTextBody }),
						...(preheader && { preheader }),
						...(tags.length > 0 && { tags }),
						...(shouldInlineCss !== undefined && {
							should_inline_css: shouldInlineCss,
						}),
					};
				} else if (operation === 'getContentBlockInfo') {
					// GET /content_blocks/info
					const contentBlockId = this.getNodeParameter('contentBlockId', i) as string;
					const includeInclusionData = this.getNodeParameter('includeInclusionData', i, false) as boolean;

					const queryParams = [`content_block_id=${encodeURIComponent(contentBlockId)}`];
					if (includeInclusionData) {
						queryParams.push(`include_inclusion_data=${includeInclusionData}`);
					}

					requestOptions.url = `${baseURL}/content_blocks/info?${queryParams.join('&')}`;
				} else if (operation === 'info') {
					// GET /templates/email/info
					const emailTemplateId = this.getNodeParameter('emailTemplateId', i) as string;
					requestOptions.url = `${baseURL}/templates/email/info?email_template_id=${encodeURIComponent(emailTemplateId)}`;
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
						...(description && { description }),
						state,
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
