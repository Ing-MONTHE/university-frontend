/**
 * API Client pour le module Évaluations & Délibérations
 * Endpoints Django REST Framework
 */

import apiClient from './client';
import type {
  TypeEvaluation,
  TypeEvaluationCreate,
  TypeEvaluationUpdate,
  TypeEvaluationFilters,
  Evaluation,
  EvaluationCreate,
  EvaluationUpdate,
  EvaluationFilters,
  Note,
  NoteCreate,
  NoteUpdate,
  NoteFilters,
  NoteSaisieLot,
  Bulletin,
  ResultatsFiliere,
  SessionDeliberation,
  SessionDeliberationCreate,
  SessionDeliberationUpdate,
  SessionDeliberationFilters,
  DecisionJuryUpdate,
  StatsEvaluation,
  EvolutionNotes,
  PaginatedTypesEvaluation,
  PaginatedEvaluations,
  PaginatedNotes,
  PaginatedSessionsDeliberation,
} from '@/types/evaluation.types';

// ============== TYPES D'ÉVALUATION ==============

export const typeEvaluationApi = {
  /**
   * Récupérer tous les types d'évaluation
   */
  getAll: async (filters?: TypeEvaluationFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedTypesEvaluation>(
      `/types-evaluations/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer un type d'évaluation par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<TypeEvaluation>(`/types-evaluations/${id}/`);
    return response.data;
  },

  /**
   * Créer un nouveau type d'évaluation
   */
  create: async (data: TypeEvaluationCreate) => {
    const response = await apiClient.post<TypeEvaluation>('/types-evaluations/', data);
    return response.data;
  },

  /**
   * Mettre à jour un type d'évaluation
   */
  update: async (id: number, data: TypeEvaluationUpdate) => {
    const response = await apiClient.patch<TypeEvaluation>(`/types-evaluations/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer un type d'évaluation
   */
  delete: async (id: number) => {
    await apiClient.delete(`/types-evaluations/${id}/`);
  },
};

// ============== ÉVALUATIONS ==============

export const evaluationApi = {
  /**
   * Récupérer toutes les évaluations (avec filtres et pagination)
   */
  getAll: async (filters?: EvaluationFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.matiere) params.append('matiere', String(filters.matiere));
    if (filters?.type_evaluation) params.append('type_evaluation', String(filters.type_evaluation));
    if (filters?.enseignant) params.append('enseignant', String(filters.enseignant));
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.date_debut) params.append('date_debut', filters.date_debut);
    if (filters?.date_fin) params.append('date_fin', filters.date_fin);
    if (filters?.filiere) params.append('filiere', String(filters.filiere));
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedEvaluations>(
      `/evaluations/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer une évaluation par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<Evaluation>(`/evaluations/${id}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle évaluation
   */
  create: async (data: EvaluationCreate) => {
    const response = await apiClient.post<Evaluation>('/evaluations/', data);
    return response.data;
  },

  /**
   * Mettre à jour une évaluation
   */
  update: async (id: number, data: EvaluationUpdate) => {
    const response = await apiClient.patch<Evaluation>(`/evaluations/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer une évaluation
   */
  delete: async (id: number) => {
    await apiClient.delete(`/evaluations/${id}/`);
  },

  /**
   * Obtenir les statistiques d'une évaluation
   */
  getStats: async (id: number) => {
    const response = await apiClient.get<StatsEvaluation>(`/evaluations/${id}/stats/`);
    return response.data;
  },
};

// ============== NOTES ==============

export const noteApi = {
  /**
   * Récupérer toutes les notes (avec filtres et pagination)
   */
  getAll: async (filters?: NoteFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.evaluation) params.append('evaluation', String(filters.evaluation));
    if (filters?.etudiant) params.append('etudiant', String(filters.etudiant));
    if (filters?.est_absent !== undefined) params.append('est_absent', String(filters.est_absent));
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedNotes>(
      `/notes/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer une note par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<Note>(`/notes/${id}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle note
   */
  create: async (data: NoteCreate) => {
    const response = await apiClient.post<Note>('/notes/', data);
    return response.data;
  },

  /**
   * Mettre à jour une note
   */
  update: async (id: number, data: NoteUpdate) => {
    const response = await apiClient.patch<Note>(`/notes/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer une note
   */
  delete: async (id: number) => {
    await apiClient.delete(`/notes/${id}/`);
  },

  /**
   * Saisie de notes en lot pour une évaluation
   */
  saisieLot: async (data: NoteSaisieLot) => {
    const response = await apiClient.post<{ created: number; updated: number }>(
      '/notes/saisie-lot/',
      data
    );
    return response.data;
  },

  /**
   * Récupérer les notes par évaluation
   */
  getByEvaluation: async (evaluationId: number) => {
    const response = await apiClient.get<Note[]>(`/notes/?evaluation=${evaluationId}`);
    return response.data;
  },
};

// ============== BULLETINS & RÉSULTATS ==============

export const resultatApi = {
  /**
   * Récupérer les notes d'un étudiant
   */
  getNotesEtudiant: async (etudiantId: number, params?: { semestre?: number; annee_academique?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.semestre) searchParams.append('semestre', String(params.semestre));
    if (params?.annee_academique) searchParams.append('annee_academique', String(params.annee_academique));
    
    const response = await apiClient.get<Note[]>(
      `/etudiants/${etudiantId}/notes/?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer le bulletin d'un étudiant
   */
  getBulletinEtudiant: async (
    etudiantId: number,
    params: { semestre: number; annee_academique: number }
  ) => {
    const searchParams = new URLSearchParams();
    searchParams.append('semestre', String(params.semestre));
    searchParams.append('annee_academique', String(params.annee_academique));
    
    const response = await apiClient.get<Bulletin>(
      `/etudiants/${etudiantId}/bulletins/?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer les résultats d'une filière
   */
  getResultatsFiliere: async (params: {
    filiere: number;
    semestre: number;
    annee_academique?: number;
  }) => {
    const searchParams = new URLSearchParams();
    searchParams.append('filiere', String(params.filiere));
    searchParams.append('semestre', String(params.semestre));
    if (params.annee_academique) {
      searchParams.append('annee_academique', String(params.annee_academique));
    }
    
    const response = await apiClient.get<ResultatsFiliere>(
      `/resultats/?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer l'évolution des notes d'un étudiant pour une matière
   */
  getEvolutionNotes: async (etudiantId: number, matiereId: number) => {
    const response = await apiClient.get<EvolutionNotes>(
      `/etudiants/${etudiantId}/evolution-notes/?matiere=${matiereId}`
    );
    return response.data;
  },

  /**
   * Exporter le bulletin en PDF
   */
  exportBulletinPDF: async (
    etudiantId: number,
    params: { semestre: number; annee_academique: number }
  ) => {
    const searchParams = new URLSearchParams();
    searchParams.append('semestre', String(params.semestre));
    searchParams.append('annee_academique', String(params.annee_academique));
    searchParams.append('format', 'pdf');
    
    const response = await apiClient.get(
      `/etudiants/${etudiantId}/bulletins/export/?${searchParams.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Exporter les résultats filière en Excel
   */
  exportResultatsExcel: async (params: {
    filiere: number;
    semestre: number;
    annee_academique?: number;
  }) => {
    const searchParams = new URLSearchParams();
    searchParams.append('filiere', String(params.filiere));
    searchParams.append('semestre', String(params.semestre));
    if (params.annee_academique) {
      searchParams.append('annee_academique', String(params.annee_academique));
    }
    searchParams.append('format', 'excel');
    
    const response = await apiClient.get(
      `/resultats/export/?${searchParams.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};

// ============== SESSIONS DE DÉLIBÉRATION ==============

export const sessionDeliberationApi = {
  /**
   * Récupérer toutes les sessions de délibération
   */
  getAll: async (filters?: SessionDeliberationFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.filiere) params.append('filiere', String(filters.filiere));
    if (filters?.annee_academique) params.append('annee_academique', String(filters.annee_academique));
    if (filters?.semestre) params.append('semestre', String(filters.semestre));
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.date_debut) params.append('date_debut', filters.date_debut);
    if (filters?.date_fin) params.append('date_fin', filters.date_fin);
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedSessionsDeliberation>(
      `/sessions-deliberation/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer une session de délibération par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<SessionDeliberation>(`/sessions-deliberation/${id}/`);
    return response.data;
  },

  /**
   * Créer une nouvelle session de délibération
   */
  create: async (data: SessionDeliberationCreate) => {
    const response = await apiClient.post<SessionDeliberation>('/sessions-deliberation/', data);
    return response.data;
  },

  /**
   * Mettre à jour une session de délibération
   */
  update: async (id: number, data: SessionDeliberationUpdate) => {
    const response = await apiClient.patch<SessionDeliberation>(
      `/sessions-deliberation/${id}/`,
      data
    );
    return response.data;
  },

  /**
   * Supprimer une session de délibération
   */
  delete: async (id: number) => {
    await apiClient.delete(`/sessions-deliberation/${id}/`);
  },

  /**
   * Valider une session de délibération
   */
  valider: async (id: number) => {
    const response = await apiClient.post<SessionDeliberation>(
      `/sessions-deliberation/${id}/valider/`
    );
    return response.data;
  },

  /**
   * Clôturer une session de délibération
   */
  cloturer: async (id: number) => {
    const response = await apiClient.post<SessionDeliberation>(
      `/sessions-deliberation/${id}/cloturer/`
    );
    return response.data;
  },

  /**
   * Générer le PV de délibération en PDF
   */
  genererPV: async (id: number) => {
    const response = await apiClient.get(`/sessions-deliberation/${id}/generer-pv/`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ============== DÉCISIONS JURY ==============

export const decisionJuryApi = {
  /**
   * Mettre à jour une décision de jury
   */
  update: async (id: number, data: DecisionJuryUpdate) => {
    const response = await apiClient.patch(`/decisions-jury/${id}/`, data);
    return response.data;
  },
};