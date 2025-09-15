# Braze CRM Nodes for n8n

This is a collection of n8n community nodes for Braze CRM platform. Currently supported services: Campaigns, Canvas, Message Sending, Email Templates, Content Blocks, Segments, and Analytics.

**Primary Focus**: Email sending, campaign management, and analytics endpoints for comprehensive Braze integration.

**Disclaimer**: This is a community-developed project and is not officially affiliated with or endorsed by Braze or n8n. This repository is in active development, which means that not all Braze endpoints are implemented as nodes yet and some operations may currently not be available. Please report any issues you find and provide as much context as possible, include screenshots and error messages in code blocks if possible.

## Available Braze Nodes

### 🚀 Braze Campaigns

Campaign management and triggering operations.

**Operations:**
- **Analytics**: Get campaign performance data and metrics
- **Cancel Scheduled Campaign**: Cancel previously scheduled campaigns before they are sent
- **Details**: Get detailed campaign information
- **List**: Get all campaigns with filtering and pagination
- **Schedule Trigger**: Schedule API-triggered campaigns for future delivery
- **Trigger**: Send API-triggered campaigns immediately

### ✉️ Braze Send Message

Direct message sending to users across multiple channels.

**Operations:**
- **Create Send ID**: Generate send identifiers for tracking and analytics
- **Delete Scheduled Message**: Cancel scheduled messages before delivery
- **List Scheduled Messages**: View all scheduled messages and campaigns
- **Schedule**: Schedule messages for future delivery across all channels
- **Send**: Send immediate messages (email, SMS, push) to specific users
- **Send Transactional**: Send transactional emails using pre-configured campaigns
- **Update Scheduled Message**: Modify scheduled messages before they are sent

**Key Features:**
- Multi-channel support (email, SMS, push notifications)
- Message scheduling with local time and optimal delivery time options
- Send ID generation for advanced tracking and analytics
- Scheduled message management and viewing
- Batch targeting (up to 50 users per request)
- Template variable support
- Subscription state handling

### 🎨 Braze Canvas

Multi-step campaign management and triggering operations.

**Operations:**
- **Canvas Analytics**: Get time-series analytics data for Canvas campaigns
- **Canvas Details**: Get detailed information about Canvas campaigns
- **Schedule Canvas**: Schedule Canvas messages for future delivery
- **Send Canvas**: Send Canvas (multi-step campaign) messages via API

**Key Features:**
- Multi-step campaign support with complex user journeys
- Canvas scheduling for future delivery with advanced targeting
- Canvas analytics and performance tracking
- Flexible targeting (external user IDs, segments, audience filters)
- Canvas entry properties for personalization
- Local time and optimal delivery time options for scheduling

### 📧 Braze Email Template

Email template management operations.

**Operations:**
- **Create**: Create new email templates with Liquid templating
- **Get Info**: Get detailed template information
- **List**: Get all email templates with filtering and pagination
- **Update**: Update existing email templates

**Key Features:**
- Full CRUD operations for email templates
- Advanced filtering with date-based queries and pagination
- Liquid templating engine support
- Template tag management
- Template preview and modification tracking

### 🧱 Braze Content Blocks

Reusable content block management for email templates.

**Operations:**
- **Create Content Block**: Create new reusable content blocks
- **Get Content Block Info**: Get detailed information about specific content blocks
- **List Content Blocks**: Get all content blocks with filtering options
- **Update Content Block**: Update existing content blocks

**Key Features:**
- Complete content block management for reusable content across campaigns
- Content block details and inclusion tracking
- Advanced filtering with date-based queries and pagination
- Content block tag management
- State management (active/draft)
- Bulk operations and filtering capabilities

### 👥 Braze Segments

User segment management and analytics operations.

**Operations:**
- **Segment Analytics**: Get time-series segment size analytics
- **Segment Details**: Get detailed information about specific segments
- **Segment List**: Get list of all segments for analytics filtering

**Key Features:**
- Segment size analytics over time
- Detailed segment information and configuration
- Segment filtering and listing for analytics purposes
- Pagination and sorting support

### 📊 Braze Analytics

Performance metrics and analytics for campaigns and sends.

**Operations:**
- **Campaign Analytics**: Time-series campaign performance data
- **Custom Events**: Time-series custom event data and tracking
- **Purchase Analytics**: Purchase event counts and quantity analytics
- **Revenue Data**: Purchase and revenue analytics over time
- **Send Analytics**: Performance metrics for specific message sends
- **Session Analytics**: App session data and user activity analytics

**Metrics Include:**
- Opens, clicks, unsubscribes, bounces
- Conversions and revenue tracking
- Purchase event counts and quantities
- Custom event analytics
- Session analytics and user activity tracking
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
   - `messages.send` - For immediate message sending operations
   - `messages.schedule.create` - For scheduling messages
   - `messages.schedule_broadcasts` - For listing scheduled messages
   - `campaigns.trigger.send` - For immediate campaign triggering
   - `campaigns.trigger.schedule.create` - For scheduling campaigns
   - `campaigns.list` - For listing campaigns
   - `campaigns.data_series` - For campaign analytics
   - `canvas.trigger.send` - For Canvas message sending
   - `canvas.trigger.schedule.create` - For scheduling Canvas messages
   - `canvas.data_series` - For Canvas analytics
   - `canvas.details` - For Canvas details
   - `sends.id.create` - For creating send identifiers
   - `templates.email.*` - For email template operations
   - `content_blocks.list` - For listing content blocks
   - `content_blocks.create` - For creating content blocks
   - `content_blocks.update` - For updating content blocks
   - `content_blocks.info` - For content block details
   - `segments.list` - For listing segments
   - `segments.data_series` - For segment analytics
   - `segments.details` - For segment details
   - `sends.data_series` - For send analytics
   - `purchases.data_series` - For purchase analytics

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
- `POST /campaigns/trigger/schedule/create` - Schedule API-triggered campaigns for future delivery
- `POST /campaigns/trigger/schedule/delete` - Cancel scheduled API-triggered campaigns
- `GET /campaigns/data_series` - Retrieve campaign performance analytics

**Key Features:**
- Campaign filtering by last edit date and inclusion of archived campaigns
- API-triggered campaign support with external user ID targeting
- Campaign scheduling with local time and optimal delivery time options
- Comprehensive analytics with time-series data
- Batch operations and pagination support

### ✉️ BrazeSendMessage - Extended Implementation

**Implemented Endpoints:**
- `POST /messages/send` - Send immediate messages across channels (email, SMS, push)
- `POST /messages/schedule/create` - Schedule messages for future delivery across all channels
- `POST /messages/schedule/update` - Update scheduled messages before they are sent
- `POST /messages/schedule/delete` - Cancel scheduled messages before delivery
- `GET /messages/scheduled_broadcasts` - List upcoming scheduled messages and campaigns
- `POST /transactional/v1/campaigns/{campaign_id}/send` - Send transactional messages
- `POST /canvas/trigger/send` - Send Canvas (multi-step campaign) messages via API
- `POST /canvas/trigger/schedule/create` - Schedule Canvas messages for future delivery
- `POST /sends/id/create` - Generate send identifiers for tracking and analytics

**Key Features:**
- Multi-channel support (email, SMS, push notifications)
- Message scheduling with local time and optimal delivery time options
- Canvas (multi-step campaign) message support for complex user journeys
- Canvas scheduling for future delivery with advanced targeting
- Send ID generation for advanced tracking and analytics
- Scheduled message viewing and management
- Flexible targeting (external user IDs, user aliases, segments, audience filters)
- Template and custom content support for emails
- Subscription state handling and compliance
- Support for up to 50 users per targeted send

### 📧 BrazeEmailTemplate - Extended Implementation

**Implemented Endpoints:**
- `POST /templates/email/create` - Create new email templates with Liquid templating
- `GET /templates/email/list` - List all email templates with filtering and pagination
- `POST /templates/email/update` - Update existing email templates
- `GET /templates/email/info` - Get detailed template information by ID
- `GET /content_blocks/list` - List all content blocks with filtering and pagination
- `POST /content_blocks/create` - Create new reusable content blocks
- `POST /content_blocks/update` - Update existing content blocks
- `GET /content_blocks/info` - Get detailed content block information

**Key Features:**
- Full CRUD operations for email templates
- Complete content block management for reusable content across campaigns
- Content block details and inclusion tracking
- Advanced filtering with date-based queries and pagination
- Liquid templating engine support
- Template and content block tag management
- Bulk operations and filtering capabilities
- Template preview and modification tracking

### 📊 BrazeAnalytics - Extended Implementation

**Implemented Endpoints:**
- `GET /campaigns/data_series` - Campaign performance metrics over time
- `GET /canvas/data_series` - Canvas campaign analytics and performance data
- `GET /canvas/details` - Detailed Canvas campaign information and configuration
- `GET /events/data_series` - Custom event analytics and tracking
- `GET /purchases/revenue_series` - Purchase and revenue analytics
- `GET /purchases/quantity_series` - Purchase event counts and quantity analytics
- `GET /segments/list` - List all segments for analytics filtering
- `GET /segments/data_series` - Segment size analytics over time
- `GET /segments/details` - Detailed segment information and configuration
- `GET /sends/data_series` - Send-specific analytics and performance data
- `GET /sessions/data_series` - App session data and user activity analytics

**Metrics Available:**
- Email metrics: opens, clicks, unsubscribes, bounces, deliveries
- Engagement rates and conversion tracking
- Revenue and purchase event analytics
- Purchase quantity and event count tracking
- Canvas campaign performance and configuration details
- Segment size tracking and detailed information
- Custom event performance data
- Session data and user activity tracking
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
