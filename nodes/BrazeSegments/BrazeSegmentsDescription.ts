import { INodeProperties } from 'n8n-workflow';

export const segmentsOperations: INodeProperties[] = [];

export const segmentsFields: INodeProperties[] = [
	// Common fields for Segment Analytics
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
				operation: ['segmentAnalytics'],
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
				operation: ['segmentAnalytics'],
			},
		},
	},

	// Segment List fields
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 0,
		description: 'Page of segments to return (0-indexed)',
		displayOptions: {
			show: {
				operation: ['segmentList'],
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
		description: 'Sort order for segments',
		displayOptions: {
			show: {
				operation: ['segmentList'],
			},
		},
	},

	// Segment Analytics and Details fields
	{
		displayName: 'Segment ID',
		name: 'segmentId',
		type: 'string',
		required: true,
		default: '',
		description: 'Segment API identifier',
		displayOptions: {
			show: {
				operation: ['segmentAnalytics', 'segmentDetails'],
			},
		},
	},
];