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
				operation: ['send'],
			},
		},
	},
	{
		displayName: 'External User IDs',
		name: 'externalUserIds',
		type: 'string',
		default: '',
		description: 'Comma-separated list of external user IDs to send to (up to 50 users)',
		displayOptions: {
			show: {
				operation: ['send'],
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
		description: 'Segment identifier to target for the message',
		displayOptions: {
			show: {
				operation: ['send'],
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
				operation: ['send'],
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
				operation: ['send'],
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
				operation: ['send'],
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
				operation: ['send'],
			},
		},
	},

	// Email fields
	{
		displayName: 'App ID',
		name: 'emailAppId',
		type: 'string',
		required: true,
		default: '',
		description: 'App identifier for email sending',
		displayOptions: {
			show: {
				operation: ['send'],
				messageChannel: ['email'],
			},
		},
	},
	{
		displayName: 'Subject',
		name: 'emailSubject',
		type: 'string',
		required: true,
		default: '',
		description: 'Email subject line',
		displayOptions: {
			show: {
				operation: ['send'],
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
		description: 'Email sender (e.g., "Company Name &lt;company@example.com&gt;")',
		displayOptions: {
			show: {
				operation: ['send'],
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
				operation: ['send'],
				messageChannel: ['email'],
			},
		},
	},
	{
		displayName: 'Plain Text Body',
		name: 'emailPlainTextBody',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		description: 'Plain text version of email content',
		displayOptions: {
			show: {
				operation: ['send'],
				messageChannel: ['email'],
			},
		},
	},
	{
		displayName: 'Reply To',
		name: 'emailReplyTo',
		type: 'string',
		default: '',
		description: 'Reply-to email address',
		displayOptions: {
			show: {
				operation: ['send'],
				messageChannel: ['email'],
			},
		},
	},
	{
		displayName: 'Preheader',
		name: 'emailPreheader',
		type: 'string',
		default: '',
		description: 'Email preheader text (preview text)',
		displayOptions: {
			show: {
				operation: ['send'],
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
				operation: ['send'],
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
				operation: ['send'],
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
				operation: ['send'],
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
				operation: ['send'],
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
				operation: ['send'],
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
				operation: ['send'],
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
				operation: ['send'],
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
];
