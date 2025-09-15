import { INodeProperties } from 'n8n-workflow';

export const contentBlocksOperations: INodeProperties[] = [];

export const contentBlocksFields: INodeProperties[] = [
	// Get Content Block Info and Update operations fields
	{
		displayName: 'Content Block ID',
		name: 'contentBlockId',
		type: 'string',
		required: true,
		default: '',
		description: "Content Block's API identifier",
		displayOptions: {
			show: {
				operation: ['getContentBlockInfo', 'updateContentBlock'],
			},
		},
	},
	{
		displayName: 'Include Inclusion Data',
		name: 'includeInclusionData',
		type: 'boolean',
		default: false,
		description: 'Whether to include Message Variation API identifiers of campaigns/Canvases using this Content Block',
		displayOptions: {
			show: {
				operation: ['getContentBlockInfo'],
			},
		},
	},

	// List Content Blocks operation fields
	{
		displayName: 'Modified After',
		name: 'modifiedAfter',
		type: 'dateTime',
		default: '',
		description: 'Filter content blocks modified after this date (ISO 8601 format)',
		displayOptions: {
			show: {
				operation: ['listContentBlocks'],
			},
		},
	},
	{
		displayName: 'Modified Before',
		name: 'modifiedBefore',
		type: 'dateTime',
		default: '',
		description: 'Filter content blocks modified before this date (ISO 8601 format)',
		displayOptions: {
			show: {
				operation: ['listContentBlocks'],
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
				operation: ['listContentBlocks'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		description: 'Number of content blocks to skip (for pagination)',
		displayOptions: {
			show: {
				operation: ['listContentBlocks'],
			},
		},
	},

	// Create Content Block operation fields
	{
		displayName: 'Content Block Name',
		name: 'contentBlockName',
		type: 'string',
		required: true,
		default: '',
		description: 'Name for the content block (alphanumeric, dashes, underscores only)',
		displayOptions: {
			show: {
				operation: ['createContentBlock'],
			},
		},
	},
	{
		displayName: 'Content',
		name: 'contentBlockContent',
		type: 'string',
		required: true,
		default: '',
		description: 'HTML or text content of the content block (max 50KB)',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				operation: ['createContentBlock'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'contentBlockDescription',
		type: 'string',
		default: '',
		description: 'Optional description for the content block',
		displayOptions: {
			show: {
				operation: ['createContentBlock'],
			},
		},
	},
	{
		displayName: 'State',
		name: 'contentBlockState',
		type: 'options',
		options: [
			{
				name: 'Active',
				value: 'active',
			},
			{
				name: 'Draft',
				value: 'draft',
			},
		],
		default: 'active',
		description: 'State of the content block',
		displayOptions: {
			show: {
				operation: ['createContentBlock'],
			},
		},
	},
	{
		displayName: 'Tags',
		name: 'contentBlockTags',
		type: 'string',
		default: '',
		description: 'Comma-separated list of tags for the content block',
		displayOptions: {
			show: {
				operation: ['createContentBlock', 'updateContentBlock'],
			},
		},
	},

	// Update Content Block operation fields
	{
		displayName: 'Content Block Name',
		name: 'contentBlockName',
		type: 'string',
		default: '',
		description: 'Name for the content block (leave empty to keep current)',
		displayOptions: {
			show: {
				operation: ['updateContentBlock'],
			},
		},
	},
	{
		displayName: 'Content',
		name: 'contentBlockContent',
		type: 'string',
		default: '',
		description: 'HTML or text content of the content block (leave empty to keep current)',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				operation: ['updateContentBlock'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'contentBlockDescription',
		type: 'string',
		default: '',
		description: 'Description for the content block (leave empty to keep current)',
		displayOptions: {
			show: {
				operation: ['updateContentBlock'],
			},
		},
	},
	{
		displayName: 'State',
		name: 'contentBlockState',
		type: 'options',
		options: [
			{
				name: 'Active',
				value: 'active',
			},
			{
				name: 'Draft',
				value: 'draft',
			},
		],
		default: 'active',
		description: 'State of the content block',
		displayOptions: {
			show: {
				operation: ['updateContentBlock'],
			},
		},
	},
];