/**
 * API Client pour le module Académique
 */

import apiClient from './client';
import type {
  AnneeAcademique,
  AnneeAcademiqueCreate,
  AnneeAcademiqueUpdate,
  AnneeAcademiqueFilters,
  Faculte,
  FaculteCreate,
  FaculteUpdate,
  FaculteFilters,
  Departement,
  DepartementCreate,
  DepartementUpdate,
  DepartementFilters,
  Filiere,
  FiliereCreate,
  FiliereUpdate,
  FiliereFilters,
  Matiere,
  MatiereCreate,
  MatiereUpdate,
  MatiereFilters,
  PaginatedResponse,
} from '@/types/academic.types';

// ============== ANNÉE ACADÉMIQUE ==============

export const anneeAcademiqueApi = {
  /**
   * Récupérer toutes les années académiques (avec filtres et pagination)
   */
  getAll: async (filters?: AnneeAcademiqueFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedResponse<AnneeAcademique>>(
      `/academic/annees-academiques/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer une année académique par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<AnneeAcademique>(`/academic/annees-academiques/${id}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle année académique
   */
  create: async (data: AnneeAcademiqueCreate) => {
    const response = await apiClient.post<AnneeAcademique>('/academic/annees-academiques/', data);
    return response.data;
  },

  /**
   * Mettre à jour une année académique
   */
  update: async (id: number, data: AnneeAcademiqueUpdate) => {
    const response = await apiClient.patch<AnneeAcademique>(`/academic/annees-academiques/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer une année académique
   */
  delete: async (id: number) => {
    await apiClient.delete(`/academic/annees-academiques/${id}/`);
  },

  /**
   * Activer une année académique (action custom)
   */
  activate: async (id: number) => {
    const response = await apiClient.post<AnneeAcademique>(`/academic/annees-academiques/${id}/activate/`);
    return response.data;
  },

  /**
   * Fermer une année académique (action custom)
   */
  close: async (id: number) => {
    const response = await apiClient.post<AnneeAcademique>(`/academic/annees-academiques/${id}/close/`);
    return response.data;
  },
};

// ============== FACULTÉS ==============

export const faculteApi = {
  /**
   * Récupérer toutes les facultés (avec filtres et pagination)
   */
  getAll: async (filters?: FaculteFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedResponse<Faculte>>(
      `/academic/facultes/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer une faculté par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<Faculte>(`/academic/facultes/${id}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle faculté
   */
  create: async (data: FaculteCreate) => {
    const response = await apiClient.post<Faculte>('/academic/facultes/', data);
    return response.data;
  },

  /**
   * Mettre à jour une faculté
   */
  update: async (id: number, data: FaculteUpdate) => {
    const response = await apiClient.patch<Faculte>(`/academic/facultes/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer une faculté
   */
  delete: async (id: number) => {
    await apiClient.delete(`/academic/facultes/${id}/`);
  },
};

// ============== DÉPARTEMENTS ==============

export const departementApi = {
  /**
   * Récupérer tous les départements (avec filtres et pagination)
   */
  getAll: async (filters?: DepartementFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.faculte) params.append('faculte', String(filters.faculte));
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedResponse<Departement>>(
      `/academic/departements/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer un département par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<Departement>(`/academic/departements/${id}/`);
    return response.data;
  },

  /**
   * Créer un nouveau département
   */
  create: async (data: DepartementCreate) => {
    const response = await apiClient.post<Departement>('/academic/departements/', data);
    return response.data;
  },

  /**
   * Mettre à jour un département
   */
  update: async (id: number, data: DepartementUpdate) => {
    const response = await apiClient.patch<Departement>(`/academic/departements/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer un département
   */
  delete: async (id: number) => {
    await apiClient.delete(`/academic/departements/${id}/`);
  },
};

// ============== FILIÈRES ==============

export const filiereApi = {
  /**
   * Récupérer toutes les filières (avec filtres et pagination)
   */
  getAll: async (filters?: FiliereFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.departement) params.append('departement', String(filters.departement));
    if (filters?.cycle) params.append('cycle', filters.cycle);
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedResponse<Filiere>>(
      `/academic/filieres/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer une filière par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<Filiere>(`/academic/filieres/${id}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle filière
   */
  create: async (data: FiliereCreate) => {
    const response = await apiClient.post<Filiere>('/academic/filieres/', data);
    return response.data;
  },

  /**
   * Mettre à jour une filière
   */
  update: async (id: number, data: FiliereUpdate) => {
    const response = await apiClient.patch<Filiere>(`/academic/filieres/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer une filière
   */
  delete: async (id: number) => {
    await apiClient.delete(`/academic/filieres/${id}/`);
  },
};

// ============== MATIÈRES ==============

export const matiereApi = {
  /**
   * Récupérer toutes les matières (avec filtres et pagination)
   */
  getAll: async (filters?: MatiereFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.filiere) params.append('filiere', String(filters.filiere));
    if (filters?.semestre) params.append('semestre', String(filters.semestre));
    if (filters?.is_optionnelle !== undefined) params.append('is_optionnelle', String(filters.is_optionnelle));
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedResponse<Matiere>>(
      `/academic/matieres/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer une matière par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<Matiere>(`/academic/matieres/${id}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle matière
   */
  create: async (data: MatiereCreate) => {
    const response = await apiClient.post<Matiere>('/academic/matieres/', data);
    return response.data;
  },

  /**
   * Mettre à jour une matière
   */
  update: async (id: number, data: MatiereUpdate) => {
    const response = await apiClient.patch<Matiere>(`/academic/matieres/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer une matière
   */
  delete: async (id: number) => {
    await apiClient.delete(`/academic/matieres/${id}/`);
  },
};