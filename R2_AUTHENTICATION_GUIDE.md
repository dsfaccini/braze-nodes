# Cloudflare R2 Authentication Guide

## Why AWS Signature v4 is Required

Cloudflare R2 uses the **S3-compatible API**, which means it implements Amazon S3's authentication protocol: **AWS Signature Version 4**. This isn't optional—it's required by the S3 API specification that R2 follows.

### What AWS Signature v4 Provides

1. **Authentication**: Proves who you are using your Access Key ID
2. **Authorization**: Verifies you have permission using your Secret Access Key  
3. **Integrity**: Ensures the request hasn't been tampered with during transit
4. **Anti-Replay Protection**: Prevents old requests from being replayed (15-minute window)

### The Signing Process

```
Request → Canonical Request → String to Sign → Signing Key → Signature → Authenticated Request
```

#### Step-by-Step:

1. **Canonical Request**: Standardize the HTTP request format
   ```
   GET
   /bucket-name/object-key
   
   host:account-id.r2.cloudflarestorage.com
   x-amz-content-sha256:UNSIGNED-PAYLOAD
   x-amz-date:20231201T120000Z
   
   host;x-amz-content-sha256;x-amz-date
   UNSIGNED-PAYLOAD
   ```

2. **String to Sign**: Combine algorithm, timestamp, scope, and hashed canonical request
   ```
   AWS4-HMAC-SHA256
   20231201T120000Z
   20231201/auto/s3/aws4_request
   <sha256-hash-of-canonical-request>
   ```

3. **Signing Key**: Derive from secret key + date + region + service
   ```
   kDate = HMAC-SHA256("AWS4" + SecretKey, "20231201")
   kRegion = HMAC-SHA256(kDate, "auto")
   kService = HMAC-SHA256(kRegion, "s3")  
   kSigning = HMAC-SHA256(kService, "aws4_request")
   ```

4. **Signature**: HMAC-SHA256 of string-to-sign using signing key

5. **Authorization Header**:
   ```
   Authorization: AWS4-HMAC-SHA256 Credential=AKIAI.../20231201/auto/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=abc123...
   ```

## When Signature is Required

| Operation | Private Bucket | Public Bucket | Notes |
|-----------|----------------|---------------|-------|
| **List Buckets** | ✅ Required | ✅ Required | Account-level operation |
| **Create Bucket** | ✅ Required | ✅ Required | Account-level operation |
| **Delete Bucket** | ✅ Required | ✅ Required | Account-level operation |
| **Upload Object** | ✅ Required | ✅ Required | Write operations always need auth |
| **Download Object** | ✅ Required | ❌ Optional* | *If object is publicly readable |
| **List Objects** | ✅ Required | ❌ Optional* | *If bucket allows public listing |
| **Delete Object** | ✅ Required | ✅ Required | Write operations always need auth |
| **Copy Object** | ✅ Required | ✅ Required | Write operations always need auth |
| **Presigned URLs** | ✅ Required | ✅ Required | Always need auth to generate |

### Important Notes:

- **R2 buckets are private by default** - this means most operations require authentication
- **Public buckets** are rare and require explicit configuration in Cloudflare dashboard
- **Even public buckets** require authentication for write operations (upload, delete, copy)
- **Presigned URLs** always require authentication to generate them, but can be used without auth once created

## Error Scenarios

### Common Authentication Errors:

1. **403 Forbidden**: Invalid signature or expired request
2. **400 Bad Request**: Malformed signature or missing required headers
3. **404 Not Found**: Bucket/object doesn't exist OR you don't have permission to see it

### Troubleshooting:

- ✅ Check Access Key ID and Secret Access Key are correct
- ✅ Verify R2 token has correct permissions (Object Read, Object Write, etc.)
- ✅ Ensure system clock is accurate (signature includes timestamp)
- ✅ Check bucket name and object key are correct
- ✅ Verify endpoint URL matches your account ID and jurisdiction

## Security Best Practices

1. **Use R2 API Tokens** instead of Global API Keys when possible
2. **Limit token permissions** to only what's needed (principle of least privilege)
3. **Rotate tokens periodically** 
4. **Never expose tokens** in client-side code
5. **Use presigned URLs** for temporary access instead of sharing credentials
6. **Monitor token usage** in Cloudflare dashboard

## Why Not Use Simple Bearer Tokens?

You might wonder why R2 doesn't just use simple `Authorization: Bearer <token>` headers like other APIs. The answer is **S3 compatibility**:

- ✅ **Pros**: Existing S3 tools, SDKs, and knowledge work with R2
- ❌ **Cons**: Complex authentication scheme required

Cloudflare chose S3 compatibility to make migration easier, but it comes with the complexity of AWS Signature v4.