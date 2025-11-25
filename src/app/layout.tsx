import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="flex flex-col w-full h-full justify-center items-center">{children}</div>
      </body>
    </html>
  );
}
