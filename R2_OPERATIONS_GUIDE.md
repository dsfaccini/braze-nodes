# Cloudflare R2 Node Operations Guide

## Architecture Overview

```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    n8n      │    │  CloudflareR2   │    │  AWS Signature  │    │  Cloudflare R2  │
│  Workflow   │───▶│     Node        │───▶│      v4         │───▶│      API        │
└─────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
                            │                        │                        │
                            │                        │                        │
                   ┌────────▼────────┐      ┌────────▼────────┐      ┌────────▼────────┐
                   │ • Validate params│      │ • Create canonical│      │ • Validate request│
                   │ • Get credentials│      │ • Generate signature│    │ • Execute operation│
                   │ • Build request  │      │ • Add auth headers │      │ • Return response │
                   └─────────────────┘      └─────────────────┘      └─────────────────┘
```

## Complete Operations Matrix

### Bucket Operations

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              BUCKET OPERATIONS                                  │
├─────────────────┬───────────────┬─────────────────┬─────────────────────────────┤
│   Operation     │   HTTP Method │   Endpoint      │   Authentication Required   │
├─────────────────┼───────────────┼─────────────────┼─────────────────────────────┤
│ List Buckets    │ GET           │ /               │ ✅ Always                   │
│ Create Bucket   │ PUT           │ /{bucket}       │ ✅ Always                   │
│ Delete Bucket   │ DELETE        │ /{bucket}       │ ✅ Always                   │
│ Get Bucket Info │ GET           │ /{bucket}       │ ✅ Always                   │
└─────────────────┴───────────────┴─────────────────┴─────────────────────────────┘
```

**Note**: All bucket operations are account-level and always require authentication.

### Object Operations

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    OBJECT OPERATIONS                                            │
├─────────────────┬───────────────┬─────────────────────┬─────────────────┬─────────────────────┤
│   Operation     │   HTTP Method │   Endpoint          │ Private Bucket  │ Public Bucket       │
├─────────────────┼───────────────┼─────────────────────┼─────────────────┼─────────────────────┤
│ Upload Object   │ PUT           │ /{bucket}/{key}     │ ✅ Required     │ ✅ Required         │
│ Download Object │ GET           │ /{bucket}/{key}     │ ✅ Required     │ ❌ Optional*        │
│ Delete Object   │ DELETE        │ /{bucket}/{key}     │ ✅ Required     │ ✅ Required         │
│ Copy Object     │ PUT           │ /{bucket}/{key}     │ ✅ Required     │ ✅ Required         │
│ List Objects    │ GET           │ /{bucket}?list-type │ ✅ Required     │ ❌ Optional*        │
│ Presigned URL   │ N/A           │ Generated URL       │ ✅ To Generate  │ ✅ To Generate      │
└─────────────────┴───────────────┴─────────────────────┴─────────────────┴─────────────────────┘
```

*Optional for public buckets/objects, but R2 buckets are private by default.

## Detailed Operation Flows

### 1. Upload Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Binary    │    │   Sign      │    │    PUT      │    │   Object    │
│    Data     │───▶│  Request    │───▶│  Request    │───▶│   Stored    │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
┌──────▼──────┐    ┌────────▼────────┐    ┌─────▼─────┐    ┌────────▼────────┐
│• Get binary │    │• Create canonical│    │• HTTP PUT │    │• Returns ETag   │
│  from n8n   │    │• Sign with v4   │    │• Body data│    │• Confirms upload│
│• Check MIME │    │• Add Content-Type│    │• Headers  │    │• Object metadata│
└─────────────┘    └─────────────────┘    └───────────┘    └─────────────────┘
```

### 2. Download Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Object    │    │    Sign     │    │    GET      │    │   Binary    │
│    Key      │───▶│  Request    │───▶│  Request    │───▶│    Data     │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
┌──────▼──────┐    ┌────────▼────────┐    ┌─────▼─────┐    ┌────────▼────────┐
│• Build path │    │• Create canonical│    │• HTTP GET │    │• Stream to Buffer│
│• Add params │    │• Sign with v4   │    │• Headers  │    │• Prepare binary │
│             │    │• Add auth header│    │           │    │• Return to n8n  │
└─────────────┘    └─────────────────┘    └───────────┘    └─────────────────┘
```

### 3. Presigned URL Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Operation  │    │   Build     │    │    Sign     │    │  Presigned  │
│ Parameters  │───▶│    URL      │───▶│    URL      │───▶│     URL     │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
┌──────▼──────┐    ┌────────▼────────┐    ┌─────▼─────┐    ┌────────▼────────┐
│• GET or PUT │    │• Construct URL  │    │• Sign URL │    │• Temporary access│
│• Expiration │    │• Add query params│    │• Add signature│   │• No further auth│
│• Object key │    │• Include expires│    │• Return URL│    │• Time-limited   │
└─────────────┘    └─────────────────┘    └───────────┘    └─────────────────┘
```

## Access Control Scenarios

### Scenario 1: Private Bucket (Default)
```
┌─────────────────────────────────────────────────────────────────┐
│                        PRIVATE BUCKET                          │
│                     (Default R2 Setting)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ❌ 403 Forbidden    ┌─────────────────────┐   │
│  │ Anonymous   │──────────────────────▶ │     All            │   │
│  │ Request     │                        │   Operations       │   │
│  └─────────────┘                        └─────────────────────┘   │
│                                                                 │
│  ┌─────────────┐    ✅ Success          ┌─────────────────────┐   │
│  │ Signed      │──────────────────────▶ │     All            │   │
│  │ Request     │                        │   Operations       │   │
│  └─────────────┘                        └─────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Scenario 2: Public Bucket (Rare)
```
┌─────────────────────────────────────────────────────────────────┐
│                         PUBLIC BUCKET                          │
│                   (Explicitly Configured)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ✅ Success          ┌─────────────────────┐   │
│  │ Anonymous   │──────────────────────▶ │  Read Operations   │   │
│  │ Request     │                        │  (GET, LIST)       │   │
│  └─────────────┘                        └─────────────────────┘   │
│                                                                 │
│  ┌─────────────┐    ❌ 403 Forbidden    ┌─────────────────────┐   │
│  │ Anonymous   │──────────────────────▶ │  Write Operations  │   │
│  │ Request     │                        │  (PUT, DELETE)     │   │
│  └─────────────┘                        └─────────────────────┘   │
│                                                                 │
│  ┌─────────────┐    ✅ Success          ┌─────────────────────┐   │
│  │ Signed      │──────────────────────▶ │     All            │   │
│  │ Request     │                        │   Operations       │   │
│  └─────────────┘                        └─────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling Matrix

| HTTP Status | AWS Error Code | Description | Node Behavior |
|-------------|----------------|-------------|---------------|
| 400 | InvalidRequest | Malformed request | Throw NodeApiError |
| 401 | InvalidAccessKeyId | Invalid credentials | Throw NodeApiError |
| 403 | AccessDenied | No permission | Throw NodeApiError |
| 403 | SignatureDoesNotMatch | Invalid signature | Throw NodeApiError |
| 404 | NoSuchBucket | Bucket not found | Throw NodeApiError |
| 404 | NoSuchKey | Object not found | Return null value |
| 409 | BucketAlreadyExists | Bucket exists | Throw NodeApiError |
| 500 | InternalError | Server error | Throw NodeApiError |

## Best Practices for n8n Users

### 1. Credential Setup
```
R2 Credentials Required:
✅ Account ID (from Cloudflare dashboard)
✅ Access Key ID (R2 API token ID)  
✅ Secret Access Key (R2 API token secret)
✅ Jurisdiction (default, eu, or fedramp)
```

### 2. Common Patterns

**File Upload Pattern:**
```
HTTP Request Node → CloudflareR2 (Upload) → Success Response
```

**File Download Pattern:**
```
CloudflareR2 (Download) → Use Binary Data → Next Node
```

**Presigned URL Pattern:**
```
CloudflareR2 (Presigned) → HTTP Request (External) → File Access
```

### 3. Performance Tips
- Use presigned URLs for large files or high-frequency access
- Implement retry logic for network issues
- Consider parallel uploads for multiple files
- Use appropriate MIME types for better browser handling

This comprehensive guide should help users understand when and why authentication is needed, and how to effectively use the R2 node in their n8n workflows!