#!/bin/bash

# Supabase Environment Setup Script
# This script helps you configure your Supabase environment variables

echo "🚀 LocalAI Stack - Supabase Configuration"
echo "================================================"
echo ""

# Check if .env.local exists
ENV_FILE="apps/web/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env.local file not found at: $ENV_FILE"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "✅ Found .env.local file"
echo ""

# Instructions for getting Supabase credentials
echo "📋 To get your Supabase credentials:"
echo "1. Visit: https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh/settings/api"
echo "2. Copy the 'anon public' key from the 'Project API keys' section"
echo ""

# Prompt for Supabase API key
read -p "Please paste your Supabase anon public key here: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "❌ No API key provided. Exiting."
    exit 1
fi

# Validate the API key format (should start with eyJ)
if [[ ! "$API_KEY" =~ ^eyJ ]]; then
    echo "⚠️  Warning: The API key doesn't look like a valid JWT token (should start with 'eyJ')"
    read -p "Continue anyway? (y/N): " CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Update the .env.local file
if sed -i.bak "s/NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here/NEXT_PUBLIC_SUPABASE_ANON_KEY=$API_KEY/" "$ENV_FILE"; then
    echo ""
    echo "✅ Successfully updated $ENV_FILE"
    echo ""
    echo "🔄 Next steps:"
    echo "1. Restart your development server: pnpm dev"
    echo "2. Check the browser for the connection test results"
    echo ""
    echo "🎉 Setup complete!"
else
    echo "❌ Failed to update .env.local file"
    exit 1
fi
