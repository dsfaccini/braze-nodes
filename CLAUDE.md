# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package forked from the n8n node starter repository, focused on developing nodes for Cloudflare services including R2 (object storage), D1 (serverless SQL database), and AI modules.

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

## Architecture Overview

### Node Structure
- Nodes are located in `nodes/[NodeName]/[NodeName].node.ts`
- Each node implements the `INodeType` interface from `n8n-workflow`
- Nodes must be registered in `package.json` under `n8n.nodes`
- Icons (.svg or .png) should be placed alongside the node file
- Use `requestDefaults` for API base configuration

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

## n8n Node Patterns

- Use `displayName` for UI and `name` for internal reference
- Implement `resource` and `operation` pattern for organizing actions
- Properties can be separated into description files for clarity
- Use `typeOptions: { password: true }` for sensitive credential fields
- Include `usableAsTool: true` for nodes that can be used as tools