import { getRequestConfig } from 'next-intl/server';

// サポートする言語
const locales = ['en', 'ja', 'vi', 'zh'] as const;
const defaultLocale = 'ja' as const;

export default getRequestConfig(async ({ locale }) => {
  // 有効なロケールかチェック、無効な場合はデフォルトを使用
  const validLocale = locale && locales.includes(locale as any) 
    ? locale 
    : defaultLocale;

  return {
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});

