# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package forked from the n8n node starter repository, focused on developing nodes for Cloudflare services including R2 (object storage), KV (key-value storage), Queues (message queuing), D1 (serverless SQL database), and AI modules.

## Development Commands

```bash
# Install dependencies
npm install

# Build the project (compiles TypeScript and copies icons)
npm run build

# Development mode (watch for TypeScript changes)
npm run dev

# Lint the code
npm run lint

# Fix linting issues
npm run lintfix

# Format code with Prettier
npm run format

# Run before publishing (build + lint with prepublish config)
npm run prepublishOnly
```

## Important Folders

- **`credentials/`** - Contains credential type definitions for authenticating with Cloudflare services
- **`nodes/`** - Contains all the custom n8n node implementations for Cloudflare services

These are the two main folders where all the custom n8n package code lives.

### Example Nodes

The repository includes ExampleNode and HttpBin nodes from the template as examples that are helpful for development. Additional example nodes may be added as needed.

## Architecture Overview

### Node Structure

- Nodes are located in `nodes/[NodeName]/[NodeName].node.ts`
- Each node implements the `INodeType` interface from `n8n-workflow`
- Nodes must be registered in `package.json` under `n8n.nodes`
- Icons (.svg or .png) should be placed alongside the node file
- Use `requestDefaults` for API base configuration

**Important**: Be very careful with the naming of files and classes. Everything must match exactly:

- Folder name: `nodes/[NodeName]`
- File name: `[NodeName].node.ts`
- Class name: `[NodeName]`
- Registration in `package.json` must use the exact same naming

### Credentials Structure

- Credentials are in `credentials/[ServiceName]Api.credentials.ts`
- Implement `ICredentialType` interface
- Must be registered in `package.json` under `n8n.credentials`
- Include `authenticate` property for request authentication
- Add `test` property for credential validation

### Build Process

- TypeScript compiles to `dist/` directory
- Gulp task copies icons to dist structure
- Only `dist/` folder is published to npm
- Source maps and declarations are generated

## Cloudflare Integration Requirements

### R2 Node

- Support all REST operations (list, get, create, delete)
- Option to create bucket if it doesn't exist
- Handle private/public bucket configuration
- Note: R2 buckets are private by default

### D1 Node

- CRUD operations for serverless SQL database
- Similar to existing Supabase/SQL database nodes
- Handle D1-specific connection patterns

### AI Modules Node

- Integrate with Cloudflare AI services
- Support completions, image generation, and transcription
- Handle multiple model options

### CloudflareKV Node (Implemented)

#### Namespace Operations

- **List**: Lists all KV namespaces in the account
- **Create**: Creates a new KV namespace with a title
- **Delete**: Deletes a KV namespace by ID

#### Key-Value Operations

- **Get**: Retrieves a single value by key (with metadata support)
- **Set**: Stores a value with optional expiration, TTL, and metadata
- **Delete**: Deletes a single key-value pair
- **List Keys**: Lists all keys with optional prefix filtering and pagination
- **Get Multiple**: Retrieves multiple values by comma-separated keys
- **Set Multiple**: Bulk sets multiple key-value pairs with individual settings
- **Delete Multiple**: Bulk deletes multiple keys

#### Key Features

- Metadata support for storing arbitrary JSON with each key-value pair
- TTL and absolute expiration time support
- Proper URL encoding for special characters in keys
- Bulk operations for efficiency
- Cursor-based pagination for listing keys
- Prefix filtering capabilities

### CloudflareQueue Nodes (Implemented)

#### Queue Management Operations

- **List**: Lists all queues in the account
- **Create**: Creates a new queue with configurable settings
- **Update**: Updates queue settings
- **Delete**: Deletes a queue
- **Get Info**: Retrieves information about a specific queue

#### Message Operations

- **Send**: Sends a single message with optional delay
- **Send Batch**: Sends multiple messages in a single request
- **Pull**: Pulls messages with configurable batch size and visibility timeout
- **Acknowledge**: Acknowledges processed messages by lease IDs
- **Retry**: Retries failed messages with optional delay

#### Queue Configuration Options

- Delivery delay for messages
- Message retention period (default: 4 days)
- Maximum retry attempts
- Dead letter queue configuration

#### CloudflareQueue Trigger Node

- Polling-based message consumption
- Auto-acknowledgment option for successful messages
- Exponential backoff retry logic (capped at 5 minutes)
- Configurable polling interval (minimum 5 seconds)
- Batch message pulling (1-100 messages)
- Visibility timeout configuration
- Manual trigger support for testing
- Graceful error handling and recovery

## n8n Node Patterns

- Use `displayName` for UI and `name` for internal reference
- Implement `resource` and `operation` pattern for organizing actions
- Properties can be separated into description files for clarity
- Use `typeOptions: { password: true }` for sensitive credential fields
- Include `usableAsTool: true` for nodes that can be used as tools

## Development Best Practices

### The Review Loop

When creating or modifying nodes, use the "review loop" to verify your implementation:

1. Double-check naming consistency:

Check that the names between folder, file, class and package.json registration are consistent and follow the n8n naming convention required to be able to be installed and used in n8n.

2. Validate implementation details:

- Use subagents to verify code correctness and safety
- When uncertain about n8n node implementation patterns, use the REF mcp to get n8n documentation
- Perform web searches for specific implementation areas when needed

Example validation prompt: "For my custom n8n node I was asked to implement [task definition], I wrote the following code: [code snippet]. Will the code work correctly, is it safe? If you have conflicting knowledge on the correct implementation of a custom n8n node use the REF mcp to get documentation about n8n or do a websearch for the specific area"
