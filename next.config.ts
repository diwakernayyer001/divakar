import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd316u7k0d46mo4.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'www.hereco.xyz',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/festival',
        destination: 'https://www.hereco.xyz/api/festival',
      },
      {
        source: '/api/proxy/lottie/:path*',
        destination: 'https://d316u7k0d46mo4.cloudfront.net/festival-badges/:path*',
      },
    ];
  },
};

export default nextConfig;
