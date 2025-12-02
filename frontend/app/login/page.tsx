'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // ログインページにアクセスした場合は、即座にダッシュボード（ルートパス）にリダイレクト
  useEffect(() => {
    // 即座にリダイレクト（クライアントサイド）
    router.replace('/');
  }, [router]);

  // サーバーサイドでもリダイレクトを試みる（フォールバック）
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }

  // リダイレクト中は何も表示しない（ミドルウェアでリダイレクトされるため）
  return null;
}
