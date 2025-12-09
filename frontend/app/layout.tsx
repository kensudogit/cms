import { Providers } from './providers';

// ルートレイアウト
// [locale]フォルダのレイアウトが実際のレイアウトを提供
// ただし、QueryClientProviderはすべてのページで必要なので、ここで提供
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}

