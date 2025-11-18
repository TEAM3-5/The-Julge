import localFont from 'next/font/local';

export const spoqa = localFont({
  src: [
    { path: './fonts/SpoqaHanSansNeo-Regular.woff2', weight: '400', style: 'normal' },
    { path: './fonts/SpoqaHanSansNeo-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-thejulge',
  display: 'swap',
});
