import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
    transpilePackages: ["@workspace/ui"],
    // Use standalone output for Vercel deployments
    output: process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' ? 'standalone' : undefined,
    // Configure file tracing for monorepo - use absolute path
    outputFileTracingRoot: process.env.VERCEL === '1' ? path.join(__dirname, '../../') : undefined,
}

export default nextConfig