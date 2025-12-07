'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { Content, University } from '@/lib/types';
import { sampleContents, sampleUniversities } from '@/lib/sampleData';

export default function SeminarsPage() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'セミナー' | 'シンポジウム'>('all');

  const { data: universities } = useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/university/active');
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch universities, using sample data:', error);
        return sampleUniversities;
      }
    },
  });

  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ['seminars', selectedUniversityId],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/content');
        const allContents = response.data || [];
        
        // セミナー・シンポジウムのコンテンツをフィルタリング
        let filtered = allContents.filter((content: Content) => 
          content.contentType === 'セミナー' || content.contentType === 'シンポジウム'
        );

        // 大学でフィルタリング
        if (selectedUniversityId) {
          filtered = filtered.filter((content: Content) => 
            content.universityId === selectedUniversityId
          );
        }

        if (filtered.length === 0) {
          // APIからデータが取得できない場合、サンプルデータを返す
          const sampleSeminars = sampleContents.filter(c => 
            c.contentType === 'セミナー' || c.contentType === 'シンポジウム'
          );
          if (selectedUniversityId) {
            return sampleSeminars.filter(s => s.universityId === selectedUniversityId);
          }
          return sampleSeminars;
        }

        return filtered;
      } catch (error) {
        console.warn('Failed to fetch seminars, using sample data:', error);
        // エラー時はサンプルデータを返す
        const sampleSeminars = sampleContents.filter(c => 
          c.contentType === 'セミナー' || c.contentType === 'シンポジウム'
        );
        if (selectedUniversityId) {
          return sampleSeminars.filter(s => s.universityId === selectedUniversityId);
        }
        return sampleSeminars;
      }
    },
    enabled: true,
  });

  // コンテンツタイプでフィルタリング
  const filteredContents = contents?.filter(content => {
    if (contentTypeFilter === 'all') return true;
    return content.contentType === contentTypeFilter;
  }) || [];

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
                onClick={() => router.push('/dashboard')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">セミナー・シンポジウム</h1>
                <p className="text-xs text-slate-500 font-medium">Seminars & Symposia</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/seminars/registrations"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>申し込み管理</span>
              </Link>
              <Link
                href="/dashboard/seminars/payments"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>会費管理</span>
              </Link>
              <Link
                href="/dashboard/contents/new"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-bold shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>新規登録</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          {/* フィルター */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="university" className="block text-sm font-bold text-slate-700 mb-2">
                  大学を選択
                </label>
                <select
                  id="university"
                  value={selectedUniversityId || ''}
                  onChange={(e) => setSelectedUniversityId(e.target.value ? Number(e.target.value) : null)}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="">すべての大学</option>
                  {(universities && universities.length > 0 ? universities : sampleUniversities).map((univ: University) => (
                    <option key={univ.id} value={univ.id}>
                      {univ.name} {!universities || universities.length === 0 ? '(サンプル)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="contentType" className="block text-sm font-bold text-slate-700 mb-2">
                  種類で絞り込み
                </label>
                <select
                  id="contentType"
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value as 'all' | 'セミナー' | 'シンポジウム')}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="all">すべて</option>
                  <option value="セミナー">セミナーのみ</option>
                  <option value="シンポジウム">シンポジウムのみ</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
            </div>
          ) : filteredContents && filteredContents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContents.map((content, index) => (
                <Link
                  key={content.id}
                  href={`/dashboard/contents/${content.id}`}
                  className="group card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="glass-card rounded-3xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            content.contentType === 'セミナー' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {content.contentType}
                          </span>
                          {content.status === 'PUBLISHED' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                              公開中
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-2">
                          {content.title}
                        </h3>
                        {content.metaDescription && (
                          <p className="text-sm text-slate-600 line-clamp-3 mb-3">{content.metaDescription}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-200/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {content.publishedAt 
                            ? new Date(content.publishedAt).toLocaleDateString('ja-JP')
                            : '日付未設定'}
                        </span>
                        <svg className="w-5 h-5 text-indigo-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-3xl font-bold text-slate-800 mb-3">セミナー・シンポジウムが見つかりません</h3>
              <p className="text-slate-600 mb-8">新しいセミナー・シンポジウムを登録して始めましょう！</p>
              <Link
                href="/dashboard/contents/new"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>新規登録</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

