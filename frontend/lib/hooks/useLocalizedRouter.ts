'use client';

import { useRouter as useNextRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { addLocaleToPath } from '@/lib/utils/path';

/**
 * 多言語対応のルーターカスタムフック
 * パスに自動的にロケールプレフィックスを追加
 */
export function useLocalizedRouter() {
  const router = useNextRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // 現在のロケールを取得（パスから抽出、デフォルトは'ja'）
  const currentLocale = pathname?.split('/')[1] || locale || 'ja';

  return {
    push: (path: string) => {
      router.push(addLocaleToPath(path, currentLocale));
    },
    replace: (path: string) => {
      router.replace(addLocaleToPath(path, currentLocale));
    },
    back: () => router.back(),
    forward: () => router.forward(),
    refresh: () => router.refresh(),
  };
}

