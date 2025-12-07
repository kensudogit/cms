'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { ContentRequest, University, ContentCategory } from '@/lib/types';

export default function NewContentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const universityIdFromQuery = searchParams.get('universityId');

  const { data: universities } = useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async (): Promise<University[]> => {
      const response = await apiClient.get<University[]>('/api/university/active');
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContentRequest & { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }>({
    defaultValues: {
      status: 'DRAFT',
      universityId: universityIdFromQuery ? Number(universityIdFromQuery) : (universities?.[0]?.id || 1),
    },
  });

  const universityId = watch('universityId');

  // クエリパラメータから大学IDを設定
  useEffect(() => {
    if (universityIdFromQuery && !universityId) {
      setValue('universityId', Number(universityIdFromQuery));
    }
  }, [universityIdFromQuery, universityId, setValue]);

  const { data: categories } = useQuery<ContentCategory[]>({
    queryKey: ['categories', universityId],
    queryFn: async (): Promise<ContentCategory[]> => {
      if (!universityId) return [];
      const response = await apiClient.get<ContentCategory[]>(`/api/content-category/university/${universityId}`);
      return response.data;
    },
    enabled: !!universityId,
  });

  const onSubmit = async (data: ContentRequest) => {
    setLoading(true);
    setError(null);

    try {
      // APIを呼び出してコンテンツを作成
      await apiClient.post('/api/content', data, {
        headers: {
          'X-User-Id': userId || '1',
        },
      });
      
      // クエリキャッシュを無効化して最新データを取得
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      
      // ダッシュボードにリダイレクト
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'エラーが発生しました';
      setError(errorMessage);
      console.error('コンテンツ作成エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="glass-effect border-b border-white/30 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">新規コンテンツ作成</h1>
                <p className="text-xs text-slate-500 font-medium">Create New Content</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="glass-card shadow-2xl rounded-3xl p-8 border border-white/50">
            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl shadow-lg animate-slide-up backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="font-semibold">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-bold text-slate-700 flex items-center space-x-2">
                  <span>タイトル</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('title', { required: 'タイトルは必須です' })}
                  type="text"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium placeholder:text-slate-400"
                  placeholder="コンテンツのタイトルを入力"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 flex items-center font-semibold mt-2">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="universityId" className="block text-sm font-bold text-slate-700 flex items-center space-x-2">
                  <span>大学</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('universityId', { required: '大学を選択してください', valueAsNumber: true })}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  {universities?.map((univ: University) => (
                    <option key={univ.id} value={univ.id}>
                      {univ.name}
                    </option>
                  ))}
                </select>
                {errors.universityId && (
                  <p className="text-sm text-red-600 flex items-center font-semibold mt-2">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.universityId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="categoryId" className="block text-sm font-bold text-slate-700">
                  カテゴリ
                </label>
                <select
                  {...register('categoryId', { valueAsNumber: true })}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                  disabled={!universityId || !categories || categories.length === 0}
                >
                  <option value="">カテゴリを選択（オプション）</option>
                  {categories?.map((cat: ContentCategory) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="contentType" className="block text-sm font-bold text-slate-700">
                  コンテンツタイプ
                </label>
                <select
                  {...register('contentType')}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="">タイプを選択（オプション）</option>
                  <option value="入学手続き">入学手続き</option>
                  <option value="卒業手続き">卒業手続き</option>
                  <option value="お知らせ">お知らせ</option>
                  <option value="手続きガイド">手続きガイド</option>
                  <option value="FAQ">FAQ</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="slug" className="block text-sm font-bold text-slate-700 flex items-center space-x-2">
                  <span>スラッグ</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('slug', { required: 'スラッグは必須です' })}
                  type="text"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium placeholder:text-slate-400"
                  placeholder="content-slug"
                />
                {errors.slug && (
                  <p className="text-sm text-red-600 flex items-center font-semibold mt-2">
                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="body" className="block text-sm font-bold text-slate-700">
                  本文
                </label>
                <textarea
                  {...register('body')}
                  rows={12}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium placeholder:text-slate-400"
                  placeholder="コンテンツの本文を入力"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-bold text-slate-700">
                  ステータス
                </label>
                <select
                  {...register('status')}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="DRAFT">下書き</option>
                  <option value="PUBLISHED">公開</option>
                  <option value="ARCHIVED">アーカイブ</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200/50">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="group px-6 py-3 border-2 border-slate-300 rounded-xl shadow-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>キャンセル</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 overflow-hidden glow-effect"
                >
                  <span className="relative z-10 flex items-center space-x-2">
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
                        <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>コンテンツを作成</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

