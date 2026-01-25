/**
 * Types pour l'authentification et la gestion des utilisateurs
 */

// Rôles utilisateurs
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

// Utilisateur connecté
export interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  roles: Array<{ id: number; name: string; description: string }>; // ← Objet !
  all_permissions: string[];
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

// Credentials de connexion
export interface LoginCredentials {
  username: string;
  password: string;
  remember_me?: boolean;
}

// Réponse de connexion
export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

// Token de rafraîchissement
export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

// État d'authentification
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}