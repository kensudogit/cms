'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Content } from '@/lib/types';
import { getMockContents } from '@/lib/mockData';

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasAuth, setHasAuth] = useState(false);

  // クライアント側でのみ実行
  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('auth-storage');
    const hasStoredAuth = !!(storedToken || storedUser);
    
    if (!user && !token && !hasStoredAuth) {
      router.push('/login');
      return;
    }
    
    setHasAuth(!!(user || token || hasStoredAuth));
  }, [user, token, router]);

  // APIからデータを取得（フォールバックとしてモックデータを使用）
  // すべてのフックは条件分岐の前に呼び出す必要がある
  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ['contents'],
    queryFn: async () => {
      try {
        // APIからコンテンツ一覧を取得
        const response = await apiClient.get('/api/content');
        return response.data;
      } catch (error: any) {
        // APIが失敗した場合、モックデータをフォールバックとして使用
        // 接続エラーの場合は警告のみ（開発環境）
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          if (process.env.NODE_ENV === 'development') {
            console.warn('API接続エラー: バックエンドサーバーが起動していない可能性があります。モックデータを使用します。');
          }
        } else {
          console.warn('API request failed, using mock data:', error);
        }
        return getMockContents();
      }
    },
    enabled: isClient && hasAuth, // クライアント側で認証済みの場合のみ実行
    retry: false, // 接続エラーの場合はリトライしない
    refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動再取得を無効化
  });

  // サーバー側レンダリング時は何も表示しない（ハイドレーションエラーを防ぐ）
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-slate-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!hasAuth) {
    return null;
  }

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <nav className="glass-effect border-b border-white/30 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-xl overflow-hidden">
                <Image
                  src="/PC.png"
                  alt="CMS Logo"
                  width={112}
                  height={112}
                  className="object-contain w-full h-full logo-shake"
                  priority
                  unoptimized
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text bg-clip-text">CMS ダッシュボード</h1>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 glass-card px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50">
                  <span className="text-white text-sm font-bold">
                    {user ? user.name.charAt(0).toUpperCase() : 'G'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {user ? user.name : 'ゲスト'}
                  </p>
                  <p className="text-xs text-slate-500">{user?.role || 'Guest'}</p>
                </div>
              </div>
              {user && (
                <button
                  onClick={handleLogout}
                  className="group relative bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>ログアウト</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                コンテンツ管理
              </h2>
              <p className="text-slate-600 font-medium">コンテンツを管理・編集できます</p>
            </div>
            <Link
              href="/dashboard/contents/new"
              className="group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden glow-effect"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>新規作成</span>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="mt-6 text-slate-600 font-medium animate-pulse">読み込み中...</p>
            </div>
          ) : contents && contents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content, index) => (
                <Link
                  key={content.id}
                  href={`/dashboard/contents/${content.id}`}
                  className="group card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="glass-card rounded-3xl p-6 h-full flex flex-col transition-all duration-500 border border-white/50 hover:border-indigo-200/50 relative overflow-hidden">
                    {/* ホバー時のグラデーションオーバーレイ */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>
                    
                    <div className="relative z-10 flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3 leading-tight">
                          {content.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                            content.status === 'PUBLISHED'
                              ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-emerald-200'
                              : content.status === 'DRAFT'
                              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-200'
                              : 'bg-gradient-to-r from-slate-400 to-gray-500 text-white shadow-slate-200'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-white/80 mr-2 animate-pulse"></span>
                          {content.status === 'PUBLISHED' ? '公開' : content.status === 'DRAFT' ? '下書き' : 'アーカイブ'}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                          <svg className="w-6 h-6 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative z-10 mt-auto pt-4 border-t border-slate-200/50">
                      <p className="text-xs text-slate-500 mb-2 truncate font-medium">
                        <span className="text-slate-400">スラッグ:</span> {content.slug}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {new Date(content.updatedAt).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="inline-block relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full shadow-2xl">
                  <svg className="w-20 h-20 text-indigo-600 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                コンテンツがありません
              </h3>
              <p className="text-slate-600 mb-8 text-lg font-medium">最初のコンテンツを作成して始めましょう！</p>
              <Link
                href="/dashboard/contents/new"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110 glow-effect"
              >
                <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>新規コンテンツを作成</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

