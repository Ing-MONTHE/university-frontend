/**
 * API Client pour le module Students
 */

import apiClient from './client';
import type {
  Etudiant,
  EtudiantCreate,
  EtudiantUpdate,
  EtudiantFilters,
  Enseignant,
  EnseignantCreate,
  EnseignantUpdate,
  EnseignantFilters,
  PaginatedResponse,
  EtudiantStatistiques,
  EnseignantStatistiques,
} from '@/types/students.types';

// ============== ÉTUDIANTS ==============

export const etudiantApi = {
  /**
   * Récupérer tous les étudiants (avec filtres et pagination)
   */
  getAll: async (filters?: EtudiantFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.filiere) params.append('filiere', String(filters.filiere));
    if (filters?.niveau_actuel) params.append('niveau_actuel', String(filters.niveau_actuel));
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.annee_admission) params.append('annee_admission', String(filters.annee_admission));
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedResponse<Etudiant>>(
      `/etudiants/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer un étudiant par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<Etudiant>(`/etudiants/${id}/`);
    return response.data;
  },

  /**
   * Récupérer un étudiant par matricule
   */
  getByMatricule: async (matricule: string) => {
    const response = await apiClient.get<Etudiant>(`/etudiants/matricule/${matricule}/`);
    return response.data;
  },

  /**
   * Créer un nouvel étudiant
   */
  create: async (data: EtudiantCreate) => {
    const response = await apiClient.post<Etudiant>('/etudiants/', data);
    return response.data;
  },

  /**
   * Mettre à jour un étudiant
   */
  update: async (id: number, data: EtudiantUpdate) => {
    const response = await apiClient.patch<Etudiant>(`/etudiants/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer un étudiant
   */
  delete: async (id: number) => {
    await apiClient.delete(`/etudiants/${id}/`);
  },

  /**
   * Uploader une photo d'étudiant
   */
  uploadPhoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await apiClient.post<Etudiant>(
      `/etudiants/${id}/upload-photo/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Changer le statut d'un étudiant
   */
  changeStatut: async (id: number, statut: string) => {
    const response = await apiClient.post<Etudiant>(
      `/etudiants/${id}/change-statut/`,
      { statut }
    );
    return response.data;
  },

  /**
   * Obtenir les statistiques des étudiants
   */
  getStatistiques: async () => {
    const response = await apiClient.get<EtudiantStatistiques>('/etudiants/statistiques/');
    return response.data;
  },

  /**
   * Générer un matricule unique
   */
  generateMatricule: async () => {
    const response = await apiClient.get<{ matricule: string }>('/etudiants/generate-matricule/');
    return response.data;
  },
};

// ============== ENSEIGNANTS ==============

export const enseignantApi = {
  /**
   * Récupérer tous les enseignants (avec filtres et pagination)
   */
  getAll: async (filters?: EnseignantFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.departement) params.append('departement', String(filters.departement));
    if (filters?.grade) params.append('grade', filters.grade);
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.specialite) params.append('specialite', filters.specialite);
    if (filters?.ordering) params.append('ordering', filters.ordering);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.page_size) params.append('page_size', String(filters.page_size));
    
    const response = await apiClient.get<PaginatedResponse<Enseignant>>(
      `/enseignants/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer un enseignant par ID
   */
  getById: async (id: number) => {
    const response = await apiClient.get<Enseignant>(`/enseignants/${id}/`);
    return response.data;
  },

  /**
   * Récupérer un enseignant par matricule
   */
  getByMatricule: async (matricule: string) => {
    const response = await apiClient.get<Enseignant>(`/enseignants/matricule/${matricule}/`);
    return response.data;
  },

  /**
   * Créer un nouvel enseignant
   */
  create: async (data: EnseignantCreate) => {
    const response = await apiClient.post<Enseignant>('/enseignants/', data);
    return response.data;
  },

  /**
   * Mettre à jour un enseignant
   */
  update: async (id: number, data: EnseignantUpdate) => {
    const response = await apiClient.patch<Enseignant>(`/enseignants/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer un enseignant
   */
  delete: async (id: number) => {
    await apiClient.delete(`/enseignants/${id}/`);
  },

  /**
   * Uploader une photo d'enseignant
   */
  uploadPhoto: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await apiClient.post<Enseignant>(
      `/enseignants/${id}/upload-photo/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Changer le statut d'un enseignant
   */
  changeStatut: async (id: number, statut: string) => {
    const response = await apiClient.post<Enseignant>(
      `/enseignants/${id}/change-statut/`,
      { statut }
    );
    return response.data;
  },

  /**
   * Obtenir les matières enseignées par un enseignant
   */
  getMatieres: async (id: number) => {
    const response = await apiClient.get(`/enseignants/${id}/matieres/`);
    return response.data;
  },

  /**
   * Obtenir l'emploi du temps d'un enseignant
   */
  getEmploiDuTemps: async (id: number) => {
    const response = await apiClient.get(`/enseignants/${id}/emploi-du-temps/`);
    return response.data;
  },

  /**
   * Obtenir les statistiques des enseignants
   */
  getStatistiques: async () => {
    const response = await apiClient.get<EnseignantStatistiques>('/enseignants/statistiques/');
    return response.data;
  },

  /**
   * Générer un matricule unique
   */
  generateMatricule: async () => {
    const response = await apiClient.get<{ matricule: string }>('/enseignants/generate-matricule/');
    return response.data;
  },
};