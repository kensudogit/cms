'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { User } from '@/lib/types';

// サンプルユーザーデータ
const sampleUsers: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    name: '管理者',
    role: 'ADMIN',
  },
  {
    id: 2,
    email: 'staff@example.com',
    name: 'スタッフ',
    role: 'STAFF',
  },
  {
    id: 3,
    email: 'student@example.com',
    name: '学生',
    role: 'STUDENT',
  },
  {
    id: 4,
    email: 'parent@example.com',
    name: '父兄',
    role: 'PARENT',
  },
];

export default function UsersManagementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userRole = useAuthStore((state) => state.user?.role);
  const [roleFilter, setRoleFilter] = useState<'all' | 'ADMIN' | 'STAFF' | 'STUDENT' | 'PARENT' | 'FACULTY' | 'EDITOR'>('all');

  // 管理者権限チェック
  if (userRole !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">アクセス権限がありません</h2>
          <p className="text-slate-600 mb-6">このページは管理者のみアクセスできます。</p>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all"
          >
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    );
  }

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['admin-users', roleFilter],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/api/user');
        let data = response.data || [];
        
        if (roleFilter !== 'all') {
          data = data.filter((u: User) => u.role === roleFilter);
        }
        
        return data;
      } catch (error) {
        console.warn('Failed to fetch users, using sample data:', error);
        let data = [...sampleUsers];
        
        if (roleFilter !== 'all') {
          data = data.filter(u => u.role === roleFilter);
        }
        
        return data;
      }
    },
    enabled: true,
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiClient.delete(`/api/user/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-gradient-to-r from-red-400 to-pink-500 text-white';
      case 'STAFF':
        return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white';
      case 'FACULTY':
        return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
      case 'EDITOR':
        return 'bg-gradient-to-r from-green-400 to-teal-500 text-white';
      case 'STUDENT':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      case 'PARENT':
        return 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white';
      default:
        return 'bg-gradient-to-r from-slate-400 to-gray-500 text-white';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '管理者';
      case 'STAFF':
        return 'スタッフ';
      case 'FACULTY':
        return '教職員';
      case 'EDITOR':
        return '編集者';
      case 'STUDENT':
        return '学生';
      case 'PARENT':
        return '父兄';
      default:
        return role;
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
                onClick={() => router.push('/dashboard/admin')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">ユーザー管理</h1>
                <p className="text-xs text-slate-500 font-medium">User Management</p>
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
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-bold text-slate-700 mb-2">
              役割で絞り込み
            </label>
            <select
              id="role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="block w-full max-w-md border-2 border-slate-200 rounded-xl shadow-sm py-3 px-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/90 hover:bg-white text-slate-800 font-medium cursor-pointer"
            >
              <option value="all">すべて</option>
              <option value="ADMIN">管理者</option>
              <option value="STAFF">スタッフ</option>
              <option value="FACULTY">教職員</option>
              <option value="EDITOR">編集者</option>
              <option value="STUDENT">学生</option>
              <option value="PARENT">父兄</option>
            </select>
          </div>

          {/* 統計情報 */}
          {users && users.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">総ユーザー数</p>
                <p className="text-2xl font-bold text-slate-800">{users.length}</p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">管理者</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.role === 'ADMIN').length}
                </p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">スタッフ</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.role === 'STAFF').length}
                </p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">学生</p>
                <p className="text-2xl font-bold text-amber-600">
                  {users.filter(u => u.role === 'STUDENT').length}
                </p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">父兄</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {users.filter(u => u.role === 'PARENT').length}
                </p>
              </div>
              <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-xs text-slate-500 mb-1 font-semibold">その他</p>
                <p className="text-2xl font-bold text-slate-600">
                  {users.filter(u => !['ADMIN', 'STAFF', 'STUDENT', 'PARENT'].includes(u.role)).length}
                </p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
            </div>
          ) : users && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="glass-card rounded-3xl p-6 border border-white/50 hover:border-indigo-200/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/50">
                    <button
                      onClick={() => {
                        if (confirm(`ユーザー「${user.name}」を削除しますか？`)) {
                          deleteUserMutation.mutate(user.id);
                        }
                      }}
                      disabled={deleteUserMutation.isPending}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
                    >
                      削除
                    </button>
                    <button
                      onClick={() => {
                        // TODO: ユーザー編集機能を実装
                        alert('ユーザー編集機能は今後実装予定です');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                    >
                      編集
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-3xl font-bold text-slate-800 mb-3">ユーザーが見つかりません</h3>
              <p className="text-slate-600">現在、ユーザーは登録されていません。</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

