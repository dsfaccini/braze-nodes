# Braze API: POST /campaigns/trigger/send

## Overview

The Send Campaigns using API-Triggered delivery endpoint allows you to send immediate, one-off messages to designated users using API-triggered delivery. This endpoint triggers pre-configured campaigns from the Braze dashboard via API calls.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/campaigns/trigger/send`
- **HTTP Method**: POST
- **Purpose**: Send immediate, one-off messages to designated users using API-triggered delivery

## Authentication

### Required Headers
```
Content-Type: application/json
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `campaigns.trigger.send` permission

## Request Parameters

### Request Body Schema

```json
{
  "campaign_id": "string (required)",
  "send_id": "string (optional)",
  "trigger_properties": {},
  "broadcast": "boolean (optional)",
  "audience": {},
  "recipients": [],
  "attachments": []
}
```

### Parameter Details

#### Required Parameters

- **campaign_id** (String, Required)
  - The generated campaign_id from your Braze dashboard
  - Can be found on the API Keys page and Campaign Details page

#### Optional Parameters

- **send_id** (String, Optional)
  - Send identifier for tracking message transmission

- **trigger_properties** (Object, Optional)
  - Personalization key-value pairs
  - Content can be referenced in message body using: `{{ api_trigger_properties.${some_value} }}`

- **broadcast** (Boolean, Optional)
  - Set to true to send to entire segment

- **audience** (Object, Optional)
  - Connected audience filter object
  - An audience segment of any size, defined as a connected audience object

- **recipients** (Array, Optional)
  - Array of user recipients (up to 50 objects)
  - Each object contains:
    - `external_user_id` (String): User identifier
    - `trigger_properties` (Object): User-specific personalization data
    - `send_to_existing_only` (Boolean): Only send to existing users
    - `attributes` (Object): User attributes to update before sending

- **attachments** (Array, Optional)
  - Files to attach to the message

### Recipients Object Schema

```json
{
  "external_user_id": "user123",
  "trigger_properties": {
    "first_name": "John",
    "promotion_code": "SAVE20"
  },
  "send_to_existing_only": false,
  "attributes": {
    "subscription_groups": []
  }
}
```

## Response Schema

### Success Response (200)

```json
{
  "dispatch_id": "string",
  "message": "success"
}
```

### Response Fields

- **dispatch_id** (String): Identifier for tracking message transmission
- **message** (String): Status message

## Rate Limits

### Segment/Connected Audience Requests
- **250 requests per minute** when specifying segment or Connected Audience

### External ID Requests
- **250,000 requests per hour** (shared between `/messages/send`, `/campaigns/trigger/send`, and `/canvas/trigger/send`)

### Rate Limit Headers
Every API request returns rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

### HTTP Status Codes

- **2XX**: Success (non-fatal) - Request successfully received, understood, and accepted
- **4XX**: Fatal client errors - Refer to fatal errors chart for descriptions
- **5XX**: Fatal server errors - Server unable to execute request

### Common Error Responses

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

#### Invalid Campaign ID (400)
```json
{
  "message": "Invalid campaign_id",
  "errors": [
    {
      "code": "invalid_campaign_id",
      "message": "Campaign not found or inactive"
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
      "message": "Recipients array cannot contain more than 50 objects"
    }
  ]
}
```

## Key Features

- Supports sending to up to 50 specific users per request
- Can create/update user attributes before sending
- Allows personalized messaging through trigger_properties
- Returns dispatch_id for message tracking
- Re-eligibility settings control how often users receive campaigns

## Best Practices

1. **Rate Limiting**: Allow 5-minute delay between consecutive calls to minimize errors
2. **Batching**: Use recipients array for bulk operations (up to 50 users)
3. **Error Handling**: Monitor X-RateLimit-Remaining to avoid hitting limits
4. **User Creation**: Use `send_to_existing_only: false` with attributes to create new users
5. **Personalization**: Leverage trigger_properties for dynamic content

## Example Request

```bash
curl --location --request POST 'https://rest.iad-01.braze.com/campaigns/trigger/send' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR-REST-API-KEY' \
--data-raw '{
  "campaign_id": "your_campaign_id",
  "recipients": [
    {
      "external_user_id": "user123",
      "trigger_properties": {
        "first_name": "John",
        "promotion_code": "SAVE20"
      }
    }
  ]
}'
```

## Official Documentation

- **Primary Source**: [POST: Send Campaigns Using API-Triggered Delivery](https://www.braze.com/docs/api/endpoints/messaging/send_messages/post_send_triggered_campaigns)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)