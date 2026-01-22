// TYPES POUR L'AUTHENTIFICATION
/**
 * Structure d'un utilisateur
 */
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

/**
 * Données de connexion
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Réponse du serveur après connexion
 */
export interface LoginResponse {
  access: string;   // Token JWT d'accès
  refresh: string;  // Token JWT de rafraîchissement
  user: User;       // Informations utilisateur
}

/**
 * Contexte d'authentification
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
