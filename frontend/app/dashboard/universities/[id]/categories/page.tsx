'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api';
import { ContentCategory, University, ContentCategoryRequest } from '@/lib/types';
import { sampleUniversities } from '@/lib/sampleData';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function UniversityCategoriesPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  const { data: university } = useQuery<University>({
    queryKey: ['university', id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/university/${id}`);
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch university, using sample data:', error);
        return sampleUniversities.find(u => u.id === Number(id)) || null;
      }
    },
    enabled: !!id,
  });

  const { data: categories, isLoading } = useQuery<ContentCategory[]>({
    queryKey: ['content-categories', id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/content-category/university/${id}`);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch categories:', error);
        return [];
      }
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentCategoryRequest>({
    defaultValues: {
      universityId: Number(id),
      active: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ContentCategoryRequest) => {
      const response = await apiClient.post('/api/content-category', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-categories'] });
      reset();
      setIsCreating(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (categoryId: number) => {
      await apiClient.delete(`/api/content-category/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-categories'] });
    },
  });

  const onSubmit = async (data: ContentCategoryRequest) => {
    createMutation.mutate(data);
  };

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

      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1">
          <nav className="glass-effect border-b border-white/30 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20 items-center">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push(`/dashboard/universities/${id}`)}
                    className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
                  >
                    <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold gradient-text bg-clip-text">{university.name} - カテゴリ管理</h1>
                    <p className="text-xs text-slate-500 font-medium">Category Management</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/dashboard/universities/${id}/contents`}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    コンテンツ一覧
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
            <div className="px-4 py-6 sm:px-0">
              {/* 新規カテゴリ作成フォーム */}
              <div className="glass-card rounded-3xl p-6 border border-white/50 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">新規カテゴリ作成</h2>
                  <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                  >
                    {isCreating ? 'キャンセル' : '新規作成'}
                  </button>
                </div>
                {isCreating && (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                        カテゴリ名 <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('name', { required: 'カテゴリ名は必須です' })}
                        type="text"
                        className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                        placeholder="例: 入学案内"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="slug" className="block text-sm font-bold text-slate-700 mb-2">
                        スラッグ <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('slug', { required: 'スラッグは必須です' })}
                        type="text"
                        className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                        placeholder="例: admission-guide"
                      />
                      {errors.slug && (
                        <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2">
                        説明
                      </label>
                      <textarea
                        {...register('description')}
                        rows={3}
                        className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium"
                        placeholder="カテゴリの説明"
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
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                      >
                        {createMutation.isPending ? '作成中...' : 'カテゴリを作成'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* カテゴリ一覧 */}
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                  <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
                </div>
              ) : categories && categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="glass-card rounded-3xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 mb-2">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-slate-600 mb-2">{category.description}</p>
                          )}
                          <p className="text-xs text-slate-500 mb-2">スラッグ: {category.slug}</p>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              category.active
                                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white'
                                : 'bg-gradient-to-r from-slate-400 to-gray-500 text-white'
                            }`}
                          >
                            {category.active ? '有効' : '無効'}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200/50">
                        <button
                          onClick={() => {
                            if (confirm(`カテゴリ「${category.name}」を削除しますか？`)) {
                              deleteMutation.mutate(category.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-3xl font-bold text-slate-800 mb-3">カテゴリが見つかりません</h3>
                  <p className="text-slate-600">この大学にはまだカテゴリが登録されていません。</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

