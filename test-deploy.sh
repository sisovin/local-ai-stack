#!/usr/bin/env bash

# Vercel deployment simulation script
# This simulates what Vercel will do during deployment

echo "=== Vercel Deployment Simulation ==="
echo ""

echo "1. Installing dependencies with pnpm..."
pnpm install --filter=web --filter=@workspace/ui --filter=@workspace/eslint-config --filter=@workspace/typescript-config
if [ $? -ne 0 ]; then
    echo "❌ Installation failed"
    exit 1
fi

echo ""
echo "2. Building the web application..."
cd apps/web
pnpm build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Deployment simulation successful!"
echo "🚀 Your app is ready for Vercel!"

echo ""
echo "Files that will be deployed:"
ls -la .next/

echo ""
echo "To deploy to Vercel:"
echo "1. Commit and push these changes to your main branch"
echo "2. Vercel will automatically deploy using the vercel.json configuration"
echo "3. The deployment will use the custom install and build commands to avoid Python dependency issues"
