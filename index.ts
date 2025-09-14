import { INodeType } from 'n8n-workflow';
import { BrazeAnalytics } from './nodes/BrazeAnalytics/BrazeAnalytics.node';
import { BrazeCampaigns } from './nodes/BrazeCampaigns/BrazeCampaigns.node';
import { BrazeEmailTemplate } from './nodes/BrazeEmailTemplate/BrazeEmailTemplate.node';
import { BrazeSendMessage } from './nodes/BrazeSendMessage/BrazeSendMessage.node';

export const nodeTypes: INodeType[] = [
	new BrazeAnalytics(),
	new BrazeCampaigns(),
	new BrazeEmailTemplate(),
	new BrazeSendMessage(),
];
