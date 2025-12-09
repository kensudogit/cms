'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';

// 動的レンダリングを強制（QueryClientが必要なため）
export const dynamic = 'force-dynamic';

// Dashboardレイアウト
// QueryClientProviderはルートレイアウト（app/layout.tsx）で提供される
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-4 right-4 z-[100]">
        <LanguageSwitcher />
      </div>
      {children}
    </>
  );
}

