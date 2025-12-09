import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // サポートする言語
  locales: ['en', 'ja', 'vi', 'zh'],

  // デフォルト言語
  defaultLocale: 'ja',

  // 言語プレフィックスを常に表示
  localePrefix: 'always',
});

// 型安全なナビゲーション
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

// 型エクスポート
export type Locale = (typeof routing.locales)[number];

