/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      new URL('https://delightful-crown-636634ff69.media.strapiapp.com/**'),
     // new URL('http://localhost:1337/uploads/**'),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
       {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/**',
      },
      /*{
        protocol: 'https',
        hostname: 'delightful-crown-636634ff69.media.strapiapp.com',
        port: '443',
        pathname: '/**',
      },*/
    ],
  },
};

module.exports = nextConfig;