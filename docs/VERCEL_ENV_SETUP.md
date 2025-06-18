# Vercel Environment Variables Setup

## Required Environment Variables

To deploy successfully to Vercel, you need to configure the following environment variables in your Vercel project:

### 1. Supabase Configuration (Required)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**How to get these values:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" and "Project API Key (anon public)"

### 2. Optional Environment Variables

```bash
NEXT_PUBLIC_OPENWEBUI_API_KEY=your-openwebui-api-key
NEXT_PUBLIC_OPENWEBUI_URL=http://localhost:3000
```

## Setting Environment Variables in Vercel

### Method 1: Vercel Dashboard

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environment**: Check all (Production, Preview, Development)
   - Click **Save**
5. Repeat for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redeploy to apply changes
vercel --prod
```

### Method 3: Import from .env file

1. Create a `.env` file with your production values
2. In Vercel Dashboard → Settings → Environment Variables
3. Click **Import from .env** and upload your file

## Build-Time Fallbacks

The application is configured with build-time fallbacks to prevent deployment failures:

- If environment variables are missing during build, placeholder values are used
- This allows static generation to complete successfully
- At runtime, proper error handling guides users to configure environment variables

## Troubleshooting

### Build fails with "Missing env.NEXT_PUBLIC_SUPABASE_URL"

1. Check that environment variables are set in Vercel
2. Ensure variables are available for all environments (Production, Preview, Development)
3. Redeploy after adding environment variables

### Environment variables not updating

1. After changing environment variables in Vercel, you need to redeploy
2. Go to Deployments tab and click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Security Notes

- Never commit `.env.local` or `.env` files with real credentials to Git
- Use different Supabase projects for development and production
- Regularly rotate your API keys
- Monitor API usage in your Supabase dashboard

## Next Steps After Setting Environment Variables

1. Add environment variables to Vercel
2. Redeploy your application
3. Verify the deployment works by visiting your Vercel URL
4. Test key functionality like authentication and database connections
