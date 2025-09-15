# Braze API: POST /messages/schedule/create

## Overview

The Create Scheduled Messages endpoint allows you to schedule messages for future delivery using API-only messaging. This endpoint provides full control over message content, targeting, and delivery timing without requiring pre-configured dashboard campaigns.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/messages/schedule/create`
- **HTTP Method**: POST
- **Purpose**: Schedule messages with custom content for future delivery to targeted users

## Authentication

### Required Headers
```
Content-Type: application/json
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `messages.schedule.create` permission

## Request Parameters

### Request Body Schema

```json
{
  "broadcast": "boolean (optional)",
  "external_user_ids": [],
  "user_aliases": [],
  "segment_id": "string (optional)",
  "audience": {},
  "campaign_id": "string (optional)",
  "send_id": "string (optional)",
  "override_messaging_limits": "boolean (optional)",
  "recipient_subscription_state": "string (optional)",
  "schedule": {
    "time": "string (required)",
    "in_local_time": "boolean (optional)",
    "at_optimal_time": "boolean (optional)"
  },
  "messages": {
    "apple_push": {},
    "android_push": {},
    "email": {},
    "sms": {},
    "webhook": {}
  }
}
```

### Parameter Details

#### Required Parameters

- **schedule** (Object, Required)
  - **time** (String, Required): ISO 8601 datetime when message should be sent
  - **in_local_time** (Boolean, Optional): Send in user's local time zone
  - **at_optimal_time** (Boolean, Optional): Send at optimal time for each user

- **Targeting** (At least one required)
  - **external_user_ids** (Array): Up to 50 specific user IDs
  - **segment_id** (String): Target users in a specific segment
  - **audience** (Object): Connected audience filter object

#### Optional Parameters

- **broadcast** (Boolean, Optional)
  - Set to true when sending to entire segment
  - Must be true if targeting segments, false for specific users

- **messages** (Object, Optional)
  - Platform-specific message content objects
  - Can include apple_push, android_push, email, sms, webhook
  - Required unless using campaign_id

- **campaign_id** (String, Optional)
  - Reference existing campaign for message content
  - Cannot be used with messages object

- **send_id** (String, Optional)
  - Custom send identifier for tracking
  - Must be created via `/sends/id/create` endpoint

- **override_messaging_limits** (Boolean, Optional)
  - Bypass Braze's frequency capping rules
  - Default: false

- **recipient_subscription_state** (String, Optional)
  - Target users with specific subscription states
  - Values: "opted_in", "subscribed", "all"

### Schedule Object Options

```json
{
  "time": "2024-01-15T09:00:00Z",
  "in_local_time": true,
  "at_optimal_time": false
}
```

### Messages Object Schema

```json
{
  "email": {
    "app_id": "your_app_id",
    "subject": "Your Subject Line",
    "from": "sender@example.com",
    "body": "<html>Email content</html>",
    "plaintext_body": "Plain text version"
  },
  "apple_push": {
    "alert": "Push notification message",
    "badge": 1,
    "sound": "default"
  },
  "android_push": {
    "alert": "Push notification message",
    "title": "Push Title"
  }
}
```

## Response Schema

### Success Response (201)

```json
{
  "dispatch_id": "string",
  "schedule_id": "string",
  "message": "success"
}
```

### Response Fields

- **dispatch_id** (String): Identifier for tracking message transmission
- **schedule_id** (String): Identifier for scheduled message (use for updates/cancellation)
- **message** (String): Status message

## Rate Limits

### Standard Rate Limit
- **250,000 requests per hour** for external ID targeting

### Segment Targeting
- **250 requests per minute** when targeting segments or Connected Audiences

### Batching Support
- Up to 50 external_user_ids per request
- Each request counts toward rate limit regardless of recipient count

### Rate Limit Headers
Every API request returns rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

### HTTP Status Codes

- **2XX**: Success - Request successfully received and processed
- **4XX**: Fatal client errors - Check request format and permissions
- **5XX**: Fatal server errors - Server unable to execute request

### Common Error Responses

#### Missing Required Fields (400)
```json
{
  "message": "Missing required field",
  "errors": [
    {
      "code": "missing_required_field",
      "message": "Schedule object is required"
    }
  ]
}
```

#### Invalid Schedule Time (400)
```json
{
  "message": "Invalid schedule time",
  "errors": [
    {
      "code": "invalid_schedule",
      "message": "Schedule time must be in the future"
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

#### Invalid Recipients (400)
```json
{
  "message": "Invalid request",
  "errors": [
    {
      "code": "invalid_recipients",
      "message": "external_user_ids cannot contain more than 50 entries"
    }
  ]
}
```

## Key Features

- Schedule messages up to 90 days in advance
- Support for multiple messaging channels (email, push, SMS, webhooks)
- Flexible targeting options (specific users, segments, audiences)
- Local time zone and optimal time delivery
- Custom send ID tracking support
- Ability to override messaging frequency limits
- Returns schedule_id for message management

## Best Practices

1. **Schedule Management**: Always save the schedule_id for future updates or cancellations
2. **Timing Options**: Use `in_local_time` for global audiences, `at_optimal_time` for engagement
3. **Content Strategy**: Test message content before scheduling large sends
4. **Rate Management**: Implement exponential backoff for rate limit responses
5. **Targeting**: Validate segment/user targeting before scheduling
6. **Monitoring**: Track dispatch_id for delivery analytics

## Example Request

```bash
curl --location --request POST 'https://rest.iad-01.braze.com/messages/schedule/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR-REST-API-KEY' \
--data-raw '{
  "broadcast": false,
  "external_user_ids": ["user123", "user456"],
  "schedule": {
    "time": "2024-01-15T09:00:00Z",
    "in_local_time": true
  },
  "messages": {
    "email": {
      "app_id": "your_app_id",
      "subject": "Special Offer Just for You!",
      "from": "offers@company.com",
      "body": "<html><body><h1>Exclusive Deal!</h1><p>Check out our latest offer.</p></body></html>"
    }
  }
}'
```

## Related Endpoints

- **POST /messages/schedule/update** - Update scheduled messages
- **DELETE /messages/schedule/delete** - Cancel scheduled messages
- **POST /messages/send** - Send messages immediately
- **POST /sends/id/create** - Create send IDs for tracking
- **GET /messages/scheduled_broadcasts** - List scheduled messages

## References

- **Primary Source**: [POST: Create Scheduled Messages](https://www.braze.com/docs/api/endpoints/messaging/schedule_messages/post_schedule_messages)
- **Message Objects**: [Messaging Objects](https://www.braze.com/docs/api/objects_filters/messaging)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)