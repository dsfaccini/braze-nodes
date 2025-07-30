# Cloudflare Nodes for n8n

A comprehensive collection of n8n community nodes for Cloudflare services including R2 object storage, D1 serverless database, Workers AI, KV storage, and Queues.

## Available Nodes

### 🗄️ Cloudflare R2

Object storage compatible with Amazon S3 API.

**Operations:**

- **Buckets**: List, create, delete, get info
- **Objects**: Upload, download, list, delete, copy
- **URLs**: Generate presigned URLs for temporary access

### 🗃️ Cloudflare KV

Globally distributed key-value store.

**Operations:**

- **Namespaces**: List, create, delete
- **Key-Value**: Get, set, delete, list keys
- **Bulk**: Get/set/delete multiple keys at once
- **Advanced**: Expiration, metadata, prefix filtering

### 📬 Cloudflare Queue

Message queue service for asynchronous processing.

**Operations:**

- **Queue Management**: List, create, update, delete queues
- **Messages**: Send, pull, acknowledge, retry messages
- **Trigger Mode**: Auto-poll for new messages with configurable intervals

### 🤖 Cloudflare AI

Access to Cloudflare's AI/ML models.

**Operations:**

- **Text Generation**: Completions and chat models
- **Image Generation**: AI-powered image creation
- **Speech**: Transcription and text-to-speech

### 🗂️ Cloudflare D1

Serverless SQL database built on SQLite.

**Operations:**

- **Database Management**: List, create, delete databases
- **Query Execution**: Run SQL queries and commands
- **Data Operations**: CRUD operations with structured data

## Installation

Install via npm in your n8n instance:

```bash
npm install @getalecs/n8n-nodes-cloudflare
```

Or install directly in n8n:

1. Go to **Settings** > **Community Nodes**
2. Enter: `@getalecs/n8n-nodes-cloudflare`
3. Click **Install**

## Authentication

All nodes use **Cloudflare API credentials**:

1. **Standard Mode** (D1, AI, KV, Queue):
   - API Token (from Cloudflare dashboard)
   - Account ID

2. **R2 Mode** (Object Storage):
   - API Token
   - Account ID  
   - R2 Access Key ID
   - R2 Secret Access Key
   - R2 Jurisdiction (default/eu/fedramp)

### Getting Credentials

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Create API Token with required permissions:
   - **R2**: `Object Read`, `Object Write`
   - **KV**: `Zone:Zone Settings:Edit`, `Account:Cloudflare Workers KV Storage:Edit`
   - **D1**: `Account:Cloudflare D1:Edit`
   - **Queues**: `Account:Cloudflare Queues:Edit`
   - **AI**: `Account:Cloudflare AI:Read`
3. Copy your Account ID from the dashboard sidebar

## Key Features

- ✅ **Zero External Dependencies**: Uses native HTTP requests instead of heavy SDKs
- ✅ **Complete API Coverage**: Implements all major operations for each service
- ✅ **Error Handling**: Comprehensive error messages and continue-on-fail support
- ✅ **Security**: Implements AWS Signature v4 for R2 authentication
- ✅ **Performance**: Efficient bulk operations and streaming support
- ✅ **Trigger Support**: Queue trigger node for real-time message processing

## Documentation

Detailed guides available in the repository:

- [R2 Authentication Guide](./R2_AUTHENTICATION_GUIDE.md) - Why AWS Signature v4 is needed
- [R2 Operations Guide](./R2_OPERATIONS_GUIDE.md) - Complete operations matrix
- [R2 Architecture Diagram](./R2_ARCHITECTURE_DIAGRAM.md) - Visual request flow

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

## Support

- [GitHub Issues](https://github.com/n8n-community/n8n-nodes-cloudflare/issues)
- [n8n Community Forum](https://community.n8n.io/)

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the n8n community