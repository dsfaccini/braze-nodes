# Braze CRM Nodes for n8n

This is a collection of n8n community nodes for Braze CRM platform. Currently supported services: Campaigns, Message Sending, Email Templates, and Analytics.

**Primary Focus**: Email sending, campaign management, and analytics endpoints for comprehensive Braze integration.

**Disclaimer**: This is a community-developed project and is not officially affiliated with or endorsed by Braze or n8n. This repository is in active development, which means that not all Braze endpoints are implemented as nodes yet and some operations may currently not be available. Please report any issues you find and provide as much context as possible, include screenshots and error messages in code blocks if possible.

## Available Braze Nodes

### 🚀 Braze Campaigns

Campaign management and triggering operations.

**Operations:**
- **List**: Get all campaigns with filtering and pagination
- **Details**: Get detailed campaign information
- **Trigger**: Send API-triggered campaigns
- **Analytics**: Get campaign performance data and metrics

### ✉️ Braze Send Message

Direct message sending to users across multiple channels.

**Operations:**
- **Send**: Send immediate messages (email, SMS, push) to specific users
- **Send Transactional**: Send transactional emails using pre-configured campaigns

**Key Features:**
- Multi-channel support (email, SMS, push notifications)
- Batch targeting (up to 50 users per request)
- Template variable support
- Subscription state handling

### 📧 Braze Email Template

Email template management operations.

**Operations:**
- **Create**: Create new email templates with Liquid templating
- **List**: Get all email templates with filtering and pagination
- **Update**: Update existing email templates
- **Info**: Get detailed template information

### 📊 Braze Analytics

Performance metrics and analytics for campaigns and sends.

**Operations:**
- **Campaign Analytics**: Time-series campaign performance data
- **Send Analytics**: Performance metrics for specific message sends

**Metrics Include:**
- Opens, clicks, unsubscribes, bounces
- Conversions and revenue tracking
- Delivery and engagement rates

## Installation

Install directly in n8n:

1. Go to **Settings** > **Community Nodes**
2. Enter: `@braze/n8n-nodes-braze` (coming soon)
3. Click **Install**

## Authentication

### Braze REST API Key Setup

Braze uses REST API keys for authentication. Each key is scoped with specific permissions.

1. **Create API Key:**
   - Navigate to Settings > APIs and Identifiers in your Braze dashboard
   - Select "Create API Key"
   - Assign required permissions (see table below)
   - Configure IP allowlisting (optional but recommended)

2. **Required Permissions:**
   - `messages.send` - For message sending operations
   - `campaigns.trigger.send` - For campaign triggering
   - `campaigns.list` - For listing campaigns
   - `campaigns.data_series` - For campaign analytics
   - `templates.email.*` - For email template operations
   - `sends.data_series` - For send analytics

3. **Instance Selection:**
   Choose your Braze instance based on your dashboard URL:
   - US instances: US-01 through US-08, US-10
   - EU instances: EU-01, EU-02
   - AU instance: AU-01
   - ID instance: ID-01

### Rate Limits

- **Standard**: 250,000 requests per hour
- **Message sending**: 250 requests/minute (broadcast) OR 250,000/hour (targeted)
- **Campaign analytics**: 50,000 requests per minute
- Monitor rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Examples

### Send Email Campaign
```
Manual Trigger → Braze Campaigns (Trigger) → Success Response
```

### Send Direct Email
```
Code Node → Braze Send Message → Analytics Tracking
```

### Template Management
```
HTTP Request → Braze Email Template (Create) → Campaign Setup
```

---

# Legacy Cloudflare Nodes (Reference)

*The following Cloudflare nodes are maintained as reference during the Braze implementation phase.*

This is a collection of n8n community nodes for Cloudflare services. Currently supported services: R2 object storage, D1 serverless database, Workers AI, KV storage, and Queues.

**Disclaimer**: This is a community-developed project and is not officially affiliated with or endorsed by Cloudflare or n8n. I'm just a fan that wanted to use cloudflare services in n8n. This repository is in development, which means that not all cloudflare services are implemented as nodes yet and some operations may currently not be available. Additionally you may encounter bugs or unhelpful error messages. Please report any issues you find and provide as much context as possible, include screenshots and error messages in code blocks if possible.

## Available Nodes

### <img src="./nodes/CloudflareR2/cloudflare-r2.svg" width="24" height="24" style="vertical-align: middle"> Cloudflare R2

Object storage compatible with Amazon S3 API.

**Operations:**

- **Buckets**: List, create, delete, get info
- **Objects**: Upload, download, list, delete, copy
- **URLs**: Generate presigned URLs for temporary access

**Important Note**: R2 buckets can only be deleted when completely empty. If you encounter a 409 error when trying to delete a bucket, ensure all objects (including hidden files and incomplete multipart uploads) are removed first. You may need to manually verify the bucket is empty in the Cloudflare dashboard.

### <img src="./nodes/CloudflareKV/cloudflare-kv.svg" width="24" height="24" style="vertical-align: middle"> Cloudflare KV

Globally distributed key-value store.

**Operations:**

- **Namespaces**: List, create, delete
- **Key-Value**: Get, set, delete, list keys
- **Bulk**: Get/set/delete multiple keys at once
- **Advanced**: Expiration, metadata, prefix filtering

### <img src="./nodes/CloudflareQueue/cloudflare-queue.svg" width="24" height="24" style="vertical-align: middle"> Cloudflare Queue

Message queue service for asynchronous processing.

**Operations:**

- **Queue Management**: List, create, update, delete queues
- **Messages**: Send, pull, acknowledge, retry messages
- **Trigger Mode**: Auto-poll for new messages with configurable intervals

### <img src="./nodes/CloudflareAI/cloudflare-ai.svg" width="24" height="24" style="vertical-align: middle"> Cloudflare AI

Access to Cloudflare's AI/ML models.

**Operations:**

- **Text Generation**: Completions and chat models
- **Image Generation**: AI-powered image creation
- **Speech**: Transcription and text-to-speech

### <img src="./nodes/CloudflareD1/cloudflare-d1.svg" width="24" height="24" style="vertical-align: middle"> Cloudflare D1

Serverless SQL database built on SQLite.

**Operations:**

- **Database Management**: List, create, delete databases
- **Query Execution**: Run SQL queries and commands
- **Data Operations**: CRUD operations with structured data

## Installation

Install directly in n8n:

1. Go to **Settings** > **Community Nodes**
	```
	https://YOUR_N8N_DOMAIN/settings/community-nodes
	```
2. Enter:
	```
	@getalecs/n8n-nodes-cloudflare
	```
3. Click **Install**

![Installation](https://cdn.getalecs.com/n8n-nodes-cloudflare/install-cloudflare-nodes.gif)

Or install via npm in your n8n instance:

```bash
npm install @getalecs/n8n-nodes-cloudflare
```

## Starter Templates

Get started quickly with pre-built workflow templates for each Cloudflare service. These templates demonstrate common use cases and best practices.

### R2 Starter ✅ Tested
Basic R2 operations: upload, download, list objects

```
https://raw.githubusercontent.com/dsfaccini/cloudflare-nodes/refs/heads/master/starter-templates/r2-starter.json
```

### KV Starter ✅ Tested
Key-value operations with metadata and expiration

```
https://raw.githubusercontent.com/dsfaccini/cloudflare-nodes/refs/heads/master/starter-templates/kv-starter.json
```

### D1 Starter ✅ Tested
SQL database operations and query examples

```
https://raw.githubusercontent.com/dsfaccini/cloudflare-nodes/refs/heads/master/starter-templates/d1-starter.json
```

### AI Starter ⚠️ Untested
Text generation, image creation, and speech

```
https://raw.githubusercontent.com/dsfaccini/cloudflare-nodes/refs/heads/master/starter-templates/ai-starter.json
```

### Queue Starter ⚠️ Untested
Message sending and processing basics

```
https://raw.githubusercontent.com/dsfaccini/cloudflare-nodes/refs/heads/master/starter-templates/queue-starter.json
```

### Queue Trigger ⚠️ Untested
Automated message polling with error handling

```
https://raw.githubusercontent.com/dsfaccini/cloudflare-nodes/refs/heads/master/starter-templates/queue-trigger-starter.json
```

### How to Import Templates

1. Copy the template URL from the table above
2. In n8n, go to **Workflows** → **Add workflow** → **Import from URL...**
3. Paste the URL and click **Import**

![Import from URL](https://cdn.getalecs.com/n8n-nodes-cloudflare/import-workflow-from-url.gif)

> 💡 **Tip**: After importing, remember to add your Cloudflare credentials in the node settings!

## Prerequisites

> [!IMPORTANT]
> **Cloudflare Queues requires a paid Workers plan**. Free accounts will receive 403 errors when using Queue nodes. [Learn more about Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

- Valid Cloudflare account
- For Queues: Paid Workers plan
- For R2: Separate R2 API token (see below)

## Authentication

### 🔑 API Token Types

Cloudflare offers two types of API tokens with different scopes:

#### 1. **User-Level Tokens** (Recommended for most services)
Perfect for D1, AI, KV, and Queues. Use this pre-configured link:

**[📝 Create user-level token for non R2 services](https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22ai%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22ai%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22queues%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22queues%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%5D&name=custom-n8n-cloudflare-nodes&accountId=%2A&zoneId=all)** *(Pre-configured with required permissions)*

**[Create a separate user-level token for R2 (Recommended)](https://dash.cloudflare.com/?to=/:account/r2/api-tokens/create&type=user)**

#### 2. **Account-Level Tokens**
**[📝 Or create an account-level token for non R2 services](https://dash.cloudflare.com/?to=/:account/api-tokens&permissionGroupKeys=%5B%7B%22key%22%3A%22ai%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22ai%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22queues%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22queues%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%5D&name=custom-n8n-cloudflare-nodes&accountId=%2A&zoneId=all)** *(Pre-configured with required permissions)*

**[Or a separate account-level token for R2](https://dash.cloudflare.com/?to=/:account/r2/api-tokens/create&type=account)**

### 🔐 Authentication Modes

**Standard Mode** (D1, AI, KV, Queue):
- ✅ API Token (from link above)
- ✅ Account ID

**R2 Mode** (Object Storage):
- ✅ Account ID
- ✅ R2 Access Key ID
- ✅ R2 Secret Access Key
- ✅ R2 Jurisdiction (default/eu/fedramp)

> [!WARNING]
> **R2 requires special S3-compatible API tokens**, not regular Cloudflare API tokens. These provide Access Key ID and Secret Access Key for S3 compatibility.

### 🚀 Quick Setup

1. **For most services (D1, AI, KV, Queues):**
   - Create a user or acccount api token with the permissions for the services you want to use. Use the link [above](#1-user-level-tokens-recommended-for-most-services) to navigate to cloudflare dashboard to generate the api token with the required permissions pre-selected.
   - Click "Continue to summary" → "Create Token"
   - Copy the token and your Account ID

2. **For R2 object storage:**
   - Follow the [R2 API Token Guide](https://developers.cloudflare.com/r2/api/tokens/)
   - Create an S3-compatible token
   - Use the Access Key ID and Secret Access Key provided

3. **In n8n:**
   - Add Cloudflare API credentials
   - Choose the appropriate authentication mode
   - Enter your token(s) and Account ID

### 🛠️ Custom Token Generation

If you won't use all the services or you want to keep separate keys for different services you can select them manually on the cloudflare api token dashboard or use one of the pre-configured links above and remove the permissions you don't need.

## Key Features

- ✅ **Complete API Coverage**: Implements all major operations for each service
- ✅ **Error Handling**: Comprehensive error messages and continue-on-fail support
- ✅ **Security**: Implements a custom AWS Signature v4 for R2 authentication, and uses the official AWS SDK for generating presigned URLs.
- ✅ **Performance**: Efficient bulk operations and streaming support
- ✅ **Trigger Support**: Queue trigger node for real-time message processing

## Documentation

A detailed guide for advanced R2 usage is available in the repository:

- [Cloudflare R2 Advanced Guide](./R2 guide.md) - In-depth look at architecture, authentication, and operations.

## Examples

### Upload File to R2

```text
HTTP Request → CloudflareR2 (Upload) → Success Response
```

### Process Queue Messages

```text
CloudflareQueue Trigger → Code Node → CloudflareQueue (Acknowledge)
```

### Store Data in KV

```text
Code Node → CloudflareKV (Set) → Email Node
```

## Requirements

- n8n version 0.198.0 or higher
- Node.js 20.15.0 or higher
- Valid Cloudflare account with API access

## Troubleshooting

### 🚨 Common Issues

#### Queue Operations Return 403 Forbidden
```
Error: Request failed with status code 403
```
**Solution:** Cloudflare Queues requires a paid Workers plan. [Upgrade your account](https://dash.cloudflare.com/YOUR_ACCOUNT_ID/workers/plans) or visit your [Queue dashboard](https://dash.cloudflare.com/YOUR_ACCOUNT_ID/workers/queues).

#### R2 Authentication Errors
```
Error: The AWS Access Key Id you provided does not exist in our records
```
**Solution:** R2 requires S3-compatible API tokens, not regular Cloudflare tokens. Create one at the [R2 Token page](https://developers.cloudflare.com/r2/api/tokens/).

#### Invalid Account ID
```
Error: Unknown account identifier
```
**Solution:** Double-check your Account ID in the Cloudflare dashboard sidebar. It should be a 32-character hexadecimal string.

#### Token Permission Errors
```
Error: API token does not have the required permissions
```
**Solution:** Verify that the token you're using has the right permissions for the service you want to use it for. You can use the preconfigured links provided [above](#1-user-level-tokens-recommended-for-most-services).

### 📖 Additional Resources

- [Cloudflare API Documentation](https://developers.cloudflare.com/api/)
- [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [R2 API Tokens Guide](https://developers.cloudflare.com/r2/api/tokens/)
- [D1 Database Limits](https://developers.cloudflare.com/d1/platform/limits/)

## Support

- [GitHub Issues](https://github.com/dsfaccini/n8n-nodes-cloudflare/issues)
- [n8n Community Forum](https://community.n8n.io/)

## License

n8n original + MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the cloudflare and n8n communities
