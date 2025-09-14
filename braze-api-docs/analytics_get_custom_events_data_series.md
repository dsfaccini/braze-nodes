# Braze Custom Events Analytics Export Endpoint

## Overview

The Custom Events Analytics Export endpoint retrieves time-series data showing the number of occurrences of custom events in your app over a designated time period. This endpoint is essential for tracking user behavior and custom event performance.

## Endpoint Details

- **URL**: `GET /events/data_series`
- **Full URL**: `https://rest.{instance}.braze.com/events/data_series`
- **HTTP Method**: GET
- **Purpose**: Retrieve a series of the number of occurrences of a custom event over time

## Authentication Requirements

- **Authentication**: Bearer token authentication
- **Required API Key Permission**: `events.data_series`
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
| `event` | String | Name of the custom event to analyze |
| `length` | Integer | Number of time units to include in series (1-100) |

### Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `unit` | String | Time granularity: `day` or `hour` (default: `day`) |
| `ending_at` | String | End date/time for data series (ISO-8601 format: YYYY-MM-DDTHH:mm:ss-HH:mm) |
| `app_id` | String | Specific app identifier to filter results |
| `segment_id` | String | Analytics-enabled segment ID to filter results |

## Response Schema

### Success Response

```json
{
  "message": "success",
  "data": [
    {
      "time": "2023-01-01T00:00:00+00:00",
      "count": 1250
    },
    {
      "time": "2023-01-01T01:00:00+00:00",
      "count": 875
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | Status of the request (`success` or `error`) |
| `data` | Array | Array of time-series data points |
| `time` | String | ISO 8601 timestamp for the data point |
| `count` | Integer | Number of event occurrences for that time period |

## Time Granularity Options

### Daily Granularity (`unit=day`)
- Returns one data point per day
- Time stamp represents the start of the day (00:00:00 UTC)
- Suitable for longer-term trend analysis

### Hourly Granularity (`unit=hour`)
- Returns one data point per hour
- Time stamp represents the start of the hour
- Suitable for detailed, short-term analysis
- Limited to shorter time ranges due to data volume

## Rate Limits

- **Default Rate Limit**: 250,000 requests per hour
- **Shared Limit**: This limit is shared across all Braze API endpoints

## Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | API key lacks required permissions |
| 404 | Not Found | Custom event not found |
| 422 | Unprocessable Entity | Invalid segment_id or app_id |
| 429 | Rate Limited | Too many requests |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "message": "error",
  "errors": [
    {
      "code": "invalid_event_name",
      "message": "Custom event 'invalid_event' not found"
    }
  ]
}
```

## Example Requests

### Basic Daily Analytics

```bash
curl 'https://rest.iad-01.braze.com/events/data_series?event=purchase_completed&length=30' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

### Hourly Analytics with Segment Filter

```bash
curl 'https://rest.iad-01.braze.com/events/data_series?event=video_watched&length=24&unit=hour&segment_id=segment_1234&ending_at=2023-12-31T23:59:59-05:00' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

### App-Specific Analytics

```bash
curl 'https://rest.iad-01.braze.com/events/data_series?event=level_completed&length=7&app_id=app_5678' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

## Example Response

```json
{
  "message": "success",
  "data": [
    {
      "time": "2023-12-25T00:00:00+00:00",
      "count": 2847
    },
    {
      "time": "2023-12-26T00:00:00+00:00",
      "count": 3156
    },
    {
      "time": "2023-12-27T00:00:00+00:00",
      "count": 2934
    },
    {
      "time": "2023-12-28T00:00:00+00:00",
      "count": 3821
    },
    {
      "time": "2023-12-29T00:00:00+00:00",
      "count": 4275
    },
    {
      "time": "2023-12-30T00:00:00+00:00",
      "count": 3967
    },
    {
      "time": "2023-12-31T00:00:00+00:00",
      "count": 4582
    }
  ]
}
```

## Custom Event Properties

### Event Property Limitations
- Each custom event can have up to **256 distinct custom event properties**
- Only the first 256 properties are captured if more are logged
- Custom event properties are not included in this analytics endpoint

### Property-Specific Analytics
For detailed analysis of custom event properties, consider:
- Using raw data export for property-level analysis
- Implementing separate tracking for critical properties
- Using the Custom Events Report in the Braze dashboard

## Dashboard Integration

Custom event analytics can also be viewed in the Braze dashboard:
- Navigate to **Analytics > Custom Events Report**
- View aggregate occurrence data for each custom event
- Access visual charts and trend analysis

## Official Documentation

For the most current information, visit:
[https://www.braze.com/docs/api/endpoints/export/custom_events/get_custom_events_analytics](https://www.braze.com/docs/api/endpoints/export/custom_events/get_custom_events_analytics)

## Usage Notes

1. **Event Names**: Event names are case-sensitive
2. **Data Retention**: Custom event data is retained according to your Braze plan
3. **Filtering**: Use segment_id and app_id to narrow down results for specific user groups
4. **Time Zones**: All timestamps are in UTC
5. **Data Availability**: Custom event data may take a few minutes to appear in analytics
6. **Segment Requirements**: Segments must have analytics tracking enabled to be used as filters
7. **Performance**: Hourly granularity over long periods may result in large responses
8. **Attribution**: Events are counted at the time they occurred, not when they were processed
9. **Zero Counts**: Time periods with no events will show `count: 0`
10. **Batch Analysis**: Consider making multiple requests for different events rather than very long time ranges