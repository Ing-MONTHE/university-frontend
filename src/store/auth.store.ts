/**
 * Store Zustand pour la gestion de l'authentification
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';
import { setAccessToken, setRefreshToken, clearTokens } from '@/api/client';

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Store d'authentification avec persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // État initial
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Définir l'utilisateur
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      // Définir les tokens
      setTokens: (accessToken, refreshToken) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        set({
          accessToken,
          refreshToken,
        });
      },

      // Login complet
      login: (user, accessToken, refreshToken) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          error: null,
        });
      },

      // Logout
      logout: () => {
        clearTokens();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Mettre à jour l'utilisateur
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      // Définir le loading
      setLoading: (isLoading) => set({ isLoading }),

      // Définir l'erreur
      setError: (error) => set({ error }),

      // Effacer l'erreur
      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.USER,
      // ✅ CORRECTION : Persister user + tokens + isAuthenticated
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      // ✅ Restaurer les tokens dans le client API au chargement
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessToken(state.accessToken);
        }
        if (state?.refreshToken) {
          setRefreshToken(state.refreshToken);
        }
      },
    }
  )
);
