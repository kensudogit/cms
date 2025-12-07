import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';

// localStorageをモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAuthStore', () => {
  beforeEach(() => {
    // 各テスト前にストアをリセット
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.clearAuth();
    });
    localStorageMock.clear();
  });

  describe('Initial State', () => {
    it('should have null initial values', () => {
      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.token).toBeNull();
      expect(result.current.userId).toBeNull();
      expect(result.current.user).toBeNull();
    });
  });

  describe('setAuth', () => {
    it('should set authentication data correctly', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const authData = {
        token: 'test-token-123',
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
      };

      act(() => {
        result.current.setAuth(authData);
      });

      expect(result.current.token).toBe(authData.token);
      expect(result.current.userId).toBe(authData.userId);
      expect(result.current.user).toEqual({
        email: authData.email,
        name: authData.name,
        role: authData.role,
      });
    });

    it('should save token to localStorage', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const authData = {
        token: 'test-token-123',
        userId: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
      };

      act(() => {
        result.current.setAuth(authData);
      });

      expect(localStorage.getItem('token')).toBe(authData.token);
      expect(localStorage.getItem('userId')).toBe(authData.userId.toString());
    });
  });

  describe('clearAuth', () => {
    it('should clear all authentication data', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // まず認証情報を設定
      act(() => {
        result.current.setAuth({
          token: 'test-token-123',
          userId: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN',
        });
      });

      // 認証情報をクリア
      act(() => {
        result.current.clearAuth();
      });

      expect(result.current.token).toBeNull();
      expect(result.current.userId).toBeNull();
      expect(result.current.user).toBeNull();
    });

    it('should remove token and userId from localStorage', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // まず認証情報を設定
      act(() => {
        result.current.setAuth({
          token: 'test-token-123',
          userId: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN',
        });
      });

      // 認証情報をクリア
      act(() => {
        result.current.clearAuth();
      });

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('userId')).toBeNull();
    });
  });

  describe('Persistence', () => {
    it('should persist auth state to localStorage', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const authData = {
        token: 'persisted-token',
        userId: 2,
        email: 'persisted@example.com',
        name: 'Persisted User',
        role: 'STUDENT',
      };

      act(() => {
        result.current.setAuth(authData);
      });

      // localStorageに保存されていることを確認
      const stored = localStorage.getItem('auth-storage');
      expect(stored).toBeTruthy();
      
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.token).toBe(authData.token);
        expect(parsed.state.userId).toBe(authData.userId);
      }
    });
  });
});

