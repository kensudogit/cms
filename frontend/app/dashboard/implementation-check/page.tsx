'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { University, ProcedureFlow, Content } from '@/lib/types';

function ImplementationCheckContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'universities' | 'flows' | 'contents' | 'progress'>('overview');
  
  // URLパラメータからタブを設定
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'universities', 'flows', 'contents', 'progress'].includes(tab)) {
      setSelectedTab(tab as any);
    }
  }, [searchParams]);

  const { data: universities, isLoading: universitiesLoading } = useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      const response = await apiClient.get('/api/university/active');
      return response.data;
    },
  });

  const { data: allFlows, isLoading: flowsLoading } = useQuery<ProcedureFlow[]>({
    queryKey: ['all-procedure-flows'],
    queryFn: async () => {
      if (!universities || universities.length === 0) return [];
      const flows: ProcedureFlow[] = [];
      for (const univ of universities) {
        try {
          const response = await apiClient.get(`/api/procedure-flow/university/${univ.id}`);
          flows.push(...response.data);
        } catch (error) {
          console.error(`Failed to fetch flows for university ${univ.id}:`, error);
        }
      }
      return flows;
    },
    enabled: !!universities && universities.length > 0,
  });

  const { data: allContents, isLoading: contentsLoading } = useQuery<Content[]>({
    queryKey: ['all-contents'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/content');
        return response.data;
      } catch (error) {
        console.error('Failed to fetch contents:', error);
        return [];
      }
    },
  });

  const implementationStatus = {
    universities: {
      total: universities?.length || 0,
      active: universities?.filter(u => u.active).length || 0,
      status: universities && universities.length > 0 ? '実装済み' : '未実装',
    },
    flows: {
      total: allFlows?.length || 0,
      admission: allFlows?.filter(f => f.flowType === '入学').length || 0,
      graduation: allFlows?.filter(f => f.flowType === '卒業').length || 0,
      status: allFlows && allFlows.length > 0 ? '実装済み' : '未実装',
    },
    contents: {
      total: allContents?.length || 0,
      published: allContents?.filter(c => c.status === 'PUBLISHED').length || 0,
      draft: allContents?.filter(c => c.status === 'DRAFT').length || 0,
      status: allContents && allContents.length > 0 ? '実装済み' : '未実装',
    },
    steps: {
      total: allFlows?.reduce((sum, flow) => sum + (flow.steps?.length || 0), 0) || 0,
      status: '実装済み',
    },
  };

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
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">実装確認</h1>
                <p className="text-xs text-slate-500 font-medium">Implementation Check</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          {/* タブナビゲーション */}
          <div className="mb-6">
            <div className="flex space-x-2 border-b border-slate-200">
              {[
                { id: 'overview', label: '概要', icon: '📊' },
                { id: 'universities', label: '大学', icon: '🏫' },
                { id: 'flows', label: '手続きフロー', icon: '🔄' },
                { id: 'contents', label: 'コンテンツ', icon: '📄' },
                { id: 'progress', label: '進行状況', icon: '📈' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`px-6 py-3 font-semibold text-sm transition-all ${
                    selectedTab === tab.id
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 概要タブ */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-8 border border-white/50">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">実装状況概要</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-800">大学</h3>
                      <span className="text-3xl">🏫</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-indigo-600">{implementationStatus.universities.total}</p>
                      <p className="text-sm text-slate-600">有効: {implementationStatus.universities.active}</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        implementationStatus.universities.status === '実装済み'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {implementationStatus.universities.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-800">手続きフロー</h3>
                      <span className="text-3xl">🔄</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-purple-600">{implementationStatus.flows.total}</p>
                      <p className="text-sm text-slate-600">入学: {implementationStatus.flows.admission} / 卒業: {implementationStatus.flows.graduation}</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        implementationStatus.flows.status === '実装済み'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {implementationStatus.flows.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-800">コンテンツ</h3>
                      <span className="text-3xl">📄</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-emerald-600">{implementationStatus.contents.total}</p>
                      <p className="text-sm text-slate-600">公開: {implementationStatus.contents.published} / 下書き: {implementationStatus.contents.draft}</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        implementationStatus.contents.status === '実装済み'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {implementationStatus.contents.status}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-800">手続きステップ</h3>
                      <span className="text-3xl">📋</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-amber-600">{implementationStatus.steps.total}</p>
                      <p className="text-sm text-slate-600">全フロー合計</p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        {implementationStatus.steps.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-8 border border-white/50">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">実装済み機能</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: '手続きフロー管理', status: '✅ 実装済み', link: '/dashboard/procedures' },
                    { name: '入学手続き処理', status: '✅ 実装済み', link: '/dashboard/procedures/admission' },
                    { name: '手続き進行状況管理', status: '✅ 実装済み', link: '/dashboard/procedures' },
                    { name: '役割別ダッシュボード', status: '✅ 実装済み', link: '/dashboard' },
                    { name: 'コンテンツ管理', status: '✅ 実装済み', link: '/dashboard/contents' },
                    { name: '大学管理', status: '✅ 実装済み', link: '/dashboard/universities' },
                  ].map((feature) => (
                    <Link
                      key={feature.name}
                      href={feature.link}
                      className="flex items-center justify-between p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all border border-white/50"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{feature.name}</p>
                        <p className="text-sm text-slate-600">{feature.status}</p>
                      </div>
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 大学タブ */}
          {selectedTab === 'universities' && (
            <div className="glass-card rounded-3xl p-8 border border-white/50">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">大学一覧</h2>
              {universitiesLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                  <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
                </div>
              ) : universities && universities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universities.map((univ) => (
                    <div key={univ.id} className="bg-white/60 rounded-2xl p-6 border border-white/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 mb-2">{univ.name}</h3>
                          <p className="text-sm text-slate-600 mb-2">コード: {univ.code}</p>
                          {univ.domain && (
                            <p className="text-sm text-slate-600 mb-2">ドメイン: {univ.domain}</p>
                          )}
                          {univ.description && (
                            <p className="text-sm text-slate-500 line-clamp-2">{univ.description}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          univ.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {univ.active ? '有効' : '無効'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 pt-4 border-t border-slate-200">
                        <Link
                          href={`/dashboard/procedures/admission?university=${univ.id}`}
                          className="flex-1 text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                        >
                          入学手続き
                        </Link>
                        <Link
                          href={`/dashboard/procedures?university=${univ.id}`}
                          className="flex-1 text-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all"
                        >
                          フロー一覧
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-600 text-lg">大学データがありません</p>
                </div>
              )}
            </div>
          )}

          {/* 手続きフロータブ */}
          {selectedTab === 'flows' && (
            <div className="glass-card rounded-3xl p-8 border border-white/50">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">手続きフロー一覧</h2>
              {flowsLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                  <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
                </div>
              ) : allFlows && allFlows.length > 0 ? (
                <div className="space-y-4">
                  {allFlows.map((flow) => (
                    <div key={flow.id} className="bg-white/60 rounded-2xl p-6 border border-white/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 mb-2">{flow.name}</h3>
                          {flow.description && (
                            <p className="text-sm text-slate-600 mb-2">{flow.description}</p>
                          )}
                          <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                              {flow.flowType}
                            </span>
                            <span className="text-sm text-slate-600">
                              ステップ数: {flow.steps?.length || 0}
                            </span>
                            <span className="text-sm text-slate-600">
                              大学ID: {flow.universityId}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          flow.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {flow.active ? '有効' : '無効'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 pt-4 border-t border-slate-200">
                        <Link
                          href={`/dashboard/procedures/${flow.id}`}
                          className="flex-1 text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                        >
                          詳細を見る
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-600 text-lg">手続きフローがありません</p>
                </div>
              )}
            </div>
          )}

          {/* コンテンツタブ */}
          {selectedTab === 'contents' && (
            <div className="glass-card rounded-3xl p-8 border border-white/50">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">コンテンツ一覧</h2>
              {contentsLoading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                  <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
                </div>
              ) : allContents && allContents.length > 0 ? (
                <div className="space-y-4">
                  {allContents.map((content) => (
                    <div key={content.id} className="bg-white/60 rounded-2xl p-6 border border-white/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 mb-2">{content.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">スラッグ: {content.slug}</p>
                          {content.universityId && (
                            <p className="text-sm text-slate-600 mb-2">大学ID: {content.universityId}</p>
                          )}
                          {content.contentType && (
                            <p className="text-sm text-slate-600 mb-2">タイプ: {content.contentType}</p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          content.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : content.status === 'DRAFT'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {content.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 pt-4 border-t border-slate-200">
                        <Link
                          href={`/dashboard/contents/${content.id}`}
                          className="flex-1 text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                        >
                          詳細を見る
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-600 text-lg">コンテンツがありません</p>
                </div>
              )}
            </div>
          )}

          {/* 進行状況タブ */}
          {selectedTab === 'progress' && (
            <div className="glass-card rounded-3xl p-8 border border-white/50">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">実装の進行状況</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">完了した機能</h3>
                  <div className="space-y-2">
                    {[
                      '手続きフロー管理機能',
                      '手続きステップ管理機能',
                      '手続き進行状況管理機能',
                      '役割別ダッシュボード（学生、父兄、大学関係者）',
                      '入学手続き処理機能',
                      '各大学のコンテンツ管理',
                      '依存ステップの自動チェック',
                      '進捗率の自動計算',
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-800 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">実装済みAPI</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'GET /api/procedure-flow/university/{id}',
                      'GET /api/procedure-flow/{id}/university/{id}',
                      'POST /api/procedure-flow',
                      'GET /api/procedure-step/flow/{id}',
                      'POST /api/procedure-step',
                      'GET /api/procedure-progress/user/{id}/flow/{id}',
                      'POST /api/procedure-progress/start/user/{id}/step/{id}',
                      'POST /api/procedure-progress/complete/user/{id}/step/{id}',
                    ].map((api, index) => (
                      <div key={index} className="p-3 bg-indigo-50 rounded-lg">
                        <code className="text-sm text-indigo-800 font-mono">{api}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ImplementationCheckPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
        </div>
      </div>
    }>
      <ImplementationCheckContent />
    </Suspense>
  );
}

