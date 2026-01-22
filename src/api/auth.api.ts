import { apiClient } from './clients';
import type { LoginCredentials, LoginResponse, User } from '../types/auth.types';

// SERVICE D'AUTHENTIFICATION
/**
 * Service pour gérer l'authentification
 */
export const authApi = {
  /**
   * Connexion de l'utilisateur
   * @param credentials - Identifiants (username, password)
   * @returns Tokens JWT et informations utilisateur
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', credentials);
    return response.data;
  },

  /**
   * Rafraîchir le token d'accès
   * @param refreshToken - Token de rafraîchissement
   * @returns Nouveau token d'accès
   */
  refresh: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await apiClient.post<{ access: string }>('/auth/refresh/', {
      refresh: refreshToken
    });
    return response.data;
  },

  /**
   * Déconnexion de l'utilisateur (côté client uniquement)
   * Supprime les tokens du localStorage
   */
  logout: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  /**
   * Récupérer l'utilisateur actuellement connecté depuis le localStorage
   * @returns Utilisateur ou null si non connecté
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erreur lors du parsing de l\'utilisateur:', error);
      return null;
    }
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns true si un token existe, false sinon
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};
