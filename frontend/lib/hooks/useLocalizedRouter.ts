'use client';

import { useRouter as useNextRouter, usePathname } from 'next/navigation';
import { addLocaleToPath } from '@/lib/utils/path';

/**
 * 多言語対応のルーターカスタムフック
 * パスに自動的にロケールプレフィックスを追加
 */
export function useLocalizedRouter() {
  const router = useNextRouter();
  const pathname = usePathname();

  // パスからロケールを取得、またはデフォルトを使用
  const getLocale = () => {
    const match = pathname?.match(/^\/(en|ja|vi|zh)/);
    return match ? match[1] : 'ja';
  };

  const currentLocale = getLocale();

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

