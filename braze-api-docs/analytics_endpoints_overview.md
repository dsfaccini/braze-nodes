# Braze Analytics Endpoints Overview

## Summary

This document provides an overview of all Braze analytics endpoints available for performance metrics and data export. These endpoints enable comprehensive analysis of campaigns, user behavior, revenue, and segmentation.

## Analytics Endpoints

### 1. Send Analytics (`/sends/data_series`)

**Purpose**: Retrieve daily analytics data for API campaign sends

- **File**: [`analytics_get_sends_data_series.md`](./analytics_get_sends_data_series.md)
- **Permission**: `sends.data_series`
- **Rate Limit**: 250,000 requests/hour
- **Key Metrics**: Sends, deliveries, opens, clicks, conversions, revenue by message type and variation
- **Data Retention**: 14 days after send
- **Use Case**: Analyze performance of specific send IDs from API campaigns

### 2. Campaign Analytics (`/campaigns/data_series`)

**Purpose**: Retrieve time-series analytics data for campaigns over time

- **File**: [`analytics_get_campaigns_data_series.md`](./analytics_get_campaigns_data_series.md)
- **Permission**: `campaigns.data_series`
- **Rate Limit**: 50,000 requests/minute (lower than other endpoints)
- **Key Metrics**: Multi-channel analytics including sends, opens, clicks, conversions, revenue
- **Supported Channels**: Email, push (iOS/Android/Web), SMS, in-app messages, webhooks
- **Use Case**: Long-term campaign performance tracking and optimization

### 3. Custom Events Analytics (`/events/data_series`)

**Purpose**: Retrieve time-series data for custom event occurrences

- **File**: [`analytics_get_custom_events_data_series.md`](./analytics_get_custom_events_data_series.md)
- **Permission**: `events.data_series`
- **Rate Limit**: 250,000 requests/hour
- **Key Metrics**: Event occurrence count over time
- **Granularity**: Daily or hourly data
- **Filtering**: By app, segment, time range
- **Use Case**: Track user behavior patterns and custom event trends

### 4. Revenue Analytics (`/purchases/revenue_series`)

**Purpose**: Retrieve total revenue data over time

- **File**: [`analytics_get_revenue_series.md`](./analytics_get_revenue_series.md)
- **Permission**: `purchases.revenue_series`
- **Rate Limit**: 1,000 requests/hour (significantly lower)
- **Key Metrics**: Total revenue amounts over time
- **Granularity**: Daily or hourly data
- **Filtering**: By app, specific products
- **Use Case**: Revenue trend analysis and ROI tracking

### 5. Segment Analytics (`/segments/data_series`)

**Purpose**: Retrieve segment size estimates over time

- **File**: [`analytics_get_segments_data_series.md`](./analytics_get_segments_data_series.md)
- **Permission**: `segments.data_series`
- **Rate Limit**: 250,000 requests/hour
- **Key Metrics**: Estimated segment size per day
- **Granularity**: Daily only
- **Requirements**: Segment must have analytics tracking enabled
- **Use Case**: Track segment growth and user journey progression

## Rate Limits Comparison

| Endpoint | Rate Limit | Notes |
|----------|------------|-------|
| Send Analytics | 250,000 requests/hour | Standard Braze limit |
| Campaign Analytics | 50,000 requests/minute | Lower due to data complexity |
| Custom Events Analytics | 250,000 requests/hour | Standard Braze limit |
| Revenue Analytics | 1,000 requests/hour | Shared with other purchase endpoints |
| Segment Analytics | 250,000 requests/hour | Standard Braze limit |

## Common Parameters

### Required Parameters (Most Endpoints)

| Parameter | Type | Description |
|-----------|------|-------------|
| `length` | Integer | Number of time units (1-100) |

### Optional Parameters (Most Endpoints)

| Parameter | Type | Description |
|-----------|------|-------------|
| `ending_at` | String | End date/time (ISO-8601 format) |
| `unit` | String | Time granularity (`day` or `hour`) |
| `app_id` | String | Filter by specific app |

### Endpoint-Specific Parameters

- **Send Analytics**: `campaign_id`, `send_id`
- **Campaign Analytics**: `campaign_id`
- **Custom Events**: `event` (required), `segment_id`
- **Revenue Analytics**: `product`
- **Segment Analytics**: `segment_id`

## Authentication Requirements

All analytics endpoints require:
- **Bearer token authentication**
- **Specific API key permissions** (see individual endpoint docs)
- **Header**: `Authorization: Bearer YOUR-REST-API-KEY`

## Response Format Standards

### Success Response Pattern

```json
{
  "message": "success",
  "data": [
    {
      "time": "ISO 8601 timestamp",
      "metric": "value"
    }
  ]
}
```

### Error Response Pattern

```json
{
  "message": "error",
  "errors": [
    {
      "code": "error_code",
      "message": "Error description"
    }
  ]
}
```

## Time and Data Considerations

### Timestamps
- All timestamps are in **UTC** format
- Daily data points represent start of day (00:00:00 UTC)
- Hourly data points represent start of hour

### Data Availability
- Analytics data may take **a few hours** to become fully available
- Revenue and purchase data may have slight delays
- Current day data might not be complete until daily processing finishes

### Data Retention
- **Send Analytics**: 14 days after send
- **Campaign Analytics**: Lifetime of campaign
- **Custom Events**: Based on Braze plan
- **Revenue Data**: Based on Braze plan
- **Segment Analytics**: Based on Braze plan

## Instance Endpoints

All analytics endpoints follow the pattern:
`https://rest.{instance}.braze.com/{endpoint_path}`

### Available Instances
- **US**: US-01 through US-08, US-10 (`rest.iad-XX.braze.com`)
- **EU**: EU-01, EU-02 (`rest.fra-XX.braze.com`)
- **APAC**: AU-01 (`rest.ap-01.braze.com`), ID-01 (`rest.ap-02.braze.com`)

## Implementation Recommendations

### For n8n Node Development

1. **Error Handling**: Implement consistent error parsing across all analytics endpoints
2. **Rate Limiting**: Account for different rate limits per endpoint
3. **Caching**: Consider caching analytics data due to rate limits
4. **Batch Requests**: Design for efficient data retrieval patterns
5. **Validation**: Validate date ranges and required parameters
6. **Instance Selection**: Implement dynamic endpoint construction

### Performance Optimization

1. **Time Range Management**: Use appropriate date ranges to balance detail vs. performance
2. **Granularity Selection**: Choose daily vs. hourly based on use case
3. **Filtering**: Use app_id and segment filters to reduce response size
4. **Sequential Requests**: Respect rate limits, especially for revenue endpoint

## Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid API key | Verify API key and permissions |
| 403 Forbidden | Missing permissions | Add required permission to API key |
| 404 Not Found | Invalid ID | Verify campaign/segment/send IDs exist |
| 422 Unprocessable | Analytics not enabled | Enable analytics for segments |
| 429 Rate Limited | Too many requests | Implement rate limiting logic |

## Related Documentation

- [Braze API Overview](https://www.braze.com/docs/api/basics)
- [Export Endpoints](https://www.braze.com/docs/api/endpoints/export)
- [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- [REST API Keys](https://www.braze.com/docs/api/basics#rest-api-key)

## Official Braze Documentation Links

Each endpoint has specific documentation:

1. [Send Analytics](https://www.braze.com/docs/api/endpoints/export/campaigns/get_send_analytics)
2. [Campaign Analytics](https://www.braze.com/docs/api/endpoints/export/campaigns/get_campaign_analytics)
3. [Custom Events Analytics](https://www.braze.com/docs/api/endpoints/export/custom_events/get_custom_events_analytics)
4. [Revenue Analytics](https://www.braze.com/docs/api/endpoints/export/purchases/get_revenue_series)
5. [Segment Analytics](https://www.braze.com/docs/api/endpoints/export/segments/get_segment_analytics)

---

*This overview was generated on 2025-09-13 for use in n8n Braze node development*