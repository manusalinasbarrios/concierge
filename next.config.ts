import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      new URL('https://delightful-crown-636634ff69.media.strapiapp.com/**'),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
       {
        protocol: 'https',
        hostname: 'delightful-crown-636634ff69.media.strapiapp.com',
        port: '443',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;