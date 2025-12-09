import { Providers } from '../providers';

// 動的レンダリングを強制（QueryClientが必要なため）
export const dynamic = 'force-dynamic';

// Dashboardレイアウト: QueryClientProviderを提供
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}

