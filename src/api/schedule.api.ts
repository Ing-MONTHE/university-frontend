import apiClient from './client';
import type {
  Batiment,
  BatimentCreate,
  BatimentUpdate,
  BatimentFilters,
  Salle,
  SalleCreate,
  SalleUpdate,
  SalleFilters,
  Creneau,
  CreneauCreate,
  CreneauUpdate,
  CreneauFilters,
  Cours,
  CoursCreate,
  CoursUpdate,
  CoursFilters,
  ConflitSalle,
  ConflitSalleUpdate,
  ConflitFilters,
} from '@/types/schedule.types';
import type { PaginatedResponse } from '@/types/api.types';

const BASE_URL = '/api/schedule';

// ============== BÂTIMENTS ==============
export const batimentApi = {
  getAll: (params?: BatimentFilters) =>
    apiClient.get<PaginatedResponse<Batiment>>(`${BASE_URL}/batiments/`, { params }),
  
  getById: (id: number) =>
    apiClient.get<Batiment>(`${BASE_URL}/batiments/${id}/`),
  
  create: (data: BatimentCreate) =>
    apiClient.post<Batiment>(`${BASE_URL}/batiments/`, data),
  
  update: (id: number, data: BatimentUpdate) =>
    apiClient.patch<Batiment>(`${BASE_URL}/batiments/${id}/`, data),
  
  delete: (id: number) =>
    apiClient.delete(`${BASE_URL}/batiments/${id}/`),
};

// ============== SALLES ==============
export const salleApi = {
  getAll: (params?: SalleFilters) =>
    apiClient.get<PaginatedResponse<Salle>>(`${BASE_URL}/salles/`, { params }),
  
  getById: (id: number) =>
    apiClient.get<Salle>(`${BASE_URL}/salles/${id}/`),
  
  create: (data: SalleCreate) =>
    apiClient.post<Salle>(`${BASE_URL}/salles/`, data),
  
  update: (id: number, data: SalleUpdate) =>
    apiClient.patch<Salle>(`${BASE_URL}/salles/${id}/`, data),
  
  delete: (id: number) =>
    apiClient.delete(`${BASE_URL}/salles/${id}/`),
};

// ============== CRÉNEAUX ==============
export const creneauApi = {
  getAll: (params?: CreneauFilters) =>
    apiClient.get<PaginatedResponse<Creneau>>(`${BASE_URL}/creneaux/`, { params }),
  
  getById: (id: number) =>
    apiClient.get<Creneau>(`${BASE_URL}/creneaux/${id}/`),
  
  create: (data: CreneauCreate) =>
    apiClient.post<Creneau>(`${BASE_URL}/creneaux/`, data),
  
  update: (id: number, data: CreneauUpdate) =>
    apiClient.patch<Creneau>(`${BASE_URL}/creneaux/${id}/`, data),
  
  delete: (id: number) =>
    apiClient.delete(`${BASE_URL}/creneaux/${id}/`),
};

// ============== COURS ==============
export const coursApi = {
  getAll: (params?: CoursFilters) =>
    apiClient.get<PaginatedResponse<Cours>>(`${BASE_URL}/cours/`, { params }),
  
  getById: (id: number) =>
    apiClient.get<Cours>(`${BASE_URL}/cours/${id}/`),
  
  create: (data: CoursCreate) =>
    apiClient.post<Cours>(`${BASE_URL}/cours/`, data),
  
  update: (id: number, data: CoursUpdate) =>
    apiClient.patch<Cours>(`${BASE_URL}/cours/${id}/`, data),
  
  delete: (id: number) =>
    apiClient.delete(`${BASE_URL}/cours/${id}/`),

  getEmploiTemps: (filiereId: number, params?: { semestre?: number }) =>
    apiClient.get<Cours[]>(`${BASE_URL}/cours/emploi-temps/${filiereId}/`, { params }),
};

// ============== CONFLITS ==============
export const conflitApi = {
  getAll: (params?: ConflitFilters) =>
    apiClient.get<PaginatedResponse<ConflitSalle>>(`${BASE_URL}/conflits/`, { params }),
  
  getById: (id: number) =>
    apiClient.get<ConflitSalle>(`${BASE_URL}/conflits/${id}/`),
  
  resolve: (id: number, data: ConflitSalleUpdate) =>
    apiClient.patch<ConflitSalle>(`${BASE_URL}/conflits/${id}/`, data),
};