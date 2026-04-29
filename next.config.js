/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
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

module.exports = nextConfig;