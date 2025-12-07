'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { Payment, University, PaymentRequest } from '@/lib/types';

export default function PaymentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);
  const userRole = useAuthStore((state) => state.user?.role);

  const { data: payment, isLoading } = useQuery<Payment>({
    queryKey: ['payment', id, userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const response = await apiClient.get(`/api/payment/${id}/user/${userId}`);
      return response.data;
    },
    enabled: !!id && !!userId,
  });

  const { data: universities } = useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      const response = await apiClient.get('/api/university/active');
      return response.data;
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentRequest>({
    defaultValues: {
      userId: payment?.userId || userId || undefined,
      universityId: payment?.universityId || undefined,
      flowId: payment?.flowId || undefined,
      paymentType: payment?.paymentType || '入学金',
      amount: payment?.amount || 0,
      currency: payment?.currency || 'JPY',
      status: payment?.status || 'PENDING',
      paymentMethod: payment?.paymentMethod || '銀行振込',
      transactionId: payment?.transactionId || '',
      notes: payment?.notes || '',
    },
  });

  useEffect(() => {
    if (payment) {
      reset({
        userId: payment.userId,
        universityId: payment.universityId,
        flowId: payment.flowId,
        paymentType: payment.paymentType,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod || '銀行振込',
        transactionId: payment.transactionId || '',
        notes: payment.notes || '',
      });
    }
  }, [payment, reset]);

  const updatePaymentMutation = useMutation({
    mutationFn: async (data: PaymentRequest) => {
      if (!userId) throw new Error('User not authenticated');
      const response = await apiClient.put(`/api/payment/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment', id] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setIsEditing(false);
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      await apiClient.delete(`/api/payment/${id}/user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      router.push('/dashboard/payments');
    },
  });

  const completePaymentMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const response = await apiClient.post(`/api/payment/${id}/user/${userId}/complete`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment', id] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const onSubmit = (data: PaymentRequest) => {
    updatePaymentMutation.mutate(data);
  };

  const handleDelete = () => {
    if (confirm('この支払い記録を削除してもよろしいですか？')) {
      deletePaymentMutation.mutate();
    }
  };

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
          <button
            onClick={() => router.push('/dashboard/payments')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all"
          >
            支払い一覧に戻る
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
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">支払い詳細</h1>
                <p className="text-xs text-slate-500 font-medium">Payment Details</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="glass-card rounded-3xl p-8 border border-white/50">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-slate-800">{payment.paymentType}</h2>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(payment.status)}`}>
                  {getStatusText(payment.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs text-slate-500 mb-2 font-semibold">支払い金額</p>
                  <p className="text-3xl font-bold text-indigo-600">{formatCurrency(payment.amount, payment.currency)}</p>
                </div>
                <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-xs text-slate-500 mb-2 font-semibold">支払い方法</p>
                  <p className="text-lg font-bold text-slate-800">{payment.paymentMethod || '未設定'}</p>
                </div>
                {payment.transactionId && (
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-xs text-slate-500 mb-2 font-semibold">取引ID</p>
                    <p className="text-sm font-bold text-slate-800 font-mono">{payment.transactionId}</p>
                  </div>
                )}
                {payment.paidAt && (
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-xs text-slate-500 mb-2 font-semibold">支払い日時</p>
                    <p className="text-sm font-bold text-slate-800">
                      {new Date(payment.paidAt).toLocaleString('ja-JP')}
                    </p>
                  </div>
                )}
            </div>

            {payment.reconciliation && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    消込情報
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">消込金額</p>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatCurrency(payment.reconciliation.reconciledAmount, payment.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">消込状況</p>
                      <p className="text-sm font-bold text-slate-800">
                        {payment.reconciliation.status === 'COMPLETED' ? '消込完了' : '未消込'}
                      </p>
                    </div>
                    {payment.reconciliation.reconciledAt && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">消込日時</p>
                        <p className="text-sm font-bold text-slate-800">
                          {new Date(payment.reconciliation.reconciledAt).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
            )}

            {payment.notes && (
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <p className="text-xs text-slate-500 mb-2 font-semibold">備考</p>
                  <p className="text-sm text-slate-700">{payment.notes}</p>
                </div>
            )}

            {payment.reconciliation && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                      <svg className="w-6 h-6 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      消込情報
                    </h3>
                    {(userRole === 'ADMIN' || userRole === 'STAFF' || userRole === 'FACULTY') && (
                      <Link
                        href={`/dashboard/payments/${payment.id}/reconciliation/${payment.reconciliation.id}`}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                      >
                        編集
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">消込金額</p>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatCurrency(payment.reconciliation.reconciledAmount, payment.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">消込状況</p>
                      <p className="text-sm font-bold text-slate-800">
                        {payment.reconciliation.status === 'COMPLETED' ? '消込完了' : '未消込'}
                      </p>
                    </div>
                    {payment.reconciliation.reconciledAt && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">消込日時</p>
                        <p className="text-sm font-bold text-slate-800">
                          {new Date(payment.reconciliation.reconciledAt).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    )}
                    {payment.reconciliation.reconciliationMethod && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">消込方法</p>
                        <p className="text-sm font-bold text-slate-800">
                          {payment.reconciliation.reconciliationMethod}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
            )}

            <div className="flex items-center space-x-4 pt-6 border-t border-slate-200/50">
                <button
                  onClick={handleDelete}
                  disabled={deletePaymentMutation.isPending}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 hover:from-red-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {deletePaymentMutation.isPending ? '削除中...' : '削除'}
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all"
                >
                  編集
                </button>
                {payment.status !== 'COMPLETED' && (
                  <button
                    onClick={() => completePaymentMutation.mutate()}
                    disabled={completePaymentMutation.isPending}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                  >
                    {completePaymentMutation.isPending ? '処理中...' : '支払い完了にする'}
                  </button>
                )}
                {!payment.reconciliation && (userRole === 'ADMIN' || userRole === 'STAFF' || userRole === 'FACULTY') && (
                  <Link
                    href={`/dashboard/payments/${payment.id}/reconciliation`}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all"
                  >
                    消込処理を開始
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

