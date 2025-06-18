/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: 'standalone',
  outputFileTracingRoot: "../../",
}

export default nextConfig
