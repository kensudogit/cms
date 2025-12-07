'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { University, UniversityRequest } from '@/lib/types';
import { sampleUniversities } from '@/lib/sampleData';

export default function EditUniversityPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: university, isLoading } = useQuery<University>({
    queryKey: ['university', id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/university/${id}`);
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch university, using sample data:', error);
        // サンプルデータから検索
        const sample = sampleUniversities.find(u => u.id === Number(id));
        if (sample) return sample;
        throw error;
      }
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UniversityRequest>({
    defaultValues: {
      code: university?.code || '',
      name: university?.name || '',
      description: university?.description || '',
      domain: university?.domain || '',
      active: university?.active ?? true,
    },
  });

  // 大学データが取得できたらフォームをリセット
  useEffect(() => {
    if (university) {
      reset({
        code: university.code,
        name: university.name,
        description: university.description || '',
        domain: university.domain || '',
        active: university.active,
      });
    }
  }, [university, reset]);

  const mutation = useMutation({
    mutationFn: async (data: UniversityRequest) => {
      const response = await apiClient.put(`/api/university/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
      queryClient.invalidateQueries({ queryKey: ['university', id] });
      router.push('/dashboard/universities');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'エラーが発生しました';
      setError(errorMessage);
    },
  });

  const onSubmit = async (data: UniversityRequest) => {
    setLoading(true);
    setError(null);
    mutation.mutate(data);
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center py-20">
          <h3 className="text-3xl font-bold text-slate-800 mb-3">大学が見つかりません</h3>
          <button
            onClick={() => router.push('/dashboard/universities')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
          >
            大学一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="glass-effect border-b border-white/30 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/universities')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">大学編集</h1>
                <p className="text-xs text-slate-500 font-medium">Edit University</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="glass-card shadow-2xl rounded-3xl p-8 border border-white/50">
            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl shadow-lg">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-bold text-slate-700">
                  <span>大学コード</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('code', { required: '大学コードは必須です' })}
                  type="text"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                  placeholder="TOKYO_UNIV"
                />
                {errors.code && (
                  <p className="text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                  <span>大学名</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: '大学名は必須です' })}
                  type="text"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                  placeholder="東京大学"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-bold text-slate-700">
                  説明
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium"
                  placeholder="大学の説明を入力"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="domain" className="block text-sm font-bold text-slate-700">
                  ドメイン
                </label>
                <input
                  {...register('domain')}
                  type="text"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                  placeholder="example.ac.jp"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...register('active')}
                  type="checkbox"
                  className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-sm font-bold text-slate-700">
                  有効
                </label>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-slate-200/50">
                <Link
                  href={`/dashboard/universities/${id}/contents`}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>コンテンツ管理</span>
                </Link>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard/universities')}
                    className="px-6 py-3 border-2 border-slate-300 rounded-xl shadow-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '更新中...' : '更新する'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

