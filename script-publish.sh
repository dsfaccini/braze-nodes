#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting n8n-nodes-cloudflare publish process..."

# Build the project
echo "📦 Building project..."
npm run prepublishOnly

# Prepare package.json for publishing
echo "📝 Preparing package.json..."
node scripts/prepare-package.js

# Copy necessary files to dist
echo "📄 Copying additional files..."
cp README.md dist/
cp LICENSE.md dist/

# Navigate to dist directory
cd dist

# Publish from dist directory
echo "🎉 Publishing package..."
npm publish

# Go back to root
cd ..

echo "✅ Package published successfully!"
