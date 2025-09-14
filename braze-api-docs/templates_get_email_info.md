# Braze API: See Email Template Information

## Endpoint Overview
- **URL**: `GET /templates/email/info`
- **Full Path**: `https://rest.{instance-url}.braze.com/templates/email/info`
- **HTTP Method**: GET
- **Purpose**: Get detailed information on your email templates

## Authentication Requirements
- **API Key Permission**: `templates.email.info`
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

### Required Parameters
| Parameter | Data Type | Description |
|-----------|-----------|-------------|
| `email_template_id` | String | See [email template API identifier](https://www.braze.com/docs/api/identifier_types/) |

## Example Request
```bash
curl --location -g --request GET 'https://rest.iad-01.braze.com/templates/email/info?email_template_id={{email_template_id}}' \
--header 'Authorization: Bearer YOUR_REST_API_KEY'
```

## Response Schema
```json
{
  "email_template_id": "(string) Your email template's API Identifier",
  "template_name": "(string) The name of your email template",
  "description": "(string) The email template description",
  "subject": "(string) The email template subject line",
  "preheader": "(optional, string) The email preheader used to generate previews in some clients",
  "body": "(optional, string) The email template body that may include HTML",
  "plaintext_body": "(optional, string) A plaintext version of the email template body",
  "should_inline_css": "(optional, boolean) Whether there is inline CSS in the body of the template - defaults to the CSS inlining value for the workspace",
  "tags": "(string) Tag names",
  "created_at": "(string) The time the email was created at in ISO 8601",
  "updated_at": "(string) The time the email was updated in ISO 8601"
}
```

## Example Response
```json
{
  "email_template_id": "5ab02d2e-52f8-4883-b2aa-954e3fcg6784",
  "template_name": "Welcome Email Template",
  "description": "A welcome email template for new users",
  "subject": "Welcome to our platform!",
  "preheader": "Get started with your new account",
  "body": "<html><body><h1>Welcome!</h1><p>Thank you for joining us. <a href='https://www.braze.com'>Get started</a></p></body></html>",
  "plaintext_body": "Welcome! Thank you for joining us. Get started: https://www.braze.com",
  "should_inline_css": true,
  "tags": ["welcome", "onboarding"],
  "created_at": "2020-01-01T01:01:01.000Z",
  "updated_at": "2020-01-15T10:30:00.000Z"
}
```

## Important Notes
- **Templates built using the drag-and-drop editor for email are not accepted**
- Images in the response will show in the `body` variable as HTML
- This endpoint returns complete template information including content, metadata, and timestamps
- The `body` field may contain HTML and Liquid templating syntax
- CSS inlining setting reflects the workspace default if not explicitly set for the template

## Error Codes
Standard HTTP error codes apply:
- **400 Bad Request**: Invalid email_template_id parameter
- **401 Unauthorized**: Invalid API key or insufficient permissions
- **404 Not Found**: Email template not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side error

## Use Cases
- Retrieve template content for editing or cloning
- Audit template configurations and metadata
- Export template data for backup or migration
- Verify template structure before sending campaigns

## Official Documentation
- **Source**: [Braze API Documentation - See Email Template Information](https://www.braze.com/docs/api/endpoints/templates/email_templates/get_see_email_template_information/)
- **Postman Collection**: [See me in Postman](https://documenter.getpostman.com/view/4689407/SVYrsdsG?version=latest#e98d2d5b-62fe-4358-b391-9fe9e460d0ac)
- **Email Template API Identifier**: [See email template API identifier documentation](https://www.braze.com/docs/api/identifier_types/)