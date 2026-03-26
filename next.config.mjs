/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/commission-engine',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
