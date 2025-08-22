import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IHttpRequestMethods,
	NodeOperationError,
} from 'n8n-workflow';

// Cloudflare AI node implementation
export class CloudflareAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cloudflare AI',
		name: 'cloudflareAi',
		icon: { light: 'file:cloudflare-ai.svg', dark: 'file:cloudflare-ai.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Use Cloudflare Workers AI models for text, image, and audio processing',
		defaults: {
			name: 'Cloudflare AI',
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
						name: 'Text',
						value: 'text',
					},
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Audio',
						value: 'audio',
					},
					{
						name: 'Embedding',
						value: 'embeddings',
					},
				],
				default: 'text',
			},
			// Text operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['text'],
					},
				},
				options: [
					{
						name: 'Chat Completion',
						value: 'chatCompletion',
						description: 'Generate chat completions using LLMs',
						action: 'Generate chat completion',
					},
					{
						name: 'Text Generation',
						value: 'textGeneration',
						description: 'Generate text from a prompt',
						action: 'Generate text',
					},
					{
						name: 'Text Classification',
						value: 'textClassification',
						description: 'Classify text into categories',
						action: 'Classify text',
					},
					{
						name: 'Summarization',
						value: 'summarization',
						description: 'Summarize text content',
						action: 'Summarize text',
					},
				],
				default: 'chatCompletion',
			},
			// Image operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['image'],
					},
				},
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate images from text',
						action: 'Generate image',
					},
					{
						name: 'Classification',
						value: 'classification',
						description: 'Classify images',
						action: 'Classify image',
					},
				],
				default: 'generate',
			},
			// Audio operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['audio'],
					},
				},
				options: [
					{
						name: 'Speech to Text',
						value: 'speechToText',
						description: 'Convert speech to text',
						action: 'Convert speech to text',
					},
					{
						name: 'Text to Speech',
						value: 'textToSpeech',
						description: 'Convert text to speech',
						action: 'Convert text to speech',
					},
				],
				default: 'speechToText',
			},
			// Embeddings operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['embeddings'],
					},
				},
				options: [
					{
						name: 'Generate',
						value: 'generate',
						description: 'Generate embeddings from text',
						action: 'Generate embeddings',
					},
				],
				default: 'generate',
			},
			// Model selection for text
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['text'],
						operation: ['chatCompletion', 'textGeneration'],
					},
				},
				options: [
					{
						name: 'Llama 3.1 8B Instruct',
						value: '@cf/meta/llama-3.1-8b-instruct',
					},
					{
						name: 'Llama 3 8B Instruct',
						value: '@cf/meta/llama-3-8b-instruct',
					},
					{
						name: 'Mistral 7B Instruct',
						value: '@cf/mistral/mistral-7b-instruct-v0.1',
					},
					{
						name: 'Gemma 7B',
						value: '@cf/google/gemma-7b-it',
					},
				],
				default: '@cf/meta/llama-3.1-8b-instruct',
				description: 'The AI model to use',
			},
			// Messages for chat completion
			{
				displayName: 'Messages',
				name: 'messages',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						resource: ['text'],
						operation: ['chatCompletion'],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						displayName: 'Message',
						name: 'messageValues',
						values: [
							{
								displayName: 'Role',
								name: 'role',
								type: 'options',
								options: [
									{
										name: 'System',
										value: 'system',
									},
									{
										name: 'User',
										value: 'user',
									},
									{
										name: 'Assistant',
										value: 'assistant',
									},
								],
								default: 'user',
							},
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								default: '',
								typeOptions: {
									rows: 2,
								},
							},
						],
					},
				],
				description: 'The messages for the chat completion',
			},
			// Prompt for text generation
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['text'],
						operation: ['textGeneration'],
					},
				},
				default: '',
				description: 'The prompt for text generation',
				typeOptions: {
					rows: 4,
				},
			},
			// Text input for various operations
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['text'],
						operation: ['textClassification', 'summarization'],
					},
				},
				default: '',
				description: 'The text to process',
				typeOptions: {
					rows: 4,
				},
			},
			// Text input for embeddings
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['embeddings'],
					},
				},
				default: '',
				description: 'The text to generate embeddings for',
				typeOptions: {
					rows: 4,
				},
			},
			// Image generation prompt
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['generate'],
					},
				},
				default: '',
				description: 'The prompt for image generation',
			},
			// Binary property for image/audio input
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['image'],
						operation: ['classification'],
					},
				},
				default: 'data',
				description: 'Name of the binary property containing the image',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['audio'],
						operation: ['speechToText'],
					},
				},
				default: 'data',
				description: 'Name of the binary property containing the audio',
			},
			// Text to speech input
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['audio'],
						operation: ['textToSpeech'],
					},
				},
				default: '',
				description: 'The text to convert to speech',
			},
			// Additional options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['text'],
						operation: ['chatCompletion', 'textGeneration'],
					},
				},
				options: [
					{
						displayName: 'Max Tokens',
						name: 'max_tokens',
						type: 'number',
						default: 256,
						description: 'Maximum number of tokens to generate',
					},
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 0.7,
						typeOptions: {
							minValue: 0,
							maxValue: 2,
							numberPrecision: 1,
						},
						description: 'Sampling temperature (0-2)',
					},
					{
						displayName: 'Stream',
						name: 'stream',
						type: 'boolean',
						default: false,
						description: 'Whether to stream the response',
					},
				],
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

		const baseURL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run`;

		for (let i = 0; i < items.length; i++) {
			try {
				let response;
				const requestOptions: any = {
					headers: {
						Authorization: `Bearer ${apiToken}`,
						'Content-Type': 'application/json',
					},
					method: 'POST' as IHttpRequestMethods,
					url: '',
					json: true,
				};

				if (resource === 'text') {
					if (operation === 'chatCompletion' || operation === 'textGeneration') {
						const model = this.getNodeParameter('model', i) as string;
						requestOptions.url = `${baseURL}/${model}`;

						if (operation === 'chatCompletion') {
							const messages = this.getNodeParameter(
								'messages.messageValues',
								i,
								[],
							) as Array<{ role: string; content: string }>;
							const options = this.getNodeParameter('options', i, {}) as any;

							requestOptions.body = {
								messages,
								...options,
							};
						} else {
							const prompt = this.getNodeParameter('prompt', i) as string;
							const options = this.getNodeParameter('options', i, {}) as any;

							requestOptions.body = {
								prompt,
								...options,
							};
						}
					} else if (operation === 'textClassification') {
						const text = this.getNodeParameter('text', i) as string;
						requestOptions.url = `${baseURL}/@cf/huggingface/distilbert-sst-2-int8`;
						requestOptions.body = {
							text,
						};
					} else if (operation === 'summarization') {
						const text = this.getNodeParameter('text', i) as string;
						requestOptions.url = `${baseURL}/@cf/facebook/bart-large-cnn`;
						requestOptions.body = {
							input_text: text,
						};
					}
				} else if (resource === 'image') {
					if (operation === 'generate') {
						const prompt = this.getNodeParameter('prompt', i) as string;
						requestOptions.url = `${baseURL}/@cf/stabilityai/stable-diffusion-xl-base-1.0`;
						requestOptions.body = {
							prompt,
						};
						requestOptions.encoding = null;
					} else if (operation === 'classification') {
						const binaryPropertyName = this.getNodeParameter(
							'binaryPropertyName',
							i,
						) as string;
						const binaryData = await this.helpers.getBinaryDataBuffer(
							i,
							binaryPropertyName,
						);

						requestOptions.url = `${baseURL}/@cf/microsoft/resnet-50`;
						requestOptions.headers!['Content-Type'] = 'application/octet-stream';
						requestOptions.body = binaryData;
					}
				} else if (resource === 'audio') {
					if (operation === 'speechToText') {
						const binaryPropertyName = this.getNodeParameter(
							'binaryPropertyName',
							i,
						) as string;
						const binaryData = await this.helpers.getBinaryDataBuffer(
							i,
							binaryPropertyName,
						);

						requestOptions.url = `${baseURL}/@cf/openai/whisper`;
						requestOptions.headers!['Content-Type'] = 'application/octet-stream';
						requestOptions.body = binaryData;
					} else if (operation === 'textToSpeech') {
						const text = this.getNodeParameter('text', i) as string;
						requestOptions.url = `${baseURL}/@cf/meta/m2m100-1.2b`;
						requestOptions.body = {
							text,
							target_lang: 'en', // Default to English
						};
					}
				} else if (resource === 'embeddings') {
					const text = this.getNodeParameter('text', i) as string;
					requestOptions.url = `${baseURL}/@cf/baai/bge-base-en-v1.5`;
					requestOptions.body = {
						text: [text], // API expects array of texts
					};
				}

				// Handle image generation separately since it returns binary data
				if (resource === 'image' && operation === 'generate') {
					requestOptions.encoding = 'buffer';
					const imageResponse = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'cloudflareApi',
						requestOptions,
					);

					const binaryData = await this.helpers.prepareBinaryData(
						imageResponse as Buffer,
						'generated-image.png',
						'image/png',
					);

					returnData.push({
						json: {
							success: true,
						},
						binary: {
							data: binaryData,
						},
					});
				} else {
					// Handle JSON responses
					response = await this.helpers.httpRequestWithAuthentication.call(this, 'cloudflareApi', requestOptions);

					if (response.success !== false) {
						returnData.push({
							json: response.result || response,
						});
					} else {
						throw new NodeOperationError(
							this.getNode(),
							response.errors?.[0]?.message || 'Request failed',
						);
					}
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
