#!/bin/bash

# Exit on error
set -e

# Load NPM_TOKEN from .env file
if [ -f .env ]; then
    echo "📋 Loading NPM_TOKEN from .env..."
    export NPM_TOKEN=$(grep '^NPM_TOKEN=' .env | cut -d '=' -f2)
    if [ -z "$NPM_TOKEN" ]; then
        echo "⚠️  Warning: NPM_TOKEN not found in .env file"
    fi
else
    echo "⚠️  Warning: .env file not found"
fi

echo "🚀 Starting n8n-nodes-braze publish process..."

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
