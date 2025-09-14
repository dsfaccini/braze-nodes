# Braze API: GET /campaigns/data_series

## Overview

The Export Campaign Analytics endpoint retrieves a daily series of various statistics for a campaign over time. This endpoint provides comprehensive campaign performance metrics including sends, opens, clicks, conversions, and revenue data broken down by messaging channel.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/campaigns/data_series`
- **HTTP Method**: GET
- **Purpose**: Retrieve daily time-series analytics data for a specific campaign

## Authentication

### Required Headers
```
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `campaigns.data_series` permission

## Request Parameters

### Query Parameters

#### Required Parameters

- **campaign_id** (String, Required)
  - Campaign API identifier
  - Can be found on API Keys page, Campaign Details page, or via List campaigns endpoint

- **length** (Integer, Required)
  - Maximum number of days before ending_at to include in returned series
  - Must be between 1 and 100 (inclusive)

#### Optional Parameters

- **ending_at** (Datetime, Optional)
  - Date on which the data series should end
  - Format: ISO 8601 string (e.g., "2020-06-28T23:59:59-5:00")
  - Defaults to time of request if not specified

### URL Example
```
https://rest.iad-01.braze.com/campaigns/data_series?campaign_id=your_campaign_id&length=7&ending_at=2020-06-28T23:59:59-5:00
```

## Response Schema

### Success Response (200)

```json
{
  "message": "success",
  "data": [
    {
      "time": "2020-06-22T00:00:00+00:00",
      "conversions_by_send_time": 0,
      "conversions1_by_send_time": 0,
      "conversions2_by_send_time": 0,
      "conversions3_by_send_time": 0,
      "conversions": 0,
      "conversions1": 0,
      "conversions2": 0,
      "conversions3": 0,
      "unique_recipients": 1000,
      "revenue": 123.45,
      "messages": {
        "email": [
          {
            "variation_api_id": "variation_1",
            "sent": 1000,
            "delivered": 950,
            "bounces": 50,
            "total_opens": 300,
            "unique_opens": 250,
            "total_clicks": 100,
            "unique_clicks": 80,
            "unsubscribes": 5,
            "spam_reports": 2
          }
        ],
        "ios_push": [
          {
            "variation_api_id": "variation_2",
            "sent": 500,
            "direct_opens": 150,
            "total_opens": 200,
            "bounces": 10
          }
        ],
        "android_push": [
          {
            "variation_api_id": "variation_3",
            "sent": 300,
            "direct_opens": 90,
            "total_opens": 120,
            "bounces": 5
          }
        ]
      }
    }
  ]
}
```

### Response Fields

#### Top-Level Fields
- **message** (String): Status message ("success" when completed without errors)
- **data** (Array): Array of daily analytics objects

#### Daily Analytics Object Fields
- **time** (String): ISO 8601 date string for the data point
- **conversions_by_send_time** (Integer, Optional): Conversions attributed by send time
- **conversions1_by_send_time** through **conversions3_by_send_time** (Integer, Optional): Specific conversion events by send time
- **conversions** (Integer, Optional): Total conversions
- **conversions1** through **conversions3** (Integer, Optional): Specific conversion events
- **unique_recipients** (Integer): Number of unique users who received messages
- **revenue** (Float, Optional): Revenue generated from campaign
- **messages** (Object): Channel-specific message statistics

#### Message Channel Types
The possible message types are:
- `email`
- `in_app_message`
- `webhook`
- `android_push`
- `ios_push`
- `kindle_push`
- `web_push`

#### Channel-Specific Metrics

##### Email Metrics
- **variation_api_id** (String): Identifier for the message variation
- **sent** (Integer): Number of messages sent
- **delivered** (Integer): Number of messages delivered
- **bounces** (Integer): Number of bounced messages
- **total_opens** (Integer): Total number of opens (including multiple opens by same user)
- **unique_opens** (Integer): Number of unique users who opened
- **total_clicks** (Integer): Total number of clicks
- **unique_clicks** (Integer): Number of unique users who clicked
- **unsubscribes** (Integer): Number of unsubscribes
- **spam_reports** (Integer): Number of spam reports

##### Push Notification Metrics
- **variation_api_id** (String): Identifier for the message variation
- **sent** (Integer): Number of messages sent
- **direct_opens** (Integer): Number of direct opens from notification
- **total_opens** (Integer): Total number of opens
- **bounces** (Integer): Number of bounced messages
- **body_clicks** (Integer): Number of body clicks (for some push types)

## Rate Limits

- **50,000 requests per minute** for this endpoint

### Rate Limit Headers
Every API request returns rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

### HTTP Status Codes

- **2XX**: Success - Request successfully processed
- **4XX**: Client errors - Invalid request parameters
- **5XX**: Server errors - Internal server issues

### Common Error Responses

#### Invalid Campaign ID (400)
```json
{
  "message": "Invalid campaign_id",
  "errors": [
    {
      "code": "invalid_campaign_id",
      "message": "Campaign not found"
    }
  ]
}
```

#### Invalid Length Parameter (400)
```json
{
  "message": "Invalid request parameters",
  "errors": [
    {
      "code": "invalid_length",
      "message": "Length must be between 1 and 100"
    }
  ]
}
```

#### Rate Limit Exceeded (429)
```json
{
  "message": "rate limit exceeded",
  "errors": [
    {
      "code": "rate_limited",
      "message": "API rate limit exceeded for this endpoint"
    }
  ]
}
```

#### Insufficient Permissions (403)
```json
{
  "message": "Insufficient permissions",
  "errors": [
    {
      "code": "insufficient_permissions",
      "message": "API key does not have campaigns.data_series permission"
    }
  ]
}
```

## Analytics Availability

- Analytics are always available for campaigns
- Analytics are available for specific campaign send instances when campaign is sent as broadcast
- When tracking is available for specific send instance, the provided send_id can be used with `/send/data_series` endpoint

## Best Practices

1. **Data Freshness**: Allow 5-minute delay between making subsequent API calls to minimize errors
2. **Rate Limiting**: Monitor `X-RateLimit-Remaining` header to avoid hitting limits
3. **Date Ranges**: Use appropriate `length` values (1-100 days) for your analysis needs
4. **Error Handling**: Implement retry logic for transient server errors (5XX codes)
5. **Caching**: Consider caching results for frequently accessed campaign analytics

## Example Request

```bash
curl --location -g --request GET 'https://rest.iad-01.braze.com/campaigns/data_series?campaign_id=your_campaign_id&length=7&ending_at=2020-06-28T23:59:59-5:00' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

## Use Cases

- **Performance Analysis**: Track campaign effectiveness over time
- **Campaign Optimization**: Compare metrics across different time periods
- **Revenue Attribution**: Monitor revenue generated from campaigns
- **Engagement Tracking**: Analyze open rates, click rates, and conversions
- **Channel Comparison**: Compare performance across email, push, and other channels

## Official Documentation

- **Primary Source**: [GET: Export Campaign Analytics](https://www.braze.com/docs/api/endpoints/export/campaigns/get_campaign_analytics)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)
- **Campaign Export Endpoints**: [Export Endpoints](https://www.braze.com/docs/api/endpoints/export)