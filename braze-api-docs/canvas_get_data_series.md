# Braze API: GET /canvas/data_series

## Overview

The Export Canvas Data Series Analytics endpoint allows you to retrieve time-series data for Canvas performance metrics. This endpoint provides detailed analytics over specified time periods, including entry statistics, conversion metrics, revenue data, and step-level performance breakdowns.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/canvas/data_series`
- **HTTP Method**: GET
- **Purpose**: Export time-series analytics data for Canvas performance analysis

## Authentication

### Required Headers
```
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `canvas.data_series` permission

## Request Parameters

### Query Parameters

#### Required Parameters

- **canvas_id** (String, Required)
  - The Canvas API identifier
  - Must be a valid Canvas ID from your Braze workspace

- **ending_at** (String, Required)
  - End date for data export in ISO 8601 format
  - Format: "YYYY-MM-DDTHH:MM:SSZ"
  - Must be in the past

#### Optional Parameters

- **starting_at** (String, Optional)
  - Start date for data export in ISO 8601 format
  - If not provided, defaults to 14 days before ending_at
  - Format: "YYYY-MM-DDTHH:MM:SSZ"

- **length** (Integer, Optional)
  - Number of days to include in the series
  - Range: 1-14 days
  - Alternative to using starting_at

- **include_variant_breakdown** (Boolean, Optional)
  - Include variant-level statistics in response
  - Default: false

- **include_step_breakdown** (Boolean, Optional)
  - Include step-level statistics in response
  - Default: false

- **include_deleted_step_data** (Boolean, Optional)
  - Include data for deleted Canvas steps
  - Default: false

### URL Construction Example

```
https://rest.iad-01.braze.com/canvas/data_series?canvas_id=canvas_123&ending_at=2024-01-15T23:59:59Z&length=7&include_variant_breakdown=true
```

## Response Schema

### Success Response (200)

```json
{
  "message": "success",
  "data": [
    {
      "name": "Canvas Name",
      "stats": [
        {
          "time": "2024-01-01T00:00:00Z",
          "total_stats": {
            "revenue": 12500.50,
            "conversions": 450,
            "conversions_by_send_time": 425,
            "entries": 2500
          },
          "variant_stats": [
            {
              "name": "Variant 1",
              "revenue": 8200.25,
              "conversions": 285,
              "entries": 1600
            }
          ],
          "step_stats": [
            {
              "name": "Email Step 1",
              "messages": {
                "email": [
                  {
                    "sent": 1500,
                    "opens": 750,
                    "clicks": 225,
                    "bounces": 15
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Response Fields

- **message** (String): Status message indicating success
- **data** (Array): Canvas analytics data
  - **name** (String): Canvas name
  - **stats** (Array): Time-series statistics
    - **time** (String): ISO 8601 timestamp for the data point
    - **total_stats** (Object): Overall Canvas performance metrics
      - **revenue** (Number): Total revenue generated
      - **conversions** (Integer): Total conversion events
      - **conversions_by_send_time** (Integer): Conversions attributed to send time
      - **entries** (Integer): Total Canvas entries
    - **variant_stats** (Array): Variant-level breakdowns (if requested)
    - **step_stats** (Array): Step-level performance data (if requested)

## Rate Limits

### Standard Rate Limit
- **250,000 requests per hour** (standard Braze API rate limit)

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

#### Invalid Canvas ID (400)
```json
{
  "message": "Invalid canvas_id",
  "errors": [
    {
      "code": "invalid_canvas_id",
      "message": "Canvas not found or access denied"
    }
  ]
}
```

#### Invalid Date Range (400)
```json
{
  "message": "Invalid date range",
  "errors": [
    {
      "code": "invalid_date_range",
      "message": "ending_at must be in the past and starting_at must be before ending_at"
    }
  ]
}
```

#### Date Range Too Large (400)
```json
{
  "message": "Date range too large",
  "errors": [
    {
      "code": "date_range_limit_exceeded",
      "message": "Maximum date range is 14 days"
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

## Key Features

- Retrieve up to 14 days of Canvas performance data
- Support for variant-level analytics breakdown
- Step-level performance metrics including channel-specific data
- Revenue and conversion tracking over time
- Option to include deleted step data for historical analysis
- Time-series format ideal for trend analysis and reporting

## Best Practices

1. **Date Range Planning**: Start with smaller date ranges for faster responses
2. **Breakdown Usage**: Only request breakdowns when needed to reduce response size
3. **Rate Management**: Monitor rate limits when making multiple requests
4. **Data Caching**: Implement response caching for frequently accessed data
5. **Time Zone Handling**: All timestamps returned in UTC
6. **Performance Monitoring**: Use for regular Canvas performance analysis

## Example Request

```bash
curl --location --request GET 'https://rest.iad-01.braze.com/canvas/data_series?canvas_id=your_canvas_id&ending_at=2024-01-15T23:59:59Z&length=7&include_variant_breakdown=true&include_step_breakdown=true' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

## Example Use Cases

- **Performance Tracking**: Monitor Canvas performance over time
- **A/B Testing Analysis**: Compare variant performance metrics
- **Step Optimization**: Identify high-performing and underperforming steps
- **Revenue Attribution**: Track revenue generated by Canvas campaigns
- **Conversion Analysis**: Understand conversion patterns and trends
- **Business Intelligence**: Feed data into analytics dashboards

## Data Retention

- Canvas analytics data availability depends on your Braze plan
- Historical data typically available for 13 months
- Contact Braze support for extended historical data access

## Related Endpoints

- **GET /canvas/data_summary** - Get Canvas summary analytics
- **GET /canvas/details** - Retrieve Canvas configuration details
- **GET /canvas/list** - List all Canvas campaigns
- **POST /canvas/trigger/send** - Send Canvas messages via API
- **GET /campaigns/data_series** - Campaign-level analytics data

## References

- **Primary Source**: [GET: Export Canvas Data Series Analytics](https://www.braze.com/docs/api/endpoints/export/canvas/get_canvas_analytics)
- **Canvas Overview**: [Creating a Canvas](https://www.braze.com/docs/user_guide/engagement_tools/canvas/create_a_canvas/create_a_canvas)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)