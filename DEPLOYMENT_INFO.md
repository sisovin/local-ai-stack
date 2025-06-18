# Deployment Info

Last deployment attempt: 2025-06-18 (Fresh Deployment #2)
Build fixes applied:
- Added @eslint/js dependency to eslint-config package
- Fixed Vercel monorepo configuration with proper rootDirectory
- Added Next.js standalone output configuration
- Created .vercelignore for deployment optimization
- Updated for fresh deployment trigger

## Key Changes for Vercel Deployment

1. **ESLint Configuration**: Added missing `@eslint/js` dependency
2. **Vercel Config**: Set `rootDirectory: "apps/web"` and relative `outputDirectory: ".next"`
3. **Next.js Config**: Added conditional `output: 'standalone'` and `outputFileTracingRoot: "../../"`
4. **Build Command**: Updated to handle monorepo structure properly
5. **Fresh Deployment**: Added additional files to ensure fresh commit

This file serves as a deployment trigger for fresh commits.
