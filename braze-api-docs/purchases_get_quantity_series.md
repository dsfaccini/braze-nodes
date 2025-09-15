# Braze API: GET /purchases/quantity_series

## Overview

The Export Purchase Quantity Data endpoint allows you to retrieve time-series data showing the total number of purchases in your app over a specified time range. This endpoint provides purchase volume analytics to help understand purchase trends and patterns.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/purchases/quantity_series`
- **HTTP Method**: GET
- **Purpose**: Export time-series data showing purchase quantities over time

## Authentication

### Required Headers
```
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `purchases.quantity_series` permission

## Request Parameters

### Query Parameters

#### Required Parameters

- **length** (Integer, Required)
  - Number of days/hours to include in the series
  - Range: 1-100
  - Determines the time range for data retrieval

#### Optional Parameters

- **ending_at** (String, Optional)
  - End date for the data export in ISO 8601 format
  - If not provided, defaults to current time
  - Format: "YYYY-MM-DDTHH:MM:SSZ"

- **unit** (String, Optional)
  - Time interval for data points
  - Values: "day" (default) or "hour"
  - Determines granularity of returned data

- **app_id** (String, Optional)
  - Specific app identifier to filter purchases
  - If not provided, returns data for all apps
  - Must be a valid app ID from your workspace

- **product** (String, Optional)
  - Product name to filter purchase data
  - Returns only purchases for the specified product
  - Case-sensitive string matching

### URL Construction Example

```
https://rest.iad-01.braze.com/purchases/quantity_series?length=30&unit=day&ending_at=2024-01-15T23:59:59Z
```

## Response Schema

### Success Response (200)

```json
{
  "message": "success",
  "data": [
    {
      "time": "2024-01-01T00:00:00Z",
      "purchase_quantity": 145
    },
    {
      "time": "2024-01-02T00:00:00Z",
      "purchase_quantity": 203
    },
    {
      "time": "2024-01-03T00:00:00Z",
      "purchase_quantity": 178
    }
  ]
}
```

### Response Fields

- **message** (String): Status message indicating success
- **data** (Array): Time-series data points
  - **time** (String): ISO 8601 timestamp for the data point
  - **purchase_quantity** (Integer): Total number of purchases in that time period

## Rate Limits

### Shared Rate Limit
- **1,000 requests per hour** shared with other purchase export endpoints

### Rate Limit Headers
Every API request returns rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

### HTTP Status Codes

- **2XX**: Success - Data retrieved successfully
- **4XX**: Fatal client errors - Check request parameters
- **5XX**: Fatal server errors - Server unable to execute request

### Common Error Responses

#### Invalid Length Parameter (400)
```json
{
  "message": "Invalid length parameter",
  "errors": [
    {
      "code": "invalid_length",
      "message": "Length must be between 1 and 100"
    }
  ]
}
```

#### Invalid Date Format (400)
```json
{
  "message": "Invalid date format",
  "errors": [
    {
      "code": "invalid_date",
      "message": "ending_at must be in ISO 8601 format"
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
      "message": "API rate limit exceeded for purchase endpoints"
    }
  ]
}
```

#### Invalid App ID (400)
```json
{
  "message": "Invalid app_id",
  "errors": [
    {
      "code": "invalid_app_id",
      "message": "App ID not found or access denied"
    }
  ]
}
```

## Key Features

- Retrieve up to 100 days of purchase quantity data
- Support for both daily and hourly data granularity
- Filter by specific app or product
- Time-series format ideal for trend analysis
- Shared rate limiting across purchase export endpoints
- ISO 8601 timestamp formatting for easy parsing

## Best Practices

1. **Data Range Planning**: Start with smaller date ranges for initial analysis
2. **Rate Management**: Monitor shared 1,000/hour limit with other purchase endpoints
3. **Granularity Selection**: Use "hour" unit for recent data, "day" for historical trends
4. **Filtering Strategy**: Use app_id and product filters to reduce data volume
5. **Time Zone Considerations**: All timestamps returned in UTC
6. **Caching**: Implement response caching to minimize API calls

## Example Request

```bash
curl --location --request GET 'https://rest.iad-01.braze.com/purchases/quantity_series?length=30&unit=day&app_id=your_app_id' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

## Example Use Cases

- **Trend Analysis**: Track purchase volume changes over time
- **Seasonality Studies**: Identify seasonal purchase patterns
- **Product Performance**: Compare purchase volumes across products
- **App Comparison**: Analyze purchase differences between apps
- **Business Intelligence**: Feed data into analytics dashboards
- **Performance Monitoring**: Set up alerts for purchase volume changes

## Data Retention

- Purchase data availability depends on your Braze plan
- Historical data typically available for 13 months
- Contact Braze support for extended historical data access

## Related Endpoints

- **GET /purchases/revenue_series** - Get revenue data over time
- **GET /purchases/product_list** - List all product IDs with purchase data
- **POST /users/track** - Track purchase events
- **GET /campaigns/data_series** - Campaign-level purchase analytics

## References

- **Primary Source**: [GET: Export Purchase Quantity Data](https://www.braze.com/docs/api/endpoints/export/purchases/get_number_of_purchases)
- **Purchase Tracking**: [Logging Purchases](https://www.braze.com/docs/developer_guide/analytics/logging_purchases)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)