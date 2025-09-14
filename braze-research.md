# Braze CRM Platform Research

## Platform Overview

### What is Braze

Braze is a comprehensive customer engagement platform that powers real-time, personalized interactions between consumers and brands across multiple channels. It's a marketing automation and customer relationship management platform designed for modern, data-driven customer engagement.

**Key Characteristics:**
- Real-time data processing and message delivery (sub-second capabilities)
- Multi-channel orchestration (email, SMS, push notifications, WhatsApp, RCS, LINE, in-app messaging)
- AI-powered personalization and optimization (BrazeAI™)
- Enterprise-grade reliability and scale
- Cross-channel customer journey automation

### 2024 Performance Metrics

- **Scale**: 3.9 trillion messages and Canvas actions processed
- **Reliability**: 100% uptime during Black Friday/Cyber Monday period
- **Peak Volume**: 50+ billion messages during BFCM weekend
- **Customer Base**: 2,000+ brands worldwide, 300+ customers send 1+ billion messages annually
- **Recognition**: Gartner Magic Quadrant Leader for Multichannel Marketing Hubs (2024)

### Core Capabilities

1. **Real-time Data Platform**: Always-on data stream with sub-second processing
2. **Cross-channel Orchestration**: Unified platform for all digital touchpoints
3. **AI-powered Optimization**: Automated testing, personalization, and content generation
4. **Journey Automation**: Trigger-based campaigns and customer lifecycle management
5. **Advanced Analytics**: Comprehensive reporting and performance tracking

---

## Authentication

### REST API Key System

Braze uses REST API keys for authentication. Each key is scoped with specific permissions to limit access to particular endpoints.

**Authentication Method**: Bearer token in Authorization header
```
Authorization: Bearer YOUR-REST-API-KEY
```

**API Key Creation Process:**
1. Navigate to Settings > APIs and Identifiers
2. Select "Create API Key"
3. Assign specific permissions (see permissions table below)
4. Configure IP allowlisting (optional but recommended)
5. Cannot edit permissions after creation - must create new key

### Endpoint Structure

Braze operates multiple instances globally. The correct REST endpoint must be used based on your account's provisioned instance:

| Instance | Dashboard URL | REST Endpoint |
|----------|---------------|---------------|
| US-01 | `dashboard-01.braze.com` | `https://rest.iad-01.braze.com` |
| US-02 | `dashboard-02.braze.com` | `https://rest.iad-02.braze.com` |
| US-03 | `dashboard-03.braze.com` | `https://rest.iad-03.braze.com` |
| US-04 | `dashboard-04.braze.com` | `https://rest.iad-04.braze.com` |
| US-05 | `dashboard-05.braze.com` | `https://rest.iad-05.braze.com` |
| US-06 | `dashboard-06.braze.com` | `https://rest.iad-06.braze.com` |
| US-07 | `dashboard-07.braze.com` | `https://rest.iad-07.braze.com` |
| US-08 | `dashboard-08.braze.com` | `https://rest.iad-08.braze.com` |
| US-10 | `dashboard.us-10.braze.com` | `https://rest.us-10.braze.com` |
| EU-01 | `dashboard-01.braze.eu` | `https://rest.fra-01.braze.eu` |
| EU-02 | `dashboard-02.braze.eu` | `https://rest.fra-02.braze.eu` |
| AU-01 | `dashboard.au-01.braze.com` | `https://rest.au-01.braze.com` |
| ID-01 | `dashboard.id-01.braze.com` | `https://rest.id-01.braze.com` |

### Key API Permissions for Priority Endpoints

| Permission | Endpoint | Description |
|------------|----------|-------------|
| `messages.send` | `/messages/send` | Send immediate messages |
| `campaigns.trigger.send` | `/campaigns/trigger/send` | Trigger campaign sending |
| `campaigns.list` | `/campaigns/list` | Query campaign list |
| `campaigns.data_series` | `/campaigns/data_series` | Campaign analytics |
| `campaigns.details` | `/campaigns/details` | Campaign details |
| `templates.email.create` | `/templates/email/create` | Create email templates |
| `templates.email.list` | `/templates/email/list` | List email templates |
| `templates.email.update` | `/templates/email/update` | Update email templates |
| `sends.data_series` | `/sends/data_series` | Send analytics |

---

## Rate Limits & API Considerations

### Default Rate Limit
- **Standard**: 250,000 requests per hour
- **Specific endpoints have different limits** (see table below)

### Priority Endpoint Rate Limits

| Endpoint | Rate Limit | Notes |
|----------|------------|--------|
| `/messages/send` | 250 requests/minute (broadcast) OR 250,000 requests/hour (targeted) | Shared with campaigns/canvas trigger endpoints |
| `/campaigns/trigger/send` | 250,000 requests/hour | Shared with messages/canvas endpoints |
| `/campaigns/data_series` | 50,000 requests/minute | Campaign analytics |
| `/campaigns/list` | 250,000 requests/hour | Shared limit pool |
| `/campaigns/details` | 250,000 requests/hour | Shared limit pool |
| `/templates/email/*` | 250,000 requests/hour | Shared with other template endpoints |
| `/sends/data_series` | 250,000 requests/hour | Shared limit pool |

### Rate Limit Headers
Every API response includes:
- `X-RateLimit-Limit`: Maximum requests per interval
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: UTC epoch seconds when window resets

### Best Practices
- **Batching**: Up to 50 external_ids per messaging request
- **Delay**: 5-minute delay recommended between dependent endpoint calls
- **Monitoring**: Use rate limit headers for real-time throttling

---

## Priority Endpoints (Email & Campaigns)

### 1. Email Sending Endpoints

#### Send Messages Immediately
**Endpoint**: `POST /messages/send`
**Permission Required**: `messages.send`
**Rate Limit**: 250 requests/minute (broadcast) OR 250,000 requests/hour (targeted)

**Purpose**: Send immediate email messages to specific users or segments

**Key Parameters**:
```json
{
  "broadcast": false,
  "external_user_ids": ["user1", "user2"],
  "segment_id": "optional_segment_id",
  "campaign_id": "optional_for_tracking",
  "recipient_subscription_state": "subscribed",
  "messages": {
    "email": {
      "app_id": "your_app_id",
      "subject": "Email Subject",
      "from": "sender@example.com",
      "body": "HTML email body",
      "plaintext_body": "Plain text version"
    }
  }
}
```

**Response**: Returns `dispatch_id` for tracking

#### Send Transactional Emails
**Endpoint**: `POST /transactional/v1/campaigns/{campaign_id}/send`
**Permission Required**: `transactional.send`

**Purpose**: Send transactional emails using pre-configured campaigns

### 2. Campaign Management Endpoints

#### List Campaigns
**Endpoint**: `GET /campaigns/list`
**Permission Required**: `campaigns.list`
**Rate Limit**: 250,000 requests/hour (shared)

**Purpose**: Retrieve list of campaigns with filtering options

**Parameters**:
- `page` (optional): Page number for pagination
- `include_archived` (optional): Include archived campaigns
- `sort_direction` (optional): asc or desc

**Response Structure**:
```json
{
  "campaigns": [
    {
      "id": "campaign_id",
      "last_edited": "2024-01-15T12:00:00Z",
      "name": "Campaign Name",
      "is_api_campaign": true,
      "tags": ["tag1", "tag2"]
    }
  ],
  "message": "success"
}
```

#### Get Campaign Details
**Endpoint**: `GET /campaigns/details`
**Permission Required**: `campaigns.details`
**Rate Limit**: 250,000 requests/hour (shared)

**Purpose**: Get detailed information about specific campaigns

**Parameters**:
- `campaign_id` (required): Campaign identifier

#### Trigger Campaign Send
**Endpoint**: `POST /campaigns/trigger/send`
**Permission Required**: `campaigns.trigger.send`
**Rate Limit**: 250,000 requests/hour (shared)

**Purpose**: Trigger sending of API-triggered campaigns

**Key Parameters**:
```json
{
  "campaign_id": "required_campaign_id",
  "send_id": "optional_send_tracking_id",
  "trigger_properties": {
    "custom_property_1": "value1",
    "custom_property_2": "value2"
  },
  "broadcast": false,
  "external_user_ids": ["user1", "user2"],
  "segment_id": "optional_segment"
}
```

### 3. Campaign Analytics Endpoints

#### Get Campaign Analytics
**Endpoint**: `GET /campaigns/data_series`
**Permission Required**: `campaigns.data_series`
**Rate Limit**: 50,000 requests/minute

**Purpose**: Retrieve time-series analytics data for campaigns

**Parameters**:
- `campaign_id` (required): Campaign identifier
- `length` (required): Number of days (1-100)
- `ending_at` (optional): End date (ISO-8601 format)

**Response Data**:
```json
{
  "data": [
    {
      "time": "2024-01-15",
      "messages": {
        "email": [
          {
            "variation_api_id": "variation_id",
            "sent": 1000,
            "opens": 300,
            "unique_opens": 250,
            "clicks": 150,
            "unique_clicks": 125,
            "unsubscribes": 5,
            "bounces": 20,
            "delivered": 980,
            "reported_spam": 1
          }
        ]
      },
      "conversions": 50,
      "revenue": 1250.75,
      "unique_recipients": 1000
    }
  ]
}
```

#### Get Send Analytics
**Endpoint**: `GET /sends/data_series`
**Permission Required**: `sends.data_series`
**Rate Limit**: 250,000 requests/hour (shared)

**Purpose**: Get analytics for specific message sends

**Parameters**:
- `campaign_id` OR `canvas_id` (required)
- `send_id` (required): Send identifier
- `length` (required): Number of days
- `ending_at` (optional): End date

### 4. Email Template Management

#### Create Email Template
**Endpoint**: `POST /templates/email/create`
**Permission Required**: `templates.email.create`
**Rate Limit**: 250,000 requests/hour (shared)

**Purpose**: Create new email templates

**Request Body**:
```json
{
  "template_name": "My Email Template",
  "subject": "Welcome to {{${app_name}}}",
  "body": "<html><body>Welcome {{${first_name}}}!</body></html>",
  "plaintext_body": "Welcome {{${first_name}}}!",
  "preheader": "Optional preheader text",
  "tags": ["welcome", "onboarding"]
}
```

#### List Email Templates
**Endpoint**: `GET /templates/email/list`
**Permission Required**: `templates.email.list`
**Rate Limit**: 250,000 requests/hour (shared)

**Purpose**: Retrieve list of email templates

**Parameters**:
- `modified_after` (optional): ISO-8601 datetime
- `modified_before` (optional): ISO-8601 datetime
- `limit` (optional): Number of results (default 100, max 1000)
- `offset` (optional): Pagination offset

#### Update Email Template
**Endpoint**: `POST /templates/email/update`
**Permission Required**: `templates.email.update`
**Rate Limit**: 250,000 requests/hour (shared)

**Purpose**: Update existing email templates

**Required Parameters**:
- `email_template_id` (required): Template identifier

#### Get Email Template Info
**Endpoint**: `GET /templates/email/info`
**Permission Required**: `templates.email.info`
**Rate Limit**: 250,000 requests/hour (shared)

**Purpose**: Get detailed information about specific template

**Parameters**:
- `email_template_id` (required): Template identifier

---

## Additional Useful Endpoints

### User Management
- `POST /users/track` - Track user attributes, events, purchases
- `POST /users/export/ids` - Export user data by ID
- `POST /users/delete` - Delete users
- `POST /users/alias/new` - Create user aliases

### Email List Management
- `GET /email/unsubscribes` - Query unsubscribed email addresses
- `POST /email/status` - Change email subscription status
- `GET /email/hard_bounces` - Query hard bounced emails
- `POST /email/bounce/remove` - Remove emails from bounce list
- `POST /email/spam/remove` - Remove emails from spam list

### Subscription Groups
- `GET /subscription/status/get` - Get subscription group status
- `POST /subscription/status/set` - Set subscription group status

### Content Management
- `GET /content_blocks/list` - List content blocks
- `POST /content_blocks/create` - Create content blocks
- `POST /content_blocks/update` - Update content blocks

### Canvas (Journey) Management
- `GET /canvas/list` - List Canvas journeys
- `GET /canvas/details` - Get Canvas details
- `POST /canvas/trigger/send` - Trigger Canvas journeys
- `GET /canvas/data_series` - Canvas analytics

---

## Implementation Considerations for n8n Nodes

### 1. Authentication Node
- **Credential Type**: BrazeApi
- **Fields**:
  - REST API Key (password field)
  - Instance/Region selection (dropdown)
- **Test**: Use `/campaigns/list` with minimal permissions

### 2. Error Handling
- Implement retry logic with exponential backoff
- Parse Braze-specific error responses:
```json
{
  "message": "error description",
  "errors": [
    {
      "message": "specific error details"
    }
  ]
}
```

### 3. Rate Limit Management
- Monitor rate limit headers
- Implement queuing for batch operations
- Add delays between dependent calls (5 minutes recommended)

### 4. Regional Endpoint Handling
- Dynamic endpoint URL based on instance selection
- Validate instance/region in credentials

### 5. Data Types & Validation
- User ID validation (external_id format)
- Email address validation
- Campaign ID format validation
- Date/time handling (ISO-8601)

### 6. Batching Support
- Email sending: Support up to 50 external_ids per request
- User tracking: 75 events/attributes/purchases per request
- Template operations: Consider pagination

---

## Recommended Implementation Priority

Based on the prioritized requirements (email sending, campaign management, analytics), here's the suggested implementation order:

### Phase 1: Core Email & Campaign Operations
1. **BrazeApi Credentials** - Authentication setup
2. **Braze Send Message Node** - Immediate email sending (`/messages/send`)
3. **Braze Campaign Trigger Node** - Trigger API campaigns (`/campaigns/trigger/send`)

### Phase 2: Campaign Management
4. **Braze Campaign List Node** - List and search campaigns (`/campaigns/list`)
5. **Braze Campaign Details Node** - Get campaign information (`/campaigns/details`)

### Phase 3: Analytics & Reporting
6. **Braze Campaign Analytics Node** - Campaign performance data (`/campaigns/data_series`)
7. **Braze Send Analytics Node** - Send-specific analytics (`/sends/data_series`)

### Phase 4: Email Template Management
8. **Braze Email Template Node** - CRUD operations for templates
   - Create (`/templates/email/create`)
   - List (`/templates/email/list`)
   - Update (`/templates/email/update`)
   - Get Info (`/templates/email/info`)

### Phase 5: Advanced Features
9. **Braze User Track Node** - User data management (`/users/track`)
10. **Braze Canvas Node** - Journey management and triggering
11. **Braze Email Management Node** - Subscription and list management

### Node Structure Recommendations

Each node should follow the n8n pattern:
- **Resource/Operation Structure**: Use `resource` and `operation` properties
- **Dynamic Fields**: Show relevant fields based on operation selection
- **Batch Support**: Implement batch operations where API supports it
- **Error Handling**: Comprehensive error messages with API error extraction
- **Webhook Support**: Consider trigger nodes for Canvas/Campaign events

This structure provides comprehensive Braze integration starting with the highest priority features (email sending and campaign management) while building toward full platform capabilities.