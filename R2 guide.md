# Cloudflare R2 Advanced Guide

This guide provides a deep dive into the architecture, authentication, and operations of the Cloudflare R2 node.

## 1. Architecture & Request Flow

The R2 node uses a hybrid approach for handling API requests. Most operations use a custom, lightweight implementation of the AWS Signature v4 signing process. For generating presigned URLs, the node leverages the official AWS SDK to ensure maximum compatibility and correctness.

The diagram below illustrates the complete request flow, including the decision point for handling presigned URLs.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    N8N WORKFLOW                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                       │
│  │   HTTP      │    │    Code     │    │Cloudflare R2│    │   Email     │                       │
│  │  Request    │───▶│    Node     │───▶│    Node     │───▶│    Node     │                       │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘                       │
└─────────────────────────────────────────────────┼───────────────────────────────────────────────┘
                                                  │
                          ┌───────────────────────▼───────────────────────┐
                          │         OPERATION IS PRESIGNED URL?           │
                          └───────────────────────┬───────────────────────┘
                                     ┌────────────┴────────────┐
                                    NO                         YES
                                     │                          │
               ┌─────────────────────▼──────────────────┐  ┌────▼───────────────────────────┐
               │      AWS SIGNATURE V4 MODULE           │  │      AWS SDK (S3 Presigner)    │
               │      (Custom Implementation)           │  │                                │
               │                                        │  │  • Instantiates S3Client       │
               │  ┌─────────────────────┐              │  │  • Creates GetObjectCommand or │
               │  │  1. Canonical       │              │  │    PutObjectCommand            │
               │  │     Request         │              │  │  • Calls getSignedUrl()        │
               │  └─────────┬───────────┘              │  │  • Returns generated URL string│
               │            │                          │  └────┬───────────────────────────┘
               │  ┌─────────▼───────────┐              │       │
               │  │  2. String to Sign  │              │       │
               │  └─────────┬───────────┘              │       │
               │            │                          │       │
               │  ┌─────────▼───────────┐              │       │
               │  │  3. Signing Key     │              │       │
               │  └─────────┬───────────┘              │       │
               │            │                          │       │
               │  ┌─────────▼───────────┐              │       │
               │  │  4. Signature       │              │       │
               │  └─────────┬───────────┘              │       │
               │            │                          │       │
               │  ┌─────────▼───────────┐              │       │
               │  │  5. Authorization   │              │       │
               │  │     Header          │              │       │
               │  └─────────┬───────────┘              │       │
               └────────────┬──────────────────────────┘       │
                            │                                  │
┌───────────────────────────▼──────────────────────────┐       │
│                 NATIVE FETCH REQUEST                 │       │
└───────────────────────────┬──────────────────────────┘       │
                            │                                  │
                            └─────────────────┐   ┌────────────┘
                                              │   │
            ┌─────────────────────────────────▼───▼─────────────────────────────────┐
            │                        CLOUDFLARE R2 API / END USER                   │
            └─────────────────────────────────┴───┴─────────────────────────────────┘
```

## 2. Authentication Deep Dive (AWS Signature v4)

Cloudflare R2 uses the S3-compatible API, which requires requests to be authenticated using the **AWS Signature Version 4** protocol. This process ensures the identity of the requester and the integrity of the data in transit.

The signing process involves five key steps:

1.  **Canonical Request**: Create a standardized string representation of the HTTP request.
2.  **String to Sign**: Combine the algorithm, timestamp, scope, and a hash of the canonical request.
3.  **Signing Key**: Derive a temporary signing key from your Secret Access Key. This key is specific to the date, region, and service.
4.  **Signature**: Calculate the signature by creating an HMAC-SHA256 hash of the "String to Sign" with the derived "Signing Key".
5.  **Authorization Header**: Add the calculated signature to the `Authorization` header of the HTTP request.

## 3. Complete Operations Matrix

The following tables detail all available operations for Buckets and Objects and whether they require authentication.

### Bucket Operations

| Operation | HTTP Method | Endpoint | Authentication Required |
| :--- | :--- | :--- | :--- |
| List Buckets | GET | `/` | ✅ Always |
| Create Bucket | PUT | `/{bucket}` | ✅ Always |
| Delete Bucket | DELETE | `/{bucket}` | ✅ Always |
| Get Bucket Info | GET | `/{bucket}` | ✅ Always |

> **Note**: All bucket operations are account-level and always require authentication.

### Object Operations

| Operation | HTTP Method | Endpoint | Authentication Required |
| :--- | :--- | :--- | :--- |
| Upload Object | PUT | `/{bucket}/{object}` | ✅ Always |
| Download Object | GET | `/{bucket}/{object}` | ❌ Optional* |
| List Objects | GET | `/{bucket}` | ✅ Always |
| Delete Object | DELETE | `/{bucket}/{object}` | ✅ Always |
| Copy Object | PUT | `/{dest_bucket}/{dest_obj}` | ✅ Always |
| Get Presigned URL | N/A | N/A | ✅ Always |

> \* **Public Buckets**: The `Download Object` operation does not require a signature if the bucket is public and the object is publicly accessible. All write operations (upload, delete, copy) always require authentication.

### Presigned URL Flow

Generating a presigned URL is handled by the AWS SDK.

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Operation  │    │   AWS SDK   │    │  Generate   │    │  Presigned  │
│ Parameters  │───▶│  (S3Client) │───▶│ Signed URL  │───▶│     URL     │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
┌──────▼──────┐    ┌────────▼────────┐    ┌─────▼─────┐    ┌────────▼────────┐
│• GET or PUT │    │• Create S3Client│    │• SDK handles│    │• Temporary URL  │
│• Expiration │    │• Create Command │    │  signing  │    │• No creds needed│
│• Object key │    │ (GetObject...)  │    │• Returns str│   │  for access     │
└─────────────┘    └─────────────────┘    └───────────┘    └─────────────────┘
```

## 4. Access Control & Error Scenarios

The node's access control logic first checks bucket permissions, then operation types.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              ACCESS CONTROL DECISION TREE                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

          ▼             │             ▼       │       ▼             │             ▼
┌─────────────────┐     │   ┌─────────────────┐│ ┌─────────────────┐ │   ┌─────────────────┐
│   Check Bucket  │     │   │   403 Access    ││ │  Check Operation│ │   │   403 Access    │
│   Permissions   │──NO─▶   │    Denied       ││ │      Type       │──NO─▶│     Denied      │
└────────┬────────┘     │   └─────────────────┘│ └────────┬────────┘ │   └─────────────────┘
         │ YES          │                      │          │ YES      │
         ▼              │                      │          ▼          │
┌─────────────────┐     │                      │  ┌─────────────────┐│
│    Proceed      │     │                      │  │    Proceed      ││
└─────────────────┘     │                      │  └─────────────────┘│
```
