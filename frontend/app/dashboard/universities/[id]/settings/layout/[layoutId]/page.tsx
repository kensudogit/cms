'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { 
  UniversityLayoutConfig, 
  UniversityLayoutConfigRequest,
  LayoutType
} from '@/lib/types';

const LAYOUT_TYPES: LayoutType[] = [
  'CONTENT_EDIT',
  'CONTENT_LIST',
  'CONTENT_DETAIL',
  'DASHBOARD',
  'ADMIN_PANEL'
];

export default function EditLayoutConfigPage() {
  const router = useRouter();
  const params = useParams();
  const universityId = params.id as string;
  const layoutId = params.layoutId as string;
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isNew = layoutId === 'new';

  const { data: layoutConfig, isLoading } = useQuery<UniversityLayoutConfig>({
    queryKey: ['university-layout-config', layoutId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/university-layout-config/${layoutId}`);
      return response.data;
    },
    enabled: !isNew && !!layoutId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UniversityLayoutConfigRequest>({
    defaultValues: {
      universityId: Number(universityId),
      layoutType: 'CONTENT_EDIT',
      sectionKey: '',
      sectionName: '',
      displayOrder: 0,
      visible: true,
      layoutConfig: '',
      fieldKeys: '',
      styleConfig: '',
      description: '',
    },
  });

  useEffect(() => {
    if (layoutConfig && !isNew) {
      reset({
        universityId: layoutConfig.universityId,
        layoutType: layoutConfig.layoutType,
        sectionKey: layoutConfig.sectionKey,
        sectionName: layoutConfig.sectionName,
        displayOrder: layoutConfig.displayOrder,
        visible: layoutConfig.visible,
        layoutConfig: layoutConfig.layoutConfig || '',
        fieldKeys: layoutConfig.fieldKeys || '',
        styleConfig: layoutConfig.styleConfig || '',
        description: layoutConfig.description || '',
      });
    }
  }, [layoutConfig, isNew, reset]);

  const mutation = useMutation({
    mutationFn: async (data: UniversityLayoutConfigRequest) => {
      if (isNew) {
        const response = await apiClient.post('/api/university-layout-config', data);
        return response.data;
      } else {
        const response = await apiClient.put(`/api/university-layout-config/${layoutId}`, data);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['university-layout-configs', universityId] });
      router.push(`/dashboard/universities/${universityId}/settings?tab=layout`);
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'エラーが発生しました';
      setError(errorMessage);
    },
  });

  const onSubmit = async (data: UniversityLayoutConfigRequest) => {
    setLoading(true);
    setError(null);
    mutation.mutate(data);
    setLoading(false);
  };

  if (isLoading && !isNew) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
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
                onClick={() => router.push(`/dashboard/universities/${universityId}/settings?tab=layout`)}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">
                  {isNew ? '新規レイアウト設定' : 'レイアウト設定編集'}
                </h1>
                <p className="text-xs text-slate-500 font-medium">Layout Configuration</p>
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
                <label htmlFor="layoutType" className="block text-sm font-bold text-slate-700">
                  <span>レイアウトタイプ</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('layoutType', { required: true })}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                >
                  {LAYOUT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="sectionKey" className="block text-sm font-bold text-slate-700">
                    <span>セクションキー</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('sectionKey', { required: 'セクションキーは必須です' })}
                    type="text"
                    className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                    placeholder="header"
                  />
                  {errors.sectionKey && (
                    <p className="text-sm text-red-600">{errors.sectionKey.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="sectionName" className="block text-sm font-bold text-slate-700">
                    <span>セクション名</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('sectionName', { required: 'セクション名は必須です' })}
                    type="text"
                    className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                    placeholder="ヘッダー"
                  />
                  {errors.sectionName && (
                    <p className="text-sm text-red-600">{errors.sectionName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    {...register('visible')}
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="visible" className="text-sm font-bold text-slate-700">
                    表示
                  </label>
                </div>

                <div className="space-y-2">
                  <label htmlFor="displayOrder" className="block text-sm font-bold text-slate-700">
                    表示順序
                  </label>
                  <input
                    {...register('displayOrder', { valueAsNumber: true })}
                    type="number"
                    className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="fieldKeys" className="block text-sm font-bold text-slate-700">
                  フィールドキー (JSON配列形式)
                </label>
                <textarea
                  {...register('fieldKeys')}
                  rows={3}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium font-mono text-sm"
                  placeholder='["title", "body", "custom_field_1"]'
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="layoutConfig" className="block text-sm font-bold text-slate-700">
                  レイアウト設定 (JSON形式)
                </label>
                <textarea
                  {...register('layoutConfig')}
                  rows={4}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium font-mono text-sm"
                  placeholder='{"width": "100%", "height": "auto", "position": "top", "columns": 1}'
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="styleConfig" className="block text-sm font-bold text-slate-700">
                  スタイル設定 (JSON形式)
                </label>
                <textarea
                  {...register('styleConfig')}
                  rows={4}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium font-mono text-sm"
                  placeholder='{"backgroundColor": "#ffffff", "padding": "20px", "margin": "10px"}'
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-bold text-slate-700">
                  説明
                </label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="block w-full border-2 border-slate-200 rounded-xl shadow-sm py-3.5 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white resize-none text-slate-800 font-medium"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200/50">
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/universities/${universityId}/settings?tab=layout`)}
                  className="px-6 py-3 border-2 border-slate-300 rounded-xl shadow-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '保存中...' : isNew ? '作成する' : '更新する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

