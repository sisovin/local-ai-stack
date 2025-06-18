import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  output: process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' ? 'standalone' : undefined,
  outputFileTracingRoot: process.env.VERCEL === '1' ? path.join(__dirname, '../../') : undefined,
}

export default nextConfig
