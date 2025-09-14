# Braze Campaign Analytics Export Endpoint

## Overview

The Campaign Analytics Export endpoint retrieves time-series analytics data for campaigns over a specified period. This endpoint provides comprehensive performance metrics including sends, opens, clicks, conversions, and revenue across all message channels.

## Endpoint Details

- **URL**: `GET /campaigns/data_series`
- **Full URL**: `https://rest.{instance}.braze.com/campaigns/data_series`
- **HTTP Method**: GET
- **Purpose**: Retrieve a daily series of various stats for a campaign over time

## Authentication Requirements

- **Authentication**: Bearer token authentication
- **Required API Key Permission**: `campaigns.data_series`
- **Header**: `Authorization: Bearer YOUR-REST-API-KEY`

## Instance Endpoints

Replace `{instance}` with your Braze instance:
- US-01: `rest.iad-01.braze.com`
- US-02: `rest.iad-02.braze.com`
- US-03: `rest.iad-03.braze.com`
- US-04: `rest.iad-04.braze.com`
- US-05: `rest.iad-05.braze.com`
- US-06: `rest.iad-06.braze.com`
- US-07: `rest.iad-07.braze.com`
- US-08: `rest.iad-08.braze.com`
- US-10: `rest.iad-10.braze.com`
- EU-01: `rest.fra-01.braze.com`
- EU-02: `rest.fra-02.braze.com`
- AU-01: `rest.ap-01.braze.com`
- ID-01: `rest.ap-02.braze.com`

## Request Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `campaign_id` | String | Campaign API identifier |
| `length` | Integer | Number of days to include in series (1-100) |

### Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ending_at` | String | End date for data series (ISO-8601 format: YYYY-MM-DDTHH:mm:ss-HH:mm). Defaults to current time |

## Response Schema

### Success Response

```json
{
  "message": "success",
  "data": [
    {
      "time": "2023-01-01T00:00:00+00:00",
      "messages": {
        "email": [
          {
            "variation_name": "Control",
            "sent": 10000,
            "delivered": 9500,
            "opens": 3800,
            "unique_opens": 3200,
            "clicks": 950,
            "unique_clicks": 800,
            "unsubscribes": 25,
            "bounces": 500,
            "spam_reports": 5,
            "conversions": 180,
            "revenue": 2340.50
          }
        ],
        "ios_push": [...],
        "android_push": [...],
        "web_push": [...],
        "in_app_message": [...],
        "sms": [...],
        "webhook": [...]
      }
    }
  ]
}
```

### Available Metrics by Channel

#### Email Metrics
- **sent**: Total messages sent
- **delivered**: Messages successfully delivered
- **opens**: Total opens (including multiple opens by same user)
- **unique_opens**: Unique users who opened
- **clicks**: Total clicks (including multiple clicks by same user)
- **unique_clicks**: Unique users who clicked
- **unsubscribes**: Number of unsubscribes
- **bounces**: Number of bounces (hard + soft)
- **spam_reports**: Number of spam complaints
- **conversions**: Number of conversions
- **revenue**: Revenue generated

#### Push Notifications (iOS/Android/Web)
- **sent**: Total pushes sent
- **delivered**: Pushes successfully delivered
- **opens**: Push opens
- **clicks**: Push clicks (if applicable)
- **conversions**: Number of conversions
- **revenue**: Revenue generated

#### SMS Metrics
- **sent**: Total SMS sent
- **delivered**: SMS successfully delivered
- **clicks**: Link clicks in SMS
- **conversions**: Number of conversions
- **revenue**: Revenue generated

#### In-App Messages
- **sent**: Total in-app messages sent
- **impressions**: Number of impressions
- **clicks**: Number of clicks
- **conversions**: Number of conversions
- **revenue**: Revenue generated

#### Webhook Metrics
- **sent**: Total webhooks sent
- **errors**: Number of webhook errors

### Supported Message Types

- `email`: Email campaigns
- `ios_push`: iOS push notifications
- `android_push`: Android push notifications
- `kindle_push`: Kindle push notifications
- `web_push`: Web push notifications
- `in_app_message`: In-app messages
- `sms`: SMS messages
- `webhook`: Webhook calls

## Rate Limits

- **Rate Limit**: 50,000 requests per minute
- **Note**: This is a lower rate limit compared to other endpoints due to the potentially large data sets

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request parameters (e.g., length > 100) |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | API key lacks required permissions |
| 404 | Not Found | Campaign ID not found |
| 429 | Rate Limited | Exceeded 50,000 requests per minute |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "message": "error",
  "errors": [
    {
      "code": "invalid_parameter",
      "message": "Length must be between 1 and 100"
    }
  ]
}
```

## Example Request

```bash
curl 'https://rest.iad-01.braze.com/campaigns/data_series?campaign_id=campaign_1234&length=7&ending_at=2023-12-31T23:59:59-05:00' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

## Example Response

```json
{
  "message": "success",
  "data": [
    {
      "time": "2023-12-25T00:00:00+00:00",
      "messages": {
        "email": [
          {
            "variation_name": "Holiday Promotion A",
            "sent": 15000,
            "delivered": 14250,
            "opens": 5700,
            "unique_opens": 4800,
            "clicks": 1425,
            "unique_clicks": 1200,
            "unsubscribes": 45,
            "bounces": 750,
            "spam_reports": 12,
            "conversions": 240,
            "revenue": 4800.75
          },
          {
            "variation_name": "Holiday Promotion B",
            "sent": 15000,
            "delivered": 14400,
            "opens": 6120,
            "unique_opens": 5100,
            "clicks": 1530,
            "unique_clicks": 1275,
            "unsubscribes": 38,
            "bounces": 600,
            "spam_reports": 8,
            "conversions": 285,
            "revenue": 5700.25
          }
        ],
        "ios_push": [
          {
            "variation_name": "Holiday Promotion A",
            "sent": 8000,
            "delivered": 7600,
            "opens": 3800,
            "clicks": 950,
            "conversions": 114,
            "revenue": 1425.50
          }
        ]
      }
    },
    {
      "time": "2023-12-26T00:00:00+00:00",
      "messages": {
        "email": [
          {
            "variation_name": "Holiday Promotion A",
            "sent": 12000,
            "delivered": 11400,
            "opens": 4560,
            "unique_opens": 3840,
            "clicks": 1140,
            "unique_clicks": 960,
            "unsubscribes": 24,
            "bounces": 600,
            "spam_reports": 6,
            "conversions": 192,
            "revenue": 3840.60
          }
        ]
      }
    }
  ]
}
```

## Official Documentation

For the most current information, visit:
[https://www.braze.com/docs/api/endpoints/export/campaigns/get_campaign_analytics](https://www.braze.com/docs/api/endpoints/export/campaigns/get_campaign_analytics)

## Usage Notes

1. **Data Retention**: Campaign analytics are available for the lifetime of the campaign
2. **Variations**: Each campaign variation is reported separately in the response
3. **Time Range**: Use appropriate time ranges to manage response size
4. **Revenue**: Revenue data is available if purchase tracking is implemented
5. **Attribution**: Conversions are tracked based on your attribution settings
6. **Timezone**: All timestamps are in UTC
7. **Data Availability**: Analytics data may take a few hours to become fully available
8. **Multi-channel**: Single campaigns can include multiple message types
9. **Rate Limiting**: Be mindful of the lower rate limit (50k/min) for this endpoint