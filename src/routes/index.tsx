import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES, USER_ROLES } from '@/config/constants';

// Pages
import Login from '@/pages/auth/Login';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Dashboards
import AdminDashboard from '@/pages/admin/Dashboard';

// Pages Académiques
import {
  AnneeAcademiquesPage,
  FacultesPage,
  DepartementsPage,
  FilieresPage,
  MatieresPage,
  AcademicStructureTree,
} from '@/pages/admin/academic';

// Pages Étudiants
import {
  StudentsList,
  StudentForm,
  StudentProfile,
} from '@/pages/admin/students';

// Pages Enseignants
import {
  TeachersList,
  TeacherForm,
  TeacherProfile,
} from '@/pages/admin/teachers';

// Pages Évaluations - AJOUT
import {
  EvaluationsList,
  GradeEntry,
  EvaluationForm,
  DeliberationSession,
  StudentGrades,
} from '@/pages/admin/evaluations';

// Components
import RoleRoute from '@/components/RoleRoute';
import { MainLayout } from '@/components/layout';

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
        <MainLayout>
          <AdminDashboard />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // Routes Académiques
  {
    path: '/admin/academic/structure',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <AcademicStructureTree />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/academic/annees-academiques',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <AnneeAcademiquesPage />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/academic/facultes',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <FacultesPage />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/academic/departements',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <DepartementsPage />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/academic/filieres',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <FilieresPage />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/academic/matieres',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <MatieresPage />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // Routes Étudiants
  {
    path: '/admin/students',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <StudentsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/students/new',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <StudentForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/students/:id',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <StudentProfile />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/students/:id/edit',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <StudentForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/students/:id/bulletin',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.TEACHER]}>
        <MainLayout>
          <StudentGrades />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // Routes Enseignants
  {
    path: '/admin/teachers',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <TeachersList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/teachers/new',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <TeacherForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/teachers/:id',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <TeacherProfile />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/teachers/:id/edit',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <TeacherForm />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // ==================== ROUTES ÉVALUATIONS ====================
  {
    path: '/admin/evaluations',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.TEACHER]}>
        <MainLayout>
          <EvaluationsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/evaluations/:id/saisie-notes',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.TEACHER]}>
        <MainLayout>
          <GradeEntry />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/evaluations/new',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <EvaluationForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/evaluations/:id/edit',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <EvaluationForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/evaluations/sessions/:id',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <DeliberationSession />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // Page 404 - Not Found (doit être en dernier)
  {
    path: '*',
    element: <NotFound />,
  },
]);