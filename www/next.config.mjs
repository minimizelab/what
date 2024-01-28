/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['cdn.sanity.io'],
    loader: 'custom',
  },
  reactStrictMode: true,
};

export default nextConfig;
