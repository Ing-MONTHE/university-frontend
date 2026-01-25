import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/config/constants';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  console.log('🔒 RoleRoute check:', { isAuthenticated, user, allowedRoles });

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Extraire les noms de rôles depuis les objets
  const userRoles = user?.roles?.map((role: any) => role.name) || [];
  
  console.log('👤 User roles:', userRoles);

  const hasRequiredRole = userRoles.some((role: string) =>
    allowedRoles.includes(role)
  );

  console.log('✓ Has required role?', hasRequiredRole);

  if (!hasRequiredRole) {
    console.log('❌ Missing required role, redirecting to unauthorized');
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}