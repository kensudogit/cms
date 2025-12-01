import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userId: number | null;
  user: {
    email: string;
    name: string;
    role: string;
  } | null;
  setAuth: (authData: {
    token: string;
    userId: number;
    email: string;
    name: string;
    role: string;
  }) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      user: null,
      setAuth: (authData) => {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('userId', authData.userId.toString());
        set({
          token: authData.token,
          userId: authData.userId,
          user: {
            email: authData.email,
            name: authData.name,
            role: authData.role,
          },
        });
      },
      clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        set({
          token: null,
          userId: null,
          user: null,
        });
      },
      isAuthenticated: () => {
        return get().token !== null;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

