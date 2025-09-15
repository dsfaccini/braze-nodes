import { INodeProperties } from 'n8n-workflow';

export const canvasOperations: INodeProperties[] = [];

export const canvasFields: INodeProperties[] = [
	// Common fields for Canvas Analytics
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
				operation: ['canvasAnalytics'],
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
				operation: ['canvasAnalytics'],
			},
		},
	},

	// Canvas ID field (used by all operations)
	{
		displayName: 'Canvas ID',
		name: 'canvasId',
		type: 'string',
		required: true,
		default: '',
		description: 'Canvas API identifier',
		displayOptions: {
			show: {
				operation: ['sendCanvas', 'scheduleCanvas', 'canvasAnalytics', 'canvasDetails'],
			},
		},
	},

	// Send Canvas and Schedule Canvas fields
	{
		displayName: 'Send ID',
		name: 'sendId',
		type: 'string',
		default: '',
		description: 'Optional send identifier for tracking purposes',
		displayOptions: {
			show: {
				operation: ['sendCanvas', 'scheduleCanvas'],
			},
		},
	},
	{
		displayName: 'Broadcast',
		name: 'broadcast',
		type: 'boolean',
		default: false,
		description: 'Whether to send to the entire segment defined in the Canvas (must be true when recipients and audience are omitted)',
		displayOptions: {
			show: {
				operation: ['sendCanvas', 'scheduleCanvas'],
			},
		},
	},
	{
		displayName: 'External User IDs',
		name: 'externalUserIds',
		type: 'string',
		default: '',
		description: 'Comma-separated list of external user IDs to send the Canvas to (up to 50 users)',
		displayOptions: {
			show: {
				operation: ['sendCanvas', 'scheduleCanvas'],
			},
			hide: {
				broadcast: [true],
			},
		},
	},
	{
		displayName: 'Segment ID',
		name: 'segmentId',
		type: 'string',
		default: '',
		description: 'Segment identifier to target for the Canvas',
		displayOptions: {
			show: {
				operation: ['sendCanvas', 'scheduleCanvas'],
			},
			hide: {
				broadcast: [true],
			},
		},
	},
	{
		displayName: 'Trigger Properties',
		name: 'triggerProperties',
		type: 'json',
		default: '{}',
		description: 'JSON object of key-value pairs for personalization in the Canvas',
		displayOptions: {
			show: {
				operation: ['sendCanvas', 'scheduleCanvas'],
			},
		},
	},

	// Schedule Canvas specific fields
	{
		displayName: 'Schedule Time',
		name: 'scheduleTime',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'ISO 8601 datetime string when the Canvas should be sent',
		displayOptions: {
			show: {
				operation: ['scheduleCanvas'],
			},
		},
	},
	{
		displayName: 'Send in Local Time',
		name: 'inLocalTime',
		type: 'boolean',
		default: false,
		description: 'Whether to send the Canvas in each recipient\'s local time zone',
		displayOptions: {
			show: {
				operation: ['scheduleCanvas'],
			},
		},
	},
	{
		displayName: 'Send at Optimal Time',
		name: 'atOptimalTime',
		type: 'boolean',
		default: false,
		description: 'Whether to send the Canvas at the optimal time for each user',
		displayOptions: {
			show: {
				operation: ['scheduleCanvas'],
			},
		},
	},

	// Canvas Details specific fields
	{
		displayName: 'Post Launch Draft Version',
		name: 'postLaunchDraftVersion',
		type: 'boolean',
		default: false,
		description: 'Whether to show draft changes for Canvases with post-launch drafts',
		displayOptions: {
			show: {
				operation: ['canvasDetails'],
			},
		},
	},
];