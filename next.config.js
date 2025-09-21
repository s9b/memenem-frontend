/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.imgflip.com', 'localhost'],
    unoptimized: true, // For static export if needed
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Backend API proxy
      },
    ];
  },
};

module.exports = nextConfig;