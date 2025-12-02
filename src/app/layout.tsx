import './globals.css';
import { spoqa } from './fonts';

import { ToastProvider } from '@/components/toast/toastProvider';
import { ModalProvider } from '@/components/modal/ModalProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationModalProvider } from '@/components/NotificationModal/NotificationModalProvider';

export const metadata = {
  title: 'The Julge',
  icons: {
    icon: '/jg-favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={spoqa.className}>
      <body className="min-h-screen flex flex-col bg-white">
        <AuthProvider>
          <ToastProvider>
            <ModalProvider>
              <NotificationModalProvider>
                {children}
              </NotificationModalProvider>
            </ModalProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
