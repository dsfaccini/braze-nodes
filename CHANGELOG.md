# Changelog

All notable changes to this project will be documented in this file.

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