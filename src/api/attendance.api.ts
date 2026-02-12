/**
 * API Client pour le module Présences
 */

import api from '@/api/client';
import {
  FeuillePresence,
  Presence,
  JustificatifAbsence,
  CreateFeuillePresenceDTO,
  MarquerPresencesDTO,
  CreateJustificatifDTO,
  TauxPresenceEtudiant,
  StatistiquesPresences,
  FeuillePresenceFilters,
  JustificatifFilters,
} from '@/types/attendance.types';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';

const BASE_URL = '/attendance';

/**
 * ==================== FEUILLES DE PRÉSENCE ====================
 */

/**
 * Récupère la liste des feuilles de présence avec filtres
 */
export const getFeuillesPresence = async (
  filters?: FeuillePresenceFilters
): Promise<PaginatedResponse<FeuillePresence>> => {
  const params = new URLSearchParams();
  
  if (filters?.cours) params.append('cours', filters.cours.toString());
  if (filters?.date_cours) params.append('date_cours', filters.date_cours);
  if (filters?.statut) params.append('statut', filters.statut);
  if (filters?.date_debut) params.append('date_debut', filters.date_debut);
  if (filters?.date_fin) params.append('date_fin', filters.date_fin);
  if (filters?.search) params.append('search', filters.search);

  const response = await api.get(`${BASE_URL}/feuilles-presence/?${params.toString()}`);
  return response.data;
};

/**
 * Récupère une feuille de présence par ID
 */
export const getFeuillePresence = async (id: number): Promise<FeuillePresence> => {
  const response = await api.get(`${BASE_URL}/feuilles-presence/${id}/`);
  return response.data;
};

/**
 * Crée une nouvelle feuille de présence
 */
export const createFeuillePresence = async (
  data: CreateFeuillePresenceDTO
): Promise<FeuillePresence> => {
  const response = await api.post(`${BASE_URL}/feuilles-presence/`, data);
  return response.data;
};

/**
 * Met à jour une feuille de présence
 */
export const updateFeuillePresence = async (
  id: number,
  data: Partial<CreateFeuillePresenceDTO>
): Promise<FeuillePresence> => {
  const response = await api.patch(`${BASE_URL}/feuilles-presence/${id}/`, data);
  return response.data;
};

/**
 * Supprime une feuille de présence
 */
export const deleteFeuillePresence = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/feuilles-presence/${id}/`);
};

/**
 * Ferme une feuille de présence (verrouillage)
 */
export const fermerFeuillePresence = async (id: number): Promise<ApiResponse> => {
  const response = await api.post(`${BASE_URL}/feuilles-presence/${id}/fermer/`);
  return response.data;
};

/**
 * ==================== PRÉSENCES ====================
 */

/**
 * Récupère les présences d'une feuille
 */
export const getPresencesByFeuille = async (feuilleId: number): Promise<Presence[]> => {
  const response = await api.get(`${BASE_URL}/feuilles-presence/${feuilleId}/liste-presences/`);
  return response.data.presences || [];
};

/**
 * Marque les présences en masse
 */
export const marquerPresences = async (
  feuilleId: number,
  data: MarquerPresencesDTO
): Promise<ApiResponse> => {
  const response = await api.post(
    `${BASE_URL}/feuilles-presence/${feuilleId}/marquer-presences/`,
    data
  );
  return response.data;
};

/**
 * Met à jour une présence individuelle
 */
export const updatePresence = async (
  id: number,
  data: Partial<Presence>
): Promise<Presence> => {
  const response = await api.patch(`${BASE_URL}/presences/${id}/`, data);
  return response.data;
};

/**
 * Marque toutes les présences d'une feuille
 */
export const marquerToutPresent = async (feuilleId: number): Promise<ApiResponse> => {
  const response = await api.post(
    `${BASE_URL}/feuilles-presence/${feuilleId}/marquer-tout-present/`
  );
  return response.data;
};

/**
 * Marque toutes les absences d'une feuille
 */
export const marquerToutAbsent = async (feuilleId: number): Promise<ApiResponse> => {
  const response = await api.post(
    `${BASE_URL}/feuilles-presence/${feuilleId}/marquer-tout-absent/`
  );
  return response.data;
};

/**
 * ==================== JUSTIFICATIFS ====================
 */

/**
 * Récupère la liste des justificatifs avec filtres
 */
export const getJustificatifs = async (
  filters?: JustificatifFilters
): Promise<PaginatedResponse<JustificatifAbsence>> => {
  const params = new URLSearchParams();
  
  if (filters?.etudiant) params.append('etudiant', filters.etudiant.toString());
  if (filters?.statut) params.append('statut', filters.statut);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.search) params.append('search', filters.search);

  const response = await api.get(`${BASE_URL}/justificatifs/?${params.toString()}`);
  return response.data;
};

/**
 * Récupère un justificatif par ID
 */
export const getJustificatif = async (id: number): Promise<JustificatifAbsence> => {
  const response = await api.get(`${BASE_URL}/justificatifs/${id}/`);
  return response.data;
};

/**
 * Crée un nouveau justificatif
 */
export const createJustificatif = async (
  data: CreateJustificatifDTO
): Promise<JustificatifAbsence> => {
  const formData = new FormData();
  formData.append('etudiant', data.etudiant.toString());
  formData.append('date_debut', data.date_debut);
  formData.append('date_fin', data.date_fin);
  formData.append('type_justificatif', data.type_justificatif);
  formData.append('document', data.document);
  formData.append('motif', data.motif);

  const response = await api.post(`${BASE_URL}/justificatifs/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Valide un justificatif
 */
export const validerJustificatif = async (
  id: number,
  commentaire?: string
): Promise<ApiResponse> => {
  const response = await api.post(`${BASE_URL}/justificatifs/${id}/valider/`, {
    commentaire,
  });
  return response.data;
};

/**
 * Rejette un justificatif
 */
export const rejeterJustificatif = async (
  id: number,
  commentaire: string
): Promise<ApiResponse> => {
  const response = await api.post(`${BASE_URL}/justificatifs/${id}/rejeter/`, {
    commentaire,
  });
  return response.data;
};

/**
 * Récupère les justificatifs en attente
 */
export const getJustificatifsEnAttente = async (): Promise<JustificatifAbsence[]> => {
  const response = await api.get(`${BASE_URL}/justificatifs/en-attente/`);
  return response.data.justificatifs || [];
};

/**
 * ==================== STATISTIQUES ====================
 */

/**
 * Récupère le taux de présence d'un étudiant
 */
export const getTauxPresenceEtudiant = async (
  etudiantId: number
): Promise<TauxPresenceEtudiant> => {
  const response = await api.get(`/students/etudiants/${etudiantId}/taux-presence/`);
  return response.data;
};

/**
 * Récupère les statistiques globales des présences
 */
export const getStatistiquesPresences = async (): Promise<StatistiquesPresences> => {
  const response = await api.get(`${BASE_URL}/feuilles-presence/statistiques/`);
  return response.data;
};

/**
 * Récupère les statistiques des justificatifs
 */
export const getStatistiquesJustificatifs = async () => {
  const response = await api.get(`${BASE_URL}/justificatifs/statistiques/`);
  return response.data;
};

/**
 * Export des fonctions
 */
export default {
  // Feuilles de présence
  getFeuillesPresence,
  getFeuillePresence,
  createFeuillePresence,
  updateFeuillePresence,
  deleteFeuillePresence,
  fermerFeuillePresence,
  
  // Présences
  getPresencesByFeuille,
  marquerPresences,
  updatePresence,
  marquerToutPresent,
  marquerToutAbsent,
  
  // Justificatifs
  getJustificatifs,
  getJustificatif,
  createJustificatif,
  validerJustificatif,
  rejeterJustificatif,
  getJustificatifsEnAttente,
  
  // Statistiques
  getTauxPresenceEtudiant,
  getStatistiquesPresences,
  getStatistiquesJustificatifs,
};