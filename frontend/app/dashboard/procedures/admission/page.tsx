'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { ProcedureFlowDetail, University } from '@/lib/types';
import { sampleUniversities, sampleProcedureFlows } from '@/lib/sampleData';

export default function AdmissionProcedurePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  // 選択された大学の入学手続きフローを取得
  const { data: admissionFlows, isLoading: flowsLoading } = useQuery<ProcedureFlowDetail[]>({
    queryKey: ['admission-flows', selectedUniversityId, userId],
    queryFn: async () => {
      if (!selectedUniversityId) {
        // 大学が選択されていない場合、サンプルデータから入学フローを返す
        const sampleAdmissionFlow = sampleProcedureFlows.find(f => f.flowType === '入学');
        if (sampleAdmissionFlow) {
          return [{
            ...sampleAdmissionFlow,
            totalSteps: sampleAdmissionFlow.steps?.length || 0,
            completedSteps: 0,
            inProgressSteps: 0,
            notStartedSteps: sampleAdmissionFlow.steps?.length || 0,
            completionRate: 0,
          } as ProcedureFlowDetail];
        }
        return [];
      }
      try {
        const response = await apiClient.get(`/api/procedure-flow/university/${selectedUniversityId}/type/入学`);
        const flows = response.data || [];
        
        if (flows.length === 0) {
          // APIからデータが取得できない場合、サンプルデータを返す
          const sampleAdmissionFlow = sampleProcedureFlows.find(f => f.flowType === '入学' && f.universityId === selectedUniversityId);
          if (sampleAdmissionFlow) {
            return [{
              ...sampleAdmissionFlow,
              totalSteps: sampleAdmissionFlow.steps?.length || 0,
              completedSteps: 0,
              inProgressSteps: 0,
              notStartedSteps: sampleAdmissionFlow.steps?.length || 0,
              completionRate: 0,
            } as ProcedureFlowDetail];
          }
        }
        
        // 各フローの詳細を取得
        const flowDetails = await Promise.all(
          flows.map(async (flow: any) => {
            try {
              const detailResponse = await apiClient.get(
                `/api/procedure-flow/${flow.id}/university/${selectedUniversityId}${userId ? `?userId=${userId}` : ''}`
              );
              return detailResponse.data;
            } catch (error) {
              return flow;
            }
          })
        );
        return flowDetails;
      } catch (error) {
        console.warn('Failed to fetch admission flows, using sample data:', error);
        // エラー時はサンプルデータを返す
        const sampleAdmissionFlow = sampleProcedureFlows.find(f => f.flowType === '入学' && f.universityId === selectedUniversityId);
        if (sampleAdmissionFlow) {
          return [{
            ...sampleAdmissionFlow,
            totalSteps: sampleAdmissionFlow.steps?.length || 0,
            completedSteps: 0,
            inProgressSteps: 0,
            notStartedSteps: sampleAdmissionFlow.steps?.length || 0,
            completionRate: 0,
          } as ProcedureFlowDetail];
        }
        return [];
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
      queryClient.invalidateQueries({ queryKey: ['admission-flows'] });
    },
  });

  const completeStepMutation = useMutation({
    mutationFn: async (stepId: number) => {
      const response = await apiClient.post(`/api/procedure-progress/complete/user/${userId}/step/${stepId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admission-flows'] });
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: { flowId: number; amount: number; paymentType: string }) => {
      if (!selectedUniversityId || !userId) throw new Error('Missing required data');
      const response = await apiClient.post('/api/payment', {
        userId,
        universityId: selectedUniversityId,
        flowId: data.flowId,
        paymentType: data.paymentType,
        amount: data.amount,
        currency: 'JPY',
        status: 'PENDING',
        paymentMethod: '銀行振込',
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const handleCompleteStepWithPayment = async (stepId: number, flowId: number, stepName: string) => {
    // ステップを完了
    await completeStepMutation.mutateAsync(stepId);
    
    // 入学金関連のステップの場合、支払い記録を作成
    if (stepName.includes('入学金') || stepName.includes('授業料') || stepName.includes('納付')) {
      // 入学金の金額を設定（実際の実装では、大学やフローから取得）
      const amount = stepName.includes('入学金') ? 282000 : stepName.includes('授業料') ? 535800 : 0;
      if (amount > 0) {
        createPaymentMutation.mutate({
          flowId,
          amount,
          paymentType: stepName.includes('入学金') ? '入学金' : '授業料',
        });
      }
    }
  };

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

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'IN_PROGRESS':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'BLOCKED':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        );
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
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">入学手続き</h1>
                <p className="text-xs text-slate-500 font-medium">Admission Procedure</p>
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

          {flowsLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
            </div>
          ) : admissionFlows && admissionFlows.length > 0 ? (
            <div className="space-y-6">
              {admissionFlows.map((flow) => (
                <div key={flow.id} className="glass-card rounded-3xl p-8 border border-white/50">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-slate-800 mb-2">{flow.name}</h2>
                      {flow.description && (
                        <p className="text-slate-600 mb-4">{flow.description}</p>
                      )}
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-indigo-100 text-indigo-700">
                          {flow.flowType}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-slate-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all"
                              style={{ width: `${flow.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            {flow.completionRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 mb-1 font-semibold">総ステップ数</p>
                      <p className="text-2xl font-bold text-slate-800">{flow.totalSteps}</p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 mb-1 font-semibold">完了</p>
                      <p className="text-2xl font-bold text-emerald-600">{flow.completedSteps}</p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 mb-1 font-semibold">進行中</p>
                      <p className="text-2xl font-bold text-blue-600">{flow.inProgressSteps}</p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-xs text-slate-500 mb-1 font-semibold">未開始</p>
                      <p className="text-2xl font-bold text-amber-600">{flow.notStartedSteps}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">手続きステップ</h3>
                    {flow.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`glass-card rounded-2xl p-6 border transition-all ${
                          step.progressStatus === 'COMPLETED'
                            ? 'border-emerald-200/50 bg-emerald-50/30'
                            : step.progressStatus === 'IN_PROGRESS'
                            ? 'border-blue-200/50 bg-blue-50/30'
                            : step.progressStatus === 'BLOCKED'
                            ? 'border-red-200/50 bg-red-50/30'
                            : 'border-white/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg shadow-md">
                                {step.stepOrder}
                              </span>
                              <h4 className="text-lg font-bold text-slate-800">{step.name}</h4>
                              <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(step.progressStatus)}`}>
                                {getStatusIcon(step.progressStatus)}
                                <span>{getStatusText(step.progressStatus)}</span>
                              </span>
                            </div>
                            {step.description && (
                              <p className="text-sm text-slate-600 ml-13">{step.description}</p>
                            )}
                            {step.requiredRole && (
                              <p className="text-xs text-slate-500 ml-13 mt-1">
                                必要な役割: {step.requiredRole}
                              </p>
                            )}
                            {step.dependsOnStepIds && (
                              <p className="text-xs text-amber-600 ml-13 mt-1">
                                依存ステップ: {step.dependsOnStepIds}
                              </p>
                            )}
                          </div>
                        </div>

                        {userId && (userRole === 'STUDENT' || userRole === 'PARENT') && (
                          <div className="flex items-center space-x-2 ml-13">
                            {step.progressStatus === 'NOT_STARTED' && step.canStart && (
                              <button
                                onClick={() => handleStartStep(step.id)}
                                disabled={startStepMutation.isPending}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                              >
                                開始
                              </button>
                            )}
                            {step.progressStatus === 'IN_PROGRESS' && (
                              <button
                                onClick={() => {
                                  // 入学金・授業料関連のステップの場合は支払い記録も作成
                                  if (step.name.includes('入学金') || step.name.includes('授業料') || step.name.includes('納付')) {
                                    handleCompleteStepWithPayment(step.id, flow.id, step.name);
                                  } else {
                                    handleCompleteStep(step.id);
                                  }
                                }}
                                disabled={completeStepMutation.isPending || createPaymentMutation.isPending}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                              >
                                {completeStepMutation.isPending || createPaymentMutation.isPending ? '処理中...' : '完了'}
                              </button>
                            )}
                            {step.progressStatus === 'BLOCKED' && (
                              <p className="text-sm text-red-600 font-semibold">
                                ⚠️ 依存ステップが未完了です
                              </p>
                            )}
                            {step.progressCompletedAt && (
                              <p className="text-xs text-slate-500 ml-4">
                                完了日時: {new Date(step.progressCompletedAt).toLocaleString('ja-JP')}
                              </p>
                            )}
                          </div>
                        )}

                        {step.progressStatus === 'COMPLETED' && (
                          <div className="ml-13 mt-2">
                            <Link
                              href={`/dashboard/contents/${step.contentId}`}
                              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold underline"
                            >
                              関連コンテンツを確認 →
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : selectedUniversityId ? (
            <div className="text-center py-20">
              <h3 className="text-3xl font-bold text-slate-800 mb-3">入学手続きフローが見つかりません</h3>
              <p className="text-slate-600 mb-8">選択された大学には入学手続きフローが設定されていません。</p>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-600 text-lg">大学を選択してください</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

