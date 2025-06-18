/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: "../../",
  },
}

export default nextConfig
