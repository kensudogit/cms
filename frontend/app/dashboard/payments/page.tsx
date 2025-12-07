'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { Payment, University } from '@/lib/types';
import { samplePayments, sampleUniversities } from '@/lib/sampleData';
import { AdminSidebar } from '@/components/AdminSidebar';

export default function PaymentsPage() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const userRole = useAuthStore((state) => state.user?.role);
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);

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

  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['payments', userId, selectedUniversityId],
    queryFn: async () => {
      if (!userId) return samplePayments;
      try {
        if (selectedUniversityId) {
          const response = await apiClient.get(`/api/payment/user/${userId}/university/${selectedUniversityId}`);
          return response.data || [];
        }
        const response = await apiClient.get(`/api/payment/user/${userId}`);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch payments, using sample data:', error);
        // 選択された大学でフィルタリング
        if (selectedUniversityId) {
          return samplePayments.filter(p => p.universityId === selectedUniversityId);
        }
        return samplePayments;
      }
    },
    enabled: true, // 常に有効にしてサンプルデータを表示
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
                    <h1 className="text-2xl font-bold gradient-text bg-clip-text">支払い管理</h1>
                    <p className="text-xs text-slate-500 font-medium">Payment Management</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/payments/new"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>新規登録</span>
                </Link>
              </div>
            </div>
          </nav>

          <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <label htmlFor="university" className="block text-sm font-bold text-slate-700 mb-2">
              大学を選択（オプション）
            </label>
            <select
              id="university"
              value={selectedUniversityId || ''}
              onChange={(e) => setSelectedUniversityId(e.target.value ? Number(e.target.value) : null)}
              className="block w-full max-w-md border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
            >
              <option value="">すべての大学</option>
              {(universities && universities.length > 0 ? universities : sampleUniversities).map((univ: University) => (
                <option key={univ.id} value={univ.id}>
                  {univ.name} {!universities || universities.length === 0 ? '(サンプル)' : ''}
                </option>
              ))}
            </select>
          </div>

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
                  className="glass-card rounded-2xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-slate-800">{payment.paymentType}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">金額</p>
                          <p className="text-lg font-bold text-slate-800">{formatCurrency(payment.amount, payment.currency)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">支払い方法</p>
                          <p className="text-sm font-semibold text-slate-700">{payment.paymentMethod || '未設定'}</p>
                        </div>
                        {payment.paidAt && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">支払い日時</p>
                            <p className="text-sm font-semibold text-slate-700">
                              {new Date(payment.paidAt).toLocaleString('ja-JP')}
                            </p>
                          </div>
                        )}
                        {payment.reconciliation && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">消込状況</p>
                            <p className="text-sm font-semibold text-emerald-600">
                              {payment.reconciliation.status === 'COMPLETED' ? '消込完了' : '未消込'}
                            </p>
                          </div>
                        )}
                      </div>
                      {payment.notes && (
                        <p className="text-sm text-slate-600 mt-3">{payment.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4 border-t border-slate-200/50">
                    <Link
                      href={`/dashboard/payments/${payment.id}`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                    >
                      詳細を見る
                    </Link>
                    {payment.reconciliation && (
                      <Link
                        href={`/dashboard/payments/${payment.id}/reconciliation`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        消込処理
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-3xl font-bold text-slate-800 mb-3">支払い記録がありません</h3>
              <p className="text-slate-600 mb-8">入学手続きを進めると、支払い記録が表示されます。</p>
            </div>
          )}
        </div>
      </main>
        </div>
      </div>
    </div>
  );
}

