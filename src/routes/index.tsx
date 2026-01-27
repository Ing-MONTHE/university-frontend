import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '@/config/constants';

// Pages
import Login from '@/pages/auth/Login';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Dashboards
import AdminDashboard from '@/pages/admin/Dashboard';
import TeacherDashboard from '@/pages/teacher/Dashboard';
import StudentDashboard from '@/pages/student/Dashboard';

// Students
import StudentsList from '@/pages/admin/students/StudentsList';

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
  
  // Route STUDENTS
  {
    path: '/admin/students',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <StudentsList />
      </RoleRoute>
    ),
  },

  // TODO: Ajouter plus de routes admin
  // {
  //   path: '/admin/teachers',
  //   element: (
  //     <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
  //       <TeachersList />
  //     </RoleRoute>
  //   ),
  // },

  // ==================== ROUTES ENSEIGNANT ====================
  {
    path: ROUTES.TEACHER_DASHBOARD,
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.TEACHER]}>
        <TeacherDashboard />
      </RoleRoute>
    ),
  },

  // ==================== ROUTES ÉTUDIANT ====================
  {
    path: ROUTES.STUDENT_DASHBOARD,
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.STUDENT]}>
        <StudentDashboard />
      </RoleRoute>
    ),
  },

  // Page 404 - Not Found (doit être en dernier)
  {
    path: '*',
    element: <NotFound />,
  },
]);