'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { University, Content, Payment, SeminarRegistration } from '@/lib/types';
import { sampleUniversities, sampleContents, samplePayments } from '@/lib/sampleData';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function AdminDashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userRole = useAuthStore((state) => state.user?.role);

  // 管理者権限チェック
  if (userRole !== 'ADMIN' && userRole !== 'STAFF') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">アクセス権限がありません</h2>
          <p className="text-slate-600 mb-6">このページは管理者のみアクセスできます。</p>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    );
  }

  // 統計データを取得
  const { data: universities } = useQuery<University[]>({
    queryKey: ['admin-universities'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/university');
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch universities, using sample data:', error);
        return sampleUniversities;
      }
    },
  });

  const { data: contents } = useQuery<Content[]>({
    queryKey: ['admin-contents'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/content');
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch contents, using sample data:', error);
        return sampleContents;
      }
    },
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/payment');
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch payments, using sample data:', error);
        return samplePayments;
      }
    },
  });

  // 統計情報を計算
  const stats = {
    universities: universities?.length || 0,
    activeUniversities: universities?.filter(u => u.active).length || 0,
    contents: contents?.length || 0,
    publishedContents: contents?.filter(c => c.status === 'PUBLISHED').length || 0,
    totalPayments: payments?.length || 0,
    completedPayments: payments?.filter(p => p.status === 'COMPLETED').length || 0,
    pendingPayments: payments?.filter(p => p.status === 'PENDING').length || 0,
    totalAmount: payments?.reduce((sum, p) => sum + (p.status === 'COMPLETED' ? p.amount : 0), 0) || 0,
  };

  const adminMenuItems = [
    {
      title: '大学管理',
      description: '大学の登録・編集・削除',
      href: '/dashboard/universities',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'コンテンツ管理',
      description: 'コンテンツの作成・編集・公開管理',
      href: '/dashboard/contents',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: '手続きフロー管理',
      description: '手続きフローの作成・編集・管理',
      href: '/dashboard/procedures',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: '支払い管理',
      description: '支払い記録の確認・管理',
      href: '/dashboard/payments',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'セミナー・シンポジウム',
      description: 'セミナー・シンポジウムの管理',
      href: '/dashboard/seminars',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: '申し込み管理',
      description: 'セミナー・シンポジウムの申し込み管理',
      href: '/dashboard/seminars/registrations',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: '会費管理',
      description: 'セミナー・シンポジウムの会費管理',
      href: '/dashboard/seminars/payments',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: '入金消込',
      description: '入金の消込管理',
      href: '/dashboard/payments/reconciliation',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'from-teal-500 to-cyan-600',
    },
    {
      title: 'ユーザー管理',
      description: 'ユーザーの登録・編集・削除',
      href: '/dashboard/admin/users',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-violet-500 to-purple-600',
    },
    {
      title: '実装確認',
      description: 'システムの実装状況を確認',
      href: '/dashboard/implementation-check',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-slate-500 to-gray-600',
    },
  ];

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
                    onClick={() => router.push('/dashboard')}
                    className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
                  >
                    <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold gradient-text bg-clip-text">管理者ダッシュボード</h1>
                    <p className="text-xs text-slate-500 font-medium">Admin Dashboard</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{user?.name || '管理者'}</p>
                    <p className="text-xs text-slate-500">{user?.role || 'ADMIN'}</p>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          {/* 統計情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card rounded-3xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1 font-semibold">大学数</p>
              <p className="text-3xl font-bold text-slate-800">{stats.universities}</p>
              <p className="text-xs text-slate-500 mt-2">有効: {stats.activeUniversities}</p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1 font-semibold">コンテンツ数</p>
              <p className="text-3xl font-bold text-slate-800">{stats.contents}</p>
              <p className="text-xs text-slate-500 mt-2">公開中: {stats.publishedContents}</p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1 font-semibold">支払い記録</p>
              <p className="text-3xl font-bold text-slate-800">{stats.totalPayments}</p>
              <p className="text-xs text-slate-500 mt-2">完了: {stats.completedPayments} / 保留: {stats.pendingPayments}</p>
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-1 font-semibold">入金総額</p>
              <p className="text-3xl font-bold text-slate-800">¥{stats.totalAmount.toLocaleString('ja-JP')}</p>
              <p className="text-xs text-slate-500 mt-2">完了分のみ</p>
            </div>
          </div>

          {/* 管理メニュー */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">管理機能</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminMenuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="group glass-card rounded-3xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-white`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                  <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-700">
                    <span className="text-sm font-semibold">管理画面へ</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 最近の活動 */}
          <div className="glass-card rounded-3xl p-6 border border-white/50">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">最近の活動</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">新しいコンテンツが作成されました</p>
                  <p className="text-xs text-slate-500">1時間前</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">支払いが完了しました</p>
                  <p className="text-xs text-slate-500">2時間前</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">新しい大学が登録されました</p>
                  <p className="text-xs text-slate-500">3時間前</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
        </div>
      </div>
    </div>
  );
}

