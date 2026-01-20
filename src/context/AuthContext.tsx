import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type User, type LoginResponse } from '../services/api'; // On importe ici notre service API

// TYPES : Cette interface definit ce que le context va fournir a tous les composants.
interface AuthContextType {
  user: User | null; // L'utilisateur connecté; null si personne n'est connecté
  isAuthenticated: boolean;
  isLoading: boolean; // Icic, on a true pendant la verification initiale pour eviter les flashs d'ecran
  login: (username: string, password: string) => Promise<void>; // notre fonction pour se connecter
  logout: () => void; // Notre fonction pour se deconnecter.
}

// CRÉER LE CONTEXTE
const AuthContext = createContext<AuthContextType | undefined>(undefined); // undefined = Valeur par defaut, parceque le context n'existe pas que a l'interieur du provider

// PROVIDER
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // UseState: Créé un etat local
  const [isLoading, setIsLoading] = useState(true); // IsLoading: Nous indique si on est en train de charger

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => { // C'est le Hook React pour executer le code au bon moment. IL dit fais ca qunad le composant apparait a l'ecran
    const checkAuth = () => { //Fonction qui verifie si l'utilisateur est connecté
      const storedUser = authService.getCurrentUser(); // Recupere l'utilisateur du localStorage
      const isAuth = authService.isAuthenticated(); // Verifie si le token existe
      
      if (isAuth && storedUser) { // Si connecté, mettre l'utilisateur dans l'etat
        setUser(storedUser);
      }
      
      setIsLoading(false);
    };

    checkAuth(); //Execute la fonction
  }, []); // Une seule fois au chargement

  // Fonction de connexion
  const login = async (username: string, password: string) => { // Fonction asynchrone qui prend le username et password
    try {
      const response: LoginResponse = await authService.login(username, password);
      
      // Sauvegarder les tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Mettre à jour l'état
      setUser(response.user);
    } catch (error) { // Si erreur -> l'afficher
      console.error('Erreur de connexion:', error);
      throw error; // Relance l'erreur, et le composant qui appelle pourra la gerer
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authService.logout(); //Supprime du localStorage
    setUser(null); // Reinitialise l'etat
  };

  // Valeur de contexte : Objet qui contient tout ce qu'on veut partager
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  // Retourner le PROVIDER
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; // AuthContext.provider -> Composant qui fournit le contexte
};

// HOOK PERSONNALISÉ : Fonction qui commence par use et qui simplifie l'utilisation du contexte
export const useAuth = () => {
  const context = useContext(AuthContext); // REcupere le contexte
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  } // C'est une verification de securité, si utilisé en dehors du provider -> erreur claire
  
  return context; // Retourne le contexte
};

// Le contexte va permettre de partager l'authentification
/*
HOOK: fonction react qui commence par use. permet d'ajouter des fonctionnalites aa un composant
       useState -> Gerer un etat
       UseEffect -> Executer du code au changement
       useContext -> Utiliser un context
*/
// Hook personnalisé: Votre propre foonction qui utilise d'autres hooks 