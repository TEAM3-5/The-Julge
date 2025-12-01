import type { NextConfig } from 'next';

const remotePatterns: NonNullable<NextConfig['images']>['remotePatterns'] = [
  {
    protocol: 'https',
    hostname: 'encrypted-tbn0.gstatic.com',
  },
  {
    protocol: 'https',
    hostname: 'via.placeholder.com',
  },
  {
    protocol: 'https',
    hostname: 'bootcamp-project-api.s3.ap-northeast-2.amazonaws.com',
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
