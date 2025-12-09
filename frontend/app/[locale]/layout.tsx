import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import { Providers } from '../providers';

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 有効なロケールかチェック
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // メッセージを取得
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


