/**
 * Constantes de configuration de l'application
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = 30000; // 30 secondes

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'University Management System';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: import.meta.env.VITE_TOKEN_STORAGE_KEY || 'ums_access_token',
  REFRESH_TOKEN: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'ums_refresh_token',
  USER: 'ums_user',
  THEME: 'ums_theme',
  LANGUAGE: 'ums_language',
} as const;

// Features Flags
export const FEATURES = {
  DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Format
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const TIME_FORMAT = 'HH:mm';

// Routes
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',

  // Error pages
  UNAUTHORIZED: '/unauthorized',  // ← AJOUTER CETTE LIGNE
  NOT_FOUND: '/404',
  
  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_STUDENTS: '/admin/students',
  ADMIN_TEACHERS: '/admin/teachers',
  ADMIN_FACULTIES: '/admin/faculties',
  ADMIN_PROGRAMS: '/admin/programs',
  ADMIN_SCHEDULE: '/admin/schedule',
  ADMIN_FINANCE: '/admin/finance',
  ADMIN_LIBRARY: '/admin/library',
  ADMIN_REPORTS: '/admin/reports',
  
  // Teacher
  TEACHER_DASHBOARD: '/teacher',
  TEACHER_CLASSES: '/teacher/classes',
  TEACHER_ATTENDANCE: '/teacher/attendance',
  TEACHER_GRADES: '/teacher/grades',
  TEACHER_SCHEDULE: '/teacher/schedule',
  
  // Student
  STUDENT_DASHBOARD: '/student',
  STUDENT_GRADES: '/student/grades',
  STUDENT_SCHEDULE: '/student/schedule',
  STUDENT_LIBRARY: '/student/library',
  STUDENT_FINANCE: '/student/finance',
  STUDENT_DOCUMENTS: '/student/documents',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login/',
  AUTH_LOGOUT: '/auth/logout/',
  AUTH_REFRESH: '/auth/refresh/',
  AUTH_ME: '/users/me/',
  
  // Academic
  FACULTIES: '/facultes/',
  DEPARTMENTS: '/departements/',
  PROGRAMS: '/filieres/',
  SUBJECTS: '/matieres/',
  ACADEMIC_YEARS: '/annees-academiques/',
  
  // Students
  STUDENTS: '/etudiants/',
  TEACHERS: '/enseignants/',
  ENROLLMENTS: '/inscriptions/',
  
  // Evaluations
  EVALUATIONS: '/evaluations/',
  GRADES: '/notes/',
  RESULTS: '/resultats/',
  
  // Schedule
  BUILDINGS: '/batiments/',
  ROOMS: '/salles/',
  TIMETABLE: '/cours/',
  CONFLICTS: '/conflits/',
  
  // Library
  BOOKS: '/livres/',
  BORROWINGS: '/emprunts/',
  CATEGORIES: '/categories-livre/',
  
  // Finance
  FEES: '/frais-scolarite/',
  PAYMENTS: '/paiements/',
  SCHOLARSHIPS: '/bourses/',
  INVOICES: '/factures/',
  
  // Communications
  ANNOUNCEMENTS: '/annonces/',
  NOTIFICATIONS: '/notifications/',
  MESSAGES: '/messages/',
  
  // Analytics
  REPORTS: '/rapports/',
  DASHBOARDS: '/dashboards/',
  KPIS: '/kpis/',
} as const;

// Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
} as const;