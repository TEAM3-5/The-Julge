import './globals.css';
import { spoqa } from './fonts';

import { ToastProvider } from '@/components/toast/toastProvider';
import { ModalProvider } from '@/components/modal/ModalProvider';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={spoqa.className}>
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <ToastProvider>
            <ModalProvider>{children}</ModalProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
