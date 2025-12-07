'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { PaymentRequest, University, ProcedureFlow } from '@/lib/types';

export default function NewPaymentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);

  const { data: universities } = useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      const response = await apiClient.get('/api/university/active');
      return response.data;
    },
  });

  const { data: flows } = useQuery<ProcedureFlow[]>({
    queryKey: ['procedure-flows', selectedUniversityId],
    queryFn: async () => {
      if (!selectedUniversityId) return [];
      const response = await apiClient.get(`/api/procedure-flow/university/${selectedUniversityId}`);
      return response.data;
    },
    enabled: !!selectedUniversityId,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentRequest>({
    defaultValues: {
      userId: userId || undefined,
      universityId: undefined,
      flowId: undefined,
      paymentType: '入学金',
      amount: 0,
      currency: 'JPY',
      status: 'PENDING',
      paymentMethod: '銀行振込',
    },
  });

  const watchedUniversityId = watch('universityId');

  const createPaymentMutation = useMutation({
    mutationFn: async (data: PaymentRequest) => {
      const response = await apiClient.post('/api/payment', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      router.push('/dashboard/payments');
    },
  });

  const onSubmit = (data: PaymentRequest) => {
    if (!userId) {
      alert('ユーザーIDが取得できませんでした。再度ログインしてください。');
      return;
    }
    createPaymentMutation.mutate({
      ...data,
      userId,
    });
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
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">新規支払い登録</h1>
                <p className="text-xs text-slate-500 font-medium">New Payment Registration</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="glass-card rounded-3xl p-8 border border-white/50">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="universityId" className="block text-sm font-bold text-slate-700">
                  <span>大学</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('universityId', { required: '大学を選択してください', valueAsNumber: true })}
                  onChange={(e) => {
                    setSelectedUniversityId(e.target.value ? Number(e.target.value) : null);
                    register('universityId').onChange(e);
                  }}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="">大学を選択してください</option>
                  {universities?.map((univ: University) => (
                    <option key={univ.id} value={univ.id}>
                      {univ.name}
                    </option>
                  ))}
                </select>
                {errors.universityId && (
                  <p className="text-sm text-red-600">{errors.universityId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="flowId" className="block text-sm font-bold text-slate-700">
                  <span>手続きフロー</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('flowId', { required: '手続きフローを選択してください', valueAsNumber: true })}
                  disabled={!watchedUniversityId || !flows || flows.length === 0}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">手続きフローを選択してください</option>
                  {flows?.map((flow: ProcedureFlow) => (
                    <option key={flow.id} value={flow.id}>
                      {flow.name}
                    </option>
                  ))}
                </select>
                {errors.flowId && (
                  <p className="text-sm text-red-600">{errors.flowId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="paymentType" className="block text-sm font-bold text-slate-700">
                  <span>支払い種別</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('paymentType', { required: '支払い種別を選択してください' })}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="入学金">入学金</option>
                  <option value="授業料">授業料</option>
                  <option value="施設設備費">施設設備費</option>
                  <option value="その他">その他</option>
                </select>
                {errors.paymentType && (
                  <p className="text-sm text-red-600">{errors.paymentType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-bold text-slate-700">
                  <span>支払い金額</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('amount', { 
                    required: '支払い金額を入力してください',
                    valueAsNumber: true,
                    min: { value: 0.01, message: '支払い金額は0より大きい必要があります' }
                  })}
                  type="number"
                  step="0.01"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                  placeholder="例: 282000"
                />
                {errors.amount && (
                  <p className="text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="paymentMethod" className="block text-sm font-bold text-slate-700">
                  支払い方法
                </label>
                <select
                  {...register('paymentMethod')}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="銀行振込">銀行振込</option>
                  <option value="クレジットカード">クレジットカード</option>
                  <option value="コンビニ決済">コンビニ決済</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="transactionId" className="block text-sm font-bold text-slate-700">
                  取引ID
                </label>
                <input
                  {...register('transactionId')}
                  type="text"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                  placeholder="取引ID（オプション）"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notes" className="block text-sm font-bold text-slate-700">
                  備考
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium"
                  placeholder="備考を入力（オプション）"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200/50">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/payments')}
                  className="px-6 py-3 border-2 border-slate-300 rounded-xl shadow-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={createPaymentMutation.isPending}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createPaymentMutation.isPending ? '登録中...' : '登録'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}


