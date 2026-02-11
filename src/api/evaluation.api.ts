/**
 * API Service - Évaluations Module
 * Gestion complète des évaluations, notes, résultats et délibérations
 */

import { default as apiClient } from './client';
import type {
  TypeEvaluation,
  Evaluation,
  Note,
  Resultat,
  SessionDeliberation,
  DecisionJuryItem,
  EvaluationFilters,
  NoteFilters,
  ResultatFilters,
  SessionFilters,
  EvaluationFormData,
  NoteFormData,
  SaisieNotesLotPayload,
  SaisieNotesLotResponse,
  EvaluationStats,
  BulletinEtudiant,
  SessionFormData,
  GenererDecisionsResponse,
  StatistiquesSession,
  DecisionUpdateData,
} from '../types/evaluation.types';
import type { PaginatedResponse } from '../types/api.types';

// ============ TYPES ÉVALUATION ============

export const typeEvaluationApi = {
  /**
   * Liste des types d'évaluation
   */
  getAll: async (): Promise<TypeEvaluation[]> => {
    const { data } = await apiClient.get('/types-evaluation/');
    return data;
  },

  /**
   * Créer un type d'évaluation
   */
  create: async (payload: Partial<TypeEvaluation>): Promise<TypeEvaluation> => {
    const { data } = await apiClient.post('/types-evaluation/', payload);
    return data;
  },

  /**
   * Modifier un type d'évaluation
   */
  update: async (id: number, payload: Partial<TypeEvaluation>): Promise<TypeEvaluation> => {
    const { data } = await apiClient.put(`/types-evaluation/${id}/`, payload);
    return data;
  },

  /**
   * Supprimer un type d'évaluation
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/types-evaluation/${id}/`);
  },
};

// ============ ÉVALUATIONS ============

export const evaluationApi = {
  /**
   * Liste paginée des évaluations avec filtres
   */
  getAll: async (filters?: EvaluationFilters): Promise<PaginatedResponse<Evaluation>> => {
    const { data } = await apiClient.get('/evaluations/', { params: filters });
    return data;
  },

  /**
   * Détails d'une évaluation
   */
  getById: async (id: number): Promise<Evaluation> => {
    const { data } = await apiClient.get(`/evaluations/${id}/`);
    return data;
  },

  /**
   * Créer une évaluation
   */
  create: async (payload: EvaluationFormData): Promise<Evaluation> => {
    const { data } = await apiClient.post('/evaluations/', payload);
    return data;
  },

  /**
   * Modifier une évaluation
   */
  update: async (id: number, payload: Partial<EvaluationFormData>): Promise<Evaluation> => {
    const { data } = await apiClient.put(`/evaluations/${id}/`, payload);
    return data;
  },

  /**
   * Supprimer une évaluation
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/evaluations/${id}/`);
  },

  /**
   * Récupérer les notes d'une évaluation
   */
  getNotes: async (evaluationId: number): Promise<{
    evaluation: Partial<Evaluation>;
    notes: Note[];
    statistiques: Partial<EvaluationStats>;
  }> => {
    const { data } = await apiClient.get(`/evaluations/${evaluationId}/notes/`);
    return data;
  },

  /**
   * Statistiques d'une évaluation
   */
  getStats: async (evaluationId: number): Promise<EvaluationStats> => {
    const { data } = await apiClient.get(`/evaluations/${evaluationId}/statistiques/`);
    return data;
  },

  /**
   * Saisie de notes en lot
   */
  saisieNotesLot: async (
    evaluationId: number,
    payload: SaisieNotesLotPayload
  ): Promise<SaisieNotesLotResponse> => {
    const { data } = await apiClient.post(`/evaluations/${evaluationId}/saisie-lot/`, payload);
    return data;
  },
};

// ============ NOTES ============

export const noteApi = {
  /**
   * Liste des notes avec filtres
   */
  getAll: async (filters?: NoteFilters): Promise<PaginatedResponse<Note>> => {
    const { data } = await apiClient.get('/notes/', { params: filters });
    return data;
  },

  /**
   * Créer une note
   */
  create: async (payload: NoteFormData): Promise<Note> => {
    const { data } = await apiClient.post('/notes/', payload);
    return data;
  },

  /**
   * Modifier une note
   */
  update: async (id: number, payload: Partial<NoteFormData>): Promise<Note> => {
    const { data } = await apiClient.put(`/notes/${id}/`, payload);
    return data;
  },

  /**
   * Supprimer une note
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notes/${id}/`);
  },

  /**
   * Saisie multiple de notes
   */
  saisieMultiple: async (payload: SaisieNotesLotPayload): Promise<SaisieNotesLotResponse> => {
    const { data } = await apiClient.post('/notes/saisie-lot/', payload);
    return data;
  },
};

// ============ RÉSULTATS ============

export const resultatApi = {
  /**
   * Liste des résultats avec filtres
   */
  getAll: async (filters?: ResultatFilters): Promise<PaginatedResponse<Resultat>> => {
    const { data } = await apiClient.get('/resultats/', { params: filters });
    return data;
  },

  /**
   * Résultats d'un étudiant
   */
  getByEtudiant: async (etudiantId: number): Promise<Resultat[]> => {
    const { data } = await apiClient.get('/resultats/', {
      params: { etudiant: etudiantId },
    });
    return data.results || data;
  },

  /**
   * Bulletin d'un étudiant
   */
  getBulletin: async (
    etudiantId: number,
    anneeAcademiqueId?: number
  ): Promise<BulletinEtudiant> => {
    const params = anneeAcademiqueId ? { annee_academique: anneeAcademiqueId } : {};
    const { data } = await apiClient.get(`/etudiants/${etudiantId}/bulletins/`, { params });
    return data;
  },
};

// ============ SESSIONS DÉLIBÉRATION ============

export const sessionDeliberationApi = {
  /**
   * Liste des sessions avec filtres
   */
  getAll: async (filters?: SessionFilters): Promise<PaginatedResponse<SessionDeliberation>> => {
    const { data } = await apiClient.get('/sessions-deliberation/', { params: filters });
    return data;
  },

  /**
   * Détails d'une session
   */
  getById: async (id: number): Promise<SessionDeliberation> => {
    const { data } = await apiClient.get(`/sessions-deliberation/${id}/`);
    return data;
  },

  /**
   * Créer une session
   */
  create: async (payload: SessionFormData): Promise<SessionDeliberation> => {
    const { data } = await apiClient.post('/sessions-deliberation/', payload);
    return data;
  },

  /**
   * Modifier une session
   */
  update: async (
    id: number,
    payload: Partial<SessionFormData>
  ): Promise<SessionDeliberation> => {
    const { data } = await apiClient.put(`/sessions-deliberation/${id}/`, payload);
    return data;
  },

  /**
   * Supprimer une session
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/sessions-deliberation/${id}/`);
  },

  /**
   * Décisions de la session
   */
  getDecisions: async (sessionId: number): Promise<DecisionJuryItem[]> => {
    const { data } = await apiClient.get(`/sessions-deliberation/${sessionId}/decisions/`);
    return data;
  },

  /**
   * Générer les décisions automatiquement
   */
  genererDecisions: async (sessionId: number): Promise<GenererDecisionsResponse> => {
    const { data } = await apiClient.post(`/sessions-deliberation/${sessionId}/generer-decisions/`);
    return data;
  },

  /**
   * Statistiques de la session
   */
  getStatistiques: async (sessionId: number): Promise<StatistiquesSession> => {
    const { data } = await apiClient.get(`/sessions-deliberation/${sessionId}/statistiques/`);
    return data;
  },

  /**
   * Valider la session
   */
  valider: async (sessionId: number): Promise<SessionDeliberation> => {
    const { data } = await apiClient.post(`/sessions-deliberation/${sessionId}/valider/`);
    return data;
  },
};

// ============ DÉCISIONS JURY ============

export const decisionJuryApi = {
  /**
   * Modifier une décision
   */
  update: async (id: number, payload: DecisionUpdateData): Promise<DecisionJuryItem> => {
    const { data} = await apiClient.put(`/decisions-jury/${id}/`, payload);
    return data;
  },

  /**
   * Supprimer une décision
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/decisions-jury/${id}/`);
  },
};