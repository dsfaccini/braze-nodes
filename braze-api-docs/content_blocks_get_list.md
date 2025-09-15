# Braze API: GET /content_blocks/list

## Overview

The List Available Content Blocks endpoint allows you to retrieve information about your existing Content Blocks. This endpoint provides Content Block metadata including IDs, names, content types, Liquid tags, and usage statistics, making it useful for Content Block management and template organization.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/content_blocks/list`
- **HTTP Method**: GET
- **Purpose**: List existing Content Blocks with their metadata and usage information

## Authentication

### Required Headers
```
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `content_blocks.list` permission

## Request Parameters

### Query Parameters

#### Optional Parameters

- **modified_after** (String, Optional)
  - ISO 8601 timestamp to filter Content Blocks modified after this date
  - Format: "YYYY-MM-DDTHH:MM:SS.sssZ"
  - Returns only Content Blocks updated after specified time

- **modified_before** (String, Optional)
  - ISO 8601 timestamp to filter Content Blocks modified before this date
  - Format: "YYYY-MM-DDTHH:MM:SS.sssZ"
  - Returns only Content Blocks updated before specified time

- **limit** (Integer, Optional)
  - Maximum number of Content Blocks to return
  - Range: 1-1000
  - Default: 100

- **offset** (Integer, Optional)
  - Number of Content Blocks to skip
  - Used for pagination
  - Default: 0

### URL Construction Example

```
https://rest.iad-01.braze.com/content_blocks/list?modified_after=2024-01-01T00:00:00.000Z&limit=50&offset=0
```

## Response Schema

### Success Response (200)

```json
{
  "count": 150,
  "content_blocks": [
    {
      "content_block_id": "content_block_123",
      "name": "Header Template",
      "content_type": "html",
      "liquid_tag": "{% content_blocks \"Header Template\" %}",
      "inclusion_count": 25,
      "created_at": "2024-01-01T10:00:00.000Z",
      "last_edited": "2024-01-15T14:30:00.000Z",
      "tags": ["header", "email", "newsletter"]
    },
    {
      "content_block_id": "content_block_456",
      "name": "Footer Links",
      "content_type": "html",
      "liquid_tag": "{% content_blocks \"Footer Links\" %}",
      "inclusion_count": 42,
      "created_at": "2024-01-02T11:00:00.000Z",
      "last_edited": "2024-01-10T16:45:00.000Z",
      "tags": ["footer", "links"]
    }
  ]
}
```

### Response Fields

- **count** (Integer): Total number of Content Blocks matching the query
- **content_blocks** (Array): List of Content Block objects
  - **content_block_id** (String): Unique Content Block identifier
  - **name** (String): Content Block name
  - **content_type** (String): Type of content (e.g., "html", "text")
  - **liquid_tag** (String): Liquid tag for referencing the Content Block
  - **inclusion_count** (Integer): Number of places where this Content Block is used
  - **created_at** (String): ISO 8601 timestamp of creation
  - **last_edited** (String): ISO 8601 timestamp of last modification
  - **tags** (Array): Array of tag strings associated with the Content Block

## Rate Limits

### Standard Rate Limit
- **250,000 requests per hour** (standard Braze API rate limit)

### Pagination
- Maximum 1000 Content Blocks per request
- Use limit and offset parameters for pagination
- Monitor count field to determine total available records

### Rate Limit Headers
Every API request returns rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

### HTTP Status Codes

- **2XX**: Success - Content Blocks retrieved successfully
- **4XX**: Fatal client errors - Check request parameters and permissions
- **5XX**: Fatal server errors - Server unable to execute request

### Common Error Responses

#### Invalid Date Format (400)
```json
{
  "message": "Invalid date format",
  "errors": [
    {
      "code": "invalid_date_format",
      "message": "modified_after must be in ISO 8601 format"
    }
  ]
}
```

#### Invalid Limit Parameter (400)
```json
{
  "message": "Invalid limit parameter",
  "errors": [
    {
      "code": "invalid_limit",
      "message": "Limit must be between 1 and 1000"
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
      "message": "API key does not have content_blocks.list permission"
    }
  ]
}
```

## Key Features

- Retrieve up to 1000 Content Blocks per request
- Filter by modification date range
- Pagination support with limit and offset parameters
- Usage tracking via inclusion_count field
- Tag-based organization and filtering
- Liquid tag syntax provided for easy referencing

## Best Practices

1. **Date Filtering**: Use modified_after/modified_before for incremental updates
2. **Pagination**: Use appropriate limit and offset for large Content Block libraries
3. **Rate Management**: Monitor rate limits when processing large datasets
4. **Usage Tracking**: Monitor inclusion_count to identify unused Content Blocks
5. **Tag Organization**: Use tags for Content Block categorization
6. **Caching**: Cache Content Block lists that don't change frequently

## Example Request

```bash
curl --location --request GET 'https://rest.iad-01.braze.com/content_blocks/list?modified_after=2024-01-01T00:00:00.000Z&limit=100&offset=0' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'
```

## Example Use Cases

- **Content Audit**: Review all Content Blocks for cleanup and organization
- **Usage Analysis**: Identify heavily used vs. unused Content Blocks
- **Template Management**: Organize Content Blocks by tags and usage patterns
- **Incremental Sync**: Sync Content Blocks modified after a specific date
- **Backup Operations**: Export Content Block metadata for backup purposes
- **Automated Workflows**: Programmatically manage Content Block libraries

## Pagination Example

To retrieve all Content Blocks from a large library:

```bash
# First batch
curl 'https://rest.iad-01.braze.com/content_blocks/list?limit=1000&offset=0' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'

# Second batch
curl 'https://rest.iad-01.braze.com/content_blocks/list?limit=1000&offset=1000' \
--header 'Authorization: Bearer YOUR-REST-API-KEY'

# Continue until count indicates all records retrieved
```

## Related Endpoints

- **GET /content_blocks/info** - Get detailed information about specific Content Blocks
- **POST /content_blocks/create** - Create new Content Blocks
- **POST /content_blocks/update** - Update existing Content Blocks
- **DELETE /content_blocks/destroy** - Delete Content Blocks
- **GET /templates/email/list** - List email templates that may use Content Blocks

## References

- **Primary Source**: [GET: List Available Content Blocks](https://www.braze.com/docs/api/endpoints/templates/content_blocks_templates/get_list_email_content_blocks)
- **Content Blocks Overview**: [Content Blocks Library](https://www.braze.com/docs/user_guide/engagement_tools/templates_and_media/content_blocks)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)