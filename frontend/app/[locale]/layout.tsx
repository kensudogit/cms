import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

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

  // 静的レンダリングを有効化
  setRequestLocale(locale);

  // メッセージを取得
  const messages = await getMessages();

  // ネストされたレイアウトなので、<html>と<body>は提供しない
  // ルートレイアウト（app/layout.tsx）が提供する
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}


