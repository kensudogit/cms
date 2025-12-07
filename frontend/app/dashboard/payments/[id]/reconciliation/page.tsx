'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { Payment, PaymentReconciliationRequest } from '@/lib/types';

export default function PaymentReconciliationPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.id as string;
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);
  const reconciledBy = useAuthStore((state) => state.userId);

  const { data: payment, isLoading } = useQuery<Payment>({
    queryKey: ['payment', paymentId, userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const response = await apiClient.get(`/api/payment/${paymentId}/user/${userId}`);
      return response.data;
    },
    enabled: !!paymentId && !!userId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PaymentReconciliationRequest>({
    defaultValues: {
      paymentId: paymentId ? Number(paymentId) : undefined,
      userId: userId || undefined,
      universityId: payment?.universityId || undefined,
      reconciledAmount: payment?.amount || 0,
      status: 'PENDING',
      reconciliationMethod: '手動',
    },
  });

  const reconciliationMutation = useMutation({
    mutationFn: async (data: PaymentReconciliationRequest) => {
      const response = await apiClient.post('/api/payment-reconciliation', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment', paymentId] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      router.push(`/dashboard/payments/${paymentId}`);
    },
  });

  const onSubmit = async (data: PaymentReconciliationRequest) => {
    if (!payment) return;
    reconciliationMutation.mutate({
      ...data,
      paymentId: payment.id,
      userId: payment.userId,
      universityId: payment.universityId,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center py-20">
          <h3 className="text-3xl font-bold text-slate-800 mb-3">支払い記録が見つかりません</h3>
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

      <nav className="glass-effect border-b border-white/30 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/dashboard/payments/${paymentId}`)}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">消込処理</h1>
                <p className="text-xs text-slate-500 font-medium">Payment Reconciliation</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="glass-card rounded-3xl p-8 border border-white/50">
            <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">支払い情報</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">支払い種別</p>
                  <p className="text-sm font-bold text-slate-800">{payment.paymentType}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">支払い金額</p>
                  <p className="text-lg font-bold text-indigo-600">¥{payment.amount.toLocaleString('ja-JP')}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="reconciledAmount" className="block text-sm font-bold text-slate-700">
                  <span>消込金額</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('reconciledAmount', { 
                    required: '消込金額は必須です',
                    valueAsNumber: true,
                    min: { value: 0.01, message: '消込金額は0より大きい必要があります' }
                  })}
                  type="number"
                  step="0.01"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                />
                {errors.reconciledAmount && (
                  <p className="text-sm text-red-600">{errors.reconciledAmount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="reconciliationMethod" className="block text-sm font-bold text-slate-700">
                  消込方法
                </label>
                <select
                  {...register('reconciliationMethod')}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="手動">手動</option>
                  <option value="自動">自動</option>
                  <option value="銀行確認">銀行確認</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-bold text-slate-700">
                  備考
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium"
                  placeholder="消込処理に関する備考を入力"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200/50">
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/payments/${paymentId}`)}
                  className="px-6 py-3 border-2 border-slate-300 rounded-xl shadow-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={reconciliationMutation.isPending}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reconciliationMutation.isPending ? '処理中...' : '消込処理を実行'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}


