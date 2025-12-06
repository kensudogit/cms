import axios from 'axios';

// 環境変数からAPIベースURLを取得（クライアント側でのみ使用）
const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    // サーバー側ではデフォルト値を使用
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  }
  // クライアント側では環境変数またはデフォルト値を使用
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10秒のタイムアウト
});

// リクエストインターセプター: トークンを自動付与
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }
  }
  return config;
});

// レスポンスインターセプター: エラーハンドリング
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 接続エラーの場合は詳細をログに記録（開発環境のみ）
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('API接続エラー:', {
          message: error.message,
          baseURL: API_BASE_URL,
          code: error.code,
        });
      }
    }
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // ログインページを無効化したため、ダッシュボードにリダイレクト
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

