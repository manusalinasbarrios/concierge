/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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

module.exports = nextConfig;