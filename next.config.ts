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
];

// 환경 변수가 있을 때만 S3 호스트를 등록한다.
if (process.env.NEXT_PUBLIC_S3_HOSTNAME) {
  remotePatterns.push({
    protocol: 'https',
    hostname: process.env.NEXT_PUBLIC_S3_HOSTNAME,
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
