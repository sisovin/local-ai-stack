#!/usr/bin/env pwsh

# Database Setup Helper Script
# This script provides instructions for setting up your Supabase database

Write-Host "🗄️  LocalAI Stack - Database Setup Helper" -ForegroundColor Blue
Write-Host "==============================================" -ForegroundColor Blue
Write-Host ""

$schemaFile = "docs/supabase-schema.sql"

# Check if schema file exists
if (-not (Test-Path $schemaFile)) {
    Write-Host "❌ Schema file not found at: $schemaFile" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found schema file" -ForegroundColor Green
Write-Host ""

Write-Host "📋 To set up your Supabase database:" -ForegroundColor Cyan
Write-Host "1. Go to your Supabase project dashboard:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Navigate to the 'SQL Editor' tab" -ForegroundColor White
Write-Host ""
Write-Host "3. Create a new query and copy-paste the following SQL:" -ForegroundColor White
Write-Host ""

# Display the schema content
Write-Host "--- Copy from here ---" -ForegroundColor Yellow
Get-Content $schemaFile | Write-Host -ForegroundColor Gray
Write-Host "--- Copy until here ---" -ForegroundColor Yellow

Write-Host ""
Write-Host "4. Click 'Run' to execute the SQL commands" -ForegroundColor White
Write-Host ""
Write-Host "5. Restart your development server and test the database connection" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Quick Links:" -ForegroundColor Cyan
Write-Host "• Supabase Dashboard: https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh" -ForegroundColor Gray
Write-Host "• SQL Editor: https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh/sql" -ForegroundColor Gray
Write-Host "• Auth Settings: https://supabase.com/dashboard/project/plvdkvkcxqxuuvyhjojh/auth/settings" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 Tips:" -ForegroundColor Green
Write-Host "• The schema creates tables for user profiles, chat messages, and conversation sessions" -ForegroundColor Gray
Write-Host "• All tables include proper indexes for performance" -ForegroundColor Gray  
Write-Host "• Row Level Security (RLS) policies ensure data privacy" -ForegroundColor Gray
Write-Host ""

# Ask if user wants to copy schema to clipboard (Windows only)
if ($IsWindows) {
    $copyToClipboard = Read-Host "Would you like to copy the schema to clipboard? (y/N)"
    if ($copyToClipboard -eq "y" -or $copyToClipboard -eq "Y") {
        Get-Content $schemaFile | Set-Clipboard
        Write-Host "✅ Schema copied to clipboard! You can now paste it in Supabase SQL Editor." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green
