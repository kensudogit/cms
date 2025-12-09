import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// ルートページはデフォルト言語にリダイレクト
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}

