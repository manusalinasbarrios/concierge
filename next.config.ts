import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    //dangerouslyAllowLocalIP: true,
    remotePatterns: [
      //new URL('https://delightful-crown-636634ff69.media.strapiapp.com/**'),
     // new URL('http://localhost:1337/uploads/**'),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
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