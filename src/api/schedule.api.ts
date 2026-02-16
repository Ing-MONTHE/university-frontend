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

const BASE_URL = '/schedule';

// ============== BÂTIMENTS ==============
export const batimentApi = {
  getAll: async (params?: BatimentFilters) => {
    const { data } = await apiClient.get<PaginatedResponse<Batiment>>(`${BASE_URL}/batiments/`, { params });
    return data;
  },
  
  getById: async (id: number) => {
    const { data } = await apiClient.get<Batiment>(`${BASE_URL}/batiments/${id}/`);
    return data;
  },
  
  create: async (createData: BatimentCreate) => {
    const { data } = await apiClient.post<Batiment>(`${BASE_URL}/batiments/`, createData);
    return data;
  },
  
  update: async (id: number, updateData: BatimentUpdate) => {
    const { data } = await apiClient.patch<Batiment>(`${BASE_URL}/batiments/${id}/`, updateData);
    return data;
  },
  
  delete: async (id: number) => {
    const { data } = await apiClient.delete(`${BASE_URL}/batiments/${id}/`);
    return data;
  },
};

// ============== SALLES ==============
export const salleApi = {
  getAll: async (params?: SalleFilters) => {
    const { data } = await apiClient.get<PaginatedResponse<Salle>>(`${BASE_URL}/salles/`, { params });
    return data;
  },
  
  getById: async (id: number) => {
    const { data } = await apiClient.get<Salle>(`${BASE_URL}/salles/${id}/`);
    return data;
  },
  
  create: async (createData: SalleCreate) => {
    const { data } = await apiClient.post<Salle>(`${BASE_URL}/salles/`, createData);
    return data;
  },
  
  update: async (id: number, updateData: SalleUpdate) => {
    const { data } = await apiClient.patch<Salle>(`${BASE_URL}/salles/${id}/`, updateData);
    return data;
  },
  
  delete: async (id: number) => {
    const { data } = await apiClient.delete(`${BASE_URL}/salles/${id}/`);
    return data;
  },
};

// ============== CRÉNEAUX ==============
export const creneauApi = {
  getAll: async (params?: CreneauFilters) => {
    const { data } = await apiClient.get<PaginatedResponse<Creneau>>(`${BASE_URL}/creneaux/`, { params });
    return data;
  },
  
  getById: async (id: number) => {
    const { data } = await apiClient.get<Creneau>(`${BASE_URL}/creneaux/${id}/`);
    return data;
  },
  
  create: async (data: CreneauCreate) => {
    const response = await apiClient.post<Creneau>(`${BASE_URL}/creneaux/`, data);
    return response.data;
  },
  
  update: async (id: number, updateData: CreneauUpdate) => {
    const { data } = await apiClient.patch<Creneau>(`${BASE_URL}/creneaux/${id}/`, updateData);
    return data;
  },
  
  delete: async (id: number) => {
    const { data } = await apiClient.delete(`${BASE_URL}/creneaux/${id}/`);
    return data;
  },
};

// ============== COURS ==============
export const coursApi = {
  getAll: async (params?: CoursFilters) => {
    const { data } = await apiClient.get<PaginatedResponse<Cours>>(`${BASE_URL}/cours/`, { params });
    return data;
  },
  
  getById: async (id: number) => {
    const { data } = await apiClient.get<Cours>(`${BASE_URL}/cours/${id}/`);
    return data;
  },
  
  create: async (createData: CoursCreate) => {
    const { data } = await apiClient.post<Cours>(`${BASE_URL}/cours/`, createData);
    return data;
  },
  
  update: async (id: number, updateData: CoursUpdate) => {
    const { data } = await apiClient.patch<Cours>(`${BASE_URL}/cours/${id}/`, updateData);
    return data;
  },
  
  delete: async (id: number) => {
    const { data } = await apiClient.delete(`${BASE_URL}/cours/${id}/`);
    return data;
  },

  getEmploiTemps: async (filiereId: number, params?: { semestre?: number }) => {
    const { data } = await apiClient.get<Cours[]>(`${BASE_URL}/cours/emploi-temps/${filiereId}/`, { params });
    return data;
  },
};

// ============== CONFLITS ==============
export const conflitApi = {
  getAll: async (params?: ConflitFilters) => {
    const { data } = await apiClient.get<PaginatedResponse<ConflitSalle>>(`${BASE_URL}/conflits/`, { params });
    return data;
  },
  
  getById: async (id: number) => {
    const { data } = await apiClient.get<ConflitSalle>(`${BASE_URL}/conflits/${id}/`);
    return data;
  },
  
  resolve: async (id: number, updateData: ConflitSalleUpdate) => {
    const { data } = await apiClient.patch<ConflitSalle>(`${BASE_URL}/conflits/${id}/`, updateData);
    return data;
  },
};