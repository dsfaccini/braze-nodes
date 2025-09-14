const path = require('path');

module.exports = {
	mode: 'production',
	target: 'node',
	entry: {
		// Node files
		'nodes/BrazeAnalytics/BrazeAnalytics.node': './nodes/BrazeAnalytics/BrazeAnalytics.node.ts',
		'nodes/BrazeCampaigns/BrazeCampaigns.node': './nodes/BrazeCampaigns/BrazeCampaigns.node.ts',
		'nodes/BrazeEmailTemplate/BrazeEmailTemplate.node': './nodes/BrazeEmailTemplate/BrazeEmailTemplate.node.ts',
		'nodes/BrazeSendMessage/BrazeSendMessage.node': './nodes/BrazeSendMessage/BrazeSendMessage.node.ts',

		// Credential files
		'credentials/BrazeApi.credentials': './credentials/BrazeApi.credentials.ts',

		// Description files
		'nodes/BrazeAnalytics/BrazeAnalyticsDescription': './nodes/BrazeAnalytics/BrazeAnalyticsDescription.ts',
		'nodes/BrazeCampaigns/BrazeCampaignsDescription': './nodes/BrazeCampaigns/BrazeCampaignsDescription.ts',
		'nodes/BrazeEmailTemplate/BrazeEmailTemplateDescription': './nodes/BrazeEmailTemplate/BrazeEmailTemplateDescription.ts',
		'nodes/BrazeSendMessage/BrazeSendMessageDescription': './nodes/BrazeSendMessage/BrazeSendMessageDescription.ts',

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
