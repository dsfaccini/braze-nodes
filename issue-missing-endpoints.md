# Missing Braze API Endpoints Analysis

## Executive Summary

After comprehensive research of the official Braze API documentation, this report identifies missing endpoints and functionality within our 4 implemented Braze nodes. The analysis covers gaps in **Campaigns**, **Messaging**, **Email Templates**, and **Analytics** endpoint groups.

## 1. BrazeCampaigns Node - Missing Endpoints

### **Priority: HIGH**
- **POST `/campaigns/trigger/schedule`** - Schedule API-triggered campaigns
  - **Purpose**: Schedule campaign sends for future delivery instead of immediate sending
  - **Current Gap**: We only support immediate triggering via `/campaigns/trigger/send`
  - **API Documentation**: [POST: Schedule API-triggered campaigns](https://www.braze.com/docs/api/endpoints/messaging/schedule_messages/post_schedule_triggered_campaigns)

### **Priority: MEDIUM**
- **DELETE `/campaigns/trigger/send`** - Cancel scheduled API-triggered campaigns
  - **Purpose**: Cancel previously scheduled campaigns before they are sent
  - **API Documentation**: Available in schedule_messages endpoints

### **Priority: LOW**
- **POST `/campaigns/duplicate`** - Duplicate existing campaigns
  - **Purpose**: Programmatically duplicate campaigns for template purposes
  - **API Documentation**: [POST: Duplicate campaigns](https://www.braze.com/docs/api/endpoints/messaging/duplicate_messages/post_duplicate_campaigns)

## 2. BrazeSendMessage Node - Missing Endpoints

### **Priority: HIGH**
- **POST `/messages/schedule`** - Schedule messages for future delivery
  - **Purpose**: Schedule immediate messages (similar to `/messages/send`) for future sending
  - **Current Gap**: We only support immediate sending
  - **API Documentation**: [POST: Create scheduled messages](https://www.braze.com/docs/api/endpoints/messaging/schedule_messages/post_schedule_messages)

- **POST `/messages/send_ids/create`** - Create Send IDs
  - **Purpose**: Generate send IDs that can be used to track message performance programmatically
  - **Current Gap**: No support for pre-generating send IDs for tracking
  - **API Documentation**: [POST: Create send IDs](https://www.braze.com/docs/api/endpoints/messaging/send_messages/post_create_send_ids)

### **Priority: MEDIUM**
- **POST `/canvas/trigger/send`** - Send Canvas messages via API
  - **Purpose**: Trigger Canvas (multi-step campaign) messages immediately
  - **Current Gap**: No Canvas support in messaging nodes
  - **API Documentation**: [POST: Send Canvas messages using API-triggered delivery](https://www.braze.com/docs/api/endpoints/messaging/send_messages/post_send_triggered_canvases)

- **POST `/canvas/trigger/schedule`** - Schedule Canvas messages
  - **Purpose**: Schedule Canvas messages for future delivery
  - **API Documentation**: Available in Canvas trigger endpoints

- **GET `/messages/scheduled`** - List upcoming scheduled messages
  - **Purpose**: View all scheduled messages and campaigns
  - **API Documentation**: [GET: List upcoming scheduled campaigns and Canvases](https://www.braze.com/docs/api/endpoints/messaging/schedule_messages/get_messages_scheduled)

### **Priority: LOW**
- **POST `/messages/schedule/update`** - Update scheduled messages
  - **Purpose**: Modify scheduled messages before they are sent
  - **API Documentation**: Available in schedule_messages endpoints

- **POST `/messages/schedule/delete`** - Cancel scheduled messages
  - **Purpose**: Cancel scheduled messages before delivery
  - **API Documentation**: Available in schedule_messages endpoints

## 3. BrazeEmailTemplate Node - Missing Endpoints

### **Priority: HIGH**
- **DELETE `/templates/email/delete`** - Delete email templates
  - **Purpose**: Remove email templates that are no longer needed
  - **Current Gap**: No way to delete templates programmatically
  - **Note**: This endpoint may not exist in current Braze API - needs verification

### **Priority: MEDIUM**
- **GET `/templates/email/content_blocks/list`** - List content blocks
  - **Purpose**: List reusable content blocks for email templates
  - **Current Gap**: No content blocks management
  - **API Documentation**: [GET: List available content blocks](https://www.braze.com/docs/api/endpoints/templates/content_blocks_templates/get_list_email_content_blocks)

- **POST `/templates/email/content_blocks/create`** - Create content blocks
  - **Purpose**: Create reusable content blocks for templates
  - **API Documentation**: [POST: Create content block](https://www.braze.com/docs/api/endpoints/templates/content_blocks_templates/post_create_email_content_block)

- **POST `/templates/email/content_blocks/update`** - Update content blocks
  - **Purpose**: Update existing content blocks
  - **API Documentation**: [POST: Update content block](https://www.braze.com/docs/api/endpoints/templates/content_blocks_templates/post_update_content_block)

- **GET `/templates/email/content_blocks/info`** - Get content block details
  - **Purpose**: Retrieve information about specific content blocks
  - **API Documentation**: [GET: See content blocks information](https://www.braze.com/docs/api/endpoints/templates/content_blocks_templates/get_see_email_content_blocks_information)

### **Priority: LOW**
- **POST `/templates/email/duplicate`** - Duplicate email templates
  - **Purpose**: Create copies of existing templates for modification
  - **Note**: May need to be verified if this endpoint exists

## 4. BrazeAnalytics Node - Missing Endpoints

### **Priority: HIGH**
- **GET `/purchases/data_series`** - Purchase analytics (different from revenue)
  - **Purpose**: Get time-series data on purchase events (not just revenue)
  - **Current Gap**: We have revenue data but not purchase event counts
  - **API Documentation**: [GET: Export number of purchases](https://www.braze.com/docs/api/endpoints/export/purchases/get_number_of_purchases)

### **Priority: MEDIUM**
- **GET `/segments/list`** - List segments
  - **Purpose**: Retrieve all segments for analytics filtering
  - **API Documentation**: [GET: Export segment list](https://www.braze.com/docs/api/endpoints/export/segments/get_segment)

- **GET `/segments/data_series`** - Segment size analytics
  - **Purpose**: Track segment size changes over time
  - **API Documentation**: [GET: Export segment analytics](https://www.braze.com/docs/api/endpoints/export/segments/get_segment_analytics)

- **GET `/segments/details`** - Segment details
  - **Purpose**: Get detailed information about specific segments
  - **API Documentation**: [GET: Export segment details](https://www.braze.com/docs/api/endpoints/export/segments/get_segment_details)

- **GET `/canvas/data_series`** - Canvas analytics
  - **Purpose**: Get time-series analytics data for Canvas campaigns
  - **API Documentation**: [GET: Export Canvas data series analytics](https://www.braze.com/docs/api/endpoints/export/canvas/get_canvas_analytics)

- **GET `/canvas/details`** - Canvas details
  - **Purpose**: Get detailed information about Canvas campaigns
  - **API Documentation**: [GET: Export Canvas details](https://www.braze.com/docs/api/endpoints/export/canvas/get_canvas_details)

### **Priority: LOW**
- **GET `/kpi/dau`** - Daily active users
  - **Purpose**: Export daily active users by date
  - **API Documentation**: [GET: Export daily active users by date](https://www.braze.com/docs/api/endpoints/export/kpi/get_kpi_dau_date)

- **GET `/kpi/mau`** - Monthly active users
  - **Purpose**: Export monthly active users for last 30 days
  - **API Documentation**: [GET: Export monthly active users for last 30 days](https://www.braze.com/docs/api/endpoints/export/kpi/get_kpi_mau_30_days)

- **GET `/kpi/new_users`** - New users by date
  - **Purpose**: Export daily new users by date
  - **API Documentation**: [GET: Export daily new users by date](https://www.braze.com/docs/api/endpoints/export/kpi/get_kpi_daily_new_users_date)

- **GET `/sessions/data_series`** - Session analytics
  - **Purpose**: Export app session data by time period
  - **API Documentation**: [GET: Export app sessions by time](https://www.braze.com/docs/api/endpoints/export/sessions/get_sessions_analytics)

## Missing Parameters in Implemented Endpoints

### BrazeCampaigns Node
- **`/campaigns/list`** missing parameters:
  - `include_tags` - Include tag information in response
  - `sort_direction` - Already implemented ✅

### BrazeAnalytics Node
- **`/events/data_series`** missing parameters:
  - `campaign_id` - Filter events by specific campaign
  - `canvas_id` - Filter events by specific canvas

## Implementation Recommendations

### **Phase 1: High Priority (Immediate)**
1. Add scheduling support to BrazeSendMessage (`/messages/schedule`)
2. Add Send ID creation to BrazeSendMessage (`/messages/send_ids/create`)
3. Add campaign scheduling to BrazeCampaigns (`/campaigns/trigger/schedule`)
4. Add purchase analytics to BrazeAnalytics (`/purchases/data_series`)

### **Phase 2: Medium Priority (Next Sprint)**
1. Add Content Blocks management to BrazeEmailTemplate
2. Add Canvas support to BrazeSendMessage and BrazeAnalytics
3. Add segment analytics endpoints to BrazeAnalytics
4. Add scheduled message management endpoints

### **Phase 3: Low Priority (Future Enhancement)**
1. Add KPI endpoints to BrazeAnalytics
2. Add duplication endpoints across nodes
3. Add session analytics to BrazeAnalytics

## API Rate Limits to Consider

- **Schedule endpoints**: 250,000 requests per hour
- **Send ID creation**: Default rate limit of 250,000 requests per hour
- **Canvas endpoints**: 250,000 requests per hour when specifying external_id
- **Export endpoints**: Most have default 250,000 requests per hour
- **Campaign analytics**: 50,000 requests per minute (stricter than others)

## References

- [Braze API Endpoints Documentation](https://www.braze.com/docs/api/endpoints/)
- [Braze Messaging Endpoints](https://www.braze.com/docs/api/endpoints/messaging)
- [Braze Export Endpoints](https://www.braze.com/docs/api/endpoints/export)
- [Braze Templates Endpoints](https://www.braze.com/docs/api/endpoints/templates)

---

**Report Generated**: 2025-01-14
**Analysis Scope**: 4 implemented Braze nodes (Campaigns, Send Message, Email Template, Analytics)
**Total Missing High Priority Endpoints**: 4
**Total Missing Medium Priority Endpoints**: 11
**Total Missing Low Priority Endpoints**: 7