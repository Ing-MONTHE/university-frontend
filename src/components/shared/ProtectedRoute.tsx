import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// COMPOSANT PROTECTED ROUTE
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Composant pour protéger les routes
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 * 
 * @example
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, rediriger vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Si non connecté -> Redirige vers /login
  }

  // Si authentifié, afficher le composant enfant
  return <>{children}</>; // Si authentifié -> On affiche le composant enfant
};

export default ProtectedRoute;
