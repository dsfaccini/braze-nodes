# Braze Revenue Data Export Endpoint

## Overview

The Revenue Data Export endpoint returns the total money spent in your app over a specified time range. This endpoint is crucial for tracking purchase behavior, revenue trends, and ROI analysis across your user base.

## Endpoint Details

- **URL**: `GET /purchases/revenue_series`
- **Full URL**: `https://rest.{instance}.braze.com/purchases/revenue_series`
- **HTTP Method**: GET
- **Purpose**: Return the total money spent in your app over a time range

## Authentication Requirements

- **Authentication**: Bearer token authentication
- **Required API Key Permission**: `purchases.revenue_series`
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
| `length` | Integer | Number of days to include in revenue series (1-100) |

### Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ending_at` | String | End date/time for data series (ISO-8601 format: YYYY-MM-DDTHH:mm:ss-HH:mm). Defaults to current time |
| `unit` | String | Time granularity: `day` or `hour` (default: `day`) |
| `app_id` | String | Specific app identifier to filter results |
| `product` | String | Product-specific filter to analyze specific product revenue |

## Response Schema

### Success Response

```json
{
  "message": "success",
  "data": [
    {
      "time": "2023-01-01T00:00:00+00:00",
      "revenue": 12545.75
    },
    {
      "time": "2023-01-02T00:00:00+00:00",
      "revenue": 15678.25
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | Status of the request (`success` or `error`) |
| `data` | Array | Array of time-series revenue data points |
| `time` | String | ISO 8601 timestamp for the revenue data point |
| `revenue` | Number | Total revenue amount for that time period (in workspace currency) |

## Time Granularity Options

### Daily Granularity (`unit=day`)
- Returns one data point per day
- Time stamp represents the start of the day (00:00:00 UTC)
- Revenue aggregated for the full 24-hour period
- Recommended for trend analysis over weeks/months

### Hourly Granularity (`unit=hour`)
- Returns one data point per hour
- Time stamp represents the start of the hour
- Revenue aggregated for that specific hour
- Suitable for detailed short-term analysis
- Limited to shorter time ranges to manage response size

## Filtering Options

### App-Specific Revenue
Use `app_id` to filter revenue data for a specific app:
- Useful for multi-app workspaces
- Defaults to workspace-wide results if not specified

### Product-Specific Revenue
Use `product` parameter to analyze specific product performance:
- Filter by individual product identifiers
- Track product-specific revenue trends
- Useful for e-commerce and subscription apps

## Rate Limits

- **Rate Limit**: 1,000 requests per hour
- **Shared Limit**: This limit is shared with `/custom_attributes`, `/events`, and `/events/list` endpoints
- **Lower Limit**: Note the significantly lower rate limit compared to other analytics endpoints

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request parameters (e.g., length > 100) |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | API key lacks required permissions |
| 404 | Not Found | App ID or product not found |
| 422 | Unprocessable Entity | Invalid app_id or product parameter |
| 429 | Rate Limited | Exceeded 1,000 requests per hour |
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

## Example Requests

### Basic Revenue Analytics (30 days)

```bash
curl 'https://rest.iad-01.braze.com/purchases/revenue_series?length=30' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

### App-Specific Revenue with Custom End Date

```bash
curl 'https://rest.iad-01.braze.com/purchases/revenue_series?length=14&app_id=app_1234&ending_at=2023-12-31T23:59:59-05:00' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

### Hourly Revenue Analysis

```bash
curl 'https://rest.iad-01.braze.com/purchases/revenue_series?length=3&unit=hour&ending_at=2023-12-31T23:59:59-05:00' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

### Product-Specific Revenue

```bash
curl 'https://rest.iad-01.braze.com/purchases/revenue_series?length=7&product=premium_subscription' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

## Example Response

```json
{
  "message": "success",
  "data": [
    {
      "time": "2023-12-25T00:00:00+00:00",
      "revenue": 18567.45
    },
    {
      "time": "2023-12-26T00:00:00+00:00",
      "revenue": 22134.78
    },
    {
      "time": "2023-12-27T00:00:00+00:00",
      "revenue": 19876.23
    },
    {
      "time": "2023-12-28T00:00:00+00:00",
      "revenue": 25689.12
    },
    {
      "time": "2023-12-29T00:00:00+00:00",
      "revenue": 31245.67
    },
    {
      "time": "2023-12-30T00:00:00+00:00",
      "revenue": 28934.55
    },
    {
      "time": "2023-12-31T00:00:00+00:00",
      "revenue": 35678.89
    }
  ]
}
```

## Revenue Calculation Details

### Currency Handling
- Revenue is returned in your workspace's base currency
- Currency conversion is handled automatically by Braze
- Exchange rates are applied at the time of purchase

### Revenue Sources
- In-app purchases
- Subscription renewals
- One-time payments
- Any purchase events tracked via Braze SDK or REST API

### Attribution
- Revenue is attributed to the time the purchase was made
- Not when it was processed or reported to Braze
- Refunds may appear as negative revenue values

## Data Retention

- Purchase data retention varies by Braze plan
- Historical revenue data available according to your contract
- Recent data (last 30 days) typically available immediately

## Official Documentation

For the most current information, visit:
[https://www.braze.com/docs/api/endpoints/export/purchases/get_revenue_series](https://www.braze.com/docs/api/endpoints/export/purchases/get_revenue_series)

## Usage Notes

1. **Currency Format**: Revenue values are returned as decimal numbers (e.g., 123.45)
2. **Zero Revenue**: Time periods with no purchases show `revenue: 0`
3. **Negative Values**: Refunds may appear as negative revenue
4. **Time Zones**: All timestamps are in UTC
5. **Data Availability**: Purchase data may take a few minutes to appear in analytics
6. **Rate Limiting**: Be mindful of the low rate limit (1,000/hour) when making multiple requests
7. **Workspace Scope**: Default behavior includes all apps in workspace
8. **Product Filtering**: Product names must match exactly (case-sensitive)
9. **Batch Analysis**: Consider aggregating multiple days in single requests due to rate limits
10. **Performance**: Large time ranges may result in slower response times