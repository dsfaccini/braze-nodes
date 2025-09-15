# Braze API: POST /content_blocks/create

## Overview

The Create Content Block endpoint allows you to create new reusable Content Blocks via API. Content Blocks enable you to manage cross-channel content in a centralized location, providing consistent messaging across email campaigns, push notifications, and other channels.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/content_blocks/create`
- **HTTP Method**: POST
- **Purpose**: Create new Content Blocks with specified content, metadata, and configuration

## Authentication

### Required Headers
```
Content-Type: application/json
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `content_blocks.create` permission

## Request Parameters

### Request Body Schema

```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "content": "string (required)",
  "state": "string (optional)",
  "tags": []
}
```

### Parameter Details

#### Required Parameters

- **name** (String, Required)
  - Content Block name
  - Maximum length: 100 characters
  - Can only contain alphanumeric characters, dashes, and underscores
  - Must be unique within your workspace

- **content** (String, Required)
  - HTML or text content of the Content Block
  - Maximum size: 50 KB
  - Can include Liquid templating syntax
  - Supports HTML formatting for rich content

#### Optional Parameters

- **description** (String, Optional)
  - Description of the Content Block's purpose
  - Maximum length: 250 characters
  - Used for organization and documentation

- **state** (String, Optional)
  - Content Block status
  - Values: "active" (default), "draft"
  - Draft Content Blocks are not available for use until activated

- **tags** (Array, Optional)
  - Array of existing tag strings
  - Tags must already exist in your Braze workspace
  - Used for organization and filtering

### Content Block Naming Requirements

- Must be unique across all Content Blocks
- Alphanumeric characters, dashes, and underscores only
- Cannot start with a number
- Maximum 100 characters

## Response Schema

### Success Response (201)

```json
{
  "content_block_id": "content_block_12345",
  "liquid_tag": "{% content_blocks \"Your Content Block Name\" %}",
  "created_at": "2024-01-15T10:30:00.000Z",
  "message": "success"
}
```

### Response Fields

- **content_block_id** (String): Unique identifier for the created Content Block
- **liquid_tag** (String): Liquid syntax for referencing the Content Block in messages
- **created_at** (String): ISO 8601 timestamp of creation
- **message** (String): Status message indicating success

## Rate Limits

### Standard Rate Limit
- **250,000 requests per hour** (standard Braze API rate limit)

### Content Size Limit
- Maximum content size: 50 KB per Content Block

### Rate Limit Headers
Every API request returns rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

### HTTP Status Codes

- **2XX**: Success - Content Block created successfully
- **4XX**: Fatal client errors - Check request format and validation
- **5XX**: Fatal server errors - Server unable to execute request

### Common Error Responses

#### Content Too Large (400)
```json
{
  "message": "Content too large",
  "errors": [
    {
      "code": "content_size_limit",
      "message": "Content Block content exceeds 50 KB limit"
    }
  ]
}
```

#### Invalid Name Format (400)
```json
{
  "message": "Invalid name",
  "errors": [
    {
      "code": "invalid_name",
      "message": "Name can only contain alphanumeric characters, dashes, and underscores"
    }
  ]
}
```

#### Duplicate Name (400)
```json
{
  "message": "Name already exists",
  "errors": [
    {
      "code": "name_already_exists",
      "message": "A Content Block with this name already exists"
    }
  ]
}
```

#### Invalid Tags (400)
```json
{
  "message": "Invalid tags",
  "errors": [
    {
      "code": "invalid_tags",
      "message": "One or more specified tags do not exist in your workspace"
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

- Create reusable content for cross-channel messaging
- Support for HTML and Liquid templating
- Draft mode for content development and testing
- Tag-based organization and categorization
- Automatic Liquid tag generation for easy referencing
- 50 KB content size limit supports rich media content

## Best Practices

1. **Naming Convention**: Use descriptive, consistent naming patterns
2. **Content Organization**: Use tags to organize Content Blocks by type or campaign
3. **Draft Testing**: Use draft state to test content before making it live
4. **Size Management**: Keep content under 50 KB limit for optimal performance
5. **Version Control**: Consider naming conventions for different content versions
6. **Liquid Syntax**: Leverage Liquid templating for personalized content

## Example Request

```bash
curl --location --request POST 'https://rest.iad-01.braze.com/content_blocks/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR-REST-API-KEY' \
--data-raw '{
  "name": "newsletter_header_2024",
  "description": "Standard header for 2024 newsletter campaigns",
  "content": "<div style=\"background-color: #f0f0f0; padding: 20px;\"><h1 style=\"color: #333;\">Welcome to Our Newsletter!</h1><p>Stay updated with our latest news and offers.</p></div>",
  "state": "active",
  "tags": ["newsletter", "header", "2024"]
}'
```

## Example Response

```json
{
  "content_block_id": "content_block_67890",
  "liquid_tag": "{% content_blocks \"newsletter_header_2024\" %}",
  "created_at": "2024-01-15T10:30:00.000Z",
  "message": "success"
}
```

## Content Block Types

### HTML Content Blocks
```json
{
  "name": "rich_email_footer",
  "content": "<footer style=\"background-color: #333; color: white; padding: 15px;\"><p>&copy; 2024 Company Name</p><a href=\"{{${unsubscribe_url}}}\" style=\"color: #ccc;\">Unsubscribe</a></footer>"
}
```

### Text Content Blocks
```json
{
  "name": "simple_signature",
  "content": "Best regards,\nThe {{${company_name}}} Team"
}
```

## Usage in Messages

After creating a Content Block, reference it in your messages using the returned liquid_tag:

```html
<!-- Email template -->
{% content_blocks "newsletter_header_2024" %}
<p>Your email content here...</p>
{% content_blocks "email_footer" %}
```

## Related Endpoints

- **GET /content_blocks/list** - List existing Content Blocks
- **GET /content_blocks/info** - Get detailed Content Block information
- **POST /content_blocks/update** - Update existing Content Blocks
- **DELETE /content_blocks/destroy** - Delete Content Blocks
- **POST /templates/email/create** - Create email templates using Content Blocks

## References

- **Primary Source**: [POST: Create Content Block](https://www.braze.com/docs/api/endpoints/templates/content_blocks_templates/post_create_email_content_block)
- **Content Blocks Overview**: [Content Blocks Library](https://www.braze.com/docs/user_guide/engagement_tools/templates_and_media/content_blocks)
- **Liquid Templating**: [Liquid Syntax Documentation](https://www.braze.com/docs/user_guide/personalization_and_dynamic_content/liquid)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)