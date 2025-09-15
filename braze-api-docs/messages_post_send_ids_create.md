# Braze API: POST /sends/id/create

## Overview

The Create Send IDs endpoint allows you to generate custom send identifiers for tracking and analytics purposes. Send IDs are particularly useful for programmatically generating and sending content while maintaining detailed tracking capabilities without creating individual campaigns for each send.

## Endpoint Details

- **URL**: `https://rest.{instance}.braze.com/sends/id/create`
- **HTTP Method**: POST
- **Purpose**: Create custom send identifiers for message tracking and analytics

## Authentication

### Required Headers
```
Content-Type: application/json
Authorization: Bearer YOUR-REST-API-KEY
```

### API Key Permissions
- Requires REST API key with `sends.id.create` permission

## Request Parameters

### Request Body Schema

```json
{
  "campaign_id": "string (required)",
  "send_id": "string (optional)"
}
```

### Parameter Details

#### Required Parameters

- **campaign_id** (String, Required)
  - The campaign identifier associated with the send ID
  - Must reference an existing campaign in your Braze workspace

#### Optional Parameters

- **send_id** (String, Optional)
  - Custom send identifier to create
  - Must be all ASCII characters and at most 64 characters long
  - If not provided, Braze will generate one automatically
  - Can contain letters, numbers, hyphens, and underscores

### Send ID Requirements

- **Length**: Maximum 64 characters
- **Character Set**: ASCII characters only (letters, numbers, hyphens, underscores)
- **Uniqueness**: Each send_id and campaign_id combination must be unique
- **Reusability**: Can reuse send_id across multiple sends of the same campaign

## Response Schema

### Success Response (201)

```json
{
  "message": "success",
  "send_id": "your_custom_send_id"
}
```

### Response Fields

- **message** (String): Status message indicating success
- **send_id** (String): The created send identifier (generated or custom)

## Rate Limits

### Daily Limits
- **100 custom send identifiers per day** per workspace
- Each campaign_id and send_id combination counts toward daily limit
- Limit resets at midnight UTC

### Standard API Rate Limit
- **250,000 requests per hour** (shared with other messaging endpoints)

### Rate Limit Headers
Every API request returns rate limit information:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Error Codes

### HTTP Status Codes

- **2XX**: Success - Send ID created successfully
- **4XX**: Fatal client errors - Check request format and limits
- **5XX**: Fatal server errors - Server unable to execute request

### Common Error Responses

#### Daily Limit Exceeded (400)
```json
{
  "message": "Daily limit exceeded",
  "errors": [
    {
      "code": "daily_send_id_limit_exceeded",
      "message": "Maximum of 100 custom send identifiers per day reached"
    }
  ]
}
```

#### Invalid Send ID Format (400)
```json
{
  "message": "Invalid send_id",
  "errors": [
    {
      "code": "invalid_send_id",
      "message": "send_id must be ASCII characters only and maximum 64 characters"
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
      "message": "Campaign not found"
    }
  ]
}
```

#### Duplicate Send ID (400)
```json
{
  "message": "Send ID already exists",
  "errors": [
    {
      "code": "send_id_exists",
      "message": "Send ID already exists for this campaign"
    }
  ]
}
```

## Key Features

- Generate up to 100 custom send IDs per day
- Support for both custom and auto-generated send identifiers
- Reusable across multiple sends of the same campaign
- Enables detailed analytics tracking via `/sends/data_series` endpoint
- ASCII character support for maximum compatibility
- Immediate availability after creation

## Best Practices

1. **Naming Convention**: Use descriptive, consistent naming patterns for send IDs
2. **Daily Planning**: Monitor daily usage to avoid hitting the 100 ID limit
3. **Reusability**: Reuse send IDs across related sends for grouped analytics
4. **Validation**: Ensure send_id follows ASCII and length requirements
5. **Error Handling**: Implement proper error handling for limit exceeded scenarios
6. **Analytics Integration**: Plan send ID strategy to align with reporting needs

## Example Request

```bash
curl --location --request POST 'https://rest.iad-01.braze.com/sends/id/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR-REST-API-KEY' \
--data-raw '{
  "campaign_id": "campaign_12345",
  "send_id": "holiday_promo_2024_01_15"
}'
```

## Example Response

```json
{
  "message": "success",
  "send_id": "holiday_promo_2024_01_15"
}
```

## Use Cases

- **A/B Testing**: Create separate send IDs for test variants
- **Campaign Segmentation**: Different send IDs for different audience segments
- **Time-based Tracking**: Unique IDs for daily/weekly campaign sends
- **Performance Analysis**: Group related sends under common send IDs
- **Automated Campaigns**: Programmatic send ID generation for recurring campaigns

## Related Endpoints

- **POST /campaigns/trigger/send** - Use created send IDs with campaign sends
- **POST /messages/send** - Use created send IDs with direct message sends
- **GET /sends/data_series** - Retrieve analytics using send IDs
- **POST /campaigns/trigger/schedule/create** - Schedule campaigns with custom send IDs

## References

- **Primary Source**: [POST: Create Send IDs](https://www.braze.com/docs/api/endpoints/messaging/send_messages/post_create_send_ids)
- **Send Analytics**: [GET: Export Send Analytics](https://www.braze.com/docs/api/endpoints/export/campaigns/get_send_analytics)
- **Rate Limits**: [API Rate Limits](https://www.braze.com/docs/api/api_limits)
- **Error Codes**: [API Errors & Responses](https://www.braze.com/docs/api/errors)