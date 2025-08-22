# Changelog

All notable changes to this project will be documented in this file.

## [0.2.1] - 2025-08-22

### Enhanced Error Handling 🚀
- **All Cloudflare Nodes**: Implemented comprehensive error handling across CloudflareKV, CloudflareR2, CloudflareD1, and CloudflareAI nodes
    - Now extracts actual Cloudflare API error messages instead of generic axios errors
    - Users see meaningful error messages (e.g., "A namespace with this title already exists") instead of "Request failed with status code 400"
    - Added enhanced error details including `originalError` and `httpCode` for debugging
    - Provides actionable feedback for troubleshooting issues

### Fixed Parameter Descriptions ✅
- **CloudflareKV**: Corrected expiration and TTL parameter descriptions to prevent user confusion
    - **Expiration**: Now correctly described as "Absolute expiration time as UNIX timestamp (seconds since epoch)"
    - **ExpirationTtl**: Clarified as "Time to live in seconds from now (relative expiration time)"
    - Added mutual exclusivity documentation explaining users should choose one or the other
    - Updated placeholder values to show realistic examples

### UI/UX Improvements 🎨
- **CloudflareR2**: Fixed duplicate "Bucket Name" field issue in Copy Object operation
    - Added explicit `hide` condition to prevent parameter conflicts
    - Copy operation now shows only relevant parameters: Source Bucket, Source Key, Destination Bucket, Destination Key
- **CloudflareR2**: Enhanced bucket deletion with helpful error messages
    - Added specific 409 error handling explaining bucket must be completely empty
    - Updated operation description to warn about empty bucket requirement
    - Provides guidance for resolving common deletion issues

### Documentation 📚
- **README**: Added important note about R2 bucket deletion limitations
- **Node Descriptions**: Added Cloudflare API documentation links for better user guidance
- **Parameter Help**: Improved descriptions across all nodes for clarity

### Testing & Validation ✅
- **Starter Workflows**: All R2, KV, and D1 starter templates are fully tested and functional
- **Error Scenarios**: Verified enhanced error handling works correctly with real Cloudflare API responses
- **Build Process**: Confirmed all changes compile successfully and maintain compatibility

## [0.2.0] - 2025-01-22

### Fixed
- **Build Breaking Issue**: Fixed CloudflareKV naming inconsistency (CloudflareKv → CloudflareKV) that prevented package installation (#1)
- **Authentication**: Fixed credential display configuration across all nodes
- **HTTP Requests**: Replaced deprecated `uri` with `url` in all HTTP request configurations
- **Icons**: Updated CloudflareKV and CloudflareQueue SVG icons to properly reflect their respective services

### Added
- **AWS SDK Support**: Reintroduced AWS SDK for generating presigned URLs for R2 operations
- **Webpack Bundling**: Added webpack configuration to properly bundle dependencies into nodes
- **Starter Templates**: Created starter workflow templates for each node to help new users get started quickly
		- [R2 Starter Template](starter-templates/r2-starter.json)
		- [KV Starter Template](starter-templates/kv-starter.json)  
		- [Queue Starter Template](starter-templates/queue-starter.json)
		- [D1 Starter Template](starter-templates/d1-starter.json)
		- [AI Starter Template](starter-templates/ai-starter.json)
- **Documentation**: 
		- Expanded docs to clarify the different API key requirements (R2 vs other services)
		- Added explanation of User API keys vs Account API keys
		- Added note about Cloudflare Queues requiring a paid Workers plan

### Testing
- All nodes have been tested locally with test workflows
- Created test flows for each Cloudflare service (R2, KV, Queues, D1, AI)

### Released
- Successfully published updated package to npm
- Verified installation through n8n UI works correctly

---

Thanks to @DanielAGW for the comprehensive patch fixing the KV issues and to everyone who reported the installation problems. The nodes are now fully functional and available for installation.
