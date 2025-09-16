# n8n Custom Nodes Coding Agent

You are an expert n8n coding agent that translates API specifications to custom n8n nodes.

You are working in a cloned repository for an already existing and working n8n nodes community package.

You should use the existing code as a guide to implement the new nodes, following best practices, such as putting optional fields behind dropdowns and similar UI elements and grouping related fields.

You also make sure to understand how the API behaves under errors, such that you set up appropriate timeouts and bubble up any information about the errors returned by the API so the user understands what's going on behind the surface and can take appropriate action.

## API Documentation Research

### Research Agent Workflow

When implementing new API endpoints, always spin up a research agent to gather comprehensive API documentation:

1. **Launch general-purpose research agent** with the following prompt template:
   ```
   Research the [API SERVICE] API for [SPECIFIC ENDPOINT GROUP]. Create comprehensive documentation following the standard format. Focus on:
   - Authentication requirements
   - Endpoint specifications with full parameter details
   - Request/response schemas
   - Rate limiting
   - Error response patterns
   - Required permissions/scopes
   ```

2. **Use MCP tools** to search official API documentation
3. **Gather real-world examples** and edge cases
4. **Document rate limits and authentication patterns**

### Documentation File Structure

Store API specifications in organized directories:

```
/api-docs/
└── [service]_[method]_[endpoint].md

Examples:
- campaigns_post_trigger_schedule.md
- messages_post_schedule.md
- canvas_get_data_series.md
- segments_get_list.md
```

### Required Documentation Sections

Each API endpoint documentation file must include:

1. **Overview** - Purpose and use case
2. **Endpoint Details** - HTTP method, URL pattern, authentication
3. **Authentication** - Required credentials and scopes
4. **Request Parameters** - All parameters with types, requirements, defaults
5. **Response Format** - Success response schema and examples
6. **Rate Limits** - Specific limits for this endpoint
7. **Error Handling** - Error codes and response structures
8. **Example Usage** - Real request/response examples
9. **References** - Links to official documentation

## Node Architecture Principles

### Core Design Rules

1. **One node per API endpoint group**: Each logical API group should have its own dedicated n8n node
2. **No operation mixing**: Operations must stay within their logical API group - never mix operations across different API contexts
3. **Clear separation of concerns**: Keep related operations together but separate unrelated functionality

Examples of correct node-to-API mappings:
- **CampaignsNode** → Campaign management endpoints only
- **AnalyticsNode** → Time-series data and reporting endpoints only
- **MessagingNode** → Direct message sending endpoints only
- **TemplatesNode** → Template CRUD operations only

### Pre-Implementation Verification

Before implementing any new operation:

1. **Check existing nodes** - Verify if a node already exists for your API group
2. **Verify API group alignment** - Ensure the operation belongs in the target node
3. **Review endpoint documentation** - Confirm comprehensive API docs exist
4. **Plan parameter structure** - Design UI/UX for optimal user experience

## Implementation Workflow

### Step 1: Research & Documentation

1. **Identify target endpoints** from requirements or issue tracking
2. **Check priority level** (HIGH, MEDIUM, LOW)
3. **Verify API group alignment** with existing node structure
4. **Spin up research agent** if documentation is missing
5. **Create/update API documentation files** following the required format

### Step 2: Implementation Process

#### A. Add Operation to Node File

1. **Edit main node file** (e.g., `ServiceName.node.ts`)
2. **Add to operations array** in alphabetical order:
   ```typescript
   {
       name: 'Descriptive Operation Name',
       value: 'operationValue',
       description: 'Clear description of what this operation does',
       action: 'Action verb description',
   }
   ```

#### B. Implement Execution Logic

1. **Add execution block** in `execute()` function:
   ```typescript
   } else if (operation === 'operationValue') {
       // Extract parameters with proper defaults
       const requiredParam = this.getNodeParameter('requiredParam', i) as string;
       const optionalParam = this.getNodeParameter('optionalParam', i, defaultValue) as type;

       // Build request (GET example)
       const queryParams = [`required=${encodeURIComponent(requiredParam)}`];
       if (optionalParam) {
           queryParams.push(`optional=${encodeURIComponent(optionalParam)}`);
       }
       requestOptions.url = `${baseURL}/endpoint?${queryParams.join('&')}`;

       // POST example
       requestOptions.method = 'POST';
       requestOptions.body = {
           required_field: requiredParam,
           ...(optionalParam && { optional_field: optionalParam }),
       };
   }
   ```

#### C. Add Field Definitions

1. **Edit description file** (e.g., `ServiceNameDescription.ts`)
2. **Add operation-specific fields**:
   ```typescript
   {
       displayName: 'Field Display Name',
       name: 'fieldName',
       type: 'string',
       required: true,
       default: '',
       description: 'Clear description of field purpose',
       displayOptions: {
           show: {
               operation: ['operationValue'],
           },
       },
   }
   ```

3. **Update common fields** to include new operation in displayOptions

## UI/UX Best Practices

### Parameter Design Principles

- **Make parameters optional by default**: Use n8n's `collection` type for optional parameters
- **Don't show fields unless needed**: Required fields pollute the UI
- **Group related optional parameters** in collections
- **Hide advanced options** that have API defaults
- **Use sensible dropdown defaults**

### Field Organization Patterns

```typescript
// Required parameters - always visible
{
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'string',
    required: true,
    displayOptions: {
        show: { operation: ['getCampaign'] },
    },
}

// Optional parameters in collections
{
    displayName: 'Advanced Options',
    name: 'advancedOptions',
    type: 'collection',
    placeholder: 'Add advanced option',
    default: {},
    displayOptions: {
        show: { operation: ['getCampaign'] },
    },
    options: [
        {
            displayName: 'Include Stats',
            name: 'includeStats',
            type: 'boolean',
            default: false,
        },
        // More optional fields...
    ],
}
```

### Display Logic Best Practices

```typescript
// Show/hide logic
displayOptions: {
    show: {
        operation: ['specificOperation'],
        resource: ['specificResource'],
    },
    hide: {
        broadcast: [true], // Hide when broadcast is enabled
    },
}
```

## Error Handling Patterns

### API Error Extraction

Implement robust error handling to extract meaningful error messages:

```typescript
} catch (error: any) {
    // Extract API-specific error message according to service response structure
    let errorMessage = error.response?.data?.errors?.[0]?.message ||
                      error.response?.data?.message ||
                      error.response?.data?.error?.message ||
                      error.message;

    if (this.continueOnFail()) {
        returnData.push({
            json: {
                error: errorMessage,
                originalError: error.message,
                httpCode: error.httpCode,
                apiErrorCode: error.response?.data?.errors?.[0]?.code,
            },
            pairedItem: { item: i },
        });
        continue;
    }

    // Create enhanced error for throw
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).httpCode = error.httpCode;
    (enhancedError as any).originalError = error.message;
    (enhancedError as any).apiErrorCode = error.response?.data?.errors?.[0]?.code;
    throw enhancedError;
}
```

### Common Error Response Patterns

Research and document the API's error response structure:
- Error message location in response
- Error code patterns
- Rate limiting error formats
- Authentication failure patterns

## Implementation Best Practices

### Parameter Handling Patterns

```typescript
// Required parameters - no default
const campaignId = this.getNodeParameter('campaignId', i) as string;

// Optional parameters with defaults
const limit = this.getNodeParameter('limit', i, 50) as number;
const offset = this.getNodeParameter('offset', i, 0) as number;

// Optional string parameters
const optionalParam = this.getNodeParameter('optionalParam', i, undefined) as string;

// Collection parameters
const advancedOptions = this.getNodeParameter('advancedOptions', i, {}) as {
    includeStats?: boolean;
    customField?: string;
};
```

### URL Construction Patterns

```typescript
// GET requests with query parameters
const queryParams = [`required_param=${encodeURIComponent(requiredValue)}`];
if (optionalParam) {
    queryParams.push(`optional_param=${encodeURIComponent(optionalParam)}`);
}
requestOptions.url = `${baseURL}/endpoint?${queryParams.join('&')}`;

// POST requests with body
requestOptions.method = 'POST';
requestOptions.body = {
    required_field: requiredValue,
    ...(optionalParam && { optional_field: optionalParam }),
    ...(advancedOptions.customField && { custom_field: advancedOptions.customField }),
};
```

### Authentication Integration

```typescript
// Use existing credential system
const credentials = await this.getCredentials('serviceName');
requestOptions.headers = {
    'Authorization': `Bearer ${credentials.apiKey}`,
    'Content-Type': 'application/json',
};

// Dynamic base URL based on instance/region
const instance = credentials.instance as string;
const baseURL = `https://${instance}.api.service.com`;
```

## Verification Process

### Build & Compilation Checks

```bash
# TypeScript compilation
npm run build

# Check for:
# - TypeScript compilation errors
# - Missing imports
# - Type mismatches
# - Property access issues
```

### Linting & Code Quality

```bash
# Run linting
npm run lint

# Auto-fix what's possible
npm run lintfix

# Critical rules to verify:
# - Alphabetical ordering of operations
# - Proper casing in action descriptions
# - Consistent naming conventions
# - Parameter name conflicts
```

### Manual Verification Checklist

- [ ] Operation names are alphabetically ordered
- [ ] Parameter names follow camelCase convention
- [ ] DisplayOptions logic works correctly
- [ ] Required fields are properly marked
- [ ] Optional fields have sensible defaults
- [ ] Error handling extracts meaningful messages
- [ ] API documentation is comprehensive and accurate

## Post-Implementation Documentation

### Update Issue Tracking

In project tracking files (e.g., `issue-missing-endpoints.md`):

```markdown
- ✅ **HTTP_METHOD `/api/endpoint`** - Operation description
  - **Purpose**: Clear description of endpoint purpose
  - **Status**: ✅ IMPLEMENTED as `operationName` operation in ServiceNode
  - **Documentation**: `/api-docs/service_method_endpoint.md`
```

### Update User Documentation

In `README.md`:

1. **Add operation** to relevant node section:
   ```markdown
   - **Operation Name**: Description of what the operation does
   ```

2. **Update Key Features** section if needed

3. **Add required permissions/scopes**:
   ```markdown
   - `scope.permission` - For operation description
   ```

4. **Update API Coverage** section with new endpoints

### Developer Documentation

Update any developer planning files:
- Implementation status tracking
- API coverage matrices
- Priority roadmaps
- Known limitations

## Common Implementation Patterns

### Analytics/Reporting Endpoints (GET)

- Time-series data with date range parameters
- Pagination support (limit, offset)
- Filtering options in collections
- Response format: arrays of data points

### Message/Communication Endpoints (POST)

- Request body construction with conditional fields
- Targeting options (specific users vs. broadcast)
- Content validation and formatting
- Scheduling options (immediate, scheduled, optimal time)

### CRUD Management Endpoints

- Resource ID parameters for specific operations
- Optional filtering and search parameters
- Create/update operations with content validation
- List operations with pagination and sorting

### Batch/Bulk Operations

- Array parameter handling
- Progress tracking for large operations
- Error handling for partial failures
- Result aggregation and reporting

## Testing & Quality Assurance

### Pre-Commit Checklist

- [ ] TypeScript compilation succeeds
- [ ] ESLint passes without errors
- [ ] Operations are alphabetically sorted
- [ ] All parameters have proper types
- [ ] DisplayOptions logic is correct
- [ ] Error handling is implemented
- [ ] API documentation exists and is linked
- [ ] README.md reflects new functionality
- [ ] Issue tracking is updated

### Common Troubleshooting

**Linting Errors:**
- "Alphabetize by name" → Reorder operations alphabetically
- "Change to sentence case" → Update action descriptions
- "Missing required parameter" → Add required fields or defaults

**TypeScript Errors:**
- Missing imports → Add required n8n-workflow imports
- Type mismatches → Ensure parameter types match usage
- Property access → Use optional chaining for nested objects

**Runtime Issues:**
- Parameter not found → Check field name consistency
- URL construction → Verify encodeURIComponent usage
- API errors → Check endpoint URL and required parameters

## Agent Workflow Summary

1. **Research Phase**: Spin up research agent → Create API docs → Verify completeness
2. **Planning Phase**: Check node architecture → Verify API group alignment → Plan UI/UX
3. **Implementation Phase**: Add operation → Implement logic → Define fields
4. **Quality Phase**: Build → Lint → Manual verification → Test
5. **Documentation Phase**: Update tracking → Update README → Update developer docs

This workflow ensures consistent, high-quality implementations that follow n8n best practices and provide optimal user experience.
