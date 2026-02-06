/**
 * API Client pour le module Évaluations
 * VERSION COMPLÈTE avec tous les endpoints
 */

import axios from 'axios';
import type {
  Evaluation,
  EvaluationFormData,
  EvaluationFilters,
  Note,
  NoteFormData,
  SaisieNotesLotPayload,
  SaisieNotesLotResponse,
  EvaluationStats,
  Resultat,
  CalculerMoyennePayload,
  CalculerMoyenneResponse,
  BulletinEtudiant,
  SessionDeliberation,
  DecisionJuryItem,
  GenererDecisionsResponse,
  TypeEvaluation,
} from '@/types/evaluation.types';
import type { PaginatedResponse } from '@/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// ============ TYPES EVALUATIONS ============

export const evaluationApi = {
  // Types d'évaluations
  getTypesEvaluations: async (): Promise<TypeEvaluation[]> => {
    const response = await axios.get(`${API_BASE_URL}/types-evaluations/`);
    return response.data.results || response.data;
  },

  // Liste des évaluations
  getEvaluations: async (
    filters?: EvaluationFilters
  ): Promise<PaginatedResponse<Evaluation>> => {
    const response = await axios.get(`${API_BASE_URL}/evaluations/`, {
      params: filters,
    });
    return response.data;
  },

  // Détail d'une évaluation
  getEvaluation: async (id: number): Promise<Evaluation> => {
    const response = await axios.get(`${API_BASE_URL}/evaluations/${id}/`);
    return response.data;
  },

  // Créer une évaluation
  createEvaluation: async (data: EvaluationFormData): Promise<Evaluation> => {
    const payload = {
      titre: data.titre,
      type_evaluation_id: data.type_evaluation,
      matiere_id: data.matiere,
      annee_academique_id: data.annee_academique,
      date: data.date,
      coefficient: data.coefficient,
      note_totale: data.note_totale,
      duree: data.duree,
      description: data.description,
    };
    const response = await axios.post(`${API_BASE_URL}/evaluations/`, payload);
    return response.data;
  },

  // Modifier une évaluation
  updateEvaluation: async (
    id: number,
    data: Partial<EvaluationFormData>
  ): Promise<Evaluation> => {
    const payload: any = {};
    if (data.titre) payload.titre = data.titre;
    if (data.type_evaluation) payload.type_evaluation_id = data.type_evaluation;
    if (data.matiere) payload.matiere_id = data.matiere;
    if (data.annee_academique) payload.annee_academique_id = data.annee_academique;
    if (data.date) payload.date = data.date;
    if (data.coefficient) payload.coefficient = data.coefficient;
    if (data.note_totale) payload.note_totale = data.note_totale;
    if (data.duree !== undefined) payload.duree = data.duree;
    if (data.description !== undefined) payload.description = data.description;

    const response = await axios.patch(`${API_BASE_URL}/evaluations/${id}/`, payload);
    return response.data;
  },

  // Supprimer une évaluation
  deleteEvaluation: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/evaluations/${id}/`);
  },

  // Dupliquer une évaluation
  duplicateEvaluation: async (
    id: number,
    titre: string,
    date: string
  ): Promise<Evaluation> => {
    const response = await axios.post(`${API_BASE_URL}/evaluations/${id}/dupliquer/`, {
      titre,
      date,
    });
    return response.data.evaluation;
  },

  // ✨ NOUVEAU: Saisie de notes en lot
  saisieNotesLot: async (
    evaluationId: number,
    payload: SaisieNotesLotPayload
  ): Promise<SaisieNotesLotResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/evaluations/${evaluationId}/saisie-lot/`,
      payload
    );
    return response.data;
  },

  // Statistiques d'une évaluation
  getEvaluationStats: async (id: number): Promise<EvaluationStats> => {
    const response = await axios.get(`${API_BASE_URL}/evaluations/${id}/statistiques/`);
    return response.data;
  },

  // Notes d'une évaluation
  getEvaluationNotes: async (id: number): Promise<Note[]> => {
    const response = await axios.get(`${API_BASE_URL}/evaluations/${id}/notes/`);
    return response.data.notes || [];
  },
};

// ============ NOTES ============

export const noteApi = {
  // Liste des notes
  getNotes: async (filters?: any): Promise<PaginatedResponse<Note>> => {
    const response = await axios.get(`${API_BASE_URL}/notes/`, {
      params: filters,
    });
    return response.data;
  },

  // Créer une note
  createNote: async (data: NoteFormData): Promise<Note> => {
    const payload = {
      evaluation_id: data.evaluation,
      etudiant_id: data.etudiant,
      note_obtenue: data.note_obtenue,
      absence: data.absence,
      appreciations: data.appreciations,
    };
    const response = await axios.post(`${API_BASE_URL}/notes/`, payload);
    return response.data;
  },

  // Modifier une note
  updateNote: async (id: number, data: Partial<NoteFormData>): Promise<Note> => {
    const payload: any = {};
    if (data.note_obtenue !== undefined) payload.note_obtenue = data.note_obtenue;
    if (data.absence !== undefined) payload.absence = data.absence;
    if (data.appreciations !== undefined) payload.appreciations = data.appreciations;

    const response = await axios.patch(`${API_BASE_URL}/notes/${id}/`, payload);
    return response.data;
  },

  // Supprimer une note
  deleteNote: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/notes/${id}/`);
  },

  // Saisie multiple de notes
  saisieMultiple: async (evaluationId: number, notes: any[]): Promise<any> => {
    const response = await axios.post(`${API_BASE_URL}/notes/saisie-multiple/`, {
      evaluation_id: evaluationId,
      notes,
    });
    return response.data;
  },
};

// ============ RESULTATS ============

export const resultatApi = {
  // Liste des résultats
  getResultats: async (filters?: any): Promise<PaginatedResponse<Resultat>> => {
    const response = await axios.get(`${API_BASE_URL}/resultats/`, {
      params: filters,
    });
    return response.data;
  },

  // ✨ NOUVEAU: Calculer moyenne d'un étudiant pour une matière
  calculerMoyenne: async (
    payload: CalculerMoyennePayload
  ): Promise<CalculerMoyenneResponse> => {
    const response = await axios.post(`${API_BASE_URL}/resultats/calculer-moyenne/`, payload);
    return response.data;
  },

  // ✨ NOUVEAU: Bulletin d'un étudiant
  getBulletin: async (etudiantId: number, anneeAcademiqueId?: number): Promise<BulletinEtudiant> => {
    const params: any = { etudiant_id: etudiantId };
    if (anneeAcademiqueId) {
      params.annee_academique_id = anneeAcademiqueId;
    }
    const response = await axios.get(`${API_BASE_URL}/resultats/bulletin/`, {
      params,
    });
    return response.data;
  },
};

// ============ SESSIONS DE DELIBERATION ============

export const sessionDeliberationApi = {
  // Liste des sessions
  getSessions: async (filters?: any): Promise<PaginatedResponse<SessionDeliberation>> => {
    const response = await axios.get(`${API_BASE_URL}/sessions-deliberation/`, {
      params: filters,
    });
    return response.data;
  },

  // Détail d'une session
  getSession: async (id: number): Promise<SessionDeliberation> => {
    const response = await axios.get(`${API_BASE_URL}/sessions-deliberation/${id}/`);
    return response.data;
  },

  // Créer une session
  createSession: async (data: any): Promise<SessionDeliberation> => {
    const payload = {
      annee_academique_id: data.annee_academique,
      filiere_id: data.filiere,
      niveau: data.niveau,
      semestre: data.semestre,
      date_deliberation: data.date_deliberation,
      lieu: data.lieu,
      president_jury: data.president_jury,
      statut: data.statut || 'PREVUE',
    };
    const response = await axios.post(`${API_BASE_URL}/sessions-deliberation/`, payload);
    return response.data;
  },

  // Modifier une session
  updateSession: async (id: number, data: any): Promise<SessionDeliberation> => {
    const payload: any = {};
    if (data.date_deliberation) payload.date_deliberation = data.date_deliberation;
    if (data.lieu) payload.lieu = data.lieu;
    if (data.president_jury) payload.president_jury = data.president_jury;
    if (data.statut) payload.statut = data.statut;
    if (data.proces_verbal !== undefined) payload.proces_verbal = data.proces_verbal;

    const response = await axios.patch(
      `${API_BASE_URL}/sessions-deliberation/${id}/`,
      payload
    );
    return response.data;
  },

  // Supprimer une session
  deleteSession: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/sessions-deliberation/${id}/`);
  },

  // Décisions d'une session
  getDecisions: async (sessionId: number): Promise<{ decisions: DecisionJuryItem[] }> => {
    const response = await axios.get(
      `${API_BASE_URL}/sessions-deliberation/${sessionId}/decisions/`
    );
    return response.data;
  },

  // ✨ NOUVEAU (AMÉLIORÉ): Générer décisions automatiquement
  genererDecisions: async (sessionId: number): Promise<GenererDecisionsResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/sessions-deliberation/${sessionId}/generer-decisions/`,
      {}
    );
    return response.data;
  },

  // Clôturer une session
  cloturerSession: async (sessionId: number): Promise<SessionDeliberation> => {
    const response = await axios.post(
      `${API_BASE_URL}/sessions-deliberation/${sessionId}/cloturer/`,
      {}
    );
    return response.data.session;
  },

  // Valider une session
  validerSession: async (sessionId: number): Promise<SessionDeliberation> => {
    const response = await axios.post(
      `${API_BASE_URL}/sessions-deliberation/${sessionId}/valider/`,
      {}
    );
    return response.data.session;
  },
};

// ============ DECISIONS JURY ============

export const decisionJuryApi = {
  // Liste des décisions
  getDecisions: async (filters?: any): Promise<PaginatedResponse<DecisionJuryItem>> => {
    const response = await axios.get(`${API_BASE_URL}/decisions-jury/`, {
      params: filters,
    });
    return response.data;
  },

  // Créer une décision
  createDecision: async (data: any): Promise<DecisionJuryItem> => {
    const payload = {
      session_id: data.session,
      etudiant_id: data.etudiant,
      moyenne_generale: data.moyenne_generale,
      total_credits_obtenus: data.total_credits_obtenus,
      total_credits_requis: data.total_credits_requis,
      decision: data.decision,
      observations: data.observations,
    };
    const response = await axios.post(`${API_BASE_URL}/decisions-jury/`, payload);
    return response.data;
  },

  // Modifier une décision
  updateDecision: async (id: number, data: any): Promise<DecisionJuryItem> => {
    const payload: any = {};
    if (data.decision) payload.decision = data.decision;
    if (data.observations !== undefined) payload.observations = data.observations;

    const response = await axios.patch(`${API_BASE_URL}/decisions-jury/${id}/`, payload);
    return response.data;
  },

  // Supprimer une décision
  deleteDecision: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/decisions-jury/${id}/`);
  },
};

// Export global
export default {
  evaluation: evaluationApi,
  note: noteApi,
  resultat: resultatApi,
  sessionDeliberation: sessionDeliberationApi,
  decisionJury: decisionJuryApi,
};