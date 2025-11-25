import './globals.css';
import { spoqa } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={spoqa.className}>
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
