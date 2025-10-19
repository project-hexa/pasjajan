/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ]
  }
}

export default nextConfig
