/**
 * API Service pour le module Évaluations
 */

import axios from 'axios';
import type {
  Evaluation,
  EvaluationFilters,
  EvaluationFormData,
  EvaluationStats,
  Note,
  NoteFilters,
  NoteFormData,
  SaisieNotesLotPayload,
  SaisieNotesLotResponse,
  ResultatFilters,
  CalculerMoyennePayload,
  CalculerMoyenneResponse,
  BulletinEtudiant,
  SessionDeliberation,
  DecisionJury,
  GenererDecisionsResponse,
  StatistiquesSession,
  TypeEvaluation,
} from '@/types/evaluation.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// ============ TYPES D'ÉVALUATIONS ============

export const getTypesEvaluations = async (): Promise<TypeEvaluation[]> => {
  const response = await axios.get(`${API_BASE_URL}/types-evaluations/`);
  return response.data.results || response.data;
};

export const getTypeEvaluationById = async (id: number): Promise<TypeEvaluation> => {
  const response = await axios.get(`${API_BASE_URL}/types-evaluations/${id}/`);
  return response.data;
};

// ============ ÉVALUATIONS ============

export const getEvaluations = async (filters?: EvaluationFilters) => {
  const response = await axios.get(`${API_BASE_URL}/evaluations/`, { params: filters });
  return response.data;
};

export const getEvaluationById = async (id: number): Promise<Evaluation> => {
  const response = await axios.get(`${API_BASE_URL}/evaluations/${id}/`);
  return response.data;
};

export const createEvaluation = async (data: EvaluationFormData): Promise<Evaluation> => {
  const response = await axios.post(`${API_BASE_URL}/evaluations/`, data);
  return response.data;
};

export const updateEvaluation = async (id: number, data: Partial<EvaluationFormData>): Promise<Evaluation> => {
  const response = await axios.patch(`${API_BASE_URL}/evaluations/${id}/`, data);
  return response.data;
};

export const deleteEvaluation = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/evaluations/${id}/`);
};

// ============ NOTES ============

export const getNotes = async (filters?: NoteFilters) => {
  const response = await axios.get(`${API_BASE_URL}/notes/`, { params: filters });
  return response.data;
};

export const getNotesByEvaluation = async (evaluationId: number) => {
  const response = await axios.get(`${API_BASE_URL}/evaluations/${evaluationId}/notes/`);
  return response.data;
};

export const createNote = async (data: NoteFormData): Promise<Note> => {
  const response = await axios.post(`${API_BASE_URL}/notes/`, data);
  return response.data;
};

export const updateNote = async (id: number, data: Partial<NoteFormData>): Promise<Note> => {
  const response = await axios.patch(`${API_BASE_URL}/notes/${id}/`, data);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/notes/${id}/`);
};

// ============ SAISIE EN LOT ============

export const saisieNotesLot = async (
  evaluationId: number,
  payload: SaisieNotesLotPayload
): Promise<SaisieNotesLotResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/evaluations/${evaluationId}/saisie-lot/`,
    payload
  );
  return response.data;
};

// ============ STATISTIQUES ============

export const getEvaluationStats = async (evaluationId: number): Promise<EvaluationStats> => {
  const response = await axios.get(`${API_BASE_URL}/evaluations/${evaluationId}/statistiques-detaillees/`);
  return response.data;
};

// ============ RÉSULTATS ============

export const getResultats = async (filters?: ResultatFilters) => {
  const response = await axios.get(`${API_BASE_URL}/resultats/`, { params: filters });
  return response.data;
};

export const calculerMoyenne = async (
  payload: CalculerMoyennePayload
): Promise<CalculerMoyenneResponse> => {
  const response = await axios.post(`${API_BASE_URL}/resultats/calculer-moyenne/`, payload);
  return response.data;
};

export const getBulletinEtudiant = async (
  etudiantId: number,
  anneeAcademiqueId?: number
): Promise<BulletinEtudiant> => {
  const params: any = { etudiant_id: etudiantId };
  if (anneeAcademiqueId) {
    params.annee_academique_id = anneeAcademiqueId;
  }
  const response = await axios.get(`${API_BASE_URL}/resultats/bulletin/`, { params });
  return response.data;
};

// ============ SESSIONS DE DÉLIBÉRATION ============

export const getSessionsDeliberation = async (filters?: any) => {
  const response = await axios.get(`${API_BASE_URL}/sessions-deliberation/`, { params: filters });
  return response.data;
};

export const getSessionDeliberationById = async (id: number): Promise<SessionDeliberation> => {
  const response = await axios.get(`${API_BASE_URL}/sessions-deliberation/${id}/`);
  return response.data;
};

export const createSessionDeliberation = async (data: any): Promise<SessionDeliberation> => {
  const response = await axios.post(`${API_BASE_URL}/sessions-deliberation/`, data);
  return response.data;
};

export const updateSessionDeliberation = async (id: number, data: any): Promise<SessionDeliberation> => {
  const response = await axios.patch(`${API_BASE_URL}/sessions-deliberation/${id}/`, data);
  return response.data;
};

export const deleteSessionDeliberation = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/sessions-deliberation/${id}/`);
};

// ============ DÉCISIONS JURY ============

export const genererDecisions = async (sessionId: number): Promise<GenererDecisionsResponse> => {
  const response = await axios.post(`${API_BASE_URL}/sessions-deliberation/${sessionId}/generer-decisions/`);
  return response.data;
};

export const getStatistiquesSession = async (sessionId: number): Promise<StatistiquesSession> => {
  const response = await axios.get(`${API_BASE_URL}/sessions-deliberation/${sessionId}/statistiques-session/`);
  return response.data;
};

export const getDecisionsJury = async (sessionId: number) => {
  const response = await axios.get(`${API_BASE_URL}/sessions-deliberation/${sessionId}/decisions/`);
  return response.data;
};

export const updateDecisionJury = async (id: number, data: Partial<DecisionJury>): Promise<DecisionJury> => {
  const response = await axios.patch(`${API_BASE_URL}/decisions-jury/${id}/`, data);
  return response.data;
};