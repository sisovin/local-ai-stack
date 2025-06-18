#!/bin/bash

# Test build script for local verification before Vercel deployment

echo "🚀 Starting local build test..."

# Set working directory to the script's directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Install specific packages for build
echo "🔧 Installing build-specific dependencies..."
pnpm install --filter=web --filter=@workspace/ui --filter=@workspace/eslint-config --filter=@workspace/typescript-config

if [ $? -ne 0 ]; then
    echo "❌ Failed to install build dependencies"
    exit 1
fi

# Run type checking
echo "🔍 Running type check..."
pnpm --filter=web run typecheck

if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi

# Run linting
echo "🧹 Running linter..."
pnpm --filter=web run lint

if [ $? -ne 0 ]; then
    echo "❌ Linting failed"
    exit 1
fi

# Build the web app
echo "🏗️  Building web application..."
pnpm --filter=web build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build test completed successfully!"
echo "🎉 The application should now deploy successfully to Vercel."
