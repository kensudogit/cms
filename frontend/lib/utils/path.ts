/**
 * パスに現在のロケールを自動的に追加するユーティリティ関数
 * 多言語対応のパス構造に対応
 */

/**
 * パスが既にロケールプレフィックスを含んでいるかチェック
 */
function hasLocalePrefix(path: string): boolean {
  return /^\/(en|ja|vi|zh)\//.test(path);
}

/**
 * パスにロケールプレフィックスを追加
 * @param path - パス（例: '/dashboard'）
 * @param locale - ロケール（例: 'ja'）
 * @returns ロケール付きパス（例: '/ja/dashboard'）
 */
export function addLocaleToPath(path: string, locale: string = 'ja'): string {
  // 既にロケールプレフィックスがある場合はそのまま返す
  if (hasLocalePrefix(path)) {
    return path;
  }

  // ルートパスの場合はロケールのみを返す
  if (path === '/') {
    return `/${locale}`;
  }

  // パスにロケールを追加
  return `/${locale}${path}`;
}

/**
 * パスからロケールプレフィックスを削除
 * @param path - ロケール付きパス（例: '/ja/dashboard'）
 * @returns ロケールなしパス（例: '/dashboard'）
 */
export function removeLocaleFromPath(path: string): string {
  return path.replace(/^\/(en|ja|vi|zh)/, '') || '/';
}

