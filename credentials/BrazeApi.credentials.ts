import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BrazeApi implements ICredentialType {
	name = 'brazeApi';
	displayName = 'Braze API';
	documentationUrl = 'https://www.braze.com/docs/api/api_key/';
	properties: INodeProperties[] = [
		{
			displayName: 'REST API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			required: true,
			description:
				'Your Braze REST API key. Create one in Settings > APIs and Identifiers with the required permissions for your use case.',
			typeOptions: {
				password: true,
			},
		},
		{
			displayName: 'Instance',
			name: 'instance',
			type: 'options',
			options: [
				{
					name: 'US-01 (dashboard-01.braze.com)',
					value: 'us-01',
				},
				{
					name: 'US-02 (dashboard-02.braze.com)',
					value: 'us-02',
				},
				{
					name: 'US-03 (dashboard-03.braze.com)',
					value: 'us-03',
				},
				{
					name: 'US-04 (dashboard-04.braze.com)',
					value: 'us-04',
				},
				{
					name: 'US-05 (dashboard-05.braze.com)',
					value: 'us-05',
				},
				{
					name: 'US-06 (dashboard-06.braze.com)',
					value: 'us-06',
				},
				{
					name: 'US-07 (dashboard-07.braze.com)',
					value: 'us-07',
				},
				{
					name: 'US-08 (dashboard-08.braze.com)',
					value: 'us-08',
				},
				{
					name: 'US-10 (dashboard.us-10.braze.com)',
					value: 'us-10',
				},
				{
					name: 'EU-01 (dashboard-01.braze.eu)',
					value: 'eu-01',
				},
				{
					name: 'EU-02 (dashboard-02.braze.eu)',
					value: 'eu-02',
				},
				{
					name: 'AU-01 (dashboard.au-01.braze.com)',
					value: 'au-01',
				},
				{
					name: 'ID-01 (dashboard.id-01.braze.com)',
					value: 'id-01',
				},
			],
			default: 'us-01',
			description:
				'Select your Braze instance based on your dashboard URL. This determines the REST endpoint URL for API calls.',
		},
	];

	// This authenticate property is used by the HTTP Request node
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	// The test endpoint uses the campaigns list endpoint with minimal permissions
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.instance && $self.getInstanceEndpoint($credentials.instance)}}',
			url: '/campaigns/list',
			method: 'GET',
			headers: {
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
				'Content-Type': 'application/json',
			},
		},
	};

	// Helper method to get the correct endpoint URL based on instance
	static getInstanceEndpoint(instance: string): string {
		const endpoints = {
			'us-01': 'https://rest.iad-01.braze.com',
			'us-02': 'https://rest.iad-02.braze.com',
			'us-03': 'https://rest.iad-03.braze.com',
			'us-04': 'https://rest.iad-04.braze.com',
			'us-05': 'https://rest.iad-05.braze.com',
			'us-06': 'https://rest.iad-06.braze.com',
			'us-07': 'https://rest.iad-07.braze.com',
			'us-08': 'https://rest.iad-08.braze.com',
			'us-10': 'https://rest.us-10.braze.com',
			'eu-01': 'https://rest.fra-01.braze.eu',
			'eu-02': 'https://rest.fra-02.braze.eu',
			'au-01': 'https://rest.au-01.braze.com',
			'id-01': 'https://rest.id-01.braze.com',
		};
		return endpoints[instance as keyof typeof endpoints] || endpoints['us-01'];
	}

	// Helper method to get rate limit information from response headers
	static getRateLimitInfo(headers: { [key: string]: string | string[] | undefined }): {
		limit: number;
		remaining: number;
		reset: number;
	} {
		return {
			limit: parseInt(headers['x-ratelimit-limit'] as string, 10) || 250000,
			remaining: parseInt(headers['x-ratelimit-remaining'] as string, 10) || 0,
			reset: parseInt(headers['x-ratelimit-reset'] as string, 10) || 0,
		};
	}
}