#!/bin/bash
set -e

# Get package info
PACKAGE_NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")
ARCHIVE_NAME="${PACKAGE_NAME}-${VERSION}.tar.gz"

echo "Creating release for ${PACKAGE_NAME} v${VERSION}..."

# Create archive
tar -czf "${ARCHIVE_NAME}" -C dist .

# Create release
gh release create "v${VERSION}" \
  "${ARCHIVE_NAME}" \
  --title "Release v${VERSION}" \
  --notes "Automated release of ${PACKAGE_NAME} v${VERSION}" \
  --generate-notes

echo "Release created! Download with:"
echo "wget https://github.com/dsfaccini/braze-nodes/releases/download/v${VERSION}/${ARCHIVE_NAME}"
echo "Extract with: (assuming folder exists)"
echo "tar -xzf ${ARCHIVE_NAME} -C ${PACKAGE_NAME}"
# Cleanup
rm "${ARCHIVE_NAME}"
