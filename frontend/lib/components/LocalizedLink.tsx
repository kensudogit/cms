'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { addLocaleToPath } from '@/lib/utils/path';
import { ReactNode } from 'react';

interface LocalizedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

/**
 * 多言語対応のLinkコンポーネント
 * hrefに自動的にロケールプレフィックスを追加
 */
export function LocalizedLink({ href, children, className, ...props }: LocalizedLinkProps) {
  const pathname = usePathname();
  const locale = useLocale();

  // 現在のロケールを取得（パスから抽出、デフォルトは'ja'）
  const currentLocale = pathname?.split('/')[1] || locale || 'ja';
  const localizedHref = addLocaleToPath(href, currentLocale);

  return (
    <Link href={localizedHref} className={className} {...props}>
      {children}
    </Link>
  );
}

