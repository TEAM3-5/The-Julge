import './globals.css';
import type { ReactNode } from 'react';
import { spoqa } from './fonts';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={spoqa.variable}>
      <body>{children}</body>
    </html>
  );
}
