/**
 * Store Zustand pour la gestion de l'UI
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'fr' | 'en';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Language
  language: Language;
  setLanguage: (language: Language) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Global Loading
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Store UI avec persistence
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // État initial
      sidebarCollapsed: false,
      language: 'fr',
      notifications: [],
      isLoading: false,

      // Toggle Sidebar
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Set Language
      setLanguage: (language) => set({ language }),

      // Add Notification
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              timestamp: Date.now(),
            },
          ],
        })),

      // Remove Notification
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // Clear Notifications
      clearNotifications: () => set({ notifications: [] }),

      // Set Loading
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'ums-ui-preferences',
      // Persister les préférences utilisateur
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        language: state.language,
      }),
    }
  )
);