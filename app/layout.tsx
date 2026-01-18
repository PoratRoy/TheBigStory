import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import 'lineicons/dist/lineicons.css';
import styles from './layout.module.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'הסיפור הגדול',
  description: 'אפליקציית שמירת אירועים על ציר זמן',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} ${styles.body} ${styles.antialiased}`}>
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bar-color)',
              color: 'var(--text-color)',
              border: '1px solid var(--border-color)',
            },
          }}
        />
      </body>
    </html>
  );
}
