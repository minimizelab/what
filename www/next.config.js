module.exports = {
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/',
        permanent: true,
      },
      {
        source: '/admin/:p*',
        destination: 'https://what-admin.minimize.se/',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  reactStrictMode: true,
};
