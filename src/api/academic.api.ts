/**
 * Service API pour le module Académique
 * CRUD pour Facultés, Départements, Filières, Matières
 */

import apiClient from './client';
import type {
  // Année Académique
  AnneeAcademique,
  AnneeAcademiqueCreate,
  
  // Faculté
  Faculte,
  FaculteCreate,
  FaculteUpdate,
  FaculteStats,
  FaculteFilters,
  
  // Département
  Departement,
  DepartementCreate,
  DepartementUpdate,
  DepartementFilters,
  
  // Filière
  Filiere,
  FiliereCreate,
  FiliereUpdate,
  FiliereFilters,
  
  // Matière
  Matiere,
  MatiereCreate,
  MatiereUpdate,
  MatiereFilters,
  
  // Types API
  PaginatedResponse,
} from '@/types';

const BASE_URL = {
  ANNEES: '/annees-academiques',
  FACULTES: '/facultes',
  DEPARTEMENTS: '/departements',
  FILIERES: '/filieres',
  MATIERES: '/matieres',
};

// ============== ANNÉES ACADÉMIQUES ==============

export const anneeAcademiqueApi = {
  getAll: () =>
    apiClient.get<PaginatedResponse<AnneeAcademique>>(BASE_URL.ANNEES),

  getActive: () =>
    apiClient.get<AnneeAcademique>(`${BASE_URL.ANNEES}/active/`),

  getById: (id: number) =>
    apiClient.get<AnneeAcademique>(`${BASE_URL.ANNEES}/${id}/`),

  create: (data: AnneeAcademiqueCreate) =>
    apiClient.post<AnneeAcademique>(BASE_URL.ANNEES, data),

  update: (id: number, data: Partial<AnneeAcademiqueCreate>) =>
    apiClient.patch<AnneeAcademique>(`${BASE_URL.ANNEES}/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`${BASE_URL.ANNEES}/${id}/`),

  activate: (id: number) =>
    apiClient.post<AnneeAcademique>(`${BASE_URL.ANNEES}/${id}/activate/`),
};

// ============== FACULTÉS ==============

export const faculteApi = {
  getAll: (filters?: FaculteFilters) =>
    apiClient.get<PaginatedResponse<Faculte>>(BASE_URL.FACULTES, { params: filters }),

  getById: (id: number) =>
    apiClient.get<Faculte>(`${BASE_URL.FACULTES}/${id}/`),

  create: (data: FaculteCreate) =>
    apiClient.post<Faculte>(BASE_URL.FACULTES, data),

  update: (id: number, data: FaculteUpdate) =>
    apiClient.patch<Faculte>(`${BASE_URL.FACULTES}/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`${BASE_URL.FACULTES}/${id}/`),

  getStats: (id: number) =>
    apiClient.get<FaculteStats>(`${BASE_URL.FACULTES}/${id}/statistiques/`),
};

// ============== DÉPARTEMENTS ==============

export const departementApi = {
  getAll: (filters?: DepartementFilters) =>
    apiClient.get<PaginatedResponse<Departement>>(BASE_URL.DEPARTEMENTS, { params: filters }),

  getById: (id: number) =>
    apiClient.get<Departement>(`${BASE_URL.DEPARTEMENTS}/${id}/`),

  create: (data: DepartementCreate) =>
    apiClient.post<Departement>(BASE_URL.DEPARTEMENTS, data),

  update: (id: number, data: DepartementUpdate) =>
    apiClient.patch<Departement>(`${BASE_URL.DEPARTEMENTS}/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`${BASE_URL.DEPARTEMENTS}/${id}/`),
};

// ============== FILIÈRES ==============

export const filiereApi = {
  getAll: (filters?: FiliereFilters) =>
    apiClient.get<PaginatedResponse<Filiere>>(BASE_URL.FILIERES, { params: filters }),

  getById: (id: number) =>
    apiClient.get<Filiere>(`${BASE_URL.FILIERES}/${id}/`),

  create: (data: FiliereCreate) =>
    apiClient.post<Filiere>(BASE_URL.FILIERES, data),

  update: (id: number, data: FiliereUpdate) =>
    apiClient.patch<Filiere>(`${BASE_URL.FILIERES}/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`${BASE_URL.FILIERES}/${id}/`),

  getMatieres: (id: number) =>
    apiClient.get<PaginatedResponse<Matiere>>(`${BASE_URL.FILIERES}/${id}/matieres/`),
};

// ============== MATIÈRES ==============

export const matiereApi = {
  getAll: (filters?: MatiereFilters) =>
    apiClient.get<PaginatedResponse<Matiere>>(BASE_URL.MATIERES, { params: filters }),

  getById: (id: number) =>
    apiClient.get<Matiere>(`${BASE_URL.MATIERES}/${id}/`),

  create: (data: MatiereCreate) =>
    apiClient.post<Matiere>(BASE_URL.MATIERES, data),

  update: (id: number, data: MatiereUpdate) =>
    apiClient.patch<Matiere>(`${BASE_URL.MATIERES}/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`${BASE_URL.MATIERES}/${id}/`),
};

// Export groupé
export const academicApi = {
  annees: anneeAcademiqueApi,
  facultes: faculteApi,
  departements: departementApi,
  filieres: filiereApi,
  matieres: matiereApi,
};

export default academicApi;
