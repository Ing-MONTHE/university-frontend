/**
 * Store Zustand pour la gestion de l'interface utilisateur
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/config/constants';

type Theme = 'light' | 'dark';
type Language = 'fr' | 'en';

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  
  // Theme
  theme: Theme;
  
  // Language
  language: Language;
  
  // Notifications
  notifications: number;
  
  // Loading global
  isGlobalLoading: boolean;
}

interface UIStore extends UIState {
  // Actions Sidebar
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Actions Theme
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  
  // Actions Language
  setLanguage: (language: Language) => void;
  
  // Actions Notifications
  setNotifications: (count: number) => void;
  incrementNotifications: () => void;
  decrementNotifications: () => void;
  clearNotifications: () => void;
  
  // Actions Loading
  setGlobalLoading: (isLoading: boolean) => void;
}

/**
 * Store UI avec persistence
 */
export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // État initial
      isSidebarOpen: true,
      isSidebarCollapsed: false,
      theme: 'light',
      language: 'fr',
      notifications: 0,
      isGlobalLoading: false,

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      openSidebar: () => set({ isSidebarOpen: true }),
      
      closeSidebar: () => set({ isSidebarOpen: false }),
      
      toggleSidebarCollapse: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      
      setSidebarCollapsed: (collapsed) =>
        set({ isSidebarCollapsed: collapsed }),

      // Theme actions
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          // Appliquer le thème au document
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),
      
      setTheme: (theme) => {
        // Appliquer le thème au document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },

      // Language actions
      setLanguage: (language) => set({ language }),

      // Notifications actions
      setNotifications: (count) => set({ notifications: count }),
      
      incrementNotifications: () =>
        set((state) => ({ notifications: state.notifications + 1 })),
      
      decrementNotifications: () =>
        set((state) => ({
          notifications: Math.max(0, state.notifications - 1),
        })),
      
      clearNotifications: () => set({ notifications: 0 }),

      // Loading actions
      setGlobalLoading: (isLoading) => set({ isGlobalLoading: isLoading }),
    }),
    {
      name: STORAGE_KEYS.THEME,
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    }
  )
);