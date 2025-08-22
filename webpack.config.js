const path = require('path');

module.exports = {
	mode: 'production',
	target: 'node',
	entry: {
		// Node files
		'nodes/CloudflareR2/CloudflareR2.node': './nodes/CloudflareR2/CloudflareR2.node.ts',
		'nodes/CloudflareD1/CloudflareD1.node': './nodes/CloudflareD1/CloudflareD1.node.ts',
		'nodes/CloudflareAI/CloudflareAi.node': './nodes/CloudflareAI/CloudflareAi.node.ts',
		'nodes/CloudflareKV/CloudflareKv.node': './nodes/CloudflareKV/CloudflareKv.node.ts',
		'nodes/CloudflareQueue/CloudflareQueue.node': './nodes/CloudflareQueue/CloudflareQueue.node.ts',
		'nodes/CloudflareQueue/CloudflareQueueTrigger.node': './nodes/CloudflareQueue/CloudflareQueueTrigger.node.ts',
		
		// Credential files
		'credentials/CloudflareApi.credentials': './credentials/CloudflareApi.credentials.ts',
		'credentials/ExampleCredentialsApi.credentials': './credentials/ExampleCredentialsApi.credentials.ts',
		'credentials/HttpBinApi.credentials': './credentials/HttpBinApi.credentials.ts',
		
		// Description files
		'nodes/CloudflareKV/CloudflareKVDescription': './nodes/CloudflareKV/CloudflareKVDescription.ts',
		'nodes/CloudflareQueue/CloudflareQueueDescription': './nodes/CloudflareQueue/CloudflareQueueDescription.ts',
		'nodes/CloudflareR2/CloudflareR2BucketDescription': './nodes/CloudflareR2/CloudflareR2BucketDescription.ts',
		'nodes/CloudflareR2/CloudflareR2ObjectDescription': './nodes/CloudflareR2/CloudflareR2ObjectDescription.ts',
		'nodes/CloudflareR2/awsSignatureV4': './nodes/CloudflareR2/awsSignatureV4.ts',
		'nodes/HttpBin/HttpVerbDescription': './nodes/HttpBin/HttpVerbDescription.ts',
		
		// Example nodes
		'nodes/ExampleNode/ExampleNode.node': './nodes/ExampleNode/ExampleNode.node.ts',
		'nodes/HttpBin/HttpBin.node': './nodes/HttpBin/HttpBin.node.ts',
		
		// Index file
		'index': './index.ts'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		libraryTarget: 'commonjs2',
		clean: true
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	externals: {
		// Exclude n8n dependencies - they're provided by the n8n runtime
		'n8n-workflow': 'commonjs2 n8n-workflow',
		'n8n-core': 'commonjs2 n8n-core'
	},
	optimization: {
		minimize: false // Keep readable for debugging
	},
	devtool: 'source-map'
};