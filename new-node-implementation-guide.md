# New Node Implementation Guide

This guide outlines the step-by-step process for implementing new Braze API endpoints in the n8n Braze nodes package, based on our successful implementation of high-priority endpoints.

## Node Architecture Principles

Before implementing any new operation, ensure you understand the fundamental architecture:

1. **One node per API endpoint group**: Each Braze API endpoint group (see `braze-all-endpoint-groups.png`) must have its own dedicated node
2. **Operations stay within their API group**: Never add operations from one API group to a node dedicated to another group
3. **Check existing nodes first**: Verify if a node already exists for your API group before creating a new one

Examples of correct node-to-API mappings:
- BrazeCanvas → Canvas endpoints only
- BrazeSegments → Segments endpoints only
- BrazeContentBlocks → Content Blocks endpoints only
- BrazeAnalytics → Analytics endpoints only (time-series data, like /data-series endpoints and similar)

## Overview

The implementation process follows a structured approach: Research → Implementation → Testing → Documentation. This ensures consistent code quality and maintains the existing patterns established in the codebase.

## Step-by-Step Process

### **Step 1: Review Current Status & Planning**

1. **Identify target endpoints** from `issue-missing-endpoints.md`
2. **Check priority level** (HIGH, MEDIUM, LOW)
3. **Verify the operation belongs in the target node** by checking against `braze-all-endpoint-groups.png`
4. **If the API group doesn't have a node yet**, create a new node instead of adding to an existing one
5. **Determine target node** (BrazeCampaigns, BrazeSendMessage, BrazeEmailTemplate, BrazeAnalytics, BrazeCanvas, BrazeSegments, BrazeContentBlocks)
6. **Verify endpoint documentation** exists in `/braze-api-docs/` folder

### **Step 2: Research & Documentation**

#### **A. Check Existing Documentation**
```bash
ls braze-api-docs/ | grep -i [endpoint-name]
```

#### **B. Create Missing Documentation (if needed)**
1. **Spin up research agent** with general-purpose subagent
2. **Use MCP tools** to search Braze API documentation
3. **Create markdown file** following existing format pattern
4. **Required sections**: Overview, Endpoint Details, Authentication, Request Parameters, Response Format, Rate Limits, Error Handling, Example Usage, References

#### **C. Documentation File Naming Convention**
```
[resource]_[method]_[endpoint].md
Examples:
- campaigns_post_trigger_schedule.md
- messages_post_schedule.md
- canvas_get_data_series.md
- segments_get_list.md
```

### **Step 3: Implementation Process**

#### **A. Add Operation to Node File**

1. **Edit main node file** (e.g., `BrazeAnalytics.node.ts`)
2. **Add to options array** in alphabetical order:
```typescript
{
    name: 'Canvas Analytics',
    value: 'canvasAnalytics',
    description: 'Get time-series analytics data for Canvas campaigns',
    action: 'Get Canvas analytics',
}
```

#### **B. Implement Execution Logic**

1. **Add else if block** in `execute()` function:
```typescript
} else if (operation === 'canvasAnalytics') {
    // GET /canvas/data_series
    const canvasId = this.getNodeParameter('canvasId', i) as string;
    const length = this.getNodeParameter('length', i, 14) as number;
    const endingAt = this.getNodeParameter('endingAt', i, undefined) as string;

    const queryParams = [
        `canvas_id=${encodeURIComponent(canvasId)}`,
        `length=${length}`,
    ];
    if (endingAt) {
        queryParams.push(`ending_at=${encodeURIComponent(endingAt)}`);
    }

    requestOptions.url = `${baseURL}/canvas/data_series?${queryParams.join('&')}`;
}
```

2. **Follow existing patterns**:
   - Parameter extraction with proper defaults
   - URL construction with query parameters
   - Use `encodeURIComponent()` for user input
   - Maintain existing error handling (already implemented)

#### **C. Add Field Definitions**

1. **Edit description file** (e.g., `BrazeAnalyticsDescription.ts`)
2. **Add new operation-specific fields**:
```typescript
{
    displayName: 'Canvas ID',
    name: 'canvasId',
    type: 'string',
    required: true,
    default: '',
    description: 'Canvas API identifier',
    displayOptions: {
        show: {
            operation: ['canvasAnalytics'],
        },
    },
}
```

3. **Update existing fields** to include new operation:
```typescript
// Update common fields to include new operation
operation: ['campaignAnalytics', 'sendAnalytics', 'customEvents', 'revenue', 'purchaseAnalytics', 'canvasAnalytics']
```

### **Step 4: Quality Checks**

#### **A. Build & Compile**
```bash
npm run build
```
- Uses TypeScript compiler directly (no webpack)
- Check for TypeScript compilation errors
- Fix any type issues or missing imports
- Note: `gulp build:icons` runs automatically to copy SVG files

#### **B. Linting**
```bash
npm run lint
npm run lintfix  # Auto-fix what's possible
```

#### **C. Critical Linting Rules**
- **Alphabetical ordering**: Operations must be alphabetically sorted
- **Proper casing**: Actions should be sentence case
- **Consistent naming**: Follow existing patterns

#### **D. Manual Checks**
- Verify operation names are alphabetically ordered
- Ensure parameter names follow camelCase convention
- Check displayOptions logic for proper field showing/hiding

### **Step 5: Documentation Updates**

#### **A. Update Issue Tracking**
In `issue-missing-endpoints.md`:
```markdown
- ✅ **GET `/canvas/data_series`** - Canvas analytics
  - **Purpose**: Get time-series analytics data for Canvas campaigns
  - **Status**: ✅ IMPLEMENTED as `canvasAnalytics` operation
```

#### **B. Update README.md**
1. **Add operation** to relevant node section:
```markdown
- **Canvas Analytics**: Get time-series analytics data for Canvas campaigns
```

2. **Update Key Features** section if needed
3. **Add required permissions**:
```markdown
- `canvas.data_series` - For Canvas analytics
```

4. **Update Detailed API Coverage** section

## Implementation Patterns & Best Practices

### **Parameter Handling**
```typescript
// Required parameters - no default
const campaignId = this.getNodeParameter('campaignId', i) as string;

// Optional parameters with defaults
const length = this.getNodeParameter('length', i, 14) as number;
const endingAt = this.getNodeParameter('endingAt', i, undefined) as string;
```

### **URL Construction**
```typescript
const queryParams = [`required_param=${encodeURIComponent(value)}`];
if (optionalParam) {
    queryParams.push(`optional_param=${encodeURIComponent(optionalParam)}`);
}
requestOptions.url = `${baseURL}/endpoint?${queryParams.join('&')}`;
```

### **Field Display Logic**
```typescript
displayOptions: {
    show: {
        operation: ['specificOperation'],
    },
    hide: {
        broadcast: [true], // Hide when broadcast is enabled
    },
}
```

### **Error Handling**
The existing error handling pattern extracts Braze-specific error messages:
```typescript
// Already implemented in all nodes - no changes needed
let errorMessage =
    error.response?.data?.errors?.[0]?.message ||
    error.response?.data?.message ||
    error.message;
```

## Common Implementation Patterns

### **Analytics Endpoints (GET)**
- Use existing common fields: `length`, `endingAt`, `appId`
- Add specific ID field (campaignId, canvasId, segmentId)
- Query parameter construction pattern
- Time-series data response format

### **Message Endpoints (POST)**
- Request body construction with conditional fields
- Targeting options (broadcast, recipients, audience)
- Support for multiple message channels
- Scheduling options (time, inLocalTime, atOptimalTime)

### **Management Endpoints (CRUD)**
- Resource ID parameters
- Optional filtering and pagination
- Create/update operations with content validation
- List operations with pagination support

## Testing Checklist

- [ ] TypeScript compilation succeeds (`npm run build`)
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] Operations are alphabetically sorted
- [ ] Required fields are properly marked
- [ ] Optional fields have sensible defaults
- [ ] DisplayOptions logic works correctly
- [ ] Parameter names follow camelCase
- [ ] API documentation exists and is referenced
- [ ] README.md reflects new functionality
- [ ] Issue tracking updated

## Troubleshooting Common Issues

### **Linting Errors**
- **"Alphabetize by name"**: Reorder operations alphabetically
- **"Change to sentence case"**: Update action descriptions
- **"Missing required parameter"**: Add required fields or defaults

### **TypeScript Errors**
- **Missing imports**: Add required n8n-workflow imports
- **Type mismatches**: Ensure parameter types match usage
- **Property access**: Use optional chaining for nested objects

### **Runtime Issues**
- **Parameter not found**: Check field name consistency
- **URL construction**: Verify encodeURIComponent usage
- **API errors**: Check endpoint URL and required parameters

## Example Implementation: Canvas Analytics

See `nodes/BrazeAnalytics/BrazeAnalytics.node.ts` lines ~200+ and `nodes/BrazeAnalytics/BrazeAnalyticsDescription.ts` for the complete Canvas Analytics implementation following this guide.

---

This guide represents the battle-tested process used to successfully implement all HIGH priority endpoints and ensures consistency across the Braze nodes package.
