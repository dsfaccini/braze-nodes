# Braze CRM Nodes Implementation Plan

## Project Overview

This document outlines the implementation plan for transforming the existing Cloudflare n8n nodes repository into a comprehensive Braze CRM integration package. The plan prioritizes email sending, campaign management, and analytics endpoints as specified in the research.

## Implementation Strategy

### Phase 1: Foundation & Documentation
- Keep existing Cloudflare nodes as reference code
- Add Braze functionality alongside existing code
- Update documentation to reflect both services during transition
- Create comprehensive GitHub issue tracking for all endpoint groups

### Phase 2: Authentication & Core Infrastructure
- Implement Braze REST API authentication system
- Support multiple Braze instances (US-01 to US-08, EU-01, EU-02, etc.)
- Dynamic endpoint URL construction based on instance selection
- Comprehensive error handling with Braze-specific error extraction

### Phase 3: Priority Node Implementation
Focus on the most requested functionality:
1. **BrazeCampaigns** - Campaign management and triggering
2. **BrazeSendMessage** - Immediate message sending
3. **BrazeEmailTemplate** - Template management
4. **BrazeAnalytics** - Performance metrics and analytics

## Detailed Implementation Plan

### 1. Authentication Infrastructure

#### BrazeApi Credentials (`credentials/BrazeApi.credentials.ts`)

**Features:**
- REST API Key authentication (Bearer token)
- Instance/Region selection dropdown
- Dynamic endpoint URL construction
- Credential validation using `/campaigns/list` endpoint

**Instance Support:**
- US instances: US-01 through US-08, US-10
- EU instances: EU-01, EU-02
- AU instance: AU-01
- ID instance: ID-01

**Based on:** CloudflareApi.credentials.ts structure

### 2. Priority Nodes

#### BrazeCampaigns Node (`nodes/BrazeCampaigns/`)

**Resources:** `campaigns`

**Operations:**
- **List**: Get all campaigns with filtering and pagination
  - Endpoint: `GET /campaigns/list`
  - Parameters: page, include_archived, sort_direction
  - Rate limit: 250,000 requests/hour

- **Details**: Get detailed campaign information
  - Endpoint: `GET /campaigns/details`
  - Parameters: campaign_id
  - Rate limit: 250,000 requests/hour

- **Trigger**: Send API-triggered campaigns
  - Endpoint: `POST /campaigns/trigger/send`
  - Parameters: campaign_id, external_user_ids, trigger_properties
  - Rate limit: 250,000 requests/hour

- **Analytics**: Get campaign performance data
  - Endpoint: `GET /campaigns/data_series`
  - Parameters: campaign_id, length, ending_at
  - Rate limit: 50,000 requests/minute

**Based on:** CloudflareKV node structure (resource/operation pattern)

#### BrazeSendMessage Node (`nodes/BrazeSendMessage/`)

**Resources:** `message`

**Operations:**
- **Send**: Send immediate messages to users
  - Endpoint: `POST /messages/send`
  - Support: Email, SMS, Push notifications
  - Batch support: Up to 50 external_user_ids per request
  - Rate limit: 250 requests/minute (broadcast) OR 250,000 requests/hour (targeted)

- **Send Transactional**: Send transactional emails
  - Endpoint: `POST /transactional/v1/campaigns/{campaign_id}/send`
  - Optimized for transactional use cases
  - Template-based sending

**Key Features:**
- Multi-channel message support (email, SMS, push)
- User targeting by external_id or segment
- Template variable support
- Subscription state handling

**Based on:** CloudflareQueue send message patterns

#### BrazeEmailTemplate Node (`nodes/BrazeEmailTemplate/`)

**Resources:** `emailTemplate`

**Operations:**
- **Create**: Create new email templates
  - Endpoint: `POST /templates/email/create`
  - Parameters: template_name, subject, body, plaintext_body, preheader, tags

- **List**: Get all email templates
  - Endpoint: `GET /templates/email/list`
  - Parameters: modified_after, modified_before, limit, offset
  - Pagination support

- **Update**: Update existing templates
  - Endpoint: `POST /templates/email/update`
  - Parameters: email_template_id + template fields

- **Info**: Get template details
  - Endpoint: `GET /templates/email/info`
  - Parameters: email_template_id

**Features:**
- Template variable support (Liquid templating)
- Tag management
- Bulk operations
- Template versioning awareness

**Based on:** CloudflareD1 CRUD operation patterns

#### BrazeAnalytics Node (`nodes/BrazeAnalytics/`)

**Resources:** `campaigns`, `sends`

**Operations:**
- **Campaign Analytics**: Time-series campaign performance
  - Endpoint: `GET /campaigns/data_series`
  - Metrics: sent, opens, clicks, unsubscribes, bounces, conversions, revenue
  - Time range support (1-100 days)

- **Send Analytics**: Performance for specific sends
  - Endpoint: `GET /sends/data_series`
  - Parameters: send_id, campaign_id/canvas_id, length, ending_at
  - Granular send performance tracking

**Key Features:**
- Time-series data processing
- Multiple metric aggregation
- Date range handling
- Performance visualization data

**Based on:** CloudflareAI response handling patterns

## Technical Implementation Details

### Error Handling Pattern

Implement enhanced error handling for Braze API responses:

```typescript
} catch (error: any) {
  // Extract Braze API error message
  let errorMessage = error.response?.data?.errors?.[0]?.message ||
                    error.response?.data?.message ||
                    error.message;

  if (this.continueOnFail()) {
    returnData.push({
      json: {
        error: errorMessage,
        originalError: error.message,
        httpCode: error.httpCode,
      },
      pairedItem: { item: i },
    });
    continue;
  }

  // Create enhanced error for throw
  const enhancedError = new Error(errorMessage);
  (enhancedError as any).httpCode = error.httpCode;
  (enhancedError as any).originalError = error.message;
  throw enhancedError;
}
```

### Rate Limit Management

- Monitor Braze rate limit headers:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- Implement exponential backoff for rate limit exceeded errors
- Queue batch operations appropriately

### Instance Endpoint Mapping

```typescript
const getInstanceEndpoint = (instance: string): string => {
  const endpoints = {
    'us-01': 'https://rest.iad-01.braze.com',
    'us-02': 'https://rest.iad-02.braze.com',
    'us-03': 'https://rest.iad-03.braze.com',
    'us-04': 'https://rest.iad-04.braze.com',
    'us-05': 'https://rest.iad-05.braze.com',
    'us-06': 'https://rest.iad-06.braze.com',
    'us-07': 'https://rest.iad-07.braze.com',
    'us-08': 'https://rest.iad-08.braze.com',
    'us-10': 'https://rest.us-10.braze.com',
    'eu-01': 'https://rest.fra-01.braze.eu',
    'eu-02': 'https://rest.fra-02.braze.eu',
    'au-01': 'https://rest.au-01.braze.com',
    'id-01': 'https://rest.id-01.braze.com'
  };
  return endpoints[instance] || endpoints['us-01'];
};
```

## GitHub Issue Tracking

Create GitHub issues for each endpoint group to track implementation progress:

### Priority 1 (Phase 1)
- [ ] **Campaigns** - Campaign management operations
- [ ] **Send Messages** - Immediate message sending
- [ ] **Email Templates** - Template CRUD operations
- [ ] **Analytics** - Performance metrics

### Priority 2 (Phase 2)
- [ ] **Canvas** - Customer journey automation
- [ ] **Email List** - Subscription management
- [ ] **User Data** - User profile management
- [ ] **Segments** - Audience segmentation

### Priority 3 (Phase 3)
- [ ] **Custom Events** - Event tracking
- [ ] **Purchases** - Purchase event management
- [ ] **Content Blocks** - Reusable content management
- [ ] **Subscription Groups** - Subscription management

### Priority 4 (Future)
- [ ] **Catalogs** - Product catalog management
- [ ] **KPI** - Key performance indicators
- [ ] **Preference Center** - User preferences
- [ ] **Schedule Messages** - Scheduled messaging
- [ ] **SMS** - SMS messaging operations
- [ ] **SCIM** - System for Cross-domain Identity Management
- [ ] **SDK Authentication** - Mobile SDK authentication
- [ ] **Live Activity** - iOS Live Activities
- [ ] **Cloud Data Ingestion** - Data import operations

## Testing Strategy

### Unit Testing
- Test each node operation individually
- Mock Braze API responses
- Validate error handling scenarios
- Test rate limit handling

### Integration Testing
- Test with actual Braze sandbox environment
- Validate authentication across instances
- Test batch operations
- Performance testing for rate limits

### Documentation Testing
- Verify all endpoint documentation links work
- Test credential setup instructions
- Validate example workflows

## Success Metrics

- [ ] All Priority 1 nodes implemented and tested
- [ ] Authentication works across all Braze instances
- [ ] Rate limiting properly handled
- [ ] Error messages are clear and actionable
- [ ] Documentation is comprehensive
- [ ] All GitHub issues created and tracked

## Migration Strategy

1. **Phase 1**: Implement alongside Cloudflare nodes
2. **Phase 2**: Test thoroughly with Braze API
3. **Phase 3**: Create comprehensive documentation
4. **Phase 4**: Only after Braze nodes are proven, remove Cloudflare nodes
5. **Phase 5**: Update package.json to final Braze-only configuration

This phased approach ensures we maintain working reference code while building robust Braze integration.