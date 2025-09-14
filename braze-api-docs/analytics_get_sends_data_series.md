# Braze Send Analytics Export Endpoint

## Overview

The Send Analytics Export endpoint retrieves daily analytics data for API campaign sends. This endpoint provides comprehensive performance metrics for specific send IDs, enabling detailed analysis of message delivery and engagement.

## Endpoint Details

- **URL**: `GET /sends/data_series`
- **Full URL**: `https://rest.{instance}.braze.com/sends/data_series`
- **HTTP Method**: GET
- **Purpose**: Retrieve a daily series of various stats for a tracked send_id for API campaigns

## Authentication Requirements

- **Authentication**: Bearer token authentication
- **Required API Key Permission**: `sends.data_series`
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
| `send_id` | String | Send API identifier |
| `length` | Integer | Number of days to include in series (1-100) |

### Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ending_at` | String | End date for data series (ISO-8601 format: YYYY-MM-DDTHH:mm:ss-HH:mm) |

## Response Schema

### Success Response

```json
{
  "message": "success",
  "data": [
    {
      "time": "2023-01-01T00:00:00+00:00",
      "messages": {
        "ios_push": [
          {
            "variation_name": "Variation 1",
            "sent": 1000,
            "delivered": 950,
            "opens": 300,
            "clicks": 150,
            "bounces": 50,
            "conversions": 75,
            "revenue": 150.50
          }
        ],
        "android_push": [...],
        "email": [...],
        "sms": [...],
        "webhook": [...]
      }
    }
  ]
}
```

### Available Metrics

The response includes detailed metrics for each message type:

- **sent**: Number of messages sent
- **delivered**: Number of messages delivered
- **opens**: Number of opens (email, push)
- **clicks**: Number of clicks
- **bounces**: Number of bounces
- **conversions**: Number of conversions
- **revenue**: Revenue generated
- **unique_recipients**: Number of unique recipients
- **variation_name**: Name of the message variation

### Supported Message Types

- `ios_push`: iOS push notifications
- `android_push`: Android push notifications
- `kindle_push`: Kindle push notifications
- `web_push`: Web push notifications
- `email`: Email messages
- `in_app_message`: In-app messages
- `sms`: SMS messages
- `webhook`: Webhook messages

## Rate Limits

- **Default Rate Limit**: 250,000 requests per hour
- **Shared Limit**: This limit is shared across all Braze API endpoints

## Data Retention

- **Analytics Storage**: Braze stores send analytics for 14 days after the send
- **Attribution**: Campaign conversions are attributed to the most recent send_id that a user has received from the campaign

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | API key lacks required permissions |
| 404 | Not Found | Campaign ID or Send ID not found |
| 429 | Rate Limited | Too many requests |
| 500 | Internal Server Error | Server error |

### Error Response Format

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

## Example Request

```bash
curl 'https://rest.iad-01.braze.com/sends/data_series?campaign_id=campaign_1234&send_id=send_5678&length=7&ending_at=2023-12-31T23:59:59-05:00' \
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
            "variation_name": "Holiday Sale",
            "sent": 5000,
            "delivered": 4850,
            "opens": 1455,
            "clicks": 436,
            "bounces": 150,
            "conversions": 87,
            "revenue": 1740.25
          }
        ],
        "ios_push": [
          {
            "variation_name": "Holiday Sale",
            "sent": 2000,
            "delivered": 1900,
            "opens": 950,
            "clicks": 285,
            "conversions": 45,
            "revenue": 675.75
          }
        ]
      }
    }
  ]
}
```

## Official Documentation

For the most current information, visit:
[https://www.braze.com/docs/api/endpoints/export/campaigns/get_send_analytics](https://www.braze.com/docs/api/endpoints/export/campaigns/get_send_analytics)

## Usage Notes

1. **Campaign Type**: This endpoint is specifically for API campaigns only
2. **Time Range**: Use reasonable time ranges to avoid large response sizes
3. **Attribution Window**: Conversions are attributed to the most recent send received by the user
4. **Timezone**: All timestamps are in UTC unless otherwise specified
5. **Data Availability**: Analytics data may take a few hours to become available after send