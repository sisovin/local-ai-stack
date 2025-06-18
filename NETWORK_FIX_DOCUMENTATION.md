# Network Connectivity Fix for Vercel Deployment

## Issue Identified
Date: June 18, 2025
Problem: Vercel build failing during `pnpm install` due to network connectivity issues

## Error Details
```
ERR_PNPM_META_FETCH_FAIL  GET https://registry.npmjs.org/@eslint%2Fjs: Value of "this" must be of type URLSearchParams
ERR_INVALID_THIS errors for multiple packages including:
- @eslint/js
- @typescript-eslint/eslint-plugin
- @radix-ui/* packages
- tailwindcss
- typescript
```

## Root Cause
- Intermittent network connectivity issues with npm registry from Vercel's build environment
- pnpm having trouble with URLSearchParams in the build environment
- Possible timeout issues during package fetching

## Solutions Applied

### 1. Added .npmrc Configuration
Created `.npmrc` in project root with:
- registry=https://registry.npmjs.org/
- network-timeout=300000 (5 minutes)
- fetch-retry-mintimeout=10000 (10 seconds)
- fetch-retry-maxtimeout=60000 (1 minute)  
- fetch-retries=3
- prefer-offline=false
- cache-max=0

### 2. Updated Vercel Install Command
Changed from:
```json
"installCommand": "cd ../.. && pnpm install"
```
To:
```json
"installCommand": "cd ../.. && pnpm install --frozen-lockfile"
```

### 3. Benefits of Changes
- `--frozen-lockfile` ensures reproducible builds using exact versions from pnpm-lock.yaml
- .npmrc provides better retry and timeout handling
- Explicit registry configuration avoids potential DNS/routing issues

## Current Configuration
- **Commit**: 47e75f3
- **Vercel Config**: `apps/web/vercel.json`
- **Network Config**: `.npmrc` in project root
- **Install Strategy**: Frozen lockfile with enhanced retry logic

## Expected Outcome
The next Vercel deployment should be more resilient to temporary network issues and complete successfully.

## Fallback Options (if still failing)
1. Use npm instead of pnpm (requires converting workspace: dependencies)
2. Pre-bundle dependencies in a different approach
3. Use Vercel's dependency caching more aggressively
4. Consider using yarn instead of pnpm
