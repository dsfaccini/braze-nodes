# Braze CRM Nodes for n8n

This is a collection of n8n community nodes for Braze CRM platform. Currently supported services: Campaigns, Message Sending, Email Templates, and Analytics.

**Primary Focus**: Email sending, campaign management, and analytics endpoints for comprehensive Braze integration.

**Disclaimer**: This is a community-developed project and is not officially affiliated with or endorsed by Braze or n8n. This repository is in active development, which means that not all Braze endpoints are implemented as nodes yet and some operations may currently not be available. Please report any issues you find and provide as much context as possible, include screenshots and error messages in code blocks if possible.

## Available Braze Nodes

### 🚀 Braze Campaigns

Campaign management and triggering operations.

**Operations:**
- **List**: Get all campaigns with filtering and pagination
- **Details**: Get detailed campaign information
- **Trigger**: Send API-triggered campaigns
- **Analytics**: Get campaign performance data and metrics

### ✉️ Braze Send Message

Direct message sending to users across multiple channels.

**Operations:**
- **Send**: Send immediate messages (email, SMS, push) to specific users
- **Send Transactional**: Send transactional emails using pre-configured campaigns

**Key Features:**
- Multi-channel support (email, SMS, push notifications)
- Batch targeting (up to 50 users per request)
- Template variable support
- Subscription state handling

### 📧 Braze Email Template

Email template management operations.

**Operations:**
- **Create**: Create new email templates with Liquid templating
- **List**: Get all email templates with filtering and pagination
- **Update**: Update existing email templates
- **Info**: Get detailed template information

### 📊 Braze Analytics

Performance metrics and analytics for campaigns and sends.

**Operations:**
- **Campaign Analytics**: Time-series campaign performance data
- **Send Analytics**: Performance metrics for specific message sends

**Metrics Include:**
- Opens, clicks, unsubscribes, bounces
- Conversions and revenue tracking
- Delivery and engagement rates

## Installation

Install directly in n8n:

1. Go to **Settings** > **Community Nodes**
2. Enter: `@getalecs/n8n-nodes-braze`
3. Click **Install**

Or install via npm in your n8n instance:

```bash
npm install @getalecs/n8n-nodes-braze
```

## Authentication

### Braze REST API Key Setup

Braze uses REST API keys for authentication. Each key is scoped with specific permissions.

1. **Create API Key:**
   - Navigate to Settings > APIs and Identifiers in your Braze dashboard
   - Select "Create API Key"
   - Assign required permissions (see table below)
   - Configure IP allowlisting (optional but recommended)

2. **Required Permissions:**
   - `messages.send` - For message sending operations
   - `campaigns.trigger.send` - For campaign triggering
   - `campaigns.list` - For listing campaigns
   - `campaigns.data_series` - For campaign analytics
   - `templates.email.*` - For email template operations
   - `sends.data_series` - For send analytics

3. **Instance Selection:**
   Choose your Braze instance based on your dashboard URL:
   - US instances: US-01 through US-08, US-10
   - EU instances: EU-01, EU-02
   - AU instance: AU-01
   - ID instance: ID-01

### Rate Limits

- **Standard**: 250,000 requests per hour
- **Message sending**: 250 requests/minute (broadcast) OR 250,000/hour (targeted)
- **Campaign analytics**: 50,000 requests per minute
- Monitor rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Detailed API Coverage

### 🚀 BrazeCampaigns - Complete Implementation

**Implemented Endpoints:**
- `GET /campaigns/list` - List all campaigns with filtering and pagination
- `GET /campaigns/details` - Get detailed campaign information by ID
- `POST /campaigns/trigger/send` - Trigger API-triggered campaigns with user targeting
- `GET /campaigns/data_series` - Retrieve campaign performance analytics

**Key Features:**
- Campaign filtering by last edit date and inclusion of archived campaigns
- API-triggered campaign support with external user ID targeting
- Comprehensive analytics with time-series data
- Batch operations and pagination support

### ✉️ BrazeSendMessage - Complete Implementation

**Implemented Endpoints:**
- `POST /messages/send` - Send immediate messages across channels (email, SMS, push)
- `POST /transactional/v1/campaigns/{campaign_id}/send` - Send transactional messages

**Key Features:**
- Multi-channel support (email, SMS, push notifications)
- Flexible targeting (external user IDs, user aliases, segments, audience filters)
- Template and custom content support for emails
- Subscription state handling and compliance
- Support for up to 50 users per targeted send

### 📧 BrazeEmailTemplate - Complete Implementation

**Implemented Endpoints:**
- `POST /templates/email/create` - Create new email templates with Liquid templating
- `GET /templates/email/list` - List all email templates with filtering and pagination
- `POST /templates/email/update` - Update existing email templates
- `GET /templates/email/info` - Get detailed template information by ID

**Key Features:**
- Full CRUD operations for email templates
- Liquid templating engine support
- Template tag management
- Bulk operations and filtering capabilities
- Template preview and modification tracking

### 📊 BrazeAnalytics - Extended Implementation

**Implemented Endpoints:**
- `GET /campaigns/data_series` - Campaign performance metrics over time
- `GET /sends/data_series` - Send-specific analytics and performance data
- `GET /events/data_series` - Custom event analytics and tracking
- `GET /purchases/revenue_series` - Purchase and revenue analytics

**Metrics Available:**
- Email metrics: opens, clicks, unsubscribes, bounces, deliveries
- Engagement rates and conversion tracking
- Revenue and purchase event analytics
- Custom event performance data
- Time-series data with configurable date ranges

## Examples & Workflows

### Send Targeted Email Campaign
```
Manual Trigger → Braze Campaigns (Trigger) → Success Response
```
*[Placeholder for workflow screenshot]*

### Direct Multi-Channel Messaging
```
Code Node → Braze Send Message → Analytics Tracking
```
*[Placeholder for workflow screenshot]*

### Template Management Workflow
```
HTTP Request → Braze Email Template (Create) → Campaign Setup → Send Message
```
*[Placeholder for workflow screenshot]*

### Analytics Dashboard Integration
```
Schedule Trigger → Braze Analytics → Database Storage → Dashboard Update
```
*[Placeholder for analytics dashboard screenshot]*

## Advanced Features

### Targeting Options
- **External User IDs**: Target up to 50 specific users per request
- **User Aliases**: Target users by custom alias identifiers
- **Segments**: Target entire user segments created in Braze dashboard
- **Audience Filters**: Advanced targeting with custom attributes and logical operators

### Template System
- **Liquid Templating**: Full support for Braze's Liquid templating engine
- **Dynamic Content**: Personalization with user attributes and custom properties
- **Template Inheritance**: Reusable components and content blocks

### Error Handling
- **Braze-specific Error Parsing**: Extracts meaningful error messages from API responses
- **Continue on Fail**: Option to continue processing despite individual failures
- **Rate Limit Awareness**: Automatic handling of Braze API rate limits

## Requirements

- n8n version 0.198.0 or higher
- Node.js 20.15.0 or higher
- Valid Braze account with API access
- Properly configured Braze REST API keys

## Support

- [GitHub Issues](https://github.com/dsfaccini/braze-nodes/issues)
- [n8n Community Forum](https://community.n8n.io/)

## License
<!-- DON'T REMOVE the n8n original, it is prepended to the MIT License -->
n8n original + MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the Braze and n8n communities
