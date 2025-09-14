# Braze Segment Analytics Export Endpoint

## Overview

The Segment Analytics Export endpoint retrieves a daily time series of the estimated size of a segment over time. This endpoint is valuable for tracking segment growth, analyzing user behavior patterns, and understanding segment evolution.

## Endpoint Details

- **URL**: `GET /segments/data_series`
- **Full URL**: `https://rest.{instance}.braze.com/segments/data_series`
- **HTTP Method**: GET
- **Purpose**: Retrieve a daily series of the estimated size of a segment over time

## Authentication Requirements

- **Authentication**: Bearer token authentication
- **Required API Key Permission**: `segments.data_series`
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
| `segment_id` | String | Segment API identifier |
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
      "size": 145678
    },
    {
      "time": "2023-01-02T00:00:00+00:00",
      "size": 146234
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | Status of the request (`success` or `error`) |
| `data` | Array | Array of time-series segment size data points |
| `time` | String | ISO 8601 timestamp for the data point (daily at 00:00:00 UTC) |
| `size` | Integer | Estimated number of users in the segment on that date |

## Segment Size Calculation

### Estimation Notes
- Segment sizes are **estimated** values, not exact counts
- Calculations are performed daily and represent a snapshot at that time
- Size may fluctuate based on user behavior and segment criteria
- Large segments may have slight variations in estimates due to sampling

### Daily Snapshots
- Data points represent segment size at the beginning of each day (00:00:00 UTC)
- Segments are recalculated based on current user profiles and behaviors
- Historical changes to segment definitions do not retroactively affect past data

## Rate Limits

- **Default Rate Limit**: 250,000 requests per hour
- **Shared Limit**: This limit is shared across all Braze API endpoints

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request parameters (e.g., length > 100) |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | API key lacks required permissions |
| 404 | Not Found | Segment ID not found |
| 422 | Unprocessable Entity | Segment does not have analytics enabled |
| 429 | Rate Limited | Too many requests |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "message": "error",
  "errors": [
    {
      "code": "segment_not_found",
      "message": "Segment with ID 'invalid_segment_id' not found"
    }
  ]
}
```

### Analytics Requirements Error

```json
{
  "message": "error",
  "errors": [
    {
      "code": "analytics_not_enabled",
      "message": "Analytics tracking is not enabled for this segment"
    }
  ]
}
```

## Example Requests

### Basic Segment Size Analysis (30 days)

```bash
curl 'https://rest.iad-01.braze.com/segments/data_series?segment_id=segment_1234&length=30' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

### Segment Growth Over Specific Period

```bash
curl 'https://rest.iad-01.braze.com/segments/data_series?segment_id=segment_5678&length=14&ending_at=2023-12-31T23:59:59-05:00' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

### Long-term Segment Trend Analysis

```bash
curl 'https://rest.iad-01.braze.com/segments/data_series?segment_id=segment_9012&length=90' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

## Example Response

```json
{
  "message": "success",
  "data": [
    {
      "time": "2023-12-25T00:00:00+00:00",
      "size": 248576
    },
    {
      "time": "2023-12-26T00:00:00+00:00",
      "size": 249134
    },
    {
      "time": "2023-12-27T00:00:00+00:00",
      "size": 248892
    },
    {
      "time": "2023-12-28T00:00:00+00:00",
      "size": 250145
    },
    {
      "time": "2023-12-29T00:00:00+00:00",
      "size": 251678
    },
    {
      "time": "2023-12-30T00:00:00+00:00",
      "size": 251923
    },
    {
      "time": "2023-12-31T00:00:00+00:00",
      "size": 252467
    }
  ]
}
```

## Segment Requirements

### Analytics Enablement
- Segments must have **analytics tracking enabled** to use this endpoint
- Enable analytics in the Braze dashboard when creating or editing segments
- Only analytics-enabled segments will return data

### Segment Types
This endpoint works with:
- **Static Segments**: Fixed user lists
- **Dynamic Segments**: Rule-based segments that update automatically
- **Location-based Segments**: Geofenced segments
- **Behavior-based Segments**: Event and activity-based segments

## Use Cases

### Growth Analysis
- Track segment growth over time
- Identify trends in user acquisition or churn
- Measure impact of marketing campaigns on segment size

### Seasonal Analysis
- Compare segment sizes across different time periods
- Identify seasonal patterns in user behavior
- Plan campaign timing based on segment trends

### Campaign Impact
- Measure how campaigns affect segment membership
- Track user journey progression through segments
- Analyze segment conversion funnels

## Dashboard Integration

Segment analytics are also available in the Braze dashboard:
- Navigate to **Engagement > Segments**
- Select a segment to view its analytics
- Access visual charts and trend analysis
- Export data for further analysis

## Official Documentation

For the most current information, visit:
[https://www.braze.com/docs/api/endpoints/export/segments/get_segment_analytics](https://www.braze.com/docs/api/endpoints/export/segments/get_segment_analytics)

## Usage Notes

1. **Analytics Requirement**: Segments must have analytics tracking enabled
2. **Estimation**: Sizes are estimates, especially for very large segments
3. **Daily Snapshots**: Only daily granularity is available (no hourly data)
4. **Time Zones**: All timestamps are in UTC (00:00:00 each day)
5. **Data Availability**: Current day data may not be available until processing completes
6. **Historical Data**: Historical segment size data is retained based on your Braze plan
7. **Segment Changes**: Changes to segment definitions don't affect historical data
8. **Performance**: Large segments may take longer to calculate
9. **Zero Size**: Segments with no users will show `size: 0`
10. **Rate Limiting**: Standard Braze rate limits apply (250k requests/hour)