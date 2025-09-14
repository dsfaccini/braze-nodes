# Braze API: GET /campaigns/details

## Overview
This endpoint allows you to retrieve comprehensive information about a specific campaign, including its configuration, messages, channels, and conversion behaviors.

## Endpoint Details

- **HTTP Method**: `GET`
- **Endpoint URL**: `/campaigns/details`
- **Full URL Pattern**: `https://rest.{instance}.braze.com/campaigns/details`

### Instance URLs
Replace `{instance}` with your Braze instance:
- US-01: `https://rest.iad-01.braze.com`
- US-02: `https://rest.iad-02.braze.com`
- US-03: `https://rest.iad-03.braze.com`
- US-04: `https://rest.iad-04.braze.com`
- US-05: `https://rest.iad-05.braze.com`
- US-06: `https://rest.iad-06.braze.com`
- US-07: `https://rest.iad-07.braze.com`
- US-08: `https://rest.iad-08.braze.com`
- US-10: `https://rest.iad-10.braze.com`
- EU-01: `https://rest.fra-01.braze.eu`
- EU-02: `https://rest.fra-02.braze.eu`
- AU-01: `https://rest.syd-01.braze.au`
- ID-01: `https://rest.jakarta-01.braze.id`

## Authentication

### Required Headers
```
Authorization: Bearer YOUR-REST-API-KEY
Content-Type: application/json
```

### API Key Permissions
Your REST API key must have the `campaigns.details` permission enabled.

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaign_id` | String | Yes | The campaign API identifier (can be found in dashboard or via campaigns list endpoint) |
| `post_launch_draft_version` | Boolean | No | Include draft changes made after campaign launch |

### Parameter Details

#### campaign_id
- Found on the API Keys page in your Braze dashboard
- Also available on the Campaign Details page
- Can be obtained via the `/campaigns/list` endpoint
- Format: String identifier (e.g., "campaign_identifier")

## Response Schema

### Success Response (HTTP 200)

```json
{
  "message": "success",
  "created_at": "2025-01-15T10:00:00Z",
  "updated_at": "2025-01-15T15:30:00Z",
  "name": "Campaign Name",
  "description": "Campaign Description",
  "schedule_type": "time_based",
  "channels": ["push", "email"],
  "first_sent": "2025-01-15T12:00:00Z",
  "last_sent": "2025-01-15T18:00:00Z",
  "tags": ["tag1", "tag2"],
  "messages": {
    "message_variation_id_1": {
      "channel": "push",
      "name": "Push Message Variant",
      "extras": {
        "key": "value"
      }
    },
    "message_variation_id_2": {
      "channel": "email",
      "name": "Email Message Variant",
      "subject": "Email Subject",
      "body": "<html>Email HTML body</html>",
      "from": "sender@example.com",
      "reply_to": "reply@example.com"
    }
  },
  "conversion_behaviors": [
    {
      "type": "Performs Custom Event",
      "window": 3600
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | Status message ("success") |
| `created_at` | String (ISO 8601) | Campaign creation timestamp |
| `updated_at` | String (ISO 8601) | Last campaign update timestamp |
| `name` | String | Campaign display name |
| `description` | String | Campaign description |
| `schedule_type` | String | Campaign scheduling type |
| `channels` | Array of Strings | Channels used in the campaign |
| `first_sent` | String (ISO 8601) | First message send timestamp |
| `last_sent` | String (ISO 8601) | Last message send timestamp |
| `tags` | Array of Strings | Tags associated with the campaign |
| `messages` | Object | Message variations by variation ID |
| `conversion_behaviors` | Array | Conversion event behaviors |

### Message Channel Types

#### Push Notification
```json
{
  "channel": "push",
  "name": "Push Message Name",
  "body": "Push notification body text",
  "title": "Push notification title",
  "extras": {
    "custom_key": "custom_value"
  },
  "alert": "Alert text",
  "sound": "notification_sound.wav"
}
```

#### Email
```json
{
  "channel": "email",
  "name": "Email Message Name",
  "subject": "Email Subject Line",
  "body": "<html>HTML email body</html>",
  "plaintext_body": "Plain text email body",
  "from": "sender@example.com",
  "reply_to": "reply@example.com",
  "preheader": "Email preheader text",
  "headers": {
    "X-Custom-Header": "value"
  }
}
```

#### In-App Message
```json
{
  "channel": "in_app_message",
  "name": "In-App Message Name",
  "type": "slideup",
  "header": "Header text",
  "message": "Message body",
  "extras": {
    "key": "value"
  }
}
```

#### Content Card
```json
{
  "channel": "content_cards",
  "name": "Content Card Name",
  "type": "classic",
  "title": "Card Title",
  "description": "Card description",
  "image_url": "https://example.com/image.jpg",
  "link_url": "https://example.com"
}
```

#### SMS
```json
{
  "channel": "sms",
  "name": "SMS Message Name",
  "body": "SMS message body",
  "media_urls": ["https://example.com/image.jpg"]
}
```

#### Webhook
```json
{
  "channel": "webhook",
  "name": "Webhook Name",
  "url": "https://api.example.com/webhook",
  "request_method": "POST",
  "request_headers": {
    "Content-Type": "application/json"
  },
  "body": "webhook payload"
}
```

### Conversion Behaviors

```json
{
  "type": "Performs Custom Event",
  "window": 3600,
  "custom_event_name": "event_name"
}
```

## Rate Limits
- **Default**: 250,000 requests per hour
- Rate limits are applied per workspace
- Consider implementing exponential backoff for rate limit handling

## Error Responses

### HTTP 400 - Bad Request
```json
{
  "message": "campaign_id is required",
  "errors": [
    {
      "field": "campaign_id",
      "message": "campaign_id cannot be empty"
    }
  ]
}
```

### HTTP 401 - Unauthorized
```json
{
  "message": "Invalid API key"
}
```

### HTTP 403 - Forbidden
```json
{
  "message": "API key does not have campaigns.details permission"
}
```

### HTTP 404 - Not Found
```json
{
  "message": "Campaign not found",
  "errors": [
    {
      "message": "Campaign with id 'invalid_campaign_id' not found"
    }
  ]
}
```

### HTTP 429 - Rate Limit Exceeded
```json
{
  "message": "Rate limit exceeded"
}
```

### HTTP 500 - Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Code Examples

### cURL Example
```bash
curl --location --request GET 'https://rest.iad-01.braze.com/campaigns/details?campaign_id=your_campaign_id' \
--header 'Authorization: Bearer YOUR-REST-API-KEY' \
--header 'Content-Type: application/json'
```

### JavaScript (Node.js) Example
```javascript
const axios = require('axios');

const getCampaignDetails = async (campaignId) => {
  try {
    const response = await axios.get('https://rest.iad-01.braze.com/campaigns/details', {
      headers: {
        'Authorization': 'Bearer YOUR-REST-API-KEY',
        'Content-Type': 'application/json'
      },
      params: {
        campaign_id: campaignId,
        post_launch_draft_version: false
      }
    });

    console.log('Campaign Details:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign details:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
getCampaignDetails('your_campaign_id');
```

### Python Example
```python
import requests

def get_campaign_details(api_key, campaign_id, instance='iad-01', include_draft=False):
    url = f'https://rest.{instance}.braze.com/campaigns/details'

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }

    params = {
        'campaign_id': campaign_id,
        'post_launch_draft_version': include_draft
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching campaign details: {e}')
        raise

# Usage
campaign_data = get_campaign_details('your_api_key', 'your_campaign_id')
```

### TypeScript Example
```typescript
interface BrazeCampaignDetails {
  message: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  schedule_type: string;
  channels: string[];
  first_sent: string;
  last_sent: string;
  tags: string[];
  messages: Record<string, any>;
  conversion_behaviors: Array<{
    type: string;
    window: number;
    custom_event_name?: string;
  }>;
}

const getCampaignDetails = async (
  apiKey: string,
  campaignId: string,
  instance: string = 'iad-01'
): Promise<BrazeCampaignDetails> => {
  const response = await fetch(
    `https://rest.${instance}.braze.com/campaigns/details?campaign_id=${campaignId}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
```

## Implementation Notes

1. **Campaign ID**: Always validate the campaign ID exists before making the request
2. **Channel Handling**: Different channels have different message structures - handle accordingly
3. **Draft Versions**: Use `post_launch_draft_version=true` to see unpublished changes
4. **Error Handling**: Implement proper error handling for missing campaigns and permission issues
5. **Performance**: Consider caching campaign details if they don't change frequently
6. **Security**: Never expose API keys in client-side code

## Use Cases

- **Campaign Analysis**: Retrieve detailed campaign configuration for reporting
- **Content Audit**: Extract message content across all channels
- **Performance Tracking**: Get campaign metadata for analytics correlation
- **Template Creation**: Use existing campaigns as templates for new ones
- **Integration**: Export campaign data to external systems

## Official Documentation
- [Braze GET: Export Campaign Details](https://www.braze.com/docs/api/endpoints/export/campaigns/get_campaign_details)
- [Braze API Overview](https://www.braze.com/docs/api/home)
- [Braze REST API Key Permissions](https://www.braze.com/docs/api/basics/#rest-api-key)