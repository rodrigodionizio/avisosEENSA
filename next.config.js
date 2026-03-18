/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/avisosEENSA',
  assetPrefix: '/avisosEENSA',
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
