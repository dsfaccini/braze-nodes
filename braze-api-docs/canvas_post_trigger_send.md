# Braze API: POST /canvas/trigger/send

## Overview

The Send Canvas Messages Using API-Triggered Delivery endpoint allows you to send immediate, one-off Canvas messages to designated users using API-triggered delivery. This endpoint triggers pre-configured Canvas flows from the Braze dashboard via API calls.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/canvas/trigger/send`
- **HTTP Method**: POST
- **Purpose**: Send immediate Canvas messages to designated users using API-triggered delivery

## Authentication

### Required Headers
```
Content-Type: application/json
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `canvas.trigger.send` permission

## Request Parameters

### Request Body Schema

```json
{
  "canvas_id": "string (required)",
  "canvas_entry_properties": {},
  "broadcast": "boolean (optional)",
  "audience": {},
  "recipients": [],
  "send_id": "string (optional)"
}
```

### Parameter Details

#### Required Parameters

- **canvas_id** (String, Required)
  - The Canvas identifier from your Braze dashboard
  - Must be an API-triggered Canvas type
  - Can be found on the API Keys page and Canvas Details page

#### Optional Parameters

- **canvas_entry_properties** (Object, Optional)
  - Personalization key-value pairs for Canvas entry
  - Maximum size limit: 50 KB
  - Referenced in Canvas content using `{{ canvas_entry_properties.${key} }}`

- **broadcast** (Boolean, Optional)
  - Set to true to send to entire Canvas audience
  - Cannot be used with recipients array
  - Default: false

- **audience** (Object, Optional)
  - Connected audience filter object
  - Defines audience segment for targeting

- **recipients** (Array, Optional)
  - Array of user recipients (up to 50 objects)
  - Each object contains:
    - `external_user_id` (String): User identifier
    - `canvas_entry_properties` (Object): User-specific personalization data
    - `send_to_existing_only` (Boolean): Only send to existing users
    - `attributes` (Object): User attributes to update before sending

- **send_id** (String, Optional)
  - Send identifier for tracking Canvas transmission
  - Must be created via `/sends/id/create` endpoint

### Recipients Object Schema

```json
{
  "external_user_id": "user123",
  "canvas_entry_properties": {
    "first_name": "John",
    "user_tier": "premium"
  },
  "send_to_existing_only": false,
  "attributes": {
    "email": "user@example.com",
    "subscription_groups": []
  }
}
```

## Response Schema

### Success Response (201)

```json
{
  "dispatch_id": "string",
  "message": "success"
}
```

### Response Fields

- **dispatch_id** (String): Identifier for tracking Canvas message transmission
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

- **2XX**: Success - Request successfully received, understood, and accepted
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

#### Invalid Canvas ID (400)
```json
{
  "message": "Invalid canvas_id",
  "errors": [
    {
      "code": "invalid_canvas_id",
      "message": "Canvas not found, inactive, or not API-triggered"
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

#### Canvas Entry Properties Too Large (400)
```json
{
  "message": "Canvas entry properties too large",
  "errors": [
    {
      "code": "entry_properties_size_limit",
      "message": "Canvas entry properties exceed 50 KB limit"
    }
  ]
}
```

## Key Features

- Supports sending to up to 50 specific users per request
- Can create/update user attributes before Canvas entry
- Allows personalized messaging through canvas_entry_properties
- Returns dispatch_id for Canvas tracking
- Maximum 50 KB size limit for entry properties
- Canvas entry properties available throughout the entire Canvas flow

## Best Practices

1. **Rate Limiting**: Allow 5-minute delay between consecutive calls to minimize errors
2. **Batching**: Use recipients array for bulk operations (up to 50 users)
3. **Error Handling**: Monitor X-RateLimit-Remaining to avoid hitting limits
4. **User Creation**: Use `send_to_existing_only: false` with attributes to create new users
5. **Personalization**: Leverage canvas_entry_properties for dynamic content throughout the Canvas
6. **Canvas State**: Ensure Canvas is active and properly configured before API calls

## Example Request

```bash
curl --location --request POST 'https://rest.iad-01.braze.com/canvas/trigger/send' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR-REST-API-KEY' \
--data-raw '{
  "canvas_id": "your_canvas_id",
  "recipients": [
    {
      "external_user_id": "user123",
      "canvas_entry_properties": {
        "first_name": "John",
        "user_tier": "premium",
        "welcome_discount": "15"
      }
    }
  ]
}'
```

## Canvas-Specific Considerations

- **Canvas State**: Canvas must be active to send messages
- **Entry Conditions**: Recipients must meet Canvas entry criteria
- **Flow Execution**: Entry properties are available throughout entire Canvas journey
- **Re-eligibility**: Canvas re-eligibility settings control repeat entries
- **Exit Conditions**: Users may exit Canvas based on configured exit criteria

## Related Endpoints

- **POST /canvas/trigger/schedule/create** - Schedule Canvas messages for future delivery
- **POST /canvas/trigger/schedule/update** - Update scheduled Canvas messages
- **DELETE /canvas/trigger/schedule/delete** - Cancel scheduled Canvas messages
- **GET /canvas/data_series** - Retrieve Canvas performance analytics
- **POST /sends/id/create** - Create send IDs for tracking

## References

- **Primary Source**: [POST: Send Canvas Messages Using API-Triggered Delivery](https://www.braze.com/docs/api/endpoints/messaging/send_messages/post_send_triggered_canvases)
- **Canvas Overview**: [Creating a Canvas](https://www.braze.com/docs/user_guide/engagement_tools/canvas/create_a_canvas/create_a_canvas)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)