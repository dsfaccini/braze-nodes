# Braze API: POST /transactional/v1/campaigns/{campaign_id}/send

## Overview
Send immediate, one-off transactional messages to a designated user using API-triggered delivery. This endpoint is specifically designed for 1:1 messaging of alerts like order confirmations, password resets, and other business-critical communications.

## Endpoint Details
- **HTTP Method**: POST
- **Endpoint URL**: `https://rest.{instance}.braze.com/transactional/v1/campaigns/{campaign_id}/send`
- **Purpose**: Send immediate transactional messages to individual users

## Authentication Requirements
- **API Key Permission**: `transactional.send`
- **Header**: `Authorization: Bearer YOUR-REST-API-KEY`
- **Content-Type**: `application/json`

## Rate Limits
- **Special Rate Limiting**: Not subject to standard rate limits
- **SLA Coverage**: Messages beyond package limit will send but aren't covered by contractual SLA
- **Performance**: System continues to ingest API calls and return success codes even when exceeding limits

## Request Parameters

### Path Parameters
- **campaign_id** (required, string): The campaign identifier for the transactional email campaign

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
  "external_send_id": "unique_send_identifier",
  "trigger_properties": {
    "property_key_1": "property_value_1",
    "property_key_2": "property_value_2"
  },
  "recipient": {
    "external_user_id": "user_external_id",
    "user_alias": {
      "alias_name": "example_alias",
      "alias_label": "example_label"
    },
    "attributes": {
      "attribute_key": "attribute_value",
      "custom_attribute": "custom_value"
    }
  }
}
```

### Required Parameters
- **recipient** (object): Must contain either `external_user_id` or `user_alias`
  - **external_user_id** (string): The external user identifier
  - **user_alias** (object): User alias object with `alias_name` and `alias_label`

### Optional Parameters
- **external_send_id** (string): Base64 compatible unique identifier for tracking and deduplication
- **trigger_properties** (object): Key-value pairs for personalizing the message content
- **recipient.attributes** (object): User attributes to set when creating or updating user profile

### Recipient Object Details

#### Using External User ID
```json
"recipient": {
  "external_user_id": "user123456",
  "attributes": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  }
}
```

#### Using User Alias
```json
"recipient": {
  "user_alias": {
    "alias_name": "john.doe@example.com",
    "alias_label": "email"
  },
  "attributes": {
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Trigger Properties for Personalization
```json
"trigger_properties": {
  "order_id": "ORD-12345",
  "order_total": "$99.99",
  "product_name": "Premium Subscription",
  "confirmation_url": "https://example.com/orders/12345",
  "delivery_date": "2024-01-15"
}
```

## Response Schema

### Successful Response (201 Created)
```json
{
  "dispatch_id": "66cdc28f8f082bc3074c0c79",
  "status": "sent",
  "metadata": {
    "external_send_id": "unique_send_identifier",
    "campaign_id": "campaign_uuid"
  }
}
```

### Response Fields
- **dispatch_id** (string): Unique identifier for this message send instance
- **status** (string): Message status (e.g., "sent", "queued")
- **metadata** (object): Additional information about the send
  - **external_send_id** (string): The external send ID provided in request
  - **campaign_id** (string): The campaign identifier used

## Error Codes and Meanings

### 400 Bad Request
```json
{
  "message": "Invalid request",
  "errors": [
    {
      "message": "Invalid campaign_id format",
      "error_code": "INVALID_CAMPAIGN_ID"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid API key or insufficient permissions"
}
```

### 403 Forbidden
```json
{
  "message": "IP address not whitelisted or API key lacks transactional.send permission"
}
```

### 404 Not Found
```json
{
  "message": "Campaign not found or archived",
  "errors": [
    {
      "message": "Campaign with ID 'campaign_uuid' not found or is archived"
    }
  ]
}
```

### 422 Unprocessable Entity
```json
{
  "message": "Request validation failed",
  "errors": [
    {
      "message": "Campaign is paused and cannot send messages"
    }
  ]
}
```

### 429 Too Many Requests
```json
{
  "message": "Rate limit exceeded",
  "retry_after": 60
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Key Features and Constraints

### Transactional Campaign Requirements
1. **Campaign Setup**: Must create a transactional email campaign in Braze dashboard first
2. **Campaign Status**: Campaign must be active (not paused or archived)
3. **Single User**: Designed for 1:1 messaging only
4. **Real-time**: Messages are sent immediately upon API call

### User Profile Management
- **Profile Creation**: Can create new user profiles if they don't exist
- **Attribute Updates**: Can update user attributes during send
- **Alias Support**: Supports both external_user_id and user_alias targeting

### Event Tracking and Postbacks
- **HTTP Postbacks**: All transactional emails include event status postbacks
- **Real-time Tracking**: Evaluate message status in real-time
- **Failover Support**: Take action if message goes undelivered
- **Event Types**: Delivery, bounce, open, click, unsubscribe, etc.

### Deduplication
- **external_send_id**: Use to prevent duplicate sends
- **Idempotent**: Same external_send_id will not trigger duplicate messages
- **Tracking**: Helps track individual message instances

## Best Practices

1. **Campaign Setup**: Ensure transactional campaign is properly configured in Braze dashboard
2. **User Identification**: Use consistent user identification (external_user_id vs user_alias)
3. **Deduplication**: Always include external_send_id for critical transactional messages
4. **Error Handling**: Implement robust error handling for all response codes
5. **Event Monitoring**: Set up HTTP postback endpoints for message status tracking
6. **Fallback Strategy**: Have alternative delivery methods for failed messages
7. **Testing**: Test with real user data in staging environment

## Transactional Campaign Setup

### Prerequisites
1. Create a transactional email campaign in Braze dashboard
2. Configure email template with liquid templating for personalization
3. Set up HTTP postback URL for event tracking
4. Generate API key with `transactional.send` permission
5. Note the campaign_id for API calls

### Template Personalization
Templates can use trigger properties for dynamic content:
```liquid
Hi {{${trigger_properties.first_name}}}!

Your order #{{${trigger_properties.order_id}}} has been confirmed.
Total: {{${trigger_properties.order_total}}}

Track your order: {{${trigger_properties.tracking_url}}}
```

## Event Postback Configuration

### Webhook Structure
```json
{
  "events": [
    {
      "email_address": "user@example.com",
      "event_type": "sent",
      "dispatch_id": "66cdc28f8f082bc3074c0c79",
      "external_send_id": "unique_send_identifier",
      "campaign_id": "campaign_uuid",
      "timestamp": 1640995200
    }
  ]
}
```

### Available Event Types
- `sent`: Message was sent successfully
- `delivered`: Message was delivered to recipient
- `bounced`: Message bounced (hard or soft bounce)
- `opened`: Recipient opened the email
- `clicked`: Recipient clicked a link in the email
- `unsubscribed`: Recipient unsubscribed
- `spam_report`: Message was marked as spam

## Official Documentation
- **Primary Source**: https://www.braze.com/docs/api/endpoints/messaging/send_messages/post_send_transactional_message
- **Transactional Campaigns**: https://www.braze.com/docs/user_guide/message_building_by_channel/email/transactional_message_api_campaign
- **Event Tracking**: https://www.braze.com/docs/user_guide/message_building_by_channel/email/transactional_message_api_campaign/tracking_transactional_emails
- **API Authentication**: https://www.braze.com/docs/api/basics#authentication

## Code Examples

### cURL Example
```bash
curl -X POST \
  'https://rest.iad-01.braze.com/transactional/v1/campaigns/campaign_uuid/send' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR-REST-API-KEY' \
  -d '{
    "external_send_id": "order_confirmation_12345",
    "recipient": {
      "external_user_id": "user123"
    },
    "trigger_properties": {
      "order_id": "ORD-12345",
      "order_total": "$99.99",
      "first_name": "John"
    }
  }'
```

### JavaScript Example
```javascript
const campaignId = 'your_campaign_uuid';
const response = await fetch(`https://rest.iad-01.braze.com/transactional/v1/campaigns/${campaignId}/send`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR-REST-API-KEY'
  },
  body: JSON.stringify({
    external_send_id: 'password_reset_' + Date.now(),
    recipient: {
      external_user_id: 'user123'
    },
    trigger_properties: {
      reset_url: 'https://app.example.com/reset?token=abc123',
      expiry_time: '1 hour',
      first_name: 'John'
    }
  })
});

const data = await response.json();
console.log('Dispatch ID:', data.dispatch_id);
console.log('Status:', data.status);
```

### Python Example
```python
import requests
import json

url = 'https://rest.iad-01.braze.com/transactional/v1/campaigns/campaign_uuid/send'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR-REST-API-KEY'
}

payload = {
    'external_send_id': 'order_confirmation_12345',
    'recipient': {
        'external_user_id': 'user123'
    },
    'trigger_properties': {
        'order_id': 'ORD-12345',
        'order_total': '$99.99',
        'product_name': 'Premium Subscription',
        'first_name': 'John'
    }
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
result = response.json()

print(f"Dispatch ID: {result['dispatch_id']}")
print(f"Status: {result['status']}")
```

## Availability
Transactional Email is currently available as part of select Braze packages. Contact your Braze customer success manager for more details about enabling this feature.