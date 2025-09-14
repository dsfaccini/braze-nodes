import { INodeProperties } from 'n8n-workflow';

export const analyticsOperations: INodeProperties[] = [];

export const analyticsFields: INodeProperties[] = [
	// Common fields
	{
		displayName: 'Length (Days)',
		name: 'length',
		type: 'number',
		default: 14,
		description: 'Number of days to include in data series (1-100)',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				operation: ['campaignAnalytics', 'sendAnalytics', 'customEvents', 'revenue'],
			},
		},
	},
	{
		displayName: 'Ending At',
		name: 'endingAt',
		type: 'dateTime',
		default: '',
		description:
			'End date for data series (ISO 8601 format). Defaults to current time if not specified.',
		displayOptions: {
			show: {
				operation: ['campaignAnalytics', 'sendAnalytics', 'customEvents', 'revenue'],
			},
		},
	},

	// Campaign Analytics fields
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		default: '',
		description: 'Campaign API identifier',
		displayOptions: {
			show: {
				operation: ['campaignAnalytics', 'sendAnalytics'],
			},
		},
	},

	// Send Analytics fields
	{
		displayName: 'Send ID',
		name: 'sendId',
		type: 'string',
		required: true,
		default: '',
		description: 'Send API identifier',
		displayOptions: {
			show: {
				operation: ['sendAnalytics'],
			},
		},
	},

	// Custom Events fields
	{
		displayName: 'Event Name',
		name: 'eventName',
		type: 'string',
		required: true,
		default: '',
		description: 'Custom event name to analyze',
		displayOptions: {
			show: {
				operation: ['customEvents'],
			},
		},
	},
	{
		displayName: 'Time Unit',
		name: 'unit',
		type: 'options',
		options: [
			{
				name: 'Day',
				value: 'day',
			},
			{
				name: 'Hour',
				value: 'hour',
			},
		],
		default: 'day',
		description: 'Time granularity for data series',
		displayOptions: {
			show: {
				operation: ['customEvents'],
			},
		},
	},
	{
		displayName: 'App ID',
		name: 'appId',
		type: 'string',
		default: '',
		description: 'App identifier to filter results',
		displayOptions: {
			show: {
				operation: ['customEvents', 'revenue'],
			},
		},
	},
	{
		displayName: 'Segment ID',
		name: 'segmentId',
		type: 'string',
		default: '',
		description: 'Segment identifier to filter results',
		displayOptions: {
			show: {
				operation: ['customEvents'],
			},
		},
	},

	// Revenue Analytics fields
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		description: 'Product identifier to filter revenue data',
		displayOptions: {
			show: {
				operation: ['revenue'],
			},
		},
	},
];
