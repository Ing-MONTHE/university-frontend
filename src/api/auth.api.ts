/**
 * Service API pour l'authentification
 */

import apiClient from './client';
import type { LoginCredentials, LoginResponse, RefreshTokenResponse, User } from '@/types';
import { API_ENDPOINTS } from '@/config/constants';

/**
 * Service d'authentification
 */
export const authApi = {
  /**
   * Connexion utilisateur
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH_LOGIN,
      credentials
    );
    return response.data;
  },

  /**
   * Déconnexion utilisateur
   */
  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
  },

  /**
   * Rafraîchir le token d'accès
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH_REFRESH,
      { refresh: refreshToken }
    );
    return response.data;
  },

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH_ME);
    return response.data;
  },

  /**
   * Mettre à jour le profil
   */
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(API_ENDPOINTS.AUTH_ME, data);
    return response.data;
  },

  /**
   * Changer le mot de passe
   */
  changePassword: async (data: {
    old_password: string;
    new_password: string;
  }): Promise<void> => {
    await apiClient.post(`${API_ENDPOINTS.AUTH_ME}/change-password/`, data);
  },
};