# Braze API: POST /messages/send

## Overview
Send immediate messages to designated users using the Braze API. This endpoint allows you to send messages across multiple channels (email, SMS, push notifications, etc.) immediately without requiring a pre-configured campaign.

## Endpoint Details
- **HTTP Method**: POST
- **Endpoint URL**: `https://rest.{instance}.braze.com/messages/send`
- **Purpose**: Send immediate messages to designated users using the Braze API

## Authentication Requirements
- **API Key Permission**: `messages.send`
- **Header**: `Authorization: Bearer YOUR-REST-API-KEY`
- **Content-Type**: `application/json`

## Rate Limits
- **Segment Targeting**: 250 requests per minute when specifying a segment or Connected Audience
- **User Targeting**: 250,000 requests per hour when specifying external_id (shared with /campaigns/trigger/send and /canvas/trigger/send)
- **Batching Support**: Up to 50 specific external_ids per request

## Request Parameters

### Path Parameters
None

### Query Parameters
None

### Request Headers
```
Authorization: Bearer YOUR-REST-API-KEY
Content-Type: application/json
```

## Request Body Schema

```json
{
  "broadcast": false,
  "external_user_ids": ["external_user_id_1", "external_user_id_2"],
  "user_aliases": [
    {
      "alias_name": "example_alias",
      "alias_label": "example_label"
    }
  ],
  "segment_id": "segment_identifier",
  "audience": {
    "AND": [
      {
        "custom_attribute": {
          "custom_attribute_name": "the_custom_attribute_name",
          "comparison": "equals",
          "value": "the_value_to_compare_with"
        }
      }
    ]
  },
  "campaign_id": "campaign_identifier",
  "send_id": "send_identifier",
  "override_frequency_capping": false,
  "recipient_subscription_state": "all",
  "messages": {
    "android_push": { /* Android push payload */ },
    "apple_push": { /* iOS push payload */ },
    "content_card": { /* Content card payload */ },
    "email": { /* Email payload */ },
    "kindle_push": { /* Kindle push payload */ },
    "web_push": { /* Web push payload */ },
    "webhook": { /* Webhook payload */ },
    "whats_app": { /* WhatsApp payload */ },
    "sms": { /* SMS payload */ }
  }
}
```

### Required Parameters
- **One of**: `external_user_ids`, `user_aliases`, `segment_id`, or `audience`
- **messages**: Object containing at least one message channel

### Optional Parameters
- **broadcast** (boolean): Set to `true` when sending to an entire segment. Defaults to `false`. Use with caution.
- **campaign_id** (string): Campaign identifier for tracking statistics
- **send_id** (string): Send identifier for tracking and analytics
- **override_frequency_capping** (boolean): Override frequency capping rules
- **recipient_subscription_state** (string): `"all"`, `"opted_in"`, or `"subscribed"`. Defaults to `"subscribed"`

### Message Channel Payloads

#### Email Message
```json
"email": {
  "app_id": "your_app_identifier",
  "subject": "Welcome to our service!",
  "from": "Company Name <company@example.com>",
  "reply_to": "support@example.com",
  "body": "<html><body>Your HTML email content</body></html>",
  "plaintext_body": "Your plain text email content",
  "preheader": "Email preheader text",
  "message_variation_id": "message_variation_uuid"
}
```

#### SMS Message
```json
"sms": {
  "app_id": "your_app_identifier",
  "subscription_group_id": "subscription_group_uuid",
  "message_variation_id": "message_variation_uuid",
  "body": "Your SMS message content"
}
```

#### Android Push Message
```json
"android_push": {
  "app_id": "your_app_identifier",
  "title": "Push notification title",
  "alert": "Push notification message",
  "message_variation_id": "message_variation_uuid",
  "extra": {
    "key": "value"
  }
}
```

#### Apple Push Message
```json
"apple_push": {
  "app_id": "your_app_identifier",
  "alert": "Push notification message",
  "badge": 1,
  "sound": "default",
  "message_variation_id": "message_variation_uuid",
  "extra": {
    "key": "value"
  }
}
```

#### Web Push Message
```json
"web_push": {
  "app_id": "your_app_identifier",
  "title": "Push notification title",
  "alert": "Push notification message",
  "message_variation_id": "message_variation_uuid",
  "extra": {
    "key": "value"
  }
}
```

#### Content Card Message
```json
"content_card": {
  "app_id": "your_app_identifier",
  "type": "CLASSIC",
  "title": "Content card title",
  "description": "Content card description",
  "message_variation_id": "message_variation_uuid",
  "pinned": false,
  "dismissible": true
}
```

#### WhatsApp Message
```json
"whats_app": {
  "app_id": "your_app_identifier",
  "subscription_group_id": "subscription_group_uuid",
  "message_variation_id": "message_variation_uuid",
  "message_type": "template",
  "template_name": "template_name",
  "template_language_code": "en"
}
```

#### Webhook Message
```json
"webhook": {
  "url": "https://example.com/webhook",
  "request_method": "POST",
  "request_headers": {
    "Content-Type": "application/json"
  },
  "body": "Raw body for webhook request",
  "message_variation_id": "message_variation_uuid"
}
```

## Response Schema

### Successful Response (200 OK)
```json
{
  "dispatch_id": "66cdc28f8f082bc3074c0c79",
  "message": "success"
}
```

### Response Fields
- **dispatch_id** (string): Unique identifier for this message dispatch/transmission
- **message** (string): Status message

## Error Codes and Meanings

### 400 Bad Request
```json
{
  "message": "Invalid request",
  "errors": [
    {
      "message": "Specific error description"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid API key"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 429 Too Many Requests
```json
{
  "message": "Rate limit exceeded",
  "retry_after": "Number of seconds to wait before retrying"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Key Features and Constraints

### Broadcasting
- Set `broadcast: true` when sending to an entire segment
- When `broadcast: true`, cannot include a recipients list
- Use with extreme caution to avoid sending to larger audiences than intended

### Batching
- Single request can target up to 50 specific external_ids
- Each external_id can have individual message parameters
- Reduces API call overhead for bulk messaging

### Message Tracking
- `dispatch_id` returned in response can be used for tracking
- Represents the unique ID for each "transmission" sent from Braze
- Useful for analytics and troubleshooting

## Best Practices

1. **Test with Small Audiences**: Always test with a small group before broadcasting
2. **Use Send IDs**: Implement `send_id` for better tracking and analytics
3. **Respect Rate Limits**: Implement proper rate limiting in your application
4. **Error Handling**: Always handle API errors gracefully
5. **Personalization**: Use trigger properties for dynamic content
6. **Subscription States**: Respect user subscription preferences

## Official Documentation
- **Primary Source**: https://www.braze.com/docs/api/endpoints/messaging/send_messages/post_send_messages
- **API Basics**: https://www.braze.com/docs/api/basics
- **Authentication**: https://www.braze.com/docs/api/basics#authentication

## Code Examples

### cURL Example
```bash
curl -X POST \
  'https://rest.iad-01.braze.com/messages/send' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR-REST-API-KEY' \
  -d '{
    "external_user_ids": ["user123"],
    "messages": {
      "email": {
        "app_id": "your-app-id",
        "subject": "Welcome!",
        "from": "Company <noreply@company.com>",
        "body": "<h1>Welcome to our service!</h1>"
      }
    }
  }'
```

### JavaScript Example
```javascript
const response = await fetch('https://rest.iad-01.braze.com/messages/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR-REST-API-KEY'
  },
  body: JSON.stringify({
    external_user_ids: ['user123'],
    messages: {
      email: {
        app_id: 'your-app-id',
        subject: 'Welcome!',
        from: 'Company <noreply@company.com>',
        body: '<h1>Welcome to our service!</h1>'
      }
    }
  })
});

const data = await response.json();
console.log('Dispatch ID:', data.dispatch_id);
```