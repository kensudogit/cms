import { routing } from '@/i18n/routing';
import { redirect } from 'next/navigation';

// ルートレイアウトは[locale]フォルダにリダイレクト
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // デフォルト言語にリダイレクト
  redirect(`/${routing.defaultLocale}`);
}

