'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Content, University, UniversityLayoutConfig } from '@/lib/types';
import { sampleContents } from '@/lib/sampleData';
import { allUniversityContents } from '@/lib/universityMockData';
import { mockUniversities } from '@/lib/mockData';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function ContentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [uploadingContentId, setUploadingContentId] = useState<number | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  // ページネーション用のstate
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 大学一覧を取得
  const { data: universities, isLoading: universitiesLoading } = useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      // 開発モードでモックデータを優先的に使用（環境変数で制御可能）
      const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_UNIVERSITIES === 'true';
      // 開発環境では常にモックデータを使用（本番環境では環境変数で制御）
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (useMockData || isDevelopment) {
        console.log('Using mock universities data (forced)');
        // 開発環境ではモックデータを優先的に使用
        // APIからデータを取得してマージすることも可能
        try {
          const response = await apiClient.get('/api/university/active');
          const data = response.data || [];
          // APIからデータが取得できた場合はマージ、空の場合はモックデータのみ
          if (data.length > 0) {
            console.log('Merging API data with mock data');
            // APIデータとモックデータをマージ（重複を避ける）
            const merged = [...data];
            mockUniversities.forEach(mock => {
              if (!merged.find(u => u.id === mock.id)) {
                merged.push(mock);
              }
            });
            return merged;
          }
        } catch (error) {
          console.warn('Failed to fetch universities in development mode, using mock data only:', error);
        }
        return mockUniversities;
      }

      try {
        const response = await apiClient.get('/api/university/active');
        const data = response.data || [];
        // APIからデータが取得できたが空の場合はモックデータを使用
        if (data.length === 0) {
          console.log('No universities from API, using mock data');
          return mockUniversities;
        }
        console.log('Fetched universities:', data);
        return data;
      } catch (error) {
        console.warn('Failed to fetch universities:', error);
        // フォールバック: すべての大学を取得
        try {
          const response = await apiClient.get('/api/university');
          const data = response.data || [];
          if (data.length === 0) {
            console.log('No universities from fallback API, using mock data');
            return mockUniversities;
          }
          return data;
        } catch (fallbackError) {
          console.warn('Failed to fetch all universities, using mock data:', fallbackError);
          // モックデータを返す
          return mockUniversities;
        }
      }
    },
    // デフォルトでモックデータを使用（開発環境）
    initialData: mockUniversities,
    // キャッシュが無効な場合もモックデータを返す
    placeholderData: mockUniversities,
  });

  // コンテンツ一覧を取得
  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ['contents', selectedUniversityId],
    queryFn: async () => {
      try {
        if (selectedUniversityId) {
          const response = await apiClient.get(`/api/content/university/${selectedUniversityId}`);
          return response.data || [];
        } else {
          const response = await apiClient.get('/api/content');
          return response.data || [];
        }
      } catch (error) {
        console.warn('Failed to fetch contents, using sample data:', error);
        return [...sampleContents, ...allUniversityContents];
      }
    },
  });

  // 選択された大学のレイアウト設定を取得（コンテンツ一覧画面用）
  const { data: layoutConfigs } = useQuery<UniversityLayoutConfig[]>({
    queryKey: ['university-layout-configs', selectedUniversityId, 'CONTENT_LIST'],
    queryFn: async () => {
      if (!selectedUniversityId) return [];
      try {
        const response = await apiClient.get(`/api/university-layout-config/university/${selectedUniversityId}/layout-type/CONTENT_LIST`);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch layout configs:', error);
        return [];
      }
    },
    enabled: !!selectedUniversityId,
  });

  // 表示するフィールドを決定（レイアウト設定から取得）
  const displayFields = layoutConfigs && layoutConfigs.length > 0
    ? layoutConfigs
        .filter(config => config.visible)
        .flatMap(config => {
          try {
            return config.fieldKeys ? JSON.parse(config.fieldKeys) : [];
          } catch {
            return [];
          }
        })
    : ['title', 'status', 'contentType', 'updatedAt']; // デフォルトフィールド

  // ページネーション計算
  const totalItems = contents?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContents = contents?.slice(startIndex, endIndex) || [];

  // 大学フィルタが変更されたら、ページを1にリセット
  const handleUniversityChange = (value: string) => {
    setSelectedUniversityId(value ? Number(value) : null);
    setSelectedFields(new Set()); // フィールド選択をリセット
    setCurrentPage(1); // ページを1にリセット
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/api/content/${id}`, {
        headers: {
          'X-User-Id': '1',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    },
  });

  const handleDelete = (content: Content) => {
    if (confirm(`コンテンツ「${content.title}」を削除してもよろしいですか？`)) {
      deleteMutation.mutate(content.id);
    }
  };

  // アップロード先URLを取得（コンテンツのcustomFieldsから取得、またはデフォルトURL）
  const getUploadUrl = (content: Content): string => {
    try {
      if (content.customFields) {
        const customFields = JSON.parse(content.customFields);
        if (customFields.uploadUrl) {
          // URL内の{id}を実際のコンテンツIDに置換
          return customFields.uploadUrl.replace('{id}', content.id.toString());
        }
      }
    } catch (e) {
      // JSON解析エラーは無視
    }
    
    // デフォルトのアップロードURL
    return `/api/content/${content.id}/upload`;
  };

  const handleFileSelect = (contentId: number) => {
    const input = fileInputRefs.current[contentId];
    if (input) {
      input.click();
    }
  };

  const handleFileChange = async (contentId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingContentId(contentId);
    
    try {
      const content = contents?.find(c => c.id === contentId);
      if (!content) return;

      const uploadUrl = getUploadUrl(content);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contentId', contentId.toString());

      // アップロード実行
      const response = await apiClient.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(`ファイル「${file.name}」のアップロードが完了しました。`);
      
      // コンテンツを更新（必要に応じて）
      queryClient.invalidateQueries({ queryKey: ['contents'] });
    } catch (error: any) {
      console.error('File upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'アップロードに失敗しました';
      alert(`ファイルのアップロードに失敗しました: ${errorMessage}`);
    } finally {
      setUploadingContentId(null);
      // ファイル入力をリセット
      if (fileInputRefs.current[contentId]) {
        fileInputRefs.current[contentId]!.value = '';
      }
    }
  };

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
                    onClick={() => router.push('/dashboard/admin')}
                    className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
                  >
                    <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold gradient-text bg-clip-text">コンテンツ管理</h1>
                    <p className="text-xs text-slate-500 font-medium">Content Management</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/contents/new"
                  className="group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>新規作成</span>
                  </span>
                </Link>
              </div>
            </div>
          </nav>

          <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
            <div className="px-4 py-6 sm:px-0">
              {/* 大学選択と表示項目設定 */}
              <div className="glass-card shadow-2xl rounded-3xl p-6 border border-white/50 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      大学でフィルタ
                    </label>
                    <select
                      value={selectedUniversityId || ''}
                      onChange={(e) => handleUniversityChange(e.target.value)}
                      disabled={universitiesLoading}
                      className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">すべての大学</option>
                      {universitiesLoading ? (
                        <option value="" disabled>読み込み中...</option>
                      ) : (
                        (() => {
                          // モックデータをフォールバックとして使用
                          const displayUniversities = (universities && universities.length > 0) ? universities : mockUniversities;
                          return displayUniversities.length > 0 ? (
                            displayUniversities.map((univ) => (
                              <option key={univ.id} value={univ.id}>
                                {univ.name} {univ.code ? `(${univ.code})` : ''}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>大学が登録されていません</option>
                          );
                        })()
                      )}
                    </select>
                    {universitiesLoading && (
                      <p className="text-xs text-slate-500 mt-1">大学データを読み込み中...</p>
                    )}
                    {!universitiesLoading && universities && universities.length === 0 && (
                      <p className="text-xs text-slate-500 mt-1">大学が登録されていません。先に大学を登録してください。</p>
                    )}
                  </div>
                  {selectedUniversityId && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        表示項目設定
                      </label>
                      <Link
                        href={`/dashboard/universities/${selectedUniversityId}/settings?tab=layout`}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        レイアウト設定を編集
                      </Link>
                      {layoutConfigs && layoutConfigs.length > 0 && (
                        <p className="text-xs text-slate-500 mt-2">
                          現在の表示項目: {displayFields.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                  <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
                </div>
              ) : contents && contents.length > 0 ? (
                <div className="glass-card shadow-2xl rounded-3xl p-6 border border-white/50">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          {displayFields.includes('title') && (
                            <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">タイトル</th>
                          )}
                          {displayFields.includes('slug') && (
                            <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">スラッグ</th>
                          )}
                          {displayFields.includes('status') && (
                            <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">ステータス</th>
                          )}
                          {displayFields.includes('contentType') && (
                            <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">タイプ</th>
                          )}
                          {displayFields.includes('universityId') && (
                            <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">大学</th>
                          )}
                          {displayFields.includes('updatedAt') && (
                            <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">更新日時</th>
                          )}
                          <th className="text-left py-3 px-4 text-sm font-bold text-slate-700">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedContents.map((content) => (
                          <tr key={content.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            {displayFields.includes('title') && (
                              <td className="py-4 px-4">
                                <Link
                                  href={`/dashboard/contents/${encodeURIComponent(content.title)}`}
                                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                                >
                                  {content.title}
                                </Link>
                              </td>
                            )}
                            {displayFields.includes('slug') && (
                              <td className="py-4 px-4 text-sm text-slate-600">{content.slug}</td>
                            )}
                            {displayFields.includes('status') && (
                              <td className="py-4 px-4">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                    content.status === 'PUBLISHED'
                                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white'
                                      : content.status === 'DRAFT'
                                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                                      : 'bg-gradient-to-r from-slate-400 to-gray-500 text-white'
                                  }`}
                                >
                                  {content.status === 'PUBLISHED' ? '公開' : content.status === 'DRAFT' ? '下書き' : 'アーカイブ'}
                                </span>
                              </td>
                            )}
                            {displayFields.includes('contentType') && (
                              <td className="py-4 px-4 text-sm text-slate-600">{content.contentType || '-'}</td>
                            )}
                            {displayFields.includes('universityId') && (
                              <td className="py-4 px-4">
                                {content.universityId ? (
                                  <Link
                                    href={`/dashboard/universities/${content.universityId}`}
                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold hover:underline"
                                  >
                                    {universities?.find(u => u.id === content.universityId)?.name || `大学ID: ${content.universityId}`}
                                  </Link>
                                ) : (
                                  <span className="text-sm text-slate-400">-</span>
                                )}
                              </td>
                            )}
                            {displayFields.includes('updatedAt') && (
                              <td className="py-4 px-4 text-sm text-slate-600">
                                {new Date(content.updatedAt).toLocaleString('ja-JP')}
                              </td>
                            )}
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Link
                                  href={`/dashboard/contents/${content.id}`}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all"
                                >
                                  編集
                                </Link>
                                <button
                                  onClick={() => handleDelete(content)}
                                  disabled={deleteMutation.isPending}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                                >
                                  削除
                                </button>
                                <button
                                  onClick={() => handleFileSelect(content.id)}
                                  disabled={uploadingContentId === content.id}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition-all flex items-center space-x-1"
                                  title="ファイルを登録"
                                >
                                  {uploadingContentId === content.id ? (
                                    <>
                                      <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      <span>登録中...</span>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                      </svg>
                                      <span>登録</span>
                                    </>
                                  )}
                                </button>
                                <input
                                  ref={(el) => {
                                    fileInputRefs.current[content.id] = el;
                                  }}
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(content.id, e)}
                                  accept="*/*"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* ページネーション */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* 件数表示とページサイズ選択 */}
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-600">
                          全 <span className="font-bold text-slate-800">{totalItems}</span> 件中{' '}
                          <span className="font-bold text-slate-800">
                            {startIndex + 1} - {Math.min(endIndex, totalItems)}
                          </span>{' '}
                          件を表示
                        </div>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="border-2 border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value={5}>5件 / ページ</option>
                          <option value={10}>10件 / ページ</option>
                          <option value={20}>20件 / ページ</option>
                          <option value={50}>50件 / ページ</option>
                        </select>
                      </div>

                      {/* ページネーションボタン */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="最初のページ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="前のページ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* ページ番号 */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                  currentPage === pageNum
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-indigo-300'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="次のページ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="最後のページ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-3xl font-bold text-slate-800 mb-3">コンテンツが登録されていません</h3>
                  <p className="text-slate-600 mb-8">最初のコンテンツを登録して始めましょう！</p>
                  <Link
                    href="/dashboard/contents/new"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>新規コンテンツを登録</span>
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

