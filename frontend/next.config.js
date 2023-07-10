/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  eslint: {
    dirs: ['.'],
  },
  async redirects() {
    return [
      {
        source: '/account',
        destination: '/account/profile',
        permanent: true,
      },
    ];
  },
  env: {
    // url: 'https://crypto.najaed.com/',
    url: 'http://localhost:8000/',
  },
};

module.exports = nextConfig;
