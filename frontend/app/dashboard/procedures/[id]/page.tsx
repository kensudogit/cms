'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { ProcedureFlowDetail, University } from '@/lib/types';
import { sampleUniversities, createSampleProcedureFlowDetail } from '@/lib/sampleData';

export default function ProcedureFlowDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.userId);
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

  const { data: flowDetail, isLoading } = useQuery<ProcedureFlowDetail>({
    queryKey: ['procedure-flow-detail', id, selectedUniversityId, userId],
    queryFn: async () => {
      const flowId = Number(id);
      
      // 大学が選択されていない場合、フローIDから大学IDを推測してサンプルデータを返す
      if (!selectedUniversityId) {
        // フローIDが奇数の場合は入学フロー、偶数の場合は卒業フロー
        // フローIDから大学IDを計算: (flowId + 1) / 2 または flowId / 2
        const estimatedUnivId = flowId % 2 === 1 ? Math.floor((flowId + 1) / 2) : flowId / 2;
        const sampleDetail = createSampleProcedureFlowDetail(flowId, estimatedUnivId);
        if (sampleDetail) return sampleDetail;
        // 推測できない場合は大学ID 1を使用
        const fallbackDetail = createSampleProcedureFlowDetail(flowId, 1);
        if (fallbackDetail) return fallbackDetail;
        throw new Error('University not selected');
      }
      
      try {
        const response = await apiClient.get(
          `/api/procedure-flow/${id}/university/${selectedUniversityId}${userId ? `?userId=${userId}` : ''}`
        );
        const apiData = response.data;
        // APIからデータが取得できない場合、サンプルデータを返す
        if (!apiData) {
          const sampleDetail = createSampleProcedureFlowDetail(flowId, selectedUniversityId);
          if (sampleDetail) return sampleDetail;
        }
        return apiData;
      } catch (error) {
        console.warn('Failed to fetch flow detail, using sample data:', error);
        // エラー時はサンプルデータを返す
        const sampleDetail = createSampleProcedureFlowDetail(flowId, selectedUniversityId);
        if (sampleDetail) return sampleDetail;
        throw error;
      }
    },
    enabled: true, // 常に有効にしてサンプルデータを表示
  });

  const startStepMutation = useMutation({
    mutationFn: async ({ stepId, universityId }: { stepId: number; universityId: number }) => {
      const response = await apiClient.post(
        `/api/procedure-progress/start/user/${userId}/step/${stepId}/university/${universityId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedure-flow-detail'] });
    },
  });

  const completeStepMutation = useMutation({
    mutationFn: async (stepId: number) => {
      const response = await apiClient.post(`/api/procedure-progress/complete/user/${userId}/step/${stepId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procedure-flow-detail'] });
    },
  });

  const handleStartStep = (stepId: number) => {
    if (!selectedUniversityId || !userId) return;
    startStepMutation.mutate({ stepId, universityId: selectedUniversityId });
  };

  const handleCompleteStep = (stepId: number) => {
    if (!userId) return;
    completeStepMutation.mutate(stepId);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white';
      case 'IN_PROGRESS':
        return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white';
      case 'BLOCKED':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white';
      case 'SKIPPED':
        return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return '完了';
      case 'IN_PROGRESS':
        return '進行中';
      case 'BLOCKED':
        return 'ブロック';
      case 'SKIPPED':
        return 'スキップ';
      default:
        return '未開始';
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
                onClick={() => router.push('/dashboard/procedures')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">手続きフロー詳細</h1>
                <p className="text-xs text-slate-500 font-medium">Procedure Flow Details</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <label htmlFor="university" className="block text-sm font-bold text-slate-700 mb-2">
              大学を選択
            </label>
            <select
              id="university"
              value={selectedUniversityId || ''}
              onChange={(e) => setSelectedUniversityId(e.target.value ? Number(e.target.value) : null)}
              className="block w-full max-w-md border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
            >
              <option value="">大学を選択してください</option>
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
          ) : flowDetail ? (
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-8 border border-white/50">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{flowDetail.name}</h2>
                    {flowDetail.description && (
                      <p className="text-slate-600 mb-4">{flowDetail.description}</p>
                    )}
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700">
                        {flowDetail.flowType}
                      </span>
                      <span className="text-sm text-slate-500">
                        完了率: {flowDetail.completionRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-xs text-slate-500 mb-1 font-semibold">総ステップ数</p>
                    <p className="text-2xl font-bold text-slate-800">{flowDetail.totalSteps}</p>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-xs text-slate-500 mb-1 font-semibold">完了</p>
                    <p className="text-2xl font-bold text-emerald-600">{flowDetail.completedSteps}</p>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-xs text-slate-500 mb-1 font-semibold">進行中</p>
                    <p className="text-2xl font-bold text-blue-600">{flowDetail.inProgressSteps}</p>
                  </div>
                  <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-xs text-slate-500 mb-1 font-semibold">未開始</p>
                    <p className="text-2xl font-bold text-amber-600">{flowDetail.notStartedSteps}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">手続きステップ</h3>
                  {flowDetail.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className="glass-card rounded-2xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                              {step.stepOrder}
                            </span>
                            <h4 className="text-lg font-bold text-slate-800">{step.name}</h4>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(step.progressStatus)}`}>
                              {getStatusText(step.progressStatus)}
                            </span>
                          </div>
                          {step.description && (
                            <p className="text-sm text-slate-600 ml-11">{step.description}</p>
                          )}
                          {step.requiredRole && (
                            <p className="text-xs text-slate-500 ml-11 mt-1">
                              必要な役割: {step.requiredRole}
                            </p>
                          )}
                        </div>
                      </div>

                      {userId && (
                        <div className="flex items-center space-x-2 ml-11">
                          {step.progressStatus === 'NOT_STARTED' && step.canStart && (
                            <button
                              onClick={() => handleStartStep(step.id)}
                              disabled={startStepMutation.isPending}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                            >
                              開始
                            </button>
                          )}
                          {step.progressStatus === 'IN_PROGRESS' && (
                            <button
                              onClick={() => handleCompleteStep(step.id)}
                              disabled={completeStepMutation.isPending}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                            >
                              完了
                            </button>
                          )}
                          {step.progressStatus === 'BLOCKED' && (
                            <p className="text-sm text-red-600">依存ステップが未完了です</p>
                          )}
                          {step.progressCompletedAt && (
                            <p className="text-xs text-slate-500">
                              完了日時: {new Date(step.progressCompletedAt).toLocaleString('ja-JP')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-600 text-lg">手続きフローが見つかりません</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


