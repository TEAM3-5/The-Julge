import './globals.css';
import { spoqa } from './fonts';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={spoqa.className}>
      <body className="min-h-screen bg-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
