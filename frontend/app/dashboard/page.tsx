'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { Content, ProcedureFlow, ProcedureProgress } from '@/lib/types';
import { allUniversityContents } from '@/lib/universityMockData';
import { sampleContents } from '@/lib/sampleData';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const userRole = user?.role || 'USER';

  // ログインチェックを一時的に無効化
  // useEffect(() => {
  //   if (!token) {
  //     router.push('/login');
  //   }
  // }, [router, token]);

  // 大学一覧を取得
  const { data: universities } = useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/university/active');
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch universities:', error);
        return [];
      }
    },
  });

  // APIから各大学のコンテンツを取得
  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ['contents', universities],
    queryFn: async () => {
      try {
        // 全コンテンツを取得（大学IDでフィルタリング可能）
        const response = await apiClient.get('/api/content');
        const allContents = response.data || [];
        
        // 大学に関連するコンテンツのみを返す（universityIdが設定されているもの）
        const universityContents = allContents.filter((content: Content) => content.universityId != null);
        
        // 大学に関連するコンテンツがある場合はそれを返す、なければ全コンテンツを返す
        const result = universityContents.length > 0 ? universityContents : allContents;
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Fetched contents:', result.length, 'items');
        }
        
        return result;
      } catch (error: any) {
        // APIが失敗した場合、エラーログを出力
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          if (process.env.NODE_ENV === 'development') {
            console.warn('API接続エラー: バックエンドサーバーが起動していない可能性があります。');
          }
        } else {
          console.warn('API request failed:', error);
        }
        // APIが失敗した場合、サンプルデータとモックデータをフォールバックとして使用
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using sample data as fallback');
        }
        // サンプルデータとモックデータを結合
        return [...sampleContents, ...allUniversityContents];
      }
    },
    enabled: true, // 常に有効
    retry: false, // 接続エラーの場合はリトライしない
    refetchOnWindowFocus: false, // ウィンドウフォーカス時の自動再取得を無効化
  });

  // 手続きフローを取得（学生・父兄向け）
  const { data: procedureFlows } = useQuery<ProcedureFlow[]>({
    queryKey: ['procedure-flows', userId],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/procedure-flow');
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch procedure flows:', error);
        return [];
      }
    },
    enabled: !!(userId && (userRole === 'STUDENT' || userRole === 'PARENT')),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // 手続き進捗を取得（学生・父兄向け）
  const { data: procedureProgress } = useQuery<ProcedureProgress[]>({
    queryKey: ['procedure-progress', userId],
    queryFn: async () => {
      try {
        if (!userId) return [];
        const response = await apiClient.get(`/api/procedure-progress/user/${userId}`);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch procedure progress:', error);
        return [];
      }
    },
    enabled: !!(userId && (userRole === 'STUDENT' || userRole === 'PARENT')),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleLogout = () => {
    clearAuth();
    router.push('/'); // ログアウト後はルートパス（ダッシュボード）に戻る
  };

  // ユーザー情報がない場合の表示を変更
  // if (!user) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <nav className="glass-effect border-b border-white/30 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Image
                  src="/PC.png"
                  alt="CMS Logo"
                  width={56}
                  height={56}
                  className="object-contain w-full h-full"
                  priority
                  unoptimized
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text bg-clip-text">CMS ダッシュボード</h1>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Content Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {(userRole === 'ADMIN' || userRole === 'STAFF') && (
                <Link
                  href="/dashboard/admin"
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  ⚙️ 管理者ダッシュボード
                </Link>
              )}
              {(userRole === 'ADMIN' || userRole === 'EDITOR') && (
                <Link
                  href="/dashboard/implementation-check"
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  📊 実装確認
                </Link>
              )}
              <div className="hidden sm:flex items-center space-x-3 glass-card px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/50">
                  <span className="text-white text-sm font-bold">
                    {user ? user.name.charAt(0).toUpperCase() : 'G'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {user ? user.name : 'ゲスト'}
                  </p>
                  <p className="text-xs text-slate-500">{user?.role || 'Guest'}</p>
                </div>
              </div>
              {user && (
                <button
                  onClick={handleLogout}
                  className="group relative bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>ログアウト</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          {/* 役割別ダッシュボード */}
          {(userRole === 'STUDENT' || userRole === 'PARENT') && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent mb-2">
                    {userRole === 'STUDENT' ? '学生ダッシュボード' : '父兄ダッシュボード'}
                  </h2>
                  <p className="text-slate-600 font-medium">手続きの進行状況を確認できます</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Link
                    href="/dashboard/procedures/admission"
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    入学手続きを開始
                  </Link>
                  <Link
                    href="/dashboard/procedures"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    手続きフロー一覧
                  </Link>
                </div>
              </div>

              {procedureFlows && procedureFlows.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {procedureFlows.map((flow: any) => {
                    const progress = procedureProgress?.filter((p: any) => p.flowId === flow.id) || [];
                    const completed = progress.filter((p: any) => p.status === 'COMPLETED').length;
                    const total = flow.steps?.length || 0;
                    const completionRate = total > 0 ? (completed / total) * 100 : 0;

                    return (
                      <Link
                        key={flow.id}
                        href={`/dashboard/procedures/${flow.id}`}
                        className="glass-card rounded-2xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all"
                      >
                        <h3 className="text-lg font-bold text-slate-800 mb-3">{flow.name}</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">進捗状況</span>
                            <span className="font-bold text-indigo-600">{completionRate.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500">
                            {completed} / {total} ステップ完了
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                {userRole === 'STUDENT' || userRole === 'PARENT' ? '関連コンテンツ' : 'コンテンツ管理'}
              </h2>
              <p className="text-slate-600 font-medium">
                {userRole === 'STUDENT' || userRole === 'PARENT' 
                  ? '手続きに関連するコンテンツを確認できます' 
                  : 'コンテンツを管理・編集できます'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {(userRole === 'STUDENT' || userRole === 'PARENT') && (
                <Link
                  href="/dashboard/payments"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  💰 支払い管理
                </Link>
              )}
              {(userRole === 'ADMIN' || userRole === 'STAFF') && (
                <Link
                  href="/dashboard/admin"
                  className="group relative bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>管理者ダッシュボード</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </Link>
              )}
              {(userRole === 'ADMIN' || userRole === 'EDITOR' || userRole === 'STAFF' || userRole === 'FACULTY') && (
                <>
                  <Link
                    href="/dashboard/seminars"
                    className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>セミナー・シンポジウム</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </Link>
                  <Link
                    href="/dashboard/create-sample-contents"
                    className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>サンプル作成</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </Link>
                  <Link
                    href="/dashboard/contents/new"
                    className="group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden glow-effect"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>新規作成</span>
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </Link>
                </>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="mt-6 text-slate-600 font-medium animate-pulse">読み込み中...</p>
            </div>
          ) : contents && contents.length > 0 ? (
            (() => {
              // コンテンツを大学IDでグループ化
              const contentsByUniversity = contents.reduce((acc: Record<number, Content[]>, content) => {
                const universityId = content.universityId || 0; // universityIdがない場合は0に分類
                if (!acc[universityId]) {
                  acc[universityId] = [];
                }
                acc[universityId].push(content);
                return acc;
              }, {});

              // 大学ごとにセクションを表示
              return (
                <div className="space-y-8">
                  {Object.entries(contentsByUniversity).map(([universityIdStr, universityContents]) => {
                    const universityId = parseInt(universityIdStr);
                    const university = universities?.find((u: any) => u.id === universityId);
                    const universityName = university?.name || (universityId === 0 ? '大学未設定' : `大学ID: ${universityId}`);
                    const universityCode = university?.code || '';

                    return (
                      <div key={universityId} className="animate-fade-in-up">
                        {/* 大学ヘッダー */}
                        <div className="mb-6 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">
                                {universityName}
                              </h3>
                              {universityCode && (
                                <p className="text-sm text-slate-500">コード: {universityCode}</p>
                              )}
                              <p className="text-sm text-slate-600 mt-1">
                                {universityContents.length}件のコンテンツ
                              </p>
                            </div>
                          </div>
                          {university && (
                            <Link
                              href={`/dashboard/universities/${university.id}`}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                            >
                              大学詳細
                            </Link>
                          )}
                        </div>

                        {/* コンテンツグリッド */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {universityContents.map((content, index) => (
                            <Link
                              key={content.id}
                              href={`/dashboard/contents/${content.id}`}
                              className="group card-hover animate-fade-in-up"
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              <div className="glass-card rounded-3xl p-6 h-full flex flex-col transition-all duration-500 border border-white/50 hover:border-indigo-200/50 relative overflow-hidden">
                                {/* ホバー時のグラデーションオーバーレイ */}
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500"></div>
                                
                                <div className="relative z-10 flex items-start justify-between mb-4">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 leading-tight">
                                      {content.title}
                                    </h4>
                                    {content.contentType && (
                                      <p className="text-xs text-slate-500 mb-2">{content.contentType}</p>
                                    )}
                                    <span
                                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
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
                                  <div className="ml-4 flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                      <svg className="w-6 h-6 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="relative z-10 mt-auto pt-4 border-t border-slate-200/50">
                                  <p className="text-xs text-slate-500 mb-2 truncate font-medium">
                                    <span className="text-slate-400">スラッグ:</span> {content.slug}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                      {new Date(content.updatedAt).toLocaleDateString('ja-JP', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          ) : (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="inline-block relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full shadow-2xl">
                  <svg className="w-20 h-20 text-indigo-600 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
                コンテンツがありません
              </h3>
              <p className="text-slate-600 mb-8 text-lg font-medium">最初のコンテンツを作成して始めましょう！</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard/contents/new"
                  className="group inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110 glow-effect"
                >
                  <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>新規コンテンツを作成</span>
                </Link>
                {(userRole === 'ADMIN' || userRole === 'EDITOR' || userRole === 'STAFF' || userRole === 'FACULTY') && (
                  <Link
                    href="/dashboard/create-sample-contents"
                    className="group inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110"
                  >
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>サンプルコンテンツを作成</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

