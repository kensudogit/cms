'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Content, University, ContentCategory } from '@/lib/types';
import { sampleUniversities, sampleContents } from '@/lib/sampleData';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function UniversityContentsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: university, isLoading: isLoadingUniversity } = useQuery<University>({
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

  const { data: categories } = useQuery<ContentCategory[]>({
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

  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ['university-contents', id, selectedCategoryId, statusFilter, searchQuery],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/content?universityId=${id}`);
        let data = response.data || [];
        
        if (selectedCategoryId) {
          data = data.filter((c: Content) => c.categoryId === selectedCategoryId);
        }
        if (statusFilter !== 'all') {
          data = data.filter((c: Content) => c.status === statusFilter);
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          data = data.filter((c: Content) => 
            c.title.toLowerCase().includes(query) ||
            c.body?.toLowerCase().includes(query) ||
            c.slug.toLowerCase().includes(query)
          );
        }
        
        return data;
      } catch (error) {
        console.warn('Failed to fetch contents, using sample data:', error);
        let data = sampleContents.filter(c => c.universityId === Number(id));
        
        if (selectedCategoryId) {
          data = data.filter(c => c.categoryId === selectedCategoryId);
        }
        if (statusFilter !== 'all') {
          data = data.filter(c => c.status === statusFilter);
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          data = data.filter(c => 
            c.title.toLowerCase().includes(query) ||
            c.body?.toLowerCase().includes(query) ||
            c.slug.toLowerCase().includes(query)
          );
        }
        
        return data;
      }
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (contentId: number) => {
      await apiClient.delete(`/api/content/${contentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['university-contents'] });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white';
      case 'DRAFT':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      case 'ARCHIVED':
        return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return '公開中';
      case 'DRAFT':
        return '下書き';
      case 'ARCHIVED':
        return 'アーカイブ';
      default:
        return status;
    }
  };

  // 統計情報を計算
  const stats = {
    total: contents?.length || 0,
    published: contents?.filter(c => c.status === 'PUBLISHED').length || 0,
    draft: contents?.filter(c => c.status === 'DRAFT').length || 0,
    archived: contents?.filter(c => c.status === 'ARCHIVED').length || 0,
  };

  if (isLoadingUniversity) {
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
                    <h1 className="text-2xl font-bold gradient-text bg-clip-text">{university.name} - コンテンツ管理</h1>
                    <p className="text-xs text-slate-500 font-medium">Content Management</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href={`/dashboard/universities/${id}/categories`}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    カテゴリ管理
                  </Link>
                  <Link
                    href={`/dashboard/contents/new?universityId=${id}`}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>新規コンテンツ作成</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
            <div className="px-4 py-6 sm:px-0">
              {/* 統計情報 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">総コンテンツ数</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">公開中</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.published}</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">下書き</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs text-slate-500 mb-1 font-semibold">アーカイブ</p>
                  <p className="text-2xl font-bold text-slate-600">{stats.archived}</p>
                </div>
              </div>

              {/* フィルター */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="search" className="block text-sm font-bold text-slate-700 mb-2">
                      検索
                    </label>
                    <input
                      id="search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="タイトル、本文、スラッグで検索..."
                      className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">
                      カテゴリでフィルタ
                    </label>
                    <select
                      id="category"
                      value={selectedCategoryId || ''}
                      onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                      className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                    >
                      <option value="">すべてのカテゴリ</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label htmlFor="status" className="block text-sm font-bold text-slate-700 mb-2">
                      ステータスでフィルタ
                    </label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                      className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                    >
                      <option value="all">すべて</option>
                      <option value="PUBLISHED">公開中</option>
                      <option value="DRAFT">下書き</option>
                      <option value="ARCHIVED">アーカイブ</option>
                    </select>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                  <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
                </div>
              ) : contents && contents.length > 0 ? (
                <div className="space-y-4">
                  {contents.map((content) => (
                    <div
                      key={content.id}
                      className="glass-card rounded-3xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-800">{content.title}</h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(content.status)}`}>
                              {getStatusText(content.status)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{content.body}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>スラッグ: {content.slug}</span>
                            {content.categoryId && (
                              <span>
                                カテゴリ: {categories?.find(c => c.id === content.categoryId)?.name || '不明'}
                              </span>
                            )}
                            <span>作成日: {new Date(content.createdAt).toLocaleDateString('ja-JP')}</span>
                            {content.publishedAt && (
                              <span>公開日: {new Date(content.publishedAt).toLocaleDateString('ja-JP')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/50">
                        <Link
                          href={`/dashboard/contents/${content.id}`}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                        >
                          編集
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`コンテンツ「${content.title}」を削除しますか？`)) {
                              deleteMutation.mutate(content.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                        >
                          削除
                        </button>
                        {content.status === 'DRAFT' && (
                          <button
                            onClick={async () => {
                              try {
                                await apiClient.patch(`/api/content/${content.id}`, { status: 'PUBLISHED' });
                                queryClient.invalidateQueries({ queryKey: ['university-contents'] });
                              } catch (error) {
                                console.error('Failed to publish content:', error);
                                alert('公開に失敗しました');
                              }
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all"
                          >
                            公開する
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <h3 className="text-3xl font-bold text-slate-800 mb-3">コンテンツが見つかりません</h3>
                  <p className="text-slate-600 mb-8">この大学にはまだコンテンツが登録されていません。</p>
                  <Link
                    href={`/dashboard/contents/new?universityId=${id}`}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>最初のコンテンツを作成</span>
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

