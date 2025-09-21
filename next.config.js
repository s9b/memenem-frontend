/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'i.imgflip.com', 
      'localhost', 
      'memenem-backend.onrender.com',
      '127.0.0.1'
    ],
    unoptimized: true, // For static export if needed
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://memenem-backend.onrender.com/api/:path*'
          : 'http://localhost:8000/api/:path*', // Backend API proxy
      },
    ];
  },
};

module.exports = nextConfig;