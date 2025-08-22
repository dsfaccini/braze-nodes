import { INodeProperties } from 'n8n-workflow';

export const kvOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['namespace'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all KV namespaces',
				action: 'List namespaces',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new KV namespace',
				action: 'Create namespace',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a KV namespace',
				action: 'Delete namespace',
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
				resource: ['keyValue'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a key-value pair',
				action: 'Delete value',
			},
			{
				name: 'Delete Multiple',
				value: 'deleteMultiple',
				description: 'Delete multiple key-value pairs',
				action: 'Delete multiple values',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a value by key',
				action: 'Get value',
			},
			{
				name: 'Get Multiple',
				value: 'getMultiple',
				description: 'Get multiple values by keys',
				action: 'Get multiple values',
			},
			{
				name: 'List Keys',
				value: 'listKeys',
				description: 'List all keys in a namespace',
				action: 'List keys',
			},
			{
				name: 'Set',
				value: 'set',
				description: 'Set a key-value pair',
				action: 'Set value',
			},
			{
				name: 'Set Multiple',
				value: 'setMultiple',
				description: 'Set multiple key-value pairs',
				action: 'Set multiple values',
			},
		],
		default: 'get',
	},
];

export const kvFields: INodeProperties[] = [
	// Namespace operations
	{
		displayName: 'Namespace Title',
		name: 'namespaceTitle',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['namespace'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'A human-readable name for the namespace',
	},
	{
		displayName: 'Namespace ID',
		name: 'namespaceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['namespace'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'The ID of the namespace to delete',
	},

	// Key-Value operations
	{
		displayName: 'Namespace ID',
		name: 'namespaceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['keyValue'],
			},
		},
		default: '',
		description: 'The ID of the KV namespace',
	},
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['get', 'set', 'delete'],
			},
		},
		default: '',
		description: 'The key to operate on',
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['set'],
			},
		},
		default: '',
		description: 'The value to store',
	},
	{
		displayName: 'Expiration',
		name: 'expiration',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['set'],
			},
		},
		default: '',
		placeholder: '1735689600',
		description: 'Absolute expiration time as UNIX timestamp (seconds since epoch). Must be greater than current time. Mutually exclusive with Expiration TTL (optional)',
	},
	{
		displayName: 'Expiration TTL',
		name: 'expirationTtl',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['set'],
			},
		},
		default: '',
		placeholder: '60',
		description: 'Time to live in seconds from now (relative expiration time). Mutually exclusive with Expiration (optional)',
	},
	{
		displayName: 'Metadata',
		name: 'metadata',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['set'],
			},
		},
		default: '{}',
		description: 'Arbitrary JSON metadata to store with the key-value pair',
	},

	// List keys options
	{
		displayName: 'Prefix',
		name: 'prefix',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['listKeys'],
			},
		},
		default: '',
		description: 'Only return keys that begin with this prefix',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['listKeys'],
			},
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['listKeys'],
			},
		},
		default: '',
		description: 'Cursor for pagination',
	},

	// Multiple operations
	{
		displayName: 'Keys',
		name: 'keys',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['getMultiple', 'deleteMultiple'],
			},
		},
		default: '',
		placeholder: 'key1,key2,key3',
		description: 'Comma-separated list of keys',
	},
	{
		displayName: 'Key-Value Pairs',
		name: 'keyValuePairs',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['keyValue'],
				operation: ['setMultiple'],
			},
		},
		default: {},
		options: [
			{
				name: 'pair',
				displayName: 'Key-Value Pair',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'The key to set',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value to store',
					},
					{
						displayName: 'Expiration',
						name: 'expiration',
						type: 'number',
						default: '',
						placeholder: '1735689600',
						description: 'Absolute expiration time as UNIX timestamp (seconds since epoch). Must be greater than current time (optional)',
					},
					{
						displayName: 'Metadata',
						name: 'metadata',
						type: 'json',
						default: '{}',
						description: 'Arbitrary JSON metadata to store with the key-value pair',
					},
				],
			},
		],
		description: 'The key-value pairs to set',
	},
];
