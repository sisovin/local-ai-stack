# Vercel Deployment Guide

## Current Status
✅ **Build Fixed**: All critical build errors have been resolved and the app builds successfully locally.
❌ **Vercel Registry Issue**: Encountering `ERR_PNPM_META_FETCH_FAIL` due to Vercel's npm registry access issues.

## Deployment Strategies

### Strategy 1: Deploy from Root (Monorepo)
Deploy from the root directory with the current `vercel.json`:
```json
{
    "framework": "nextjs",
    "buildCommand": "cd apps/web && pnpm build",
    "outputDirectory": "apps/web/.next",
    "env": {
        "NEXT_PUBLIC_SUPABASE_URL": "https://placeholder.supabase.co",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": "placeholder-key-for-build-time"
    }
}
```

### Strategy 2: Deploy Web App Only
Deploy only the `apps/web` directory as a standalone Next.js app. The web app has its own simplified `vercel.json`.

### Strategy 3: Alternative Build Commands
If registry issues persist, try these alternatives in `vercel.json`:

```json
{
    "buildCommand": "npm install -g pnpm@latest && pnpm install --registry=https://registry.npmjs.org/ && cd apps/web && pnpm build",
    "installCommand": "npm install -g pnpm@latest && pnpm install --registry=https://registry.npmjs.org/",
    "outputDirectory": "apps/web/.next",
    "framework": "nextjs"
}
```

### Strategy 4: Using Turbo (if registry works)
```json
{
    "buildCommand": "turbo build --filter=web",
    "installCommand": "pnpm install --frozen-lockfile",
    "outputDirectory": "apps/web/.next",
    "framework": null
}
```

## Registry Issue Workarounds

### Option A: Retry Deployment
The `ERR_PNPM_META_FETCH_FAIL` error is often transient. Simply retry the deployment after a few minutes.

### Option B: Contact Vercel Support
If the issue persists, contact Vercel support as this appears to be an infrastructure issue on their end.

### Option C: Use GitHub Actions + Vercel CLI
Deploy using GitHub Actions with the Vercel CLI to bypass the web interface:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm vercel
      - run: pnpm install
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Environment Variables
Make sure to set these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Any other production environment variables

## Build Status
- ✅ Local build: SUCCESS
- ✅ ESLint warnings: Only non-blocking warnings remain
- ✅ TypeScript compilation: SUCCESS
- ✅ Next.js optimization: SUCCESS
- ❌ Vercel deployment: Blocked by registry issue (not code-related)

## Next Steps
1. Try Strategy 1 (deploy from root)
2. If registry error persists, try Strategy 2 (deploy web app only)
3. If still failing, use Strategy 3 with explicit registry URL
4. Contact Vercel support if none work

The codebase is deployment-ready. The only blocker is Vercel's npm registry access issue.
