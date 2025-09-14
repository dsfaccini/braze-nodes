# Braze API: Update Email Template

## Endpoint Overview
- **URL**: `POST /templates/email/update`
- **Full Path**: `https://rest.{instance-url}.braze.com/templates/email/update`
- **HTTP Method**: POST
- **Purpose**: Update existing email templates in your Braze account

## Authentication Requirements
- **API Key Permission**: `templates.email.update`
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
| `email_template_id` | String | Your email template's API identifier |

### Optional Parameters
| Parameter | Data Type | Description |
|-----------|-----------|-------------|
| `template_name` | String | Name of your email template |
| `subject` | String | Email template subject line |
| `body` | String | Email template body that may include HTML |
| `plaintext_body` | String | A plaintext version of the email template body |
| `preheader` | String | Email preheader used to generate previews in some clients |
| `tags` | Array of Strings | Tags must already exist in Braze |
| `should_inline_css` | Boolean | Enables or disables the `inline_css` feature per template. If not provided, Braze will use the default setting for the AppGroup |

## Request Body Schema
```json
{
  "email_template_id": "(required, string) Your email template's API Identifier",
  "template_name": "(optional, string) The name of your email template",
  "subject": "(optional, string) The email template subject line",
  "body": "(optional, string) The email template body that may include HTML",
  "plaintext_body": "(optional, string) A plaintext version of the email template body",
  "preheader": "(optional, string) The email preheader used to generate previews in some clients",
  "tags": "(optional, array of Strings) Tags must already exist",
  "should_inline_css": "(optional, Boolean) If true, the inline_css feature will be applied to the template"
}
```

## Example Request
```bash
curl --location --request POST 'https://rest.iad-01.braze.com/templates/email/update' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_REST_API_KEY' \
--data-raw '{
  "email_template_id": "email_template_id",
  "template_name": "Weekly Newsletter",
  "subject": "This Week'\''s Styles",
  "body": "Check out this week'\''s digital lookbook to inspire your outfits. Take a look at https://www.braze.com/",
  "plaintext_body": "This is the updated text within my email body and here is a link to https://www.braze.com/.",
  "preheader": "We want you to have the best looks this summer",
  "tags": ["Tag1", "Tag2"]
}'
```

## Response Schema
```json
{
  "message": "(string) success"
}
```

## Example Response
```json
{
  "message": "success"
}
```

## Error Codes and Troubleshooting

| Error | Troubleshooting |
|-------|-----------------|
| Template name is required | Enter a template name |
| Tags must be an array | Tags must be formatted as an array of strings, for example `["marketing", "promotional", "transactional"]` |
| All tags must be strings | Make sure your tags are encapsulated in quotes (`""`) |
| Some tags could not be found | To add a tag when updating an email template, the tag must already exist in Braze |
| Invalid value for `should_inline_css`. One of `true` or `false` was expected | This parameter only accepts boolean values (true or false). Make sure the value for `should_inline_css` is not encapsulated in quotes (`""`), which causes the value to be sent as a string instead |

## Important Notes
- Only the `email_template_id` is required; all other parameters are optional
- You can update specific fields without affecting other template properties
- The email template must exist before you can update it
- HTML is supported in the body field
- Liquid templating can be used for personalization
- Updates are applied immediately to the template

## Official Documentation
- **Source**: [Braze API Documentation - Update Email Template](https://www.braze.com/docs/api/endpoints/templates/email_templates/post_update_email_template/)
- **Email Template API Identifier**: [See email template API identifier documentation](https://www.braze.com/docs/api/identifier_types/)