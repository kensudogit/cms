'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { Payment, University, Content } from '@/lib/types';
import { sampleUniversities, sampleContents } from '@/lib/sampleData';

// サンプル会費支払いデータ（セミナー・シンポジウム専用）
const sampleSeminarPayments: (Payment & { content?: Content })[] = [
  {
    id: 101,
    userId: 1,
    universityId: 1,
    contentId: 4,
    paymentType: 'セミナー参加費',
    amount: 5000,
    currency: 'JPY',
    status: 'COMPLETED',
    paymentMethod: 'クレジットカード',
    transactionId: 'TXN-2024-001',
    paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'AI技術セミナー参加費',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: sampleContents.find(c => c.id === 4),
  },
  {
    id: 102,
    userId: 2,
    universityId: 1,
    contentId: 5,
    paymentType: 'シンポジウム参加費',
    amount: 0,
    currency: 'JPY',
    status: 'PENDING',
    paymentMethod: '銀行振込',
    notes: '国際教育シンポジウム参加費（無料）',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: sampleContents.find(c => c.id === 5),
  },
  {
    id: 103,
    userId: 3,
    universityId: 1,
    contentId: 4,
    paymentType: 'セミナー参加費',
    amount: 5000,
    currency: 'JPY',
    status: 'PROCESSING',
    paymentMethod: '銀行振込',
    notes: 'AI技術セミナー参加費',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: sampleContents.find(c => c.id === 4),
  },
];

export default function SeminarPaymentsPage() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const userRole = useAuthStore((state) => state.user?.role);
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'>('all');

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

  const { data: payments, isLoading } = useQuery<(Payment & { content?: Content })[]>({
    queryKey: ['seminar-payments', selectedUniversityId, statusFilter],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/payment');
        let data = response.data || [];
        
        // セミナー・シンポジウム関連の支払いのみをフィルタリング
        data = data.filter((p: Payment) => p.contentId != null);
        
        if (selectedUniversityId) {
          data = data.filter((p: Payment) => p.universityId === selectedUniversityId);
        }
        
        if (statusFilter !== 'all') {
          data = data.filter((p: Payment) => p.status === statusFilter);
        }
        
        // コンテンツ情報を取得
        const paymentsWithContent = await Promise.all(
          data.map(async (payment: Payment) => {
            try {
              if (payment.contentId) {
                const contentResponse = await apiClient.get(`/api/content/${payment.contentId}`);
                return { ...payment, content: contentResponse.data };
              }
              return payment;
            } catch (error) {
              return payment;
            }
          })
        );
        
        return paymentsWithContent;
      } catch (error) {
        console.warn('Failed to fetch payments, using sample data:', error);
        let data = [...sampleSeminarPayments];
        
        if (selectedUniversityId) {
          data = data.filter(p => p.universityId === selectedUniversityId);
        }
        
        if (statusFilter !== 'all') {
          data = data.filter(p => p.status === statusFilter);
        }
        
        return data;
      }
    },
    enabled: true,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white';
      case 'PROCESSING':
        return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white';
      case 'FAILED':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white';
      case 'REFUNDED':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      case 'CANCELLED':
        return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '完了';
      case 'PROCESSING':
        return '処理中';
      case 'FAILED':
        return '失敗';
      case 'REFUNDED':
        return '返金済み';
      case 'CANCELLED':
        return 'キャンセル';
      default:
        return '未払い';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'JPY') => {
    if (currency === 'JPY') {
      return `¥${amount.toLocaleString('ja-JP')}`;
    }
    return `${amount.toLocaleString()} ${currency}`;
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
                onClick={() => router.push('/dashboard/seminars')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">セミナー・シンポジウム会費管理</h1>
                <p className="text-xs text-slate-500 font-medium">Seminar Payment Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/seminars/registrations"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
              >
                申し込み管理
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
                <label htmlFor="status" className="block text-sm font-bold text-slate-700 mb-2">
                  ステータスで絞り込み
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="all">すべて</option>
                  <option value="PENDING">未払い</option>
                  <option value="PROCESSING">処理中</option>
                  <option value="COMPLETED">完了</option>
                  <option value="FAILED">失敗</option>
                </select>
              </div>
            </div>
          </div>

          {/* 統計情報 */}
          {payments && payments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">総件数</p>
                <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">未払い</p>
                <p className="text-2xl font-bold text-amber-600">
                  {payments.filter(p => p.status === 'PENDING').length}
                </p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">処理中</p>
                <p className="text-2xl font-bold text-blue-600">
                  {payments.filter(p => p.status === 'PROCESSING').length}
                </p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">完了</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {payments.filter(p => p.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="glass-card rounded-3xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-800">
                          {payment.content?.title || 'セミナー・シンポジウム'}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">支払い金額</p>
                          <p className="text-lg font-bold text-indigo-600">
                            {formatCurrency(payment.amount, payment.currency)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">支払い方法</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {payment.paymentMethod || '未設定'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">支払い日</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {payment.paidAt 
                              ? new Date(payment.paidAt).toLocaleDateString('ja-JP')
                              : '未払い'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">取引ID</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {payment.transactionId || '未設定'}
                          </p>
                        </div>
                      </div>
                      {payment.notes && (
                        <p className="text-sm text-slate-600 mt-3">備考: {payment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/50">
                    {(userRole === 'ADMIN' || userRole === 'STAFF') && payment.status === 'PENDING' && (
                      <Link
                        href={`/dashboard/payments/${payment.id}/reconciliation`}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        入金消込
                      </Link>
                    )}
                    <Link
                      href={`/dashboard/payments/${payment.id}`}
                      className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-3xl font-bold text-slate-800 mb-3">会費記録が見つかりません</h3>
              <p className="text-slate-600">現在、会費記録はありません。</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

