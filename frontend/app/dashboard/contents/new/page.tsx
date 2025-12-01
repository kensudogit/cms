'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { ContentRequest } from '@/lib/types';

export default function NewContentPage() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContentRequest & { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }>({
    defaultValues: {
      status: 'DRAFT',
    },
  });

  const onSubmit = async (data: ContentRequest) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.post('/api/content', data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <nav className="glass-effect border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold gradient-text">新規コンテンツ作成</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="glass-effect shadow-2xl rounded-2xl p-8 border border-white/20">
            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-md animate-slide-up">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                  タイトル
                </label>
                <input
                  {...register('title', { required: 'タイトルは必須です' })}
                  type="text"
                  className="block w-full border-2 border-gray-200 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 hover:bg-white"
                  placeholder="コンテンツのタイトルを入力"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="block text-sm font-semibold text-gray-700">
                  スラッグ
                </label>
                <input
                  {...register('slug', { required: 'スラッグは必須です' })}
                  type="text"
                  className="block w-full border-2 border-gray-200 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 hover:bg-white"
                  placeholder="content-slug"
                />
                {errors.slug && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="body" className="block text-sm font-semibold text-gray-700">
                  本文
                </label>
                <textarea
                  {...register('body')}
                  rows={12}
                  className="block w-full border-2 border-gray-200 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 hover:bg-white resize-none"
                  placeholder="コンテンツの本文を入力"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700">
                  ステータス
                </label>
                <select
                  {...register('status')}
                  className="block w-full border-2 border-gray-200 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 hover:bg-white"
                >
                  <option value="DRAFT">下書き</option>
                  <option value="PUBLISHED">公開</option>
                  <option value="ARCHIVED">アーカイブ</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl shadow-md text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>作成中...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>コンテンツを作成</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

