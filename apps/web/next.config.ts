import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    transpilePackages: ["@workspace/ui"],
    output: 'standalone',
    experimental: {
        outputFileTracingRoot: "../../",
    },
}

export default nextConfig