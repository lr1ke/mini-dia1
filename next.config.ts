import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: ['*', 'https://mini-dia1.vercel.app'], // Add your dev origin here
  reactStrictMode: false,
};

export default nextConfig;
