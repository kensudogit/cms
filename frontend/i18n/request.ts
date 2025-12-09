import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig({
  // ルーティング設定を使用
  ...routing,
  // メッセージを読み込む
  messages: async (locale) => {
    return (await import(`../messages/${locale}.json`)).default;
  },
});

