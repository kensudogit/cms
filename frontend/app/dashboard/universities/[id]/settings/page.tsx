'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import { 
  University, 
  UniversityFieldConfig, 
  UniversityFieldConfigRequest,
  UniversityLayoutConfig,
  UniversityLayoutConfigRequest,
  FieldType,
  EditMethod,
  LayoutType
} from '@/lib/types';
import { sampleUniversities } from '@/lib/sampleData';

type TabType = 'fields' | 'layout';

export default function UniversitySettingsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('fields');
  const [error, setError] = useState<string | null>(null);

  // URLパラメータからタブを読み取る
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tab = searchParams.get('tab') as TabType;
      if (tab === 'fields' || tab === 'layout') {
        setActiveTab(tab);
      }
    }
  }, []);

  const { data: university, isLoading: universityLoading } = useQuery<University>({
    queryKey: ['university', id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/university/${id}`);
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch university, using sample data:', error);
        const sample = sampleUniversities.find(u => u.id === Number(id));
        if (sample) return sample;
        throw error;
      }
    },
    enabled: !!id,
  });

  const { data: fieldConfigs, isLoading: fieldConfigsLoading } = useQuery<UniversityFieldConfig[]>({
    queryKey: ['university-field-configs', id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/university-field-config/university/${id}`);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch field configs:', error);
        return [];
      }
    },
    enabled: !!id && activeTab === 'fields',
  });

  const { data: layoutConfigs, isLoading: layoutConfigsLoading } = useQuery<UniversityLayoutConfig[]>({
    queryKey: ['university-layout-configs', id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/api/university-layout-config/university/${id}`);
        return response.data || [];
      } catch (error) {
        console.warn('Failed to fetch layout configs:', error);
        return [];
      }
    },
    enabled: !!id && activeTab === 'layout',
  });

  const deleteFieldConfigMutation = useMutation({
    mutationFn: async (configId: number) => {
      await apiClient.delete(`/api/university-field-config/${configId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['university-field-configs', id] });
    },
  });

  const deleteLayoutConfigMutation = useMutation({
    mutationFn: async (configId: number) => {
      await apiClient.delete(`/api/university-layout-config/${configId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['university-layout-configs', id] });
    },
  });

  if (universityLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center py-20">
          <h3 className="text-3xl font-bold text-slate-800 mb-3">大学が見つかりません</h3>
          <button
            onClick={() => router.push('/dashboard/universities')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
          >
            大学一覧に戻る
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
                onClick={() => router.push(`/dashboard/universities/${id}`)}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">{university.name} - 設定管理</h1>
                <p className="text-xs text-slate-500 font-medium">University Settings Management</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl shadow-lg">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* タブ */}
          <div className="glass-card shadow-2xl rounded-3xl p-8 border border-white/50 mb-6">
            <div className="flex space-x-4 border-b border-slate-200/50">
              <button
                onClick={() => setActiveTab('fields')}
                className={`px-6 py-3 font-bold transition-all ${
                  activeTab === 'fields'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                フィールド設定
              </button>
              <button
                onClick={() => setActiveTab('layout')}
                className={`px-6 py-3 font-bold transition-all ${
                  activeTab === 'layout'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                レイアウト設定
              </button>
            </div>
          </div>

          {/* フィールド設定タブ */}
          {activeTab === 'fields' && (
            <FieldConfigTab
              universityId={Number(id)}
              fieldConfigs={fieldConfigs || []}
              isLoading={fieldConfigsLoading}
              onDelete={(configId) => {
                if (confirm('このフィールド設定を削除してもよろしいですか？')) {
                  deleteFieldConfigMutation.mutate(configId);
                }
              }}
            />
          )}

          {/* レイアウト設定タブ */}
          {activeTab === 'layout' && (
            <LayoutConfigTab
              universityId={Number(id)}
              layoutConfigs={layoutConfigs || []}
              isLoading={layoutConfigsLoading}
              onDelete={(configId) => {
                if (confirm('このレイアウト設定を削除してもよろしいですか？')) {
                  deleteLayoutConfigMutation.mutate(configId);
                }
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// フィールド設定タブコンポーネント
function FieldConfigTab({
  universityId,
  fieldConfigs,
  isLoading,
  onDelete,
}: {
  universityId: number;
  fieldConfigs: UniversityFieldConfig[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="glass-card shadow-2xl rounded-3xl p-8 border border-white/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">フィールド設定一覧</h2>
        <Link
          href={`/dashboard/universities/${universityId}/settings/fields/new`}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all"
        >
          + 新規フィールド追加
        </Link>
      </div>

      {fieldConfigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">フィールド設定が登録されていません</p>
          <Link
            href={`/dashboard/universities/${universityId}/settings/fields/new`}
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
          >
            最初のフィールドを追加
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {fieldConfigs
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((config) => (
              <div
                key={config.id}
                className="bg-white/50 rounded-xl p-6 border border-slate-200/50 hover:border-indigo-200/50 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{config.fieldName}</h3>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-semibold">
                        {config.fieldKey}
                      </span>
                      {!config.visible && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                          非表示
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-semibold">タイプ:</span> {config.fieldType}
                      </div>
                      <div>
                        <span className="font-semibold">編集方法:</span> {config.editMethod}
                      </div>
                      <div>
                        <span className="font-semibold">必須:</span> {config.required ? 'はい' : 'いいえ'}
                      </div>
                      <div>
                        <span className="font-semibold">表示順:</span> {config.displayOrder}
                      </div>
                    </div>
                    {config.description && (
                      <p className="text-sm text-slate-500 mt-2">{config.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Link
                      href={`/dashboard/universities/${universityId}/settings/fields/${config.id}`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                    >
                      編集
                    </Link>
                    <button
                      onClick={() => onDelete(config.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// レイアウト設定タブコンポーネント
function LayoutConfigTab({
  universityId,
  layoutConfigs,
  isLoading,
  onDelete,
}: {
  universityId: number;
  layoutConfigs: UniversityLayoutConfig[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
        <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
      </div>
    );
  }

  // レイアウトタイプごとにグループ化
  const groupedConfigs = layoutConfigs.reduce((acc, config) => {
    if (!acc[config.layoutType]) {
      acc[config.layoutType] = [];
    }
    acc[config.layoutType].push(config);
    return acc;
  }, {} as Record<LayoutType, UniversityLayoutConfig[]>);

  return (
    <div className="glass-card shadow-2xl rounded-3xl p-8 border border-white/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">レイアウト設定一覧</h2>
        <Link
          href={`/dashboard/universities/${universityId}/settings/layout/new`}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all"
        >
          + 新規レイアウト追加
        </Link>
      </div>

      {layoutConfigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">レイアウト設定が登録されていません</p>
          <Link
            href={`/dashboard/universities/${universityId}/settings/layout/new`}
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
          >
            最初のレイアウトを追加
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedConfigs).map(([layoutType, configs]) => (
            <div key={layoutType} className="bg-white/30 rounded-xl p-6 border border-slate-200/50">
              <h3 className="text-lg font-bold text-slate-800 mb-4">{layoutType}</h3>
              <div className="space-y-3">
                {configs
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((config) => (
                    <div
                      key={config.id}
                      className="bg-white/50 rounded-xl p-4 border border-slate-200/50 hover:border-indigo-200/50 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-bold text-slate-800">{config.sectionName}</h4>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                              {config.sectionKey}
                            </span>
                            {!config.visible && (
                              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">
                                非表示
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600">
                            <span className="font-semibold">表示順:</span> {config.displayOrder}
                          </div>
                          {config.description && (
                            <p className="text-sm text-slate-500 mt-2">{config.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Link
                            href={`/dashboard/universities/${universityId}/settings/layout/${config.id}`}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => onDelete(config.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

