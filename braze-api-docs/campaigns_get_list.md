# Braze API: GET /campaigns/list

## Overview
This endpoint allows you to export a list of campaigns from your Braze workspace. Each campaign entry includes its name, API identifier, campaign type, and associated tags.

## Endpoint Details

- **HTTP Method**: `GET`
- **Endpoint URL**: `/campaigns/list`
- **Full URL Pattern**: `https://rest.{instance}.braze.com/campaigns/list`

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
Your REST API key must have the `campaigns.list` permission enabled.

## Request Parameters

All parameters are optional query parameters:

| Parameter | Type | Required | Description | Default |
|-----------|------|----------|-------------|---------|
| `page` | Integer | No | Page of campaigns to return (0-indexed) | `0` |
| `include_archived` | Boolean | No | Whether to include archived campaigns | `false` |
| `sort_direction` | String | No | Sort order: `asc` or `desc` | `asc` (oldest first) |
| `last_edit.time[gt]` | String (ISO 8601) | No | Filter campaigns edited after this timestamp | None |

## Response Schema

### Success Response (HTTP 200)

```json
{
  "message": "success",
  "campaigns": [
    {
      "id": "string",
      "last_edited": "2025-01-15T10:30:00Z",
      "name": "string",
      "is_api_campaign": boolean,
      "tags": ["string", "string"]
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | String | Status message ("success") |
| `campaigns` | Array | Array of campaign objects |
| `campaigns[].id` | String | Campaign API identifier |
| `campaigns[].last_edited` | String (ISO 8601) | Timestamp when campaign was last edited |
| `campaigns[].name` | String | Campaign display name |
| `campaigns[].is_api_campaign` | Boolean | Whether campaign is triggered via API |
| `campaigns[].tags` | Array of Strings | Tags associated with the campaign |

### Response Behavior
- Returns up to 100 campaigns per page
- Campaigns are sorted by creation time (oldest to newest by default)
- Use the `page` parameter for pagination
- Empty array returned if no campaigns match the criteria

## Rate Limits
- **Default**: 250,000 requests per hour
- Rate limits are applied per workspace
- Consider implementing exponential backoff for rate limit handling

## Error Responses

### HTTP 400 - Bad Request
```json
{
  "message": "Invalid request parameters",
  "errors": [
    {
      "field": "page",
      "message": "Page must be a non-negative integer"
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
  "message": "API key does not have campaigns.list permission"
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
curl --location --request GET 'https://rest.iad-01.braze.com/campaigns/list?page=0&include_archived=false&sort_direction=desc' \
--header 'Authorization: Bearer YOUR-REST-API-KEY' \
--header 'Content-Type: application/json'
```

### JavaScript (Node.js) Example
```javascript
const axios = require('axios');

const getCampaignsList = async () => {
  try {
    const response = await axios.get('https://rest.iad-01.braze.com/campaigns/list', {
      headers: {
        'Authorization': 'Bearer YOUR-REST-API-KEY',
        'Content-Type': 'application/json'
      },
      params: {
        page: 0,
        include_archived: false,
        sort_direction: 'desc'
      }
    });

    console.log('Campaigns:', response.data.campaigns);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error.response?.data || error.message);
    throw error;
  }
};
```

### Python Example
```python
import requests

def get_campaigns_list(api_key, instance='iad-01', page=0, include_archived=False):
    url = f'https://rest.{instance}.braze.com/campaigns/list'

    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }

    params = {
        'page': page,
        'include_archived': include_archived,
        'sort_direction': 'desc'
    }

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching campaigns: {e}')
        raise
```

## Implementation Notes

1. **Pagination**: Use the `page` parameter to retrieve all campaigns if you have more than 100
2. **Filtering**: Use `last_edit.time[gt]` to get only recently modified campaigns
3. **Performance**: Consider caching campaign lists if they don't change frequently
4. **Error Handling**: Always implement proper error handling for rate limits and API errors
5. **Security**: Never expose API keys in client-side code

## Official Documentation
- [Braze GET: Export Campaigns List](https://www.braze.com/docs/api/endpoints/export/campaigns/get_campaigns)
- [Braze API Overview](https://www.braze.com/docs/api/home)
- [Braze REST API Key Permissions](https://www.braze.com/docs/api/basics/#rest-api-key)