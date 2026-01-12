import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Auth0Provider } from '@auth0/nextjs-auth0';
import { auth0 } from '@/lib/auth0';
import { syncUser } from './actions/auth';
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
  const session = await auth0.getSession();
  
  if (session?.user) {
    try {
      await syncUser({
        sub: session.user.sub,
        name: session.user.name || session.user.nickname || 'משתמש',
        picture: session.user.picture,
      });
    } catch (error) {
      console.error('Failed to sync user in layout:', error);
    }
  }

  return (
    <html lang="he" dir="rtl">
      <Auth0Provider>
        <body className={`${geistSans.variable} ${geistMono.variable} ${styles.body} ${styles.antialiased}`}>
          {children}
        </body>
      </Auth0Provider>
    </html>
  );
}
