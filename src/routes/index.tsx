import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

export const router = createBrowserRouter([
  // Routes publiques
  {
    path: '/login',
    element: <Login />,
  },

  // Routes protégées avec Layout
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },

  // Redirections
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);