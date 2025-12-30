/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // allow images served from local backend (Laravel dev server)
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      // Midtrans payment gateway QR codes
      {
        protocol: "https",
        hostname: "api.sandbox.midtrans.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.midtrans.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-d6223ac068f344b2906b8bd46bf3dac0.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
