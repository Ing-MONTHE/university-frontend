// src/api/analytics.api.ts

import axios from 'axios';
import type {
  DashboardResponse,
  RapportsListResponse,
  RapportGenerateResponse,
  KPIResponse,
  KPIDetailResponse,
  RapportFormData,
  AnalyticsFilters,
  Rapport,
  KPI,
  KPIDetail,
} from '@/types/analytics.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Configuration axios avec token d'authentification
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ DASHBOARD ANALYTICS ============

export const analyticsApi = {
  /**
   * Récupérer les données du dashboard analytics
   */
  getDashboard: async (filters?: AnalyticsFilters): Promise<DashboardResponse> => {
    const response = await api.get('/analytics/dashboard/', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Récupérer tous les rapports
   */
  getRapports: async (params?: {
    type?: string;
    format?: string;
    date_debut?: string;
    date_fin?: string;
    created_by?: string;
    page?: number;
    page_size?: number;
  }): Promise<RapportsListResponse> => {
    const response = await api.get('/analytics/rapports/', { params });
    return response.data;
  },

  /**
   * Récupérer un rapport par ID
   */
  getRapportById: async (id: string): Promise<Rapport> => {
    const response = await api.get(`/analytics/rapports/${id}/`);
    return response.data;
  },

  /**
   * Générer un nouveau rapport
   */
  genererRapport: async (data: RapportFormData): Promise<RapportGenerateResponse> => {
    const response = await api.post('/analytics/rapports/generer/', data);
    return response.data;
  },

  /**
   * Supprimer un rapport
   */
  deleteRapport: async (id: string): Promise<void> => {
    await api.delete(`/analytics/rapports/${id}/`);
  },

  /**
   * Télécharger un rapport
   */
  downloadRapport: async (id: string): Promise<Blob> => {
    const response = await api.get(`/analytics/rapports/${id}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Obtenir l'URL de téléchargement d'un rapport
   */
  getRapportDownloadURL: (id: string): string => {
    return `${API_BASE_URL}/analytics/rapports/${id}/download/`;
  },

  /**
   * Récupérer tous les KPIs
   */
  getKPIs: async (params?: {
    categorie?: string;
    code?: string;
  }): Promise<KPIResponse> => {
    const response = await api.get('/analytics/kpi/', { params });
    return response.data;
  },

  /**
   * Récupérer les détails d'un KPI
   */
  getKPIDetail: async (
    id: string,
    filters?: {
      periode_debut?: string;
      periode_fin?: string;
      comparaison_type?: 'mois' | 'trimestre' | 'annee';
    }
  ): Promise<KPIDetailResponse> => {
    const response = await api.get(`/analytics/kpi/${id}/`, {
      params: filters,
    });
    return response.data;
  },

  /**
   * Exporter le dashboard en PDF
   */
  exportDashboardPDF: async (filters?: AnalyticsFilters): Promise<Blob> => {
    const response = await api.post(
      '/analytics/dashboard/export/',
      filters,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};

export default api;