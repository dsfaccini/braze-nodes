# Braze API: GET /segments/list

## Overview

The Export Segment List endpoint allows you to retrieve a list of segments from your Braze workspace. This endpoint provides segment metadata including segment names, API identifiers, analytics tracking status, and associated tags, making it useful for segment management and analytics setup.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/segments/list`
- **HTTP Method**: GET
- **Purpose**: Export a list of segments with their basic information and metadata

## Authentication

### Required Headers
```
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `segments.list` permission

## Request Parameters

### Query Parameters

#### Optional Parameters

- **page** (Integer, Optional)
  - Page number for pagination
  - Default: 0 (first page)
  - Used to navigate through large result sets

- **sort_direction** (String, Optional)
  - Sort order for returned segments
  - Values: "asc" (oldest first), "desc" (newest first)
  - Default: "asc" (oldest to newest by creation time)

### URL Construction Example

```
https://rest.iad-01.braze.com/segments/list?page=1&sort_direction=desc
```

## Response Schema

### Success Response (200)

```json
{
  "message": "success",
  "segments": [
    {
      "id": "segment_identifier_123",
      "name": "High Value Customers",
      "analytics_tracking_enabled": true,
      "tags": ["premium", "high-ltv", "email-engaged"]
    },
    {
      "id": "segment_identifier_456",
      "name": "New Users",
      "analytics_tracking_enabled": false,
      "tags": ["onboarding", "recent-signup"]
    }
  ]
}
```

### Response Fields

- **message** (String): Status message indicating success
- **segments** (Array): List of segment objects
  - **id** (String): Segment API identifier used for targeting
  - **name** (String): Human-readable segment name
  - **analytics_tracking_enabled** (Boolean): Whether analytics tracking is enabled for this segment
  - **tags** (Array): Array of tag strings associated with the segment

## Rate Limits

### Standard Rate Limit
- **250,000 requests per hour** (standard Braze API rate limit)

### Pagination
- Returns up to 100 segments per page
- Use page parameter to retrieve additional segments
- Sorted by creation time (oldest to newest by default)

### Rate Limit Headers
Every API request returns rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

### HTTP Status Codes

- **2XX**: Success - Segments retrieved successfully
- **4XX**: Fatal client errors - Check request parameters and permissions
- **5XX**: Fatal server errors - Server unable to execute request

### Common Error Responses

#### Invalid Page Parameter (400)
```json
{
  "message": "Invalid page parameter",
  "errors": [
    {
      "code": "invalid_page",
      "message": "Page must be a non-negative integer"
    }
  ]
}
```

#### Invalid Sort Direction (400)
```json
{
  "message": "Invalid sort_direction",
  "errors": [
    {
      "code": "invalid_sort_direction",
      "message": "sort_direction must be 'asc' or 'desc'"
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

#### Insufficient Permissions (401)
```json
{
  "message": "Unauthorized",
  "errors": [
    {
      "code": "insufficient_permissions",
      "message": "API key does not have segments.list permission"
    }
  ]
}
```

## Key Features

- Retrieve up to 100 segments per request
- Pagination support for large segment lists
- Sort control by creation time (ascending or descending)
- Analytics tracking status for each segment
- Tag associations for segment organization
- Segment API identifiers for targeting in other endpoints

## Best Practices

1. **Pagination Strategy**: Use pagination for workspaces with many segments
2. **Rate Management**: Monitor rate limits when iterating through multiple pages
3. **Sorting**: Use descending sort to see most recently created segments first
4. **Caching**: Cache segment lists that don't change frequently
5. **Tag Organization**: Use returned tags for segment categorization and filtering
6. **ID Storage**: Store segment IDs for use in targeting other API endpoints

## Example Request

```bash
curl --location --request GET 'https://rest.iad-01.braze.com/segments/list?page=1&sort_direction=desc' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

## Example Use Cases

- **Segment Management**: Audit and organize existing segments
- **Campaign Targeting**: Get segment IDs for use in campaign targeting
- **Analytics Setup**: Identify segments with analytics tracking disabled
- **Tag-based Organization**: Group segments by associated tags
- **Automation**: Programmatically list segments for automated workflows
- **Reporting**: Create segment inventory reports

## Pagination Example

To retrieve all segments from a workspace with many segments:

```bash
# First page
curl 'https://rest.iad-01.braze.com/segments/list?page=0' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'

# Second page
curl 'https://rest.iad-01.braze.com/segments/list?page=1' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'

# Continue until response contains fewer than 100 segments
```

## Related Endpoints

- **GET /segments/details** - Get detailed information about specific segments
- **GET /segments/data_series** - Retrieve segment analytics data over time
- **POST /users/export/segment** - Export user profiles by segment
- **POST /campaigns/trigger/send** - Use segment IDs for campaign targeting
- **POST /messages/send** - Use segment IDs for message targeting

## References

- **Primary Source**: [GET: Export Segment List](https://www.braze.com/docs/api/endpoints/export/segments/get_segment)
- **Segment Overview**: [Creating a Segment](https://www.braze.com/docs/user_guide/engagement_tools/segments/creating_a_segment)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)