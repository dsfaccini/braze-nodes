import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
	NodeOperationError,
} from 'n8n-workflow';

export class CloudflareD1 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare D1',
		name: 'cloudflareD1',
		icon: { light: 'file:cloudflare-d1.svg', dark: 'file:cloudflare-d1.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Query and manage Cloudflare D1 serverless SQL databases',
		defaults: {
			name: 'Cloudflare D1',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'cloudflareApi',
				displayName: 'Cloudflare API key connection',
				required: true,
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
						name: 'Database',
						value: 'database',
					},
					{
						name: 'Query',
						value: 'query',
					},
				],
				default: 'query',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['database'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new D1 database',
						action: 'Create a database',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a D1 database',
						action: 'Delete a database',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all D1 databases',
						action: 'List databases',
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['query'],
					},
				},
				options: [
					{
						name: 'Execute',
						value: 'execute',
						description: 'Execute a SQL query',
						action: 'Execute query',
					},
					{
						name: 'Execute Raw',
						value: 'executeRaw',
						description: 'Execute a SQL query and return raw results',
						action: 'Execute raw query',
					},
				],
				default: 'execute',
			},
			{
				displayName: 'Database Name',
				name: 'databaseName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['create', 'delete'],
					},
				},
				default: '',
				description: 'The name of the D1 database',
			},
			{
				displayName: 'Database ID',
				name: 'databaseId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['query'],
					},
				},
				default: '',
				description: 'The ID of the D1 database',
			},
			{
				displayName: 'SQL Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['query'],
					},
				},
				default: '',
				description: 'The SQL query to execute',
				typeOptions: {
					editor: 'sqlEditor',
					rows: 5,
				},
			},
			{
				displayName: 'Query Parameters',
				name: 'parameters',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['query'],
					},
				},
				default: '[]',
				description: 'Parameters for parameterized queries (as JSON array)',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['list'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 50,
						description: 'Max number of results to return',
					},
				],
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['database'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Primary Location Hint',
						name: 'primary_location_hint',
						type: 'string',
						default: '',
						description:
							'Primary location hint for the database (e.g., "wnam" for Western North America)',
					},
				],
			},
			{
				displayName: 'Performance Warning',
				name: 'performanceNotice',
				type: 'notice',
				displayOptions: {
					show: {
						resource: ['query'],
					},
				},
				default: '',
				description:
					'The D1 REST API is not optimized for performance. For production use, consider using a Cloudflare Worker as a proxy for better performance.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('cloudflareApi');

		const accountId = credentials.accountId as string;
		const apiToken = credentials.apiToken as string;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const baseURL = 'https://api.cloudflare.com/client/v4';

		for (let i = 0; i < items.length; i++) {
			try {
				let response;
				const requestOptions: any = {
					headers: {
						Authorization: `Bearer ${apiToken}`,
						'Content-Type': 'application/json',
					},
					method: 'GET' as IHttpRequestMethods,
					url: '',
					json: true,
				};

				if (resource === 'database') {
					if (operation === 'list') {
						const limit = this.getNodeParameter('options.limit', i, 100) as number;
						requestOptions.url = `${baseURL}/accounts/${accountId}/d1/database?limit=${limit}`;
						requestOptions.method = 'GET';
					} else if (operation === 'create') {
						const databaseName = this.getNodeParameter('databaseName', i) as string;
						const primaryLocationHint = this.getNodeParameter(
							'additionalOptions.primary_location_hint',
							i,
							'',
						) as string;

						requestOptions.url = `${baseURL}/accounts/${accountId}/d1/database`;
						requestOptions.method = 'POST';
						requestOptions.body = {
							name: databaseName,
						};

						if (primaryLocationHint) {
							requestOptions.body.primary_location_hint = primaryLocationHint;
						}
					} else if (operation === 'delete') {
						const databaseName = this.getNodeParameter('databaseName', i) as string;
						// First, we need to get the database ID from the name
						const listResponse = await this.helpers.httpRequest({
							method: 'GET',
							url: `${baseURL}/accounts/${accountId}/d1/database`,
							headers: {
								Authorization: `Bearer ${apiToken}`,
							},
						});

						const database = listResponse.result.find(
							(db: any) => db.name === databaseName,
						);
						if (!database) {
							throw new NodeOperationError(
								this.getNode(),
								`Database "${databaseName}" not found`,
								{ itemIndex: i },
							);
						}

						requestOptions.url = `${baseURL}/accounts/${accountId}/d1/database/${database.uuid}`;
						requestOptions.method = 'DELETE';
					}
				} else if (resource === 'query') {
					const databaseId = this.getNodeParameter('databaseId', i) as string;
					const query = this.getNodeParameter('query', i) as string;
					const parametersJson = this.getNodeParameter('parameters', i, '[]') as string;

					let parameters;
					try {
						parameters = JSON.parse(parametersJson);
						if (!Array.isArray(parameters)) {
							throw new NodeOperationError(
								this.getNode(),
								'Parameters must be a JSON array',
							);
						}
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`Invalid parameters JSON: ${error.message}`,
						);
					}

					if (operation === 'execute') {
						requestOptions.url = `${baseURL}/accounts/${accountId}/d1/database/${databaseId}/query`;
					} else if (operation === 'executeRaw') {
						requestOptions.url = `${baseURL}/accounts/${accountId}/d1/database/${databaseId}/raw`;
					}

					requestOptions.method = 'POST';
					requestOptions.body = {
						sql: query,
						params: parameters,
					};
				}

				response = await this.helpers.httpRequest(requestOptions);

				if (response.success) {
					if (resource === 'query') {
						// For queries, return the results
						returnData.push({
							json: {
								results: response.result,
								meta: response.meta || {},
								success: true,
							},
						});
					} else {
						// For database operations
						returnData.push({
							json: response.result || { success: true },
						});
					}
				} else {
					throw new NodeOperationError(
						this.getNode(),
						response.errors?.[0]?.message || 'Request failed',
					);
				}
			} catch (error: any) {
				// Extract Cloudflare API error message
				let errorMessage = error.response?.data?.errors?.[0]?.message || error.message;

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: errorMessage,
							originalError: error.message,
							httpCode: error.httpCode,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				
				// Create enhanced error for throw
				const enhancedError = new Error(errorMessage);
				(enhancedError as any).httpCode = error.httpCode;
				(enhancedError as any).originalError = error.message;
				throw enhancedError;
			}
		}

		return [returnData];
	}
}
