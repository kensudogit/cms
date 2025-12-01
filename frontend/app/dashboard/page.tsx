'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Content } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const token = useAuthStore((state) => state.token);

  // ログインチェックを一時的に無効化
  // useEffect(() => {
  //   if (!token) {
  //     router.push('/login');
  //   }
  // }, [router, token]);

  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ['contents'],
    queryFn: async () => {
      const response = await apiClient.get('/api/content');
      return response.data;
    },
  });

  const handleLogout = () => {
    clearAuth();
    router.push('/dashboard'); // ログアウト後もダッシュボードに戻る
  };

  // ユーザー情報がない場合の表示を変更
  // if (!user) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <nav className="glass-effect border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold gradient-text">CMS ダッシュボード</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 bg-white/80 px-4 py-2 rounded-full shadow-md">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user ? user.name.charAt(0).toUpperCase() : 'G'}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {user ? `${user.name}さん` : 'ゲスト'}
                </span>
              </div>
              {user && (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  ログアウト
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">コンテンツ</h2>
              <p className="text-gray-600">コンテンツを管理・編集できます</p>
            </div>
            <Link
              href="/dashboard/contents/new"
              className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>新規作成</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">読み込み中...</p>
            </div>
          ) : contents && contents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content, index) => (
                <Link
                  key={content.id}
                  href={`/dashboard/contents/${content.id}`}
                  className="group card-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 h-full flex flex-col transition-all duration-300 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                          {content.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            content.status === 'PUBLISHED'
                              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                              : content.status === 'DRAFT'
                              ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                              : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {content.status === 'PUBLISHED' ? '公開' : content.status === 'DRAFT' ? '下書き' : 'アーカイブ'}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
                          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1 truncate">スラッグ: {content.slug}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(content.updatedAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-block p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6">
                <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">コンテンツがありません</h3>
              <p className="text-gray-600 mb-6">最初のコンテンツを作成して始めましょう！</p>
              <Link
                href="/dashboard/contents/new"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

