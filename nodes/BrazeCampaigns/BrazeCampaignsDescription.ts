import { INodeProperties } from 'n8n-workflow';

export const campaignsOperations: INodeProperties[] = [];

export const campaignsFields: INodeProperties[] = [
	// List operation fields
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 0,
		description: 'Page of campaigns to return (0-indexed)',
		displayOptions: {
			show: {
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Include Archived',
		name: 'includeArchived',
		type: 'boolean',
		default: false,
		description: 'Whether to include archived campaigns in the results',
		displayOptions: {
			show: {
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Sort Direction',
		name: 'sortDirection',
		type: 'options',
		options: [
			{
				name: 'Ascending (Oldest First)',
				value: 'asc',
			},
			{
				name: 'Descending (Newest First)',
				value: 'desc',
			},
		],
		default: 'asc',
		description: 'Sort order for campaigns',
		displayOptions: {
			show: {
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Last Edit Time Filter',
		name: 'lastEditTime',
		type: 'dateTime',
		default: '',
		description: 'Only return campaigns edited after this timestamp (ISO 8601 format)',
		displayOptions: {
			show: {
				operation: ['list'],
			},
		},
	},

	// Details operation fields
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		required: true,
		default: '',
		description: 'The campaign identifier (API identifier from campaign details)',
		displayOptions: {
			show: {
				operation: ['details', 'trigger', 'analytics', 'scheduleTrigger'],
			},
		},
	},
	{
		displayName: 'Post Launch Draft Version',
		name: 'postLaunchDraftVersion',
		type: 'boolean',
		default: false,
		description: 'Whether to export the post-launch draft version of the campaign',
		displayOptions: {
			show: {
				operation: ['details'],
			},
		},
	},

	// Trigger operation fields
	{
		displayName: 'Send ID',
		name: 'sendId',
		type: 'string',
		default: '',
		description: 'Optional send identifier for tracking purposes',
		displayOptions: {
			show: {
				operation: ['trigger', 'scheduleTrigger'],
			},
		},
	},
	{
		displayName: 'Broadcast',
		name: 'broadcast',
		type: 'boolean',
		default: false,
		description:
			'Whether to send to the entire segment defined in the campaign (must be true when recipients and audience are omitted)',
		displayOptions: {
			show: {
				operation: ['trigger', 'scheduleTrigger'],
			},
		},
	},
	{
		displayName: 'External User IDs',
		name: 'externalUserIds',
		type: 'string',
		default: '',
		description:
			'Comma-separated list of external user IDs to send the campaign to (up to 50 users)',
		displayOptions: {
			show: {
				operation: ['trigger', 'scheduleTrigger'],
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
		description: 'Segment identifier to target for the campaign',
		displayOptions: {
			show: {
				operation: ['trigger', 'scheduleTrigger'],
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
		description: 'JSON object of key-value pairs for personalization in the message',
		displayOptions: {
			show: {
				operation: ['trigger', 'scheduleTrigger'],
			},
		},
	},

	// Schedule Trigger operation fields
	{
		displayName: 'Schedule Time',
		name: 'scheduleTime',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'ISO 8601 datetime string when the campaign should be sent',
		displayOptions: {
			show: {
				operation: ['scheduleTrigger'],
			},
		},
	},
	{
		displayName: 'Send in Local Time',
		name: 'inLocalTime',
		type: 'boolean',
		default: false,
		description: 'Whether to send the message in each recipient\'s local time zone',
		displayOptions: {
			show: {
				operation: ['scheduleTrigger'],
			},
		},
	},
	{
		displayName: 'Send at Optimal Time',
		name: 'atOptimalTime',
		type: 'boolean',
		default: false,
		description: 'Whether to send the message at the optimal time for each user (based on when they typically engage)',
		displayOptions: {
			show: {
				operation: ['scheduleTrigger'],
			},
		},
	},

	// Analytics operation fields
	{
		displayName: 'Length (Days)',
		name: 'length',
		type: 'number',
		default: 14,
		description: 'Number of days to retrieve data for (1-100)',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				operation: ['analytics'],
			},
		},
	},
	{
		displayName: 'Ending At',
		name: 'endingAt',
		type: 'dateTime',
		default: '',
		description:
			'End date for the data range (ISO 8601 format). Defaults to current time if not specified.',
		displayOptions: {
			show: {
				operation: ['analytics'],
			},
		},
	},
];
