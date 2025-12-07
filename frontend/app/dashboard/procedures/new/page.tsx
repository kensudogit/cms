'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { ProcedureFlowRequest, University } from '@/lib/types';

export default function NewProcedureFlowPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: universities } = useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      const response = await apiClient.get('/api/university/active');
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProcedureFlowRequest>({
    defaultValues: {
      active: true,
      flowType: '入学',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ProcedureFlowRequest) => {
      const response = await apiClient.post('/api/procedure-flow', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedure-flows'] });
      router.push('/dashboard/procedures');
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'エラーが発生しました';
      setError(errorMessage);
    },
  });

  const onSubmit = async (data: ProcedureFlowRequest) => {
    setError(null);
    mutation.mutate(data);
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
                onClick={() => router.push('/dashboard/procedures')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">新規手続きフロー作成</h1>
                <p className="text-xs text-slate-500 font-medium">Create New Procedure Flow</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="glass-card shadow-2xl rounded-3xl p-8 border border-white/50">
            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl shadow-lg">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="universityId" className="block text-sm font-bold text-slate-700">
                  <span>大学</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('universityId', { required: '大学を選択してください', valueAsNumber: true })}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="">大学を選択</option>
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
                <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                  <span>フロー名</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', { required: 'フロー名は必須です' })}
                  type="text"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                  placeholder="例: 入学手続きフロー"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="flowType" className="block text-sm font-bold text-slate-700">
                  <span>フロータイプ</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('flowType', { required: 'フロータイプを選択してください' })}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
                >
                  <option value="入学">入学</option>
                  <option value="卒業">卒業</option>
                  <option value="在学中">在学中</option>
                  <option value="その他">その他</option>
                </select>
                {errors.flowType && (
                  <p className="text-sm text-red-600">{errors.flowType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-bold text-slate-700">
                  説明
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium"
                  placeholder="フローの説明を入力"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="displayOrder" className="block text-sm font-bold text-slate-700">
                  表示順序
                </label>
                <input
                  {...register('displayOrder', { valueAsNumber: true })}
                  type="number"
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                  placeholder="1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  {...register('active')}
                  type="checkbox"
                  className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="active" className="text-sm font-bold text-slate-700">
                  有効
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200/50">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/procedures')}
                  className="px-6 py-3 border-2 border-slate-300 rounded-xl shadow-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? '作成中...' : 'フローを作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}


