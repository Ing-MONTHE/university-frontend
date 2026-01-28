import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '@/config/constants';

// Pages
import Login from '@/pages/auth/Login';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Dashboards
import AdminDashboard from '@/pages/admin/Dashboard';
import TeacherDashboard from '@/pages/teacher/Dashboard';

// Academic
import FacultiesList from '@/pages/admin/academic/Facultieslist';

// Components
import RoleRoute from '@/components/RoleRoute';

/**
 * Configuration du router
 */
export const router = createBrowserRouter([
  // Route racine - Redirection vers login
  {
    path: '/',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },

  // Routes publiques
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },

  // Page 403 - Unauthorized
  {
    path: ROUTES.UNAUTHORIZED,
    element: <Unauthorized />,
  },

  // ==================== ROUTES ADMIN ====================
  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <AdminDashboard />
      </RoleRoute>
    ),
  },

  // Academic - Facultés
  {
    path: '/admin/academic/facultes',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <FacultiesList />
      </RoleRoute>
    ),
  },

  // ==================== ROUTES ENSEIGNANT ====================
  {
    path: ROUTES.TEACHER_DASHBOARD,
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.TEACHER]}>
        <TeacherDashboard />
      </RoleRoute>
    ),
  },

  // Page 404 - Not Found (doit être en dernier)
  {
    path: '*',
    element: <NotFound />,
  },
]);