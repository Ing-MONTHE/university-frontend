// Service API pour les enseignants

import axios from 'axios';
import type {
  Enseignant,
  EnseignantCreate,
  EnseignantUpdate,
  EnseignantFilters,
  EnseignantStats,
  ChargeHoraire,
  Attribution,
  PaginatedResponse,
} from '@/types/teacher.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Instance Axios configurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token (quand JWT sera activé)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Récupérer la liste des enseignants avec filtres
 */
export const getTeachers = async (
  filters?: EnseignantFilters
): Promise<PaginatedResponse<Enseignant>> => {
  const response = await apiClient.get('/enseignants/', { params: filters });
  return response.data;
};

/**
 * Récupérer un enseignant par ID
 */
export const getTeacherById = async (id: number): Promise<Enseignant> => {
  const response = await apiClient.get(`/enseignants/${id}/`);
  return response.data;
};

/**
 * Créer un enseignant
 */
export const createTeacher = async (data: EnseignantCreate): Promise<Enseignant> => {
  const formData = new FormData();
  
  // Ajouter les champs texte
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && !(value instanceof File)) {
      formData.append(key, String(value));
    }
  });
  
  // Ajouter les fichiers
  if (data.photo) {
    formData.append('photo', data.photo);
  }
  if (data.cv) {
    formData.append('cv', data.cv);
  }
  
  const response = await apiClient.post('/enseignants/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Mettre à jour un enseignant
 */
export const updateTeacher = async (
  id: number,
  data: EnseignantUpdate
): Promise<Enseignant> => {
  const response = await apiClient.patch(`/enseignants/${id}/`, data);
  return response.data;
};

/**
 * Supprimer un enseignant
 */
export const deleteTeacher = async (id: number): Promise<void> => {
  await apiClient.delete(`/enseignants/${id}/`);
};

/**
 * Upload de la photo d'un enseignant
 */
export const uploadTeacherPhoto = async (
  id: number,
  photo: File
): Promise<{ message: string; photo_url: string }> => {
  const formData = new FormData();
  formData.append('photo', photo);
  
  const response = await apiClient.post(`/enseignants/${id}/upload-photo/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Upload du CV d'un enseignant
 */
export const uploadTeacherCV = async (
  id: number,
  cv: File
): Promise<{ message: string; cv_url: string }> => {
  const formData = new FormData();
  formData.append('cv', cv);
  
  const response = await apiClient.post(`/enseignants/${id}/upload-cv/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Récupérer les statistiques des enseignants
 */
export const getTeacherStatistics = async (): Promise<EnseignantStats> => {
  const response = await apiClient.get('/enseignants/statistiques/');
  return response.data;
};

/**
 * Récupérer les attributions d'un enseignant
 */
export const getTeacherAttributions = async (
  id: number
): Promise<{ enseignant: any; attributions: Attribution[]; count: number }> => {
  const response = await apiClient.get(`/enseignants/${id}/attributions/`);
  return response.data;
};

/**
 * Récupérer la charge horaire d'un enseignant
 */
export const getTeacherChargeHoraire = async (id: number): Promise<ChargeHoraire> => {
  const response = await apiClient.get(`/enseignants/${id}/charge-horaire/`);
  return response.data;
};

// ============= ATTRIBUTION API =============
export const attributionApi = {
  getAll: async (filters?: any) => {
    const { data } = await apiClient.get('/students/attributions/', { params: filters });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get(`/students/attributions/${id}/`);
    return data;
  },

  create: async (attributionData: any) => {
    const { data } = await apiClient.post('/students/attributions/', attributionData);
    return data;
  },

  update: async (id: number, attributionData: any) => {
    const { data } = await apiClient.patch(`/students/attributions/${id}/`, attributionData);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/students/attributions/${id}/`);
  },
};

export default {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  uploadTeacherPhoto,
  uploadTeacherCV,
  getTeacherStatistics,
  getTeacherAttributions,
  getTeacherChargeHoraire,
  attributionApi,
};