import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';

export class CloudflareApi implements ICredentialType {
	name = 'cloudflareApi';
	displayName = 'Cloudflare API';
	documentationUrl =
		'https://developers.cloudflare.com/fundamentals/api/get-started/create-token/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			default: '',
			required: true,
			description:
				'The Cloudflare API token. Create one at My Profile → API Tokens in the Cloudflare dashboard.',
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Account ID',
			name: 'accountId',
			type: 'string',
			default: '',
			required: true,
			description:
				'Your Cloudflare account ID. Find it in the right sidebar of your Cloudflare dashboard.',
		},
		{
			displayName: 'Authentication Mode',
			name: 'authMode',
			type: 'options',
			options: [
				{
					name: 'Standard API (D1, AI, and General API)',
					value: 'standard',
					description: 'Use for D1, Workers AI, and other Cloudflare APIs',
				},
				{
					name: 'R2 S3-Compatible',
					value: 'r2',
					description: 'Use for R2 object storage with S3-compatible SDKs',
				},
			],
			default: 'standard',
			description:
				'Choose the authentication mode based on which Cloudflare service you want to use',
		},
		{
			displayName: 'R2 Access Key ID',
			name: 'r2AccessKeyId',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: {
					authMode: ['r2'],
				},
			},
			description: 'The R2 Access Key ID (API Token ID) from your Cloudflare dashboard',
		},
		{
			displayName: 'R2 Secret Access Key',
			name: 'r2SecretAccessKey',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					authMode: ['r2'],
				},
			},
			typeOptions: {
				password: true,
			},
			description: 'The R2 Secret Access Key from your Cloudflare dashboard',
		},
		{
			displayName: 'R2 Jurisdiction',
			name: 'r2Jurisdiction',
			type: 'options',
			options: [
				{
					name: 'Default',
					value: 'default',
				},
				{
					name: 'European Union (EU)',
					value: 'eu',
				},
				{
					name: 'FedRAMP',
					value: 'fedramp',
				},
			],
			default: 'default',
			displayOptions: {
				show: {
					authMode: ['r2'],
				},
			},
			description: 'The jurisdiction for your R2 buckets',
		},
	];

	// This authenticate property is used by the HTTP Request node
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiToken}}',
			},
		},
	};

	// The test endpoint uses the standard API to verify the token works
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.cloudflare.com/client/v4',
			url: '={{"/accounts/" + $credentials.accountId}}',
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiToken}}',
			},
		},
	};

	// Helper method to get R2 credentials
	// This will be used by the R2 node to get S3-compatible credentials
	static getR2Credentials(credentials: ICredentialDataDecryptedObject): {
		accessKeyId: string;
		secretAccessKey: string;
		endpoint: string;
	} {
		const accountId = credentials.accountId as string;
		const jurisdiction = (credentials.r2Jurisdiction as string) || 'default';
		const accessKeyId = credentials.r2AccessKeyId as string;
		const secretAccessKey = credentials.r2SecretAccessKey as string;

		// Determine the endpoint based on jurisdiction
		let endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
		if (jurisdiction === 'eu') {
			endpoint = `https://${accountId}.eu.r2.cloudflarestorage.com`;
		} else if (jurisdiction === 'fedramp') {
			endpoint = `https://${accountId}.fedramp.r2.cloudflarestorage.com`;
		}

		return {
			accessKeyId,
			secretAccessKey,
			endpoint,
		};
	}
}
