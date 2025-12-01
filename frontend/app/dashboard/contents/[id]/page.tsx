'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Content, ContentRequest } from '@/lib/types';

export default function ContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: content, isLoading } = useQuery<Content>({
    queryKey: ['content', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/content/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContentRequest & { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' }>({
    defaultValues: {
      title: content?.title || '',
      body: content?.body || '',
      slug: content?.slug || '',
      status: content?.status || 'DRAFT',
    },
  });

  useEffect(() => {
    if (content) {
      reset({
        title: content.title,
        body: content.body,
        slug: content.slug,
        status: content.status,
      });
    }
  }, [content, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: ContentRequest) => {
      const response = await apiClient.put(`/api/content/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', id] });
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      setIsEditing(false);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'エラーが発生しました');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      router.push('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'エラーが発生しました');
    },
  });

  const onSubmit = (data: ContentRequest) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (confirm('このコンテンツを削除してもよろしいですか？')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">コンテンツが見つかりません</p>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold gradient-text">コンテンツ詳細</h1>
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

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                    タイトル
                  </label>
                  <input
                    {...register('title', { required: 'タイトルは必須です' })}
                    type="text"
                    className="block w-full border-2 border-gray-200 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 hover:bg-white"
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
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl shadow-md text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>保存中...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>変更を保存</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="pb-6 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">{content.title}</h2>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
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
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>スラッグ: {content.slug}</span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{content.body || '本文がありません'}</p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    メタ情報
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">作成日時</p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(content.createdAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">更新日時</p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(content.updatedAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    {content.publishedAt && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">公開日時</p>
                        <p className="text-sm font-medium text-gray-700">
                          {new Date(content.publishedAt).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>削除中...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>削除</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>編集</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

