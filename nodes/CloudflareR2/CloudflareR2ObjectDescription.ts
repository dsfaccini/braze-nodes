import { INodeProperties } from 'n8n-workflow';

export const objectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['object'],
			},
		},
		options: [
			{
				name: 'Copy',
				value: 'copy',
				description: 'Copy an object to another location',
				action: 'Copy an object',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an object from a bucket',
				action: 'Delete an object',
			},
			{
				name: 'Download',
				value: 'download',
				description: 'Download an object from a bucket',
				action: 'Download an object',
			},
			{
				name: 'Get Presigned URL',
				value: 'getPresignedUrl',
				description: 'Generate a presigned URL for an object',
				action: 'Get presigned url',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List objects in a bucket',
				action: 'List objects',
			},
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload an object to a bucket',
				action: 'Upload an object',
			},
		],
		default: 'upload',
	},
];

export const objectFields: INodeProperties[] = [
	// Common fields
	{
		displayName: 'Bucket Name',
		name: 'bucketName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
			},
		},
		default: '',
		description: 'The name of the R2 bucket',
	},

	// List Objects
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Prefix',
				name: 'prefix',
				type: 'string',
				default: '',
				description: 'Limits the response to keys that begin with the specified prefix',
			},
			{
				displayName: 'Max Keys',
				name: 'maxKeys',
				type: 'number',
				default: 1000,
				description: 'The maximum number of keys to return (max 1000)',
			},
		],
	},

	// Upload Object
	{
		displayName: 'Object Key',
		name: 'objectKey',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['upload', 'download', 'delete', 'getPresignedUrl'],
			},
		},
		default: '',
		description: 'The key (path) of the object in the bucket',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['upload'],
			},
		},
		default: 'data',
		description: 'Name of the binary property which contains the data to upload',
	},
	{
		displayName: 'Create Bucket If Not Exists',
		name: 'createBucketIfNotExists',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['upload'],
			},
		},
		default: false,
		description: 'Whether to create the bucket if it does not exist',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'Cache Control',
				name: 'cacheControl',
				type: 'string',
				default: '',
				description: 'Specifies caching behavior along the request/reply chain',
			},
			{
				displayName: 'Content Disposition',
				name: 'contentDisposition',
				type: 'string',
				default: '',
				description: 'Specifies presentational information for the object',
			},
			{
				displayName: 'Content Encoding',
				name: 'contentEncoding',
				type: 'string',
				default: '',
				description: 'Specifies what content encodings have been applied to the object',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						displayName: 'Metadata',
						name: 'metadataValues',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
				description: 'A set of key-value pairs to store with the object',
			},
			{
				displayName: 'Storage Class',
				name: 'storageClass',
				type: 'options',
				options: [
					{
						name: 'Standard',
						value: 'STANDARD',
					},
				],
				default: 'STANDARD',
				description: 'The storage class for the object',
			},
		],
	},

	// Download Object
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['download'],
			},
		},
		default: 'data',
		description: 'Name of the binary property to which to write the data',
	},

	// Copy Object
	{
		displayName: 'Source Bucket',
		name: 'sourceBucket',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['copy'],
			},
		},
		default: '',
		description: 'The name of the source bucket',
	},
	{
		displayName: 'Source Key',
		name: 'sourceKey',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['copy'],
			},
		},
		default: '',
		description: 'The key of the source object',
	},
	{
		displayName: 'Destination Bucket',
		name: 'destinationBucket',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['copy'],
			},
		},
		default: '',
		description: 'The name of the destination bucket',
	},
	{
		displayName: 'Destination Key',
		name: 'destinationKey',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['copy'],
			},
		},
		default: '',
		description: 'The key for the destination object',
	},

	// Presigned URL
	{
		displayName: 'URL Operation',
		name: 'urlOperation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getPresignedUrl'],
			},
		},
		options: [
			{
				name: 'Download',
				value: 'get',
				description: 'Generate a URL for downloading the object',
			},
			{
				name: 'Upload',
				value: 'put',
				description: 'Generate a URL for uploading an object',
			},
		],
		default: 'get',
		description: 'The operation the presigned URL will allow',
	},
	{
		displayName: 'Expires In',
		name: 'expiresIn',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['getPresignedUrl'],
			},
		},
		default: 3600,
		description: 'How long the presigned URL should be valid for (in seconds)',
	},
];
