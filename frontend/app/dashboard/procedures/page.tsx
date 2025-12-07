'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { ProcedureFlow } from '@/lib/types';

export default function ProceduresPage() {
  const router = useRouter();
  const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);

  const { data: universities } = useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      const response = await apiClient.get('/api/university/active');
      return response.data;
    },
  });

  const { data: flows, isLoading } = useQuery<ProcedureFlow[]>({
    queryKey: ['procedure-flows', selectedUniversityId],
    queryFn: async () => {
      if (!selectedUniversityId) return [];
      const response = await apiClient.get(`/api/procedure-flow/university/${selectedUniversityId}`);
      return response.data;
    },
    enabled: !!selectedUniversityId,
  });

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
                onClick={() => router.push('/dashboard')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">手続きフロー管理</h1>
                <p className="text-xs text-slate-500 font-medium">Procedure Flow Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/procedures/admission"
                className="group relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>入学手続き</span>
                </span>
              </Link>
              <Link
                href="/dashboard/procedures/new"
                className="group relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>新規フローを作成</span>
                </span>
              </Link>
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
              {universities?.map((univ: any) => (
                <option key={univ.id} value={univ.id}>
                  {univ.name}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
            </div>
          ) : flows && flows.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flows.map((flow, index) => (
                <Link
                  key={flow.id}
                  href={`/dashboard/procedures/${flow.id}`}
                  className="group card-hover animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="glass-card rounded-3xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                          {flow.name}
                        </h3>
                        {flow.description && (
                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">{flow.description}</p>
                        )}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                          {flow.flowType}
                        </span>
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-200/50">
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>ステップ数: {flow.steps?.length || 0}</span>
                        <svg className="w-5 h-5 text-indigo-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : selectedUniversityId ? (
            <div className="text-center py-20">
              <h3 className="text-3xl font-bold text-slate-800 mb-3">手続きフローがありません</h3>
              <p className="text-slate-600 mb-8">最初の手続きフローを作成して始めましょう！</p>
              <Link
                href="/dashboard/procedures/new"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>新規フローを作成</span>
              </Link>
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

