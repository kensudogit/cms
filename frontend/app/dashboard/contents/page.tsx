'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Content, University, UniversityLayoutConfig } from '@/lib/types';
import { sampleContents } from '@/lib/sampleData';
import { allUniversityContents } from '@/lib/universityMockData';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function ContentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());

  // 大学一覧を取得
  const { data: universities } = useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/university/active');
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch universities:', error);
        return [];
      }
    },
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
                      onChange={(e) => {
                        const value = e.target.value;
                        setSelectedUniversityId(value ? Number(value) : null);
                        setSelectedFields(new Set()); // フィールド選択をリセット
                      }}
                      className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                    >
                      <option value="">すべての大学</option>
                      {universities?.map((univ) => (
                        <option key={univ.id} value={univ.id}>
                          {univ.name}
                        </option>
                      ))}
                    </select>
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
                        {contents.map((content) => (
                          <tr key={content.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            {displayFields.includes('title') && (
                              <td className="py-4 px-4">
                                <Link
                                  href={`/dashboard/contents/${content.id}`}
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
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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

