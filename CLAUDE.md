# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package focused on developing nodes for Braze CRM platform, with priority on email sending, campaign management, and analytics endpoints.

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

- **`credentials/`** - Contains credential type definitions for authenticating with Braze CRM
- **`nodes/`** - Contains all the custom n8n node implementations for Braze CRM

These are the two main folders where all the custom n8n package code lives.

## Braze CRM Integration Requirements

### Braze Node Implementation Priority

Based on the research in `braze-research.md`, implement nodes in this order:

#### Phase 1: Core Email & Campaign Operations
1. **BrazeApi Credentials** - Authentication setup with instance selection
2. **BrazeCampaigns Node** - Campaign management (`/campaigns/*`)
3. **BrazeSendMessage Node** - Immediate message sending (`/messages/send`)

#### Phase 2: Template & Analytics
4. **BrazeEmailTemplate Node** - Template CRUD operations (`/templates/email/*`)
5. **BrazeAnalytics Node** - Performance metrics (`/campaigns/data_series`, `/sends/data_series`)

### Braze API Authentication

- **REST API Keys**: Bearer token authentication
- **Instance Support**: US-01 to US-08, US-10, EU-01, EU-02, AU-01, ID-01
- **Dynamic Endpoints**: Construct URLs based on instance selection
- **Rate Limiting**: 250,000 requests/hour standard, specific limits per endpoint

### GitHub Issue Tracking for Endpoint Groups

**IMPORTANT**: Create GitHub issues to track implementation progress for all Braze endpoint groups. Each issue should include:

- Endpoint group name (from `braze-all-endpoint-groups.png`)
- Implementation status (Priority 1-4 or Complete)
- List of specific API endpoints to implement
- Links to relevant Braze API documentation
- Acceptance criteria for completion

**Endpoint Groups to Track**:
- ✅ Campaigns (Priority 1)
- ✅ Send Messages (Priority 1)
- ✅ Email Templates (Priority 1)
- ✅ Analytics (Priority 1)
- ⏳ Canvas (Priority 2)
- ⏳ Email List (Priority 2)
- ⏳ User Data (Priority 2)
- ⏳ Segments (Priority 2)
- ⏳ Custom Events (Priority 3)
- ⏳ Purchases (Priority 3)
- ⏳ Content Blocks (Priority 3)
- ⏳ Subscription Groups (Priority 3)
- ⏳ Catalogs (Future)
- ⏳ KPI (Future)
- ⏳ Preference Center (Future)
- ⏳ Schedule Messages (Future)
- ⏳ SMS (Future)
- ⏳ SCIM (Future)
- ⏳ SDK Authentication (Future)
- ⏳ Live Activity (Future)
- ⏳ Cloud Data Ingestion (Future)

### Braze Node UI/UX Guidelines

- **Make parameters optional by default**: Use n8n's `collection` type for optional parameters - don't show fields unless needed. Required fields pollute the UI.
- **Read API docs carefully**: Braze API parameters can often be used together (not mutually exclusive) - verify actual API behavior before implementing exclusivity logic.
- **Simplify initial UI**: Hide advanced options (like plain text body for emails) that have API defaults, use sensible dropdown defaults, and group related optional parameters in collections.

**Reference Example**: The BrazeSendMessage node demonstrates optimal UI design with targeting parameters grouped in an optional collection and advanced email options hidden by default.

### Braze Error Handling Patterns

Implement enhanced error handling to extract meaningful error messages from Braze API:

```typescript
} catch (error: any) {
  // Extract Braze API error message according to their response structure
  let errorMessage = error.response?.data?.errors?.[0]?.message ||
                    error.response?.data?.message ||
                    error.message;

  if (this.continueOnFail()) {
    returnData.push({
      json: {
        error: errorMessage,
        originalError: error.message,
        httpCode: error.httpCode,
        brazeErrorCode: error.response?.data?.errors?.[0]?.code,
      },
      pairedItem: { item: i },
    });
    continue;
  }

  // Create enhanced error for throw
  const enhancedError = new Error(errorMessage);
  (enhancedError as any).httpCode = error.httpCode;
  (enhancedError as any).originalError = error.message;
  (enhancedError as any).brazeErrorCode = error.response?.data?.errors?.[0]?.code;
  throw enhancedError;
}
```

---

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

## Parameter Definition Best Practices

### Avoiding Parameter Name Conflicts

When multiple resources use similar parameters, ensure unique naming or proper displayOptions:

```typescript
// Bad: Both bucket and object operations use 'bucketName'
// Good: Use specific displayOptions to avoid conflicts
{
  displayName: 'Bucket Name',
  name: 'bucketName',
  displayOptions: {
    show: {
      resource: ['object'],
      operation: ['upload', 'download', 'delete', 'list'],
    },
    hide: {
      operation: ['copy'], // Explicitly hide for operations with different parameters
    },
  },
}
```

### Common Service Limitations

This section is to document any limitations specific to certain endpoints. Needs to be reflected in the `README.md` for the users.
