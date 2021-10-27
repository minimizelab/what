module.exports = {
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  reactStrictMode: true,
};
