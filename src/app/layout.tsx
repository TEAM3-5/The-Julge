import './globals.css';
import { spoqa } from './fonts';
import Footer from '@/components/common/Footer';
import { ToastProvider } from '@/components/toast/toastProvider';
import { ModalProvider } from '@/components/modal/ModalProvider';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={spoqa.className}>
      <body className="min-h-screen flex flex-col bg-white">
        <ToastProvider>
          <ModalProvider>
            <NavBar isLoggedIn={isLoggedIn} role={role} />
            <main className="flex-1 flex mx-auto">
              <AuthProvider>{children}</AuthProvider>
            </main>
            <Footer />
          </ModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
