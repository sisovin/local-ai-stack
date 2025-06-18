import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    transpilePackages: ["@workspace/ui"],
    // Use standalone output for Vercel deployments
    output: process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' ? 'standalone' : undefined,
    // Configure file tracing for monorepo
    outputFileTracingRoot: process.env.VERCEL === '1' ? "../../" : undefined,
}

export default nextConfig