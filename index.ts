import { INodeType } from 'n8n-workflow';
import { BrazeAnalytics } from './nodes/BrazeAnalytics/BrazeAnalytics.node';
import { BrazeCampaigns } from './nodes/BrazeCampaigns/BrazeCampaigns.node';
import { BrazeCanvas } from './nodes/BrazeCanvas/BrazeCanvas.node';
import { BrazeContentBlocks } from './nodes/BrazeContentBlocks/BrazeContentBlocks.node';
import { BrazeEmailTemplate } from './nodes/BrazeEmailTemplate/BrazeEmailTemplate.node';
import { BrazeSegments } from './nodes/BrazeSegments/BrazeSegments.node';
import { BrazeSendMessage } from './nodes/BrazeSendMessage/BrazeSendMessage.node';

export const nodeTypes: INodeType[] = [
	new BrazeAnalytics(),
	new BrazeCampaigns(),
	new BrazeCanvas(),
	new BrazeContentBlocks(),
	new BrazeEmailTemplate(),
	new BrazeSegments(),
	new BrazeSendMessage(),
];
