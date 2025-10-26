#!/bin/bash
# Production build script that includes cache version injection

set -e  # Exit on error

echo "=== Lynk Health Production Build ==="
echo ""

# Step 1: Inject build timestamp into sw.js and version.json
echo "Step 1/3: Injecting build timestamp..."
NODE_ENV=production node scripts/inject-build-timestamp.js

# Step 2: Build frontend
echo ""
echo "Step 2/3: Building frontend..."
npm run build

# Step 3: Verify build outputs
echo ""
echo "Step 3/3: Verifying build outputs..."

if [ -f "client/public/sw.js" ]; then
  echo "✓ Service worker generated successfully"
else
  echo "✗ Service worker not found!"
  exit 1
fi

if [ -f "client/public/version.json" ]; then
  echo "✓ Version file generated successfully"
  VERSION=$(cat client/public/version.json | grep buildTimestamp | cut -d'"' -f4)
  echo "  Build version: $VERSION"
else
  echo "✗ Version file not found!"
  exit 1
fi

if [ -d "dist" ]; then
  echo "✓ Build directory exists"
else
  echo "✗ Build directory not found!"
  exit 1
fi

echo ""
echo "=== Build completed successfully ==="
echo "Run 'npm start' to launch the production server"