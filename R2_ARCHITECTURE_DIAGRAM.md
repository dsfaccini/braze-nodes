# Cloudflare R2 Node Architecture Diagram

## Complete Request Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    N8N WORKFLOW                                                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      │
│  │   HTTP      │    │    Code     │    │Cloudflare R2│    │   Email     │                      │
│  │  Request    │───▶│    Node     │───▶│    Node     │───▶│    Node     │                      │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘                      │
└─────────────────────────────────────────────────┼───────────────────────────────────────────────┘
                                                  │
                                    ┌─────────────▼─────────────┐
                                    │    CLOUDFLARE R2 NODE     │
                                    │                           │
                                    │  ┌─────────────────────┐  │
                                    │  │  Parameter          │  │
                                    │  │  Validation         │  │
                                    │  │  • Resource type    │  │
                                    │  │  • Operation        │  │
                                    │  │  • Required fields  │  │
                                    │  └─────────────────────┘  │
                                    │             │             │
                                    │  ┌─────────────────────┐  │
                                    │  │  Credential         │  │
                                    │  │  Retrieval          │  │
                                    │  │  • Account ID       │  │
                                    │  │  • Access Key ID    │  │
                                    │  │  • Secret Key       │  │
                                    │  │  • Jurisdiction     │  │
                                    │  └─────────────────────┘  │
                                    │             │             │
                                    │  ┌─────────────────────┐  │
                                    │  │  Request Builder    │  │
                                    │  │  • HTTP method      │  │
                                    │  │  • Endpoint path    │  │
                                    │  │  • Headers          │  │
                                    │  │  • Body data        │  │
                                    │  └─────────────────────┘  │
                                    └─────────────┼─────────────┘
                                                  │
                          ┌───────────────────────▼───────────────────────┐
                          │            AWS SIGNATURE V4 MODULE           │
                          │                                               │
                          │  ┌─────────────────────┐                     │
                          │  │  1. Canonical       │                     │
                          │  │     Request         │                     │
                          │  │  • HTTP method      │                     │
                          │  │  • URI path         │                     │
                          │  │  • Query string     │                     │
                          │  │  • Headers          │                     │
                          │  │  • Payload hash     │                     │
                          │  └─────────────────────┘                     │
                          │             │                                 │
                          │  ┌─────────────────────┐                     │
                          │  │  2. String to Sign  │                     │
                          │  │  • Algorithm        │                     │
                          │  │  • Timestamp        │                     │
                          │  │  • Credential scope │                     │
                          │  │  • Canonical hash   │                     │
                          │  └─────────────────────┘                     │
                          │             │                                 │
                          │  ┌─────────────────────┐                     │
                          │  │  3. Signing Key     │                     │
                          │  │  • Date key         │                     │
                          │  │  • Region key       │                     │
                          │  │  • Service key      │                     │
                          │  │  • Final key        │                     │
                          │  └─────────────────────┘                     │
                          │             │                                 │
                          │  ┌─────────────────────┐                     │
                          │  │  4. Generate        │                     │
                          │  │     Signature       │                     │
                          │  │  • HMAC-SHA256      │                     │
                          │  │  • Hex encoding     │                     │
                          │  └─────────────────────┘                     │
                          │             │                                 │
                          │  ┌─────────────────────┐                     │
                          │  │  5. Authorization   │                     │
                          │  │     Header          │                     │
                          │  │  • Algorithm        │                     │
                          │  │  • Credentials      │                     │
                          │  │  • Signed headers   │                     │
                          │  │  • Signature        │                     │
                          │  └─────────────────────┘                     │
                          └───────────────────────┼───────────────────────┘
                                                  │
                    ┌─────────────────────────────▼─────────────────────────────┐
                    │                 NATIVE FETCH REQUEST                     │
                    │                                                           │
                    │  ┌─────────────────────┐    ┌─────────────────────────┐   │
                    │  │     Headers         │    │       Request           │   │
                    │  │                     │    │                         │   │
                    │  │ Authorization: AWS4 │    │ Method: GET/PUT/DELETE  │   │
                    │  │ Host: account.r2... │    │ URL: https://account... │   │
                    │  │ x-amz-date: ...     │    │ Body: binary data       │   │
                    │  │ x-amz-content-sha.. │    │                         │   │
                    │  └─────────────────────┘    └─────────────────────────┘   │
                    └─────────────────────────────┼─────────────────────────────┘
                                                  │
            ┌─────────────────────────────────────▼─────────────────────────────────────┐
            │                        CLOUDFLARE R2 API                                  │
            │                                                                           │
            │  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐ │
            │  │   Authentication    │    │     Permission      │    │    Operation    │ │
            │  │     Validation      │    │     Check           │    │    Execution    │ │
            │  │                     │    │                     │    │                 │ │
            │  │ • Verify signature  │    │ • Bucket access     │    │ • List buckets  │ │
            │  │ • Check timestamp   │    │ • Object access     │    │ • Upload file   │ │
            │  │ • Validate request  │    │ • Operation rights  │    │ • Download file │ │
            │  │                     │    │                     │    │ • Delete object │ │
            │  └─────────────────────┘    └─────────────────────┘    └─────────────────┘ │
            │             │                           │                         │         │
            │             ▼                           ▼                         ▼         │
            │  ┌─────────────────────────────────────────────────────────────────────────┐ │
            │  │                           RESPONSE                                      │ │
            │  │                                                                         │ │
            │  │  Success (200/201):          Error (4xx/5xx):                          │ │
            │  │  • JSON/XML data             • Error code                              │ │
            │  │  • Binary content            • Error message                           │ │
            │  │  • Metadata headers          • HTTP status                             │ │
            │  └─────────────────────────────────────────────────────────────────────────┘ │
            └─────────────────────────────────┼─────────────────────────────────────────────┘
                                              │
                        ┌─────────────────────▼─────────────────────┐
                        │          R2 NODE RESPONSE HANDLER        │
                        │                                           │
                        │  ┌─────────────────────┐                 │
                        │  │   Success Path      │                 │
                        │  │                     │                 │
                        │  │ • Parse XML/JSON    │                 │
                        │  │ • Extract metadata  │                 │
                        │  │ • Prepare binary    │                 │
                        │  │ • Return to n8n     │                 │
                        │  └─────────────────────┘                 │
                        │             │                             │
                        │  ┌─────────────────────┐                 │
                        │  │    Error Path       │                 │
                        │  │                     │                 │
                        │  │ • Parse error XML   │                 │
                        │  │ • Create NodeApiError│                │
                        │  │ • Include error code │                │
                        │  │ • Throw or continue  │                │
                        │  └─────────────────────┘                 │
                        └─────────────────────┼─────────────────────┘
                                              │
          ┌─────────────────────────────────▼─────────────────────────────────┐
          │                        N8N WORKFLOW CONTINUES                     │
          │                                                                   │
          │  Success Data:                     Error Handling:                │
          │  • JSON object with results        • NodeApiError thrown          │
          │  • Binary data attached           • Workflow stops (or continues  │
          │  • Metadata available             •   if continueOnFail=true)     │
          └───────────────────────────────────────────────────────────────────┘
```

## Access Control Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              ACCESS CONTROL DECISION TREE                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────┐
                                    │   R2 Request    │
                                    │    Received     │
                                    └─────────┬───────┘
                                              │
                                    ┌─────────▼───────┐
                                    │ Authentication  │
                                    │   Headers       │
                                    │   Present?      │
                                    └─────────┬───────┘
                                              │
                        ┌─────────────────────┼─────────────────────┐
                        │ YES                 │                  NO │
                        ▼                     │                     ▼
              ┌─────────────────┐             │           ┌─────────────────┐
              │    Validate     │             │           │   Check Bucket  │
              │   Signature     │             │           │   Public Access │
              └─────────┬───────┘             │           └─────────┬───────┘
                        │                     │                     │
          ┌─────────────┼─────────────┐       │       ┌─────────────┼─────────────┐
          │ VALID       │         INVALID     │       │ PUBLIC      │       PRIVATE│
          ▼             │             ▼       │       ▼             │             ▼
┌─────────────────┐     │   ┌─────────────────┐│ ┌─────────────────┐ │   ┌─────────────────┐
│   Check Bucket  │     │   │   403 Access    ││ │  Check Operation│ │   │   403 Access    │
│   Permissions   │     │   │    Denied       ││ │      Type       │ │   │     Denied      │
└─────────┬───────┘     │   └─────────────────┘│ └─────────┬───────┘ │   └─────────────────┘
          │             │                      │           │         │
          ▼             │                      │           ▼         │
┌─────────────────┐     │                      │ ┌─────────────────┐ │
│  Check Object   │     │                      │ │    Read Op?     │ │
│   Permissions   │     │                      │ │  (GET, LIST)    │ │
└─────────┬───────┘     │                      │ └─────────┬───────┘ │
          │             │                      │           │         │
          ▼             │                      │     ┌─────┼─────┐   │
┌─────────────────┐     │                      │  YES│     │     │NO │
│  Execute R2     │     │                      │     ▼     │     ▼   │
│   Operation     │     │                      │ ┌─────────────────┐ │
└─────────────────┘     │                      │ │   200 Success   │ │
                        │                      │ └─────────────────┘ │
                        │                      │                     │
                        └──────────────────────┼─────────────────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │    403 Access       │
                                    │      Denied         │
                                    │  (Write operations  │
                                    │   require auth)     │
                                    └─────────────────────┘
```

## Signature Generation Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              AWS SIGNATURE V4 GENERATION                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

Input: HTTP Method, URL, Headers, Body, Credentials
│
├─ Step 1: Create Canonical Request
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  │ GET                                                                                         │
│  │ /bucket-name/object-key                                                                     │
│  │ list-type=2&max-keys=100                                                                    │
│  │ host:12345.r2.cloudflarestorage.com                                                        │
│  │ x-amz-content-sha256:UNSIGNED-PAYLOAD                                                       │
│  │ x-amz-date:20231201T120000Z                                                                 │
│  │                                                                                             │
│  │ host;x-amz-content-sha256;x-amz-date                                                        │
│  │ UNSIGNED-PAYLOAD                                                                            │
│  └─────────────────────────────────────────────────────────────────────────────────────────────┘
│
├─ Step 2: Create String to Sign
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  │ AWS4-HMAC-SHA256                                                                            │
│  │ 20231201T120000Z                                                                            │
│  │ 20231201/auto/s3/aws4_request                                                               │
│  │ sha256_hash_of_canonical_request                                                            │
│  └─────────────────────────────────────────────────────────────────────────────────────────────┘
│
├─ Step 3: Generate Signing Key
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  │ kDate = HMAC-SHA256("AWS4" + SecretAccessKey, "20231201")                                   │
│  │ kRegion = HMAC-SHA256(kDate, "auto")                                                        │
│  │ kService = HMAC-SHA256(kRegion, "s3")                                                       │
│  │ kSigning = HMAC-SHA256(kService, "aws4_request")                                            │
│  └─────────────────────────────────────────────────────────────────────────────────────────────┘
│
├─ Step 4: Calculate Signature
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  │ signature = HMAC-SHA256(kSigning, StringToSign).hexdigest()                                 │
│  └─────────────────────────────────────────────────────────────────────────────────────────────┘
│
└─ Step 5: Add Authorization Header
   ┌─────────────────────────────────────────────────────────────────────────────────────────────┐
   │ Authorization: AWS4-HMAC-SHA256                                                             │
   │ Credential=AKIAI.../20231201/auto/s3/aws4_request,                                          │
   │ SignedHeaders=host;x-amz-content-sha256;x-amz-date,                                         │
   │ Signature=calculated_signature_value                                                        │
   └─────────────────────────────────────────────────────────────────────────────────────────────┘

Result: Authenticated HTTP request ready for Cloudflare R2
```

This architecture documentation provides a complete visual understanding of:

1. **Why AWS Signature v4 is needed** - S3 API compatibility
2. **When authentication is required** - All private bucket ops, all write ops
3. **How the signing process works** - Step-by-step cryptographic process
4. **Where errors can occur** - Authentication, authorization, and operation levels
5. **How the R2 node fits into n8n workflows** - Complete request/response flow

The diagrams show both the technical implementation details and the user-facing access control decisions, making it clear when and why certain operations succeed or fail.