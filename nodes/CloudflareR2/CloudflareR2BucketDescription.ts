import { INodeProperties } from 'n8n-workflow';

export const bucketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['bucket'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new R2 bucket',
				action: 'Create a bucket',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an R2 bucket (bucket must be completely empty)',
				action: 'Delete a bucket',
			},
			{
				name: 'Get Info',
				value: 'getInfo',
				description: 'Get information about a bucket',
				action: 'Get bucket info',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all R2 buckets',
				action: 'List buckets',
			},
		],
		default: 'list',
	},
];

export const bucketFields: INodeProperties[] = [
	// Create Bucket
	{
		displayName: 'Bucket Name',
		name: 'bucketName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['bucket'],
				operation: ['create', 'delete', 'getInfo'],
			},
		},
		default: '',
		description: 'The name of the R2 bucket. Must be globally unique.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['bucket'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Location Hint',
				name: 'locationHint',
				type: 'string',
				default: '',
				description:
					'A hint for the location of the bucket (e.g., "wnam" for Western North America)',
			},
		],
	},
];
