'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // メニュー外をクリックしたときにメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const switchLocale = (newLocale: string) => {
    // 現在のパスから言語プレフィックスを削除
    const pathWithoutLocale = pathname.replace(/^\/(en|ja|vi|zh)/, '') || '/';
    // 新しい言語でパスを構築
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    setIsOpen(false);
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
    <div className="relative">
      <button
        ref={buttonRef}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/90 hover:bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg">
          {languages.find((l) => l.code === locale)?.flag || '🌐'}
        </span>
        <span className="text-sm font-semibold text-slate-700">
          {languages.find((l) => l.code === locale)?.name || locale.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
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
      )}
    </div>
  );
}

