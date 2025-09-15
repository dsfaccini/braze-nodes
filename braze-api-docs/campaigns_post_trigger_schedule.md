# Braze API: POST /campaigns/trigger/schedule/create

## Overview

The Schedule API-Triggered Campaigns endpoint allows you to send dashboard-created campaign messages via API-triggered delivery at a scheduled time. This endpoint lets you decide what action should trigger the message to be sent and schedule it for future delivery.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/campaigns/trigger/schedule/create`
- **HTTP Method**: POST
- **Purpose**: Schedule API-triggered campaign messages for future delivery to designated users

## Authentication

### Required Headers
```
Content-Type: application/json
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `campaigns.trigger.schedule.create` permission

## Request Parameters

### Request Body Schema

```json
{
  "campaign_id": "string (required)",
  "send_id": "string (optional)",
  "recipients": [],
  "audience": {},
  "broadcast": "boolean (optional)",
  "trigger_properties": {},
  "schedule": {
    "time": "string (required)",
    "in_local_time": "boolean (optional)",
    "at_optimal_time": "boolean (optional)"
  }
}
```

### Parameter Details

#### Required Parameters

- **campaign_id** (String, Required)
  - The API identifier for the campaign created in the dashboard
  - Must be an API-triggered campaign type

- **schedule** (Object, Required)
  - **time** (String, Required): ISO 8601 datetime string when the message should be sent
  - **in_local_time** (Boolean, Optional): Send in user's local time zone
  - **at_optimal_time** (Boolean, Optional): Send at optimal time for each user

#### Optional Parameters

- **send_id** (String, Optional)
  - Send identifier for message tracking
  - Must be created via `/sends/id/create` endpoint if specified

- **recipients** (Array, Optional)
  - Array of user recipients (up to 50 objects)
  - Each object contains:
    - `external_user_id` (String): User identifier
    - `trigger_properties` (Object): User-specific personalization data
    - `send_to_existing_only` (Boolean): Only send to existing users
    - `attributes` (Object): User attributes to update before sending

- **audience** (Object, Optional)
  - Connected audience filter object for targeting specific user segments

- **broadcast** (Boolean, Optional)
  - Set to true to send to entire campaign segment
  - Cannot be used with recipients array

- **trigger_properties** (Object, Optional)
  - Global personalization key-value pairs for all users
  - Referenced in message content using `{{ api_trigger_properties.${key} }}`

### Recipients Object Schema

```json
{
  "external_user_id": "user123",
  "trigger_properties": {
    "first_name": "John",
    "discount_code": "SAVE25"
  },
  "send_to_existing_only": false,
  "attributes": {
    "email": "user@example.com"
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
- **schedule_id** (String): Identifier for the scheduled message (use for updates/cancellation)
- **message** (String): Status message

## Rate Limits

### Standard Requests
- **250,000 requests per hour** when targeting specific external IDs

### Segment/Connected Audience Requests
- **250 requests per minute** when specifying segment or Connected Audience

### Rate Limit Headers
Every API request returns rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

### HTTP Status Codes

- **2XX**: Success - Request successfully received, understood, and accepted
- **4XX**: Fatal client errors - Refer to error descriptions
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
      "message": "Campaign not found or not API-triggered"
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

## Key Features

- Schedule API-triggered campaigns up to 90 days in advance
- Support for user-specific and global personalization properties
- Batch scheduling for up to 50 specific users per request
- Local time zone and optimal time delivery options
- Returns schedule_id for message management (update/cancel)
- Can create/update user attributes before sending

## Best Practices

1. **Schedule Management**: Save the returned schedule_id for future updates or cancellations
2. **Time Zones**: Use `in_local_time: true` for better user engagement in global campaigns
3. **Optimal Timing**: Consider `at_optimal_time: true` for maximum open rates
4. **Batching**: Use recipients array efficiently (up to 50 users per request)
5. **Rate Limiting**: Monitor rate limit headers and implement proper backoff strategies
6. **Error Handling**: Implement retry logic for 5XX errors but not for 4XX errors

## Example Request

```bash
curl --location --request POST 'https://rest.iad-01.braze.com/campaigns/trigger/schedule/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR-REST-API-KEY' \
--data-raw '{
  "campaign_id": "your_campaign_id",
  "schedule": {
    "time": "2024-01-15T09:00:00Z",
    "in_local_time": true
  },
  "recipients": [
    {
      "external_user_id": "user123",
      "trigger_properties": {
        "first_name": "John",
        "discount_code": "SAVE25"
      }
    }
  ]
}'
```

## Related Endpoints

- **POST /campaigns/trigger/schedule/update** - Update scheduled API-triggered campaigns
- **DELETE /campaigns/trigger/schedule/delete** - Cancel scheduled API-triggered campaigns
- **POST /campaigns/trigger/send** - Send API-triggered campaigns immediately
- **POST /sends/id/create** - Create send IDs for tracking

## References

- **Primary Source**: [POST: Schedule API-Triggered Campaigns](https://www.braze.com/docs/api/endpoints/messaging/schedule_messages/post_schedule_triggered_campaigns)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)