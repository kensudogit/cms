import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

