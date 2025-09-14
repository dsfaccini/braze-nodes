# Braze API: List Available Email Templates

## Endpoint Overview
- **URL**: `GET /templates/email/list`
- **Full Path**: `https://rest.{instance-url}.braze.com/templates/email/list`
- **HTTP Method**: GET
- **Purpose**: Get a list of available email templates in your Braze account

## Authentication Requirements
- **API Key Permission**: `templates.email.list`
- **Authentication**: Bearer token in Authorization header
- **Header Format**: `Authorization: Bearer YOUR_REST_API_KEY`

## Required Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_REST_API_KEY
```

## Rate Limits
- **Default Rate Limit**: 250,000 requests per hour
- **Documentation**: [API rate limits](https://www.braze.com/docs/api/api_limits/)

## Request Parameters (Query Parameters)

All parameters are optional:

| Parameter | Data Type | Description |
|-----------|-----------|-------------|
| `modified_after` | String (ISO-8601 format) | Retrieve only templates updated at or after the given time |
| `modified_before` | String (ISO-8601 format) | Retrieve only templates updated at or before the given time |
| `limit` | Positive Number | Maximum number of templates to retrieve. Default: 100, Maximum: 1000 |
| `offset` | Positive Number | Number of templates to skip before returning rest of the templates that fit the search criteria |

## Example Request
```bash
curl --location --request GET 'https://rest.iad-01.braze.com/templates/email/list?modified_after=2020-01-01T01:01:01.000000&modified_before=2020-02-01T01:01:01.000000&limit=1&offset=0' \
--header 'Authorization: Bearer YOUR_REST_API_KEY'
```

## Response Schema
```json
{
  "count": "(number) The number of templates returned",
  "templates": [
    {
      "email_template_id": "(string) Your email template's API Identifier",
      "template_name": "(string) The name of your email template",
      "created_at": "(string) The time the email was created at in ISO 8601",
      "updated_at": "(string) The time the email was updated in ISO 8601",
      "tags": "(array of strings) Tags appended to the template"
    }
  ]
}
```

## Example Response
```json
{
  "count": 1,
  "templates": [
    {
      "email_template_id": "5ab02d2e-52f8-4883-b2aa-954e3fcg6784",
      "template_name": "Welcome Email Template",
      "created_at": "2020-01-01T01:01:01.000Z",
      "updated_at": "2020-01-15T10:30:00.000Z",
      "tags": ["welcome", "onboarding"]
    }
  ]
}
```

## Important Notes
- **Templates built using the drag-and-drop editor for email are not provided in this response**
- The response includes basic template information but not the full template content
- Use the template `email_template_id` with other endpoints to get detailed information or modify templates
- Pagination is supported via `limit` and `offset` parameters
- Date filtering uses ISO-8601 format timestamps

## Error Codes
Standard HTTP error codes apply:
- **400 Bad Request**: Invalid parameters
- **401 Unauthorized**: Invalid API key or insufficient permissions
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side error

## Official Documentation
- **Source**: [Braze API Documentation - List Available Email Templates](https://www.braze.com/docs/api/endpoints/templates/email_templates/get_list_email_templates/)
- **Postman Collection**: [See me in Postman](https://documenter.getpostman.com/view/4689407/SVYrsdsG?version=latest#eec24bf4-a3f4-47cb-b4d8-bb8f03964cca)