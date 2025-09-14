# Braze API: Create Email Template

## Endpoint Overview
- **URL**: `POST /templates/email/create`
- **Full Path**: `https://rest.{instance-url}.braze.com/templates/email/create`
- **HTTP Method**: POST
- **Purpose**: Create email templates on the Braze dashboard

## Authentication Requirements
- **API Key Permission**: `templates.email.create`
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

## Request Parameters

### Required Parameters
| Parameter | Data Type | Description |
|-----------|-----------|-------------|
| `template_name` | String | Name of your email template |
| `subject` | String | Email template subject line |
| `body` | String | Email template body that may include HTML |

### Optional Parameters
| Parameter | Data Type | Description |
|-----------|-----------|-------------|
| `plaintext_body` | String | A plaintext version of the email template body |
| `preheader` | String | Email preheader used to generate previews in some clients |
| `tags` | Array of Strings | Tags must already exist in Braze |
| `should_inline_css` | Boolean | If `true`, the `inline_css` feature is used on this template. Defaults to app group setting if not provided |

## Request Body Schema
```json
{
  "template_name": "(required, string) The name of your email template",
  "subject": "(required, string) The email template subject line",
  "body": "(required, string) The email template body that may include HTML",
  "plaintext_body": "(optional, string) A plaintext version of the email template body",
  "preheader": "(optional, string) The email preheader used to generate previews in some clients",
  "tags": "(optional, Array of Strings) Tags must already exist",
  "should_inline_css": "(optional, Boolean) If true, the inline_css feature is used on this template"
}
```

## Example Request
```bash
curl --location --request POST 'https://rest.iad-01.braze.com/templates/email/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_REST_API_KEY' \
--data-raw '{
  "template_name": "email_template_name",
  "subject": "Welcome to my email template!",
  "body": "This is the text within my email body and https://www.braze.com/ here is a link to Braze.com.",
  "plaintext_body": "This is the text within my email body and here is a link to https://www.braze.com/.",
  "preheader": "My preheader is pretty cool.",
  "tags": ["Tag1", "Tag2"]
}'
```

## Response Schema
```json
{
  "email_template_id": "(string) Your email template's API Identifier",
  "message": "(string) success"
}
```

## Example Response
```json
{
  "email_template_id": "232b6d29-7e41-4106-a0ab-1c4fe915d701",
  "message": "success"
}
```

## Error Codes and Troubleshooting

| Error | Troubleshooting |
|-------|-----------------|
| Template name is required | Enter a template name |
| Tags must be an array | Tags must be formatted as an array of strings, for example `["marketing", "promotional", "transactional"]` |
| All tags must be strings | Make sure your tags are encapsulated in quotes (`""`) |
| Some tags could not be found | To add a tag when creating an email template, the tag must already exist in Braze |
| Email must have valid Content Block names | The email might contain Content Blocks that don't exist in this environment |
| Invalid value for `should_inline_css`. One of `true` or `false` was expected | This parameter only accepts boolean values (true or false). Make sure the value for `should_inline_css` is not encapsulated in quotes (`""`), which causes the value to be sent as a string instead |

## Important Notes
- The response includes a field for `email_template_id`, which can be used to update the template in subsequent API calls
- Templates will be available on the **Templates & Media** page in the Braze dashboard
- HTML is supported in the body field
- Liquid templating can be used for personalization

## Official Documentation
- **Source**: [Braze API Documentation - Create Email Template](https://www.braze.com/docs/api/endpoints/templates/email_templates/post_create_email_template/)
- **Postman Collection**: [See me in Postman](https://documenter.getpostman.com/view/4689407/SVYrsdsG?version=latest#5eb1fe0d-2795-474d-aaf2-c4e2977dc94b)