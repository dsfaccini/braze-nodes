import { INodeType } from 'n8n-workflow';
import { CloudflareAi } from './nodes/CloudflareAI/CloudflareAi.node';
import { CloudflareD1 } from './nodes/CloudflareD1/CloudflareD1.node';
import { CloudflareR2 } from './nodes/CloudflareR2/CloudflareR2.node';

export const nodeTypes: INodeType[] = [
  new CloudflareAi(),
	new CloudflareD1(),
	new CloudflareR2(),
];
