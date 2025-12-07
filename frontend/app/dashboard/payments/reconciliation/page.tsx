'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { Payment, PaymentReconciliation, University } from '@/lib/types';
import { sampleUniversities, samplePayments } from '@/lib/sampleData';

// サンプル入金消込データ
const sampleReconciliations: PaymentReconciliation[] = [
  {
    id: 1,
    paymentId: 1,
    userId: 1,
    universityId: 1,
    reconciledAmount: 300000,
    status: 'COMPLETED',
    reconciliationMethod: '銀行振込',
    reconciledAt: new Date().toISOString(),
    reconciledBy: 1,
    notes: '入金確認済み',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function PaymentReconciliationListPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);
  const userRole = useAuthStore((state) => state.user?.role);
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'>('all');

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

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ['payments-for-reconciliation', selectedUniversityId],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/payment');
        let data = response.data || [];
        
        if (selectedUniversityId) {
          data = data.filter((p: Payment) => p.universityId === selectedUniversityId);
        }
        
        // 消込が必要な支払い（PENDINGまたはPROCESSING）をフィルタリング
        data = data.filter((p: Payment) => 
          p.status === 'PENDING' || p.status === 'PROCESSING' || !p.reconciliation
        );
        
        return data;
      } catch (error) {
        console.warn('Failed to fetch payments, using sample data:', error);
        let data = samplePayments.filter(p => 
          p.status === 'PENDING' || p.status === 'PROCESSING'
        );
        
        if (selectedUniversityId) {
          data = data.filter(p => p.universityId === selectedUniversityId);
        }
        
        return data;
      }
    },
    enabled: true,
  });

  const { data: reconciliations } = useQuery<PaymentReconciliation[]>({
    queryKey: ['reconciliations', selectedUniversityId, statusFilter],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/payment-reconciliation');
        let data = response.data || [];
        
        if (selectedUniversityId) {
          data = data.filter((r: PaymentReconciliation) => r.universityId === selectedUniversityId);
        }
        
        if (statusFilter !== 'all') {
          data = data.filter((r: PaymentReconciliation) => r.status === statusFilter);
        }
        
        return data;
      } catch (error) {
        console.warn('Failed to fetch reconciliations, using sample data:', error);
        let data = [...sampleReconciliations];
        
        if (selectedUniversityId) {
          data = data.filter(r => r.universityId === selectedUniversityId);
        }
        
        if (statusFilter !== 'all') {
          data = data.filter(r => r.status === statusFilter);
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
      case 'IN_PROGRESS':
        return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white';
      case 'PENDING':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      case 'FAILED':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white';
      case 'CANCELLED':
        return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '完了';
      case 'IN_PROGRESS':
        return '進行中';
      case 'PENDING':
        return '保留中';
      case 'FAILED':
        return '失敗';
      case 'CANCELLED':
        return 'キャンセル';
      default:
        return '不明';
    }
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
                onClick={() => router.push('/dashboard/payments')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">入金消込管理</h1>
                <p className="text-xs text-slate-500 font-medium">Payment Reconciliation Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/admin"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all"
              >
                管理者ダッシュボード
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
                  <option value="PENDING">保留中</option>
                  <option value="IN_PROGRESS">進行中</option>
                  <option value="COMPLETED">完了</option>
                  <option value="FAILED">失敗</option>
                </select>
              </div>
            </div>
          </div>

          {/* 消込待ちの支払い */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">消込待ちの支払い</h2>
            {payments && payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="glass-card rounded-3xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-800">
                            支払いID: {payment.id} - {payment.paymentType}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            payment.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                            payment.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {payment.status === 'PENDING' ? '未払い' :
                             payment.status === 'PROCESSING' ? '処理中' : payment.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">支払い金額</p>
                            <p className="text-lg font-bold text-indigo-600">
                              ¥{payment.amount.toLocaleString('ja-JP')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">支払い方法</p>
                            <p className="text-sm font-semibold text-slate-800">
                              {payment.paymentMethod || '未設定'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">作成日</p>
                            <p className="text-sm font-semibold text-slate-800">
                              {new Date(payment.createdAt).toLocaleDateString('ja-JP')}
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
                      <Link
                        href={`/dashboard/payments/${payment.id}/reconciliation`}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        消込を実行
                      </Link>
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
              <div className="text-center py-12 bg-white/50 rounded-2xl">
                <p className="text-slate-600">消込待ちの支払いはありません</p>
              </div>
            )}
          </div>

          {/* 消込履歴 */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-4">消込履歴</h2>
            {reconciliations && reconciliations.length > 0 ? (
              <div className="space-y-4">
                {reconciliations.map((reconciliation) => (
                  <div
                    key={reconciliation.id}
                    className="glass-card rounded-3xl p-6 border border-white/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-800">
                            消込ID: {reconciliation.id} - 支払いID: {reconciliation.paymentId}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(reconciliation.status)}`}>
                            {getStatusText(reconciliation.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">消込金額</p>
                            <p className="text-lg font-bold text-indigo-600">
                              ¥{reconciliation.reconciledAmount.toLocaleString('ja-JP')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">消込方法</p>
                            <p className="text-sm font-semibold text-slate-800">
                              {reconciliation.reconciliationMethod || '未設定'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">消込日</p>
                            <p className="text-sm font-semibold text-slate-800">
                              {reconciliation.reconciledAt 
                                ? new Date(reconciliation.reconciledAt).toLocaleDateString('ja-JP')
                                : '未消込'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">作成日</p>
                            <p className="text-sm font-semibold text-slate-800">
                              {new Date(reconciliation.createdAt).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                        </div>
                        {reconciliation.notes && (
                          <p className="text-sm text-slate-600 mt-3">備考: {reconciliation.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/50">
                      <Link
                        href={`/dashboard/payments/${reconciliation.paymentId}/reconciliation/${reconciliation.id}`}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        詳細を見る
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/50 rounded-2xl">
                <p className="text-slate-600">消込履歴はありません</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

