// 動的レンダリングを強制（QueryClientが必要なため）
export const dynamic = 'force-dynamic';

// Dashboardレイアウト
// QueryClientProviderはルートレイアウト（app/layout.tsx）で提供される
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

