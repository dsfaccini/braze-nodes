import { INodeProperties } from 'n8n-workflow';

export const sendMessageOperations: INodeProperties[] = [];

export const sendMessageFields: INodeProperties[] = [
	// Common fields for both operations
	{
		displayName: 'Broadcast',
		name: 'broadcast',
		type: 'boolean',
		default: false,
		description: 'Whether to send to entire segment (use with caution - requires segment_id)',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
			},
		},
	},
	{
		displayName: 'Targeting Options',
		name: 'targetingOptions',
		type: 'collection',
		placeholder: 'Add Targeting Option',
		default: {},
		description:
			'Optional targeting parameters - at least one must be provided. All can be used together.',
		options: [
			{
				displayName: 'External User IDs',
				name: 'externalUserIds',
				type: 'string',
				default: '',
				description:
					'Comma-separated list of external user IDs to send to (up to 50 users)',
			},
			{
				displayName: 'User Aliases',
				name: 'userAliases',
				type: 'json',
				default: '[]',
				description: 'Array of user alias objects for targeting specific users by alias',
				placeholder: '[{"alias_name": "user_id", "alias_label": "amplitude_id"}]',
			},
			{
				displayName: 'Segment ID',
				name: 'segmentId',
				type: 'string',
				default: '',
				description: 'Segment identifier to target for the message',
			},
			{
				displayName: 'Audience Filter',
				name: 'audienceFilter',
				type: 'json',
				default:
					'{\n  "AND": [\n    {\n      "custom_attribute": {\n        "custom_attribute_name": "subscription_type",\n        "comparison": "equals",\n        "value": "premium"\n      }\n    }\n  ]\n}',
				description:
					'JSON object defining audience targeting rules based on custom attributes',
			},
		],
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
			},
		},
	},
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		default: '',
		description: 'Optional campaign identifier for tracking purposes',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
			},
		},
	},
	{
		displayName: 'Send ID',
		name: 'sendId',
		type: 'string',
		default: '',
		description: 'Optional send identifier for tracking and analytics',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
			},
		},
	},
	{
		displayName: 'Recipient Subscription State',
		name: 'recipientSubscriptionState',
		type: 'options',
		options: [
			{
				name: 'Subscribed',
				value: 'subscribed',
				description: 'Only send to subscribed users (default)',
			},
			{
				name: 'Opted In',
				value: 'opted_in',
				description: 'Only send to opted-in users',
			},
			{
				name: 'All',
				value: 'all',
				description: 'Send to all users regardless of subscription state',
			},
		],
		default: 'subscribed',
		description: 'Subscription state filter for recipients',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
			},
		},
	},

	// Message channel selection
	{
		displayName: 'Message Channel',
		name: 'messageChannel',
		type: 'options',
		options: [
			{
				name: 'Email',
				value: 'email',
				description: 'Send email message',
			},
			{
				name: 'SMS',
				value: 'sms',
				description: 'Send SMS message',
			},
			{
				name: 'Push Notification',
				value: 'push',
				description: 'Send push notification',
			},
		],
		default: 'email',
		description: 'Type of message to send',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
			},
		},
	},

	// Email fields
	{
		displayName: 'Email Content Type',
		name: 'emailContentType',
		type: 'options',
		options: [
			{
				name: 'Custom HTML',
				value: 'custom',
				description: 'Write custom HTML email content',
			},
			{
				name: 'Email Template',
				value: 'template',
				description: 'Use existing Braze email template',
			},
		],
		default: 'custom',
		description: 'Choose between custom HTML content or using an existing email template',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['email'],
			},
		},
	},
	{
		displayName: 'App ID',
		name: 'emailAppId',
		type: 'string',
		required: true,
		default: '',
		description: 'App identifier for email sending',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['email'],
			},
		},
	},
	{
		displayName: 'Email Template ID',
		name: 'emailTemplateId',
		type: 'string',
		required: true,
		default: '',
		description:
			'ID of the Braze email template to use. You can find this in your Braze dashboard or via the Braze Email Template node.',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['email'],
				emailContentType: ['template'],
			},
		},
	},
	{
		displayName: 'Subject',
		name: 'emailSubject',
		type: 'string',
		required: true,
		default: '',
		description: 'Email subject line (will override template subject if using template)',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['email'],
			},
		},
	},
	{
		displayName: 'From',
		name: 'emailFrom',
		type: 'string',
		required: true,
		default: '',
		description:
			'Email sender (e.g., "Company Name &lt;company@example.com&gt;") - will override template sender if using template',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['email'],
			},
		},
	},
	{
		displayName: 'Body (HTML)',
		name: 'emailBody',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		description: 'HTML email content',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['email'],
				emailContentType: ['custom'],
			},
		},
	},
	// Additional email options section
	{
		displayName: 'Additional Email Options',
		name: 'additionalEmailOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		description:
			'Optional email settings - Braze will auto-generate plain text from HTML if not provided',
		options: [
			{
				displayName: 'Plain Text Body',
				name: 'plainTextBody',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description:
					'Plain text version of email content (auto-generated from HTML if not provided)',
			},
			{
				displayName: 'Reply To',
				name: 'replyTo',
				type: 'string',
				default: '',
				description: 'Reply-to email address',
			},
			{
				displayName: 'Preheader',
				name: 'preheader',
				type: 'string',
				default: '',
				description: 'Email preheader text (preview text shown in inbox)',
			},
		],
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['email'],
			},
		},
	},

	// SMS fields
	{
		displayName: 'App ID',
		name: 'smsAppId',
		type: 'string',
		required: true,
		default: '',
		description: 'App identifier for SMS sending',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['sms'],
			},
		},
	},
	{
		displayName: 'Message',
		name: 'smsMessage',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		required: true,
		default: '',
		description: 'SMS message content',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['sms'],
			},
		},
	},
	{
		displayName: 'Subscription Group ID',
		name: 'smsSubscriptionGroupId',
		type: 'string',
		default: '',
		description: 'Subscription group identifier for SMS compliance',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['sms'],
			},
		},
	},

	// Push notification fields
	{
		displayName: 'Push Type',
		name: 'pushType',
		type: 'options',
		options: [
			{
				name: 'iOS (Apple Push)',
				value: 'apple_push',
			},
			{
				name: 'Android',
				value: 'android_push',
			},
			{
				name: 'Web Push',
				value: 'web_push',
			},
		],
		default: 'apple_push',
		description: 'Type of push notification',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['push'],
			},
		},
	},
	{
		displayName: 'App ID',
		name: 'pushAppId',
		type: 'string',
		required: true,
		default: '',
		description: 'App identifier for push notification',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['push'],
			},
		},
	},
	{
		displayName: 'Alert',
		name: 'pushAlert',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		required: true,
		default: '',
		description: 'Push notification message',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['push'],
			},
		},
	},
	{
		displayName: 'Title',
		name: 'pushTitle',
		type: 'string',
		default: '',
		description: 'Push notification title',
		displayOptions: {
			show: {
				operation: ['send', 'schedule'],
				messageChannel: ['push'],
			},
		},
	},

	// Transactional message fields
	{
		displayName: 'Campaign ID',
		name: 'transactionalCampaignId',
		type: 'string',
		required: true,
		default: '',
		description: 'Transactional campaign identifier from Braze dashboard',
		displayOptions: {
			show: {
				operation: ['sendTransactional'],
			},
		},
	},
	{
		displayName: 'External User ID',
		name: 'transactionalExternalUserId',
		type: 'string',
		required: true,
		default: '',
		description: 'External user identifier to send the transactional message to',
		displayOptions: {
			show: {
				operation: ['sendTransactional'],
			},
		},
	},
	{
		displayName: 'Trigger Properties',
		name: 'transactionalTriggerProperties',
		type: 'json',
		default: '{}',
		description: 'JSON object of key-value pairs for message personalization',
		displayOptions: {
			show: {
				operation: ['sendTransactional'],
			},
		},
	},

	// Schedule operation fields
	{
		displayName: 'Schedule Time',
		name: 'scheduleTime',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'ISO 8601 datetime string when the message should be sent',
		displayOptions: {
			show: {
				operation: ['schedule'],
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
				operation: ['schedule'],
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
				operation: ['schedule'],
			},
		},
	},

	// Create Send ID operation fields
	{
		displayName: 'Campaign ID',
		name: 'createSendIdCampaignId',
		type: 'string',
		required: true,
		default: '',
		description: 'The campaign identifier to associate with the send ID',
		displayOptions: {
			show: {
				operation: ['createSendId'],
			},
		},
	},
	{
		displayName: 'Custom Send ID',
		name: 'customSendId',
		type: 'string',
		default: '',
		description: 'Custom send identifier (ASCII characters only, max 64 chars). If not provided, Braze will generate one automatically.',
		displayOptions: {
			show: {
				operation: ['createSendId'],
			},
		},
	},

	// Send Canvas operation fields
	{
		displayName: 'Canvas ID',
		name: 'canvasId',
		type: 'string',
		required: true,
		default: '',
		description: 'Canvas API identifier from Braze dashboard',
		displayOptions: {
			show: {
				operation: ['sendCanvas', 'scheduleCanvas'],
			},
		},
	},
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

	// Schedule Canvas operation fields
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

	// List Scheduled Messages operation fields
	{
		displayName: 'End Time',
		name: 'endTime',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'ISO 8601 datetime string representing the end of the retrieval range',
		displayOptions: {
			show: {
				operation: ['listScheduledMessages'],
			},
		},
	},
];
