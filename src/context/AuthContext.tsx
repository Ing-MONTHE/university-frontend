import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import type { User, LoginCredentials, AuthContextType } from '../types/auth.types';

// CRÉATION DU CONTEXTE
/**
 * Contexte d'authentification
 * Permet de partager l'état d'authentification dans toute l'application
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined); // Creation du contexte React pour partager l'etat d'authentification

// PROVIDER
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider du contexte d'authentification
 * Entoure l'application pour fournir l'état d'auth à tous les composants
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // États
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // EFFET : VÉRIFIER L'AUTHENTIFICATION AU CHARGEMENT
  useEffect(() => {
    /**
     * Vérifier si l'utilisateur est déjà connecté
     * (en vérifiant le localStorage)
     */
    const checkAuth = () => {
      try {
        const isAuth = authApi.isAuthenticated();
        const currentUser = authApi.getCurrentUser();
        
        if (isAuth && currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // FONCTION : LOGIN
  /**
   * Connecter l'utilisateur
   * @param credentials - Identifiants (username, password)
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      // Appeler l'API Django
      const response = await authApi.login(credentials);
      
      // Sauvegarder les tokens dans le localStorage
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Mettre à jour l'état
      setUser(response.user);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error; // Relancer l'erreur pour que le composant puisse la gérer
    }
  };

  // FONCTION : LOGOUT
  /**
   * Déconnecter l'utilisateur
   */
  const logout = (): void => {
    // Supprimer du localStorage
    authApi.logout();
    
    // Réinitialiser l'état
    setUser(null);
  };

  // VALEUR DU CONTEXTE
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  // RENDU
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// HOOK PERSONNALISÉ
/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns Contexte d'authentification
 * @throws Erreur si utilisé en dehors du AuthProvider
 * 
 * @example
 * const { user, login, logout } = useAuth();
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    
    return context;
};
