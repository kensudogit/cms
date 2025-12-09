'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // 現在のパスから言語プレフィックスを削除
    const pathWithoutLocale = pathname.replace(/^\/(en|ja|vi|zh)/, '') || '/';
    // 新しい言語でパスを構築
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    router.push(newPath);
    router.refresh();
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/90 hover:bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all"
        onClick={() => {
          const menu = document.getElementById('language-menu');
          menu?.classList.toggle('hidden');
        }}
      >
        <span className="text-lg">
          {languages.find((l) => l.code === locale)?.flag || '🌐'}
        </span>
        <span className="text-sm font-semibold text-slate-700">
          {languages.find((l) => l.code === locale)?.name || locale.toUpperCase()}
        </span>
        <svg
          className="w-4 h-4 text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        id="language-menu"
        className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50"
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              switchLocale(lang.code);
              document.getElementById('language-menu')?.classList.add('hidden');
            }}
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-indigo-50 transition-colors ${
              locale === lang.code ? 'bg-indigo-100' : ''
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span className="text-sm font-medium text-slate-700">{lang.name}</span>
            {locale === lang.code && (
              <span className="ml-auto text-indigo-600">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

