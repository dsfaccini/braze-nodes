import { INodeProperties } from 'n8n-workflow';

export const emailTemplateOperations: INodeProperties[] = [];

export const emailTemplateFields: INodeProperties[] = [
	// Create operation fields
	{
		displayName: 'Template Name',
		name: 'templateName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name of your email template',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		default: '',
		description: 'Email template subject line',
		displayOptions: {
			show: {
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		default: '',
		description: 'Email template subject line (leave empty to keep current)',
		displayOptions: {
			show: {
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Body (HTML)',
		name: 'body',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		description: 'Email template body that may include HTML',
		displayOptions: {
			show: {
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Body (HTML)',
		name: 'body',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		description: 'Email template body that may include HTML (leave empty to keep current)',
		displayOptions: {
			show: {
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Plain Text Body',
		name: 'plainTextBody',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		description: 'A plaintext version of the email template body',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Preheader',
		name: 'preheader',
		type: 'string',
		default: '',
		description: 'Email preheader used to generate previews in some clients',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'string',
		default: '',
		description: 'Comma-separated list of tags (tags must already exist in Braze)',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
			},
		},
	},
	{
		displayName: 'Should Inline CSS',
		name: 'shouldInlineCss',
		type: 'boolean',
		default: false,
		description: 'Whether to use the inline_css feature on this template',
		displayOptions: {
			show: {
				operation: ['create', 'update'],
			},
		},
	},

	// List operation fields
	{
		displayName: 'Modified After',
		name: 'modifiedAfter',
		type: 'dateTime',
		default: '',
		description: 'Only return templates modified after this timestamp (ISO 8601 format)',
		displayOptions: {
			show: {
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Modified Before',
		name: 'modifiedBefore',
		type: 'dateTime',
		default: '',
		description: 'Only return templates modified before this timestamp (ISO 8601 format)',
		displayOptions: {
			show: {
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		description: 'Number of templates to skip for pagination',
		typeOptions: {
			minValue: 0,
		},
		displayOptions: {
			show: {
				operation: ['list'],
			},
		},
	},

	// Update and Info operation fields
	{
		displayName: 'Email Template ID',
		name: 'emailTemplateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The email template\'s API identifier',
		displayOptions: {
			show: {
				operation: ['update', 'info'],
			},
		},
	},
];