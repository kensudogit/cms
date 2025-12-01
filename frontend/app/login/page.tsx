'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // ログインページにアクセスした場合は、自動的にダッシュボード（ルートパス）にリダイレクト
  useEffect(() => {
    router.replace('/');
  }, [router]);

  // リダイレクト中はローディング表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}
