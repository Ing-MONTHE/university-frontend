import { useNavigate as useRouterNavigate } from 'react-router-dom';

/**
 * Hook personnalisé pour la navigation
 * Simplifie l'utilisation de useNavigate
 */
export const useNavigate = () => {
  const navigate = useRouterNavigate();

  return {
    goToDashboard: () => navigate('/dashboard'),
    goToLogin: () => navigate('/login'),
    goBack: () => navigate(-1),
    goTo: (path: string) => navigate(path),
  };
};