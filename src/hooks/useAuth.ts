import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store';
import { authApi } from '@/api';
import type { LoginCredentials } from '@/types';
import { ROUTES } from '@/config/constants';

export const useAuth = () => {
  const navigate = useNavigate();
  
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginStore,
    logout: logoutStore,
    updateUser,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  // Mutation de login AVEC navigation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (data) => {
      console.log('✅ Login success, data:', data);
      
      loginStore(data.user, data.access, data.refresh);
      setLoading(false);
      
      // Extraire le nom du rôle depuis l'objet
      const role = data.user.roles?.[0]?.name; // ← .name !
      
      console.log('🔍 User role:', role);
      
      if (role === 'ADMIN') {
        console.log('➡️ Redirecting to ADMIN dashboard');
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      } else if (role === 'TEACHER') {
        console.log('➡️ Redirecting to TEACHER dashboard');
        navigate(ROUTES.TEACHER_DASHBOARD, { replace: true });
      } else if (role === 'STUDENT') {
        console.log('➡️ Redirecting to STUDENT dashboard');
        navigate(ROUTES.STUDENT_DASHBOARD, { replace: true });
      } else {
        console.warn('⚠️ Unknown role:', role);
        navigate('/', { replace: true });
      }
    },
    onError: (error: any) => {
      console.error('❌ Login error:', error);
      setLoading(false);
      setError(error.message || 'Erreur de connexion');
    },
  });

  // Mutation de logout AVEC navigation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logoutStore();
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: () => {
      logoutStore();
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });

  const login = useCallback(
    (credentials: LoginCredentials) => {
      return loginMutation.mutate(credentials);
    },
    [loginMutation]
  );

  const logout = useCallback(() => {
    return logoutMutation.mutate();
  }, [logoutMutation]);

  const hasRole = useCallback(
    (role: string): boolean => {
      // Extraire les noms depuis les objets roles
      const userRoles = user?.roles?.map((r: any) => r.name) || [];
      return userRoles.includes(role);
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      // all_permissions est déjà un tableau de strings
      return user?.all_permissions?.includes(permission) || false;
    },
    [user]
  );

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    error,
    login,
    logout,
    updateUser,
    clearError,
    hasRole,
    hasPermission,
  };
};
