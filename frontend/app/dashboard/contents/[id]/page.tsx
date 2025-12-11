'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { Content, ContentRequest } from '@/lib/types';
import { getMockContentById, getMockContentByTitle, searchMockContentsByTitle } from '@/lib/mockData';
import { allUniversityContents } from '@/lib/universityMockData';

export default function ContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: content, isLoading } = useQuery<Content>({
    queryKey: ['content', id],
    queryFn: async () => {
      try {
        // APIからコンテンツを取得
        const response = await apiClient.get(`/api/content/${id}`);
        return response.data;
      } catch (error: any) {
        // APIが失敗した場合、モックデータをフォールバックとして使用
        console.warn('API request failed, using mock data:', error);
        // まず大学関連のモックデータから検索
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        const universityContent = allUniversityContents.find((c) => c.id === numericId);
        if (universityContent) {
          return universityContent;
        }
        // 次に一般的なモックデータから検索（IDで）
        const mockContent = getMockContentById(id);
        if (mockContent) {
          return mockContent;
        }
        // IDが数値でない場合、またはIDが見つからない場合、タイトルとして検索を試みる
        if (typeof id === 'string' && isNaN(numericId)) {
          // URLエンコードされたタイトルをデコード
          const decodedTitle = decodeURIComponent(id);
          // まず一般的なモックデータから検索
          const titleContent = getMockContentByTitle(decodedTitle);
          if (titleContent) {
            return titleContent;
          }
          // 大学関連のモックデータからも検索
          const universityTitleContent = allUniversityContents.find((c) => c.title === decodedTitle);
          if (universityTitleContent) {
            return universityTitleContent;
          }
          // タイトルで部分一致検索（一般的なモックデータ）
          const searchResults = searchMockContentsByTitle(decodedTitle);
          if (searchResults.length > 0) {
            return searchResults[0]; // 最初の結果を返す
          }
          // タイトルで部分一致検索（大学関連のモックデータ）
          const universitySearchResults = allUniversityContents.filter((c) => 
            c.title.toLowerCase().includes(decodedTitle.toLowerCase())
          );
          if (universitySearchResults.length > 0) {
            return universitySearchResults[0]; // 最初の結果を返す
          }
        }
        throw new Error('Content not found');
      }
    },
    enabled: !!id,
  });

  // アップロードURLをcustomFieldsから取得
  const getUploadUrlFromContent = (content: Content | undefined): string => {
    if (!content?.customFields) return '';
    try {
      const customFields = JSON.parse(content.customFields);
      return customFields.uploadUrl || '';
    } catch {
      return '';
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContentRequest & { status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; uploadUrl?: string }>({
    defaultValues: {
      title: content?.title || '',
      body: content?.body || '',
      slug: content?.slug || '',
      status: content?.status || 'DRAFT',
      uploadUrl: getUploadUrlFromContent(content),
    },
  });

  useEffect(() => {
    if (content) {
      reset({
        title: content.title,
        body: content.body,
        slug: content.slug,
        status: content.status,
        uploadUrl: getUploadUrlFromContent(content),
      });
    }
  }, [content, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: ContentRequest) => {
      try {
        // APIを呼び出してコンテンツを更新
        const response = await apiClient.put(`/api/content/${id}`, data, {
          headers: {
            'X-User-Id': userId?.toString() || '1',
          },
        });
        return response.data;
      } catch (error: any) {
        // APIが失敗した場合、エラーをスロー
        throw error;
      }
    },
    onSuccess: (updatedContent) => {
      // クエリキャッシュを更新
      queryClient.setQueryData(['content', id], updatedContent);
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      setIsEditing(false);
      setError(null);
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'エラーが発生しました';
      setError(errorMessage);
      console.error('コンテンツ更新エラー:', err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        // APIを呼び出してコンテンツを削除
        await apiClient.delete(`/api/content/${id}`, {
          headers: {
            'X-User-Id': userId?.toString() || '1',
          },
        });
      } catch (error: any) {
        // APIが失敗した場合、エラーをスロー
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
      queryClient.removeQueries({ queryKey: ['content', id] });
      router.push('/dashboard');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'エラーが発生しました';
      setError(errorMessage);
      console.error('コンテンツ削除エラー:', err);
    },
  });

  const onSubmit = (data: ContentRequest & { uploadUrl?: string }) => {
    // uploadUrlをcustomFieldsに含めて送信
    const { uploadUrl, ...contentData } = data;
    const customFields: any = {};
    
    // 既存のcustomFieldsを取得
    if (content?.customFields) {
      try {
        Object.assign(customFields, JSON.parse(content.customFields));
      } catch {
        // パースエラーは無視
      }
    }
    
    // uploadUrlを追加
    if (uploadUrl) {
      customFields.uploadUrl = uploadUrl;
    }
    
    // customFieldsをJSON文字列として設定
    const requestData: ContentRequest = {
      ...contentData,
      customFields: Object.keys(customFields).length > 0 ? JSON.stringify(customFields) : undefined,
    };
    
    updateMutation.mutate(requestData);
  };

  const handleDelete = () => {
    if (confirm('このコンテンツを削除してもよろしいですか？')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!content) {
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
                <h1 className="text-2xl font-bold gradient-text">コンテンツが見つかりません</h1>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full mb-6">
              <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">コンテンツが見つかりません</h2>
            <p className="text-gray-600 mb-6">指定されたIDのコンテンツは存在しません。</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>ダッシュボードに戻る</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">コンテンツ詳細</h1>
                <p className="text-xs text-slate-500 font-medium">Content Details</p>
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

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-bold text-slate-700 flex items-center space-x-2">
                    <span>タイトル</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title', { required: 'タイトルは必須です' })}
                    type="text"
                    className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
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

                <div className="space-y-2">
                  <label htmlFor="uploadUrl" className="block text-sm font-bold text-slate-700">
                    アップロードURL
                  </label>
                  <input
                    {...register('uploadUrl')}
                    type="url"
                    className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium placeholder:text-slate-400"
                    placeholder="https://example.com/api/upload または /api/content/{id}/upload"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    ファイルアップロード先のURLを指定します。未指定の場合はデフォルトURLが使用されます。
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="group px-6 py-3 border-2 border-slate-300 rounded-xl shadow-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>キャンセル</span>
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="group relative px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 overflow-hidden glow-effect"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
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
                          <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>変更を保存</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="pb-6 border-b border-slate-200/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                      {content.title}
                    </h2>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
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
                  <div className="flex items-center flex-wrap gap-3 text-sm text-slate-600">
                    <div className="flex items-center space-x-2 bg-slate-100/50 px-3 py-1.5 rounded-lg">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-medium">{content.slug}</span>
                    </div>
                    {content.universityId && (
                      <div className="flex items-center space-x-2 bg-indigo-100/50 px-3 py-1.5 rounded-lg">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium text-indigo-700">大学ID: {content.universityId}</span>
                      </div>
                    )}
                    {content.contentType && (
                      <div className="flex items-center space-x-2 bg-purple-100/50 px-3 py-1.5 rounded-lg">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-medium text-purple-700">{content.contentType}</span>
                      </div>
                    )}
                    {content.metaDescription && (
                      <div className="flex items-center space-x-2 bg-emerald-100/50 px-3 py-1.5 rounded-lg">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-emerald-700">{content.metaDescription}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none glass-card rounded-2xl p-8 border border-white/50">
                  <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg font-medium">{content.body || '本文がありません'}</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-indigo-100/50 shadow-lg">
                  <h3 className="text-base font-bold text-slate-700 mb-5 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    メタ情報
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">作成日時</p>
                      <p className="text-sm font-bold text-slate-700">
                        {new Date(content.createdAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">更新日時</p>
                      <p className="text-sm font-bold text-slate-700">
                        {new Date(content.updatedAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    {content.publishedAt && (
                      <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">公開日時</p>
                        <p className="text-sm font-bold text-slate-700">
                          {new Date(content.publishedAt).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200/50">
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="group relative px-6 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>削除</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="group relative px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden glow-effect"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>編集</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
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

