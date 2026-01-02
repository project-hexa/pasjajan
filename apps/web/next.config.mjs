/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // allow images served from local backend (Laravel dev server)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      // Midtrans payment gateway QR codes
      {
        protocol: 'https',
        hostname: 'api.sandbox.midtrans.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.midtrans.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
