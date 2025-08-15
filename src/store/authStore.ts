import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { services } from '../services';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  debugToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
      setAuth: (user, token) => {
        console.log('setAuth called with:', { user, token: token ? 'Token exists' : 'No token' });
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
        console.log('Token stored in localStorage:', localStorage.getItem('auth_token') ? 'Yes' : 'No');
      },
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      initializeAuth: async () => {
        const token = localStorage.getItem('auth_token');
        console.log('initializeAuth - token from localStorage:', token ? 'Exists' : 'Not found');
        if (!token) {
          set({ isAuthenticated: false, isInitialized: true });
          return;
        }

        try {
          // Validate token by calling a protected endpoint
          set({ 
            user: null, 
            token, 
            isAuthenticated: true, 
            isInitialized: true 
          });
        } catch (error) {
          // Token validation failed
          localStorage.removeItem('auth_token');
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false, 
            isInitialized: true 
          });
        }
      },
      debugToken: () => {
        const state = get();
        console.log('Current auth state:', {
          isAuthenticated: state.isAuthenticated,
          hasToken: !!state.token,
          localStorageToken: !!localStorage.getItem('auth_token'),
          user: state.user
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 