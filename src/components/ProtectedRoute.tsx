import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/config/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Rediriger vers la page de login si non authentifié
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
