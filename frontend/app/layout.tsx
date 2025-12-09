import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CMS - Content Management System',
  description: 'Webシステムリプレース CMS設計',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/PC.png', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/PC.png',
  },
};

// ルートレイアウト: <html>と<body>を提供
// すべてのページで共通のルートレイアウト
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

