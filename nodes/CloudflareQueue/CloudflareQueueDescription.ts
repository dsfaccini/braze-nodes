import { INodeProperties } from 'n8n-workflow';

export const queueOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['queue'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new queue',
				action: 'Create queue',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a queue',
				action: 'Delete queue',
			},
			{
				name: 'Get Info',
				value: 'getInfo',
				description: 'Get queue information',
				action: 'Get queue info',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all queues',
				action: 'List queues',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a queue',
				action: 'Update queue',
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
				resource: ['message'],
			},
		},
		options: [
			{
				name: 'Acknowledge',
				value: 'acknowledge',
				description: 'Acknowledge processed messages',
				action: 'Acknowledge messages',
			},
			{
				name: 'Pull',
				value: 'pull',
				description: 'Pull messages from the queue',
				action: 'Pull messages',
			},
			{
				name: 'Retry',
				value: 'retry',
				description: 'Retry failed messages',
				action: 'Retry messages',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send a message to the queue',
				action: 'Send message',
			},
			{
				name: 'Send Batch',
				value: 'sendBatch',
				description: 'Send multiple messages to the queue',
				action: 'Send batch messages',
			},
		],
		default: 'send',
	},
];

export const queueFields: INodeProperties[] = [
	// Queue operations
	{
		displayName: 'Queue Name',
		name: 'queueName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name of the queue to create',
	},
	{
		displayName: 'Queue ID',
		name: 'queueId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['update', 'delete', 'getInfo'],
			},
		},
		default: '',
		description: 'ID of the queue',
	},
	{
		displayName: 'Queue ID',
		name: 'queueId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		default: '',
		description: 'ID of the queue to operate on',
	},
	{
		displayName: 'Settings',
		name: 'settings',
		type: 'collection',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Delivery Delay',
				name: 'delivery_delay',
				type: 'number',
				default: 0,
				description: 'Delay in seconds before a message is delivered',
			},
			{
				displayName: 'Message Retention Period',
				name: 'message_retention_period',
				type: 'number',
				default: 345600,
				description: 'How long messages are retained in seconds (default: 4 days)',
			},
			{
				displayName: 'Max Retries',
				name: 'max_retries',
				type: 'number',
				default: 3,
				description: 'Maximum number of retries for a message',
			},
			{
				displayName: 'Dead Letter Queue',
				name: 'dead_letter_queue',
				type: 'string',
				default: '',
				description: 'Queue to send messages that exceed max retries',
			},
		],
	},

	// Message operations
	{
		displayName: 'Message Body',
		name: 'messageBody',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		default: '',
		description: 'The message content to send',
	},
	{
		displayName: 'Delay Seconds',
		name: 'delaySeconds',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		default: 0,
		description: 'Delay in seconds before the message becomes available',
	},
	{
		displayName: 'Messages',
		name: 'messages',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendBatch'],
			},
		},
		default: {},
		options: [
			{
				name: 'message',
				displayName: 'Message',
				values: [
					{
						displayName: 'Body',
						name: 'body',
						type: 'string',
						default: '',
						description: 'The message content',
					},
					{
						displayName: 'Delay Seconds',
						name: 'delaySeconds',
						type: 'number',
						default: 0,
						description: 'Delay in seconds before the message becomes available',
					},
				],
			},
		],
		description: 'Messages to send in batch',
	},

	// Pull operations
	{
		displayName: 'Batch Size',
		name: 'batchSize',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['pull'],
			},
		},
		default: 10,
		description: 'Number of messages to pull (1-100)',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
	},
	{
		displayName: 'Visibility Timeout',
		name: 'visibilityTimeout',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['pull'],
			},
		},
		default: 30,
		description: 'Time in seconds that messages are hidden from other consumers',
	},

	// Acknowledge/Retry operations
	{
		displayName: 'Lease IDs',
		name: 'leaseIds',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['acknowledge', 'retry'],
			},
		},
		default: '',
		placeholder: 'lease1,lease2,lease3',
		description: 'Comma-separated list of lease IDs to acknowledge or retry',
	},
	{
		displayName: 'Retry Delay Seconds',
		name: 'retryDelaySeconds',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['retry'],
			},
		},
		default: 0,
		description: 'Delay in seconds before retrying the messages',
	},
];