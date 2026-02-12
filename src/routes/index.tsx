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

// Pages Emploi de temps
import {
  BatimentsList,
  SallesList,
  CreneauxList,
  CoursPlanning,
  ConflictsList,
} from '@/pages/admin/schedule';

// Pages Évaluations
import {
  EvaluationsList,
  EvaluationForm,
  GradeEntry,
  StudentGrades,
  DeliberationSession,
  BulletinView,
} from '@/pages/admin/evaluations';

// Pages Finances
import {
  FinanceDashboard,
  FraisScolariteList,
  FraisScolariteForm,
  PaiementsList,
  PaiementForm,
  BoursesList,
  BourseForm,
  StudentPaymentsView,
} from '@/pages/admin/finance';

// Pages Bibliothèque
import {
  BooksList,
  BookForm,
  BorrowingsList,
  BorrowingForm,
  LibraryStats,
} from '@/pages/admin/library';

// Pages Présences
import {
  AttendanceSheetsList,
  AttendanceSheetView,
  AttendanceForm,
  JustificationsList,
  StudentAttendanceView,
  AttendanceStats,
} from '@/pages/admin/attendance';

// Pages Ressources (NOUVEAU MODULE)
import {
  EquipmentsList,
  EquipmentForm,
  ReservationsList,
  ReservationCalendar,
  ReservationForm,
  MaintenancesList,
  MaintenanceScheduler,
} from '@/pages/admin/resources';

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
    path: '/admin/students/:id/attendance',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <StudentAttendanceView />
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

  // ==================== ROUTES PRÉSENCES ====================
  {
    path: '/admin/attendance',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <AttendanceSheetsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/attendance/create',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <AttendanceForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/attendance/:id',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <AttendanceSheetView />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/attendance/justifications',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <JustificationsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/attendance/stats',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <AttendanceStats />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // Routes emploi de temps
  {
    path: '/admin/schedule/planning',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <CoursPlanning />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/schedule/batiments',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BatimentsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/schedule/salles',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <SallesList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/schedule/creneaux',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <CreneauxList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/schedule/conflits',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <ConflictsList />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // Routes Évaluations
  {
    path: '/admin/evaluations',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <EvaluationsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/evaluations/create',
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
    path: '/admin/evaluations/:id/notes',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <GradeEntry />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/students/:etudiantId/grades',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <StudentGrades />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/students/:etudiantId/bulletin/:anneeId?',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BulletinView />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/deliberations/:sessionId',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <DeliberationSession />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // ==================== ROUTES FINANCES ====================
  {
    path: '/admin/finance',
    element: <Navigate to="/admin/finance/dashboard" replace />,
  },
  {
    path: '/admin/finance/dashboard',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <FinanceDashboard />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/finance/frais-scolarite',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <FraisScolariteList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/finance/frais-scolarite/nouveau',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <FraisScolariteForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/finance/frais-scolarite/:id/modifier',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <FraisScolariteForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/finance/paiements',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <PaiementsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/finance/paiements/nouveau',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <PaiementForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/finance/paiements/etudiant/:id',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <StudentPaymentsView />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/finance/bourses',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BoursesList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/finance/bourses/nouveau',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BourseForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/finance/bourses/:id/modifier',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BourseForm />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // ==================== ROUTES BIBLIOTHÈQUE ====================
  {
    path: '/admin/library',
    element: <Navigate to="/admin/library/stats" replace />,
  },
  {
    path: '/admin/library/stats',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <LibraryStats />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/library/books',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BooksList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/library/books/new',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BookForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/library/books/:id/edit',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BookForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/library/borrowings',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BorrowingsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/library/borrowings/new',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <BorrowingForm />
        </MainLayout>
      </RoleRoute>
    ),
  },

  // ==================== ROUTES RESSOURCES (NOUVEAU MODULE) ====================
  {
    path: '/admin/resources',
    element: <Navigate to="/admin/resources/equipments" replace />,
  },
  {
    path: '/admin/resources/equipments',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <EquipmentsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/resources/equipments/new',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <EquipmentForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/resources/equipments/:id/edit',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <EquipmentForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/resources/calendar',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <ReservationCalendar />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/resources/reservations',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <ReservationsList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/resources/reservations/new',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <ReservationForm />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/resources/maintenances',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <MaintenancesList />
        </MainLayout>
      </RoleRoute>
    ),
  },
  {
    path: '/admin/resources/maintenances/new',
    element: (
      <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <MainLayout>
          <MaintenanceScheduler />
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