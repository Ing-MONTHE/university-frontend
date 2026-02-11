// src/api/finance.api.ts

import axios from 'axios';
import {
  FraisScolarite,
  FraisScolariteFormData,
  Paiement,
  PaiementFormData,
  Bourse,
  BourseFormData,
  FinanceStatistiques,
  StudentPaymentInfo,
  Etudiant,
} from '../types/finance.types';

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

// ============ FRAIS DE SCOLARITÉ ============

export const fraisScolariteApi = {
  // Récupérer tous les frais de scolarité
  getAll: async (params?: {
    filiere?: string;
    niveau?: string;
    annee_academique?: string;
  }): Promise<FraisScolarite[]> => {
    const response = await api.get('/frais-scolarite/', { params });
    return response.data;
  },

  // Récupérer un frais par ID
  getById: async (id: string): Promise<FraisScolarite> => {
    const response = await api.get(`/frais-scolarite/${id}/`);
    return response.data;
  },

  // Créer un nouveau frais
  create: async (data: FraisScolariteFormData): Promise<FraisScolarite> => {
    const response = await api.post('/frais-scolarite/', data);
    return response.data;
  },

  // Mettre à jour un frais
  update: async (id: string, data: Partial<FraisScolariteFormData>): Promise<FraisScolarite> => {
    const response = await api.put(`/frais-scolarite/${id}/`, data);
    return response.data;
  },

  // Supprimer un frais
  delete: async (id: string): Promise<void> => {
    await api.delete(`/frais-scolarite/${id}/`);
  },
};

// ============ PAIEMENTS ============

export const paiementsApi = {
  // Récupérer tous les paiements
  getAll: async (params?: {
    etudiant_id?: string;
    date_debut?: string;
    date_fin?: string;
    statut?: string;
    mode_paiement?: string;
    type_frais?: string;
  }): Promise<Paiement[]> => {
    const response = await api.get('/paiements/', { params });
    return response.data;
  },

  // Récupérer un paiement par ID
  getById: async (id: string): Promise<Paiement> => {
    const response = await api.get(`/paiements/${id}/`);
    return response.data;
  },

  // Créer un nouveau paiement
  create: async (data: PaiementFormData): Promise<Paiement> => {
    const response = await api.post('/paiements/', data);
    return response.data;
  },

  // Mettre à jour un paiement
  update: async (id: string, data: Partial<PaiementFormData>): Promise<Paiement> => {
    const response = await api.put(`/paiements/${id}/`, data);
    return response.data;
  },

  // Supprimer un paiement
  delete: async (id: string): Promise<void> => {
    await api.delete(`/paiements/${id}/`);
  },

  // Télécharger la facture PDF
  getFacturePDF: async (id: string): Promise<Blob> => {
    const response = await api.get(`/factures/${id}/pdf/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Obtenir l'URL de la facture
  getFactureURL: (id: string): string => {
    return `${API_BASE_URL}/factures/${id}/pdf/`;
  },
};

// ============ BOURSES ============

export const boursesApi = {
  // Récupérer toutes les bourses
  getAll: async (params?: {
    etudiant_id?: string;
    type_bourse?: string;
    statut?: string;
  }): Promise<Bourse[]> => {
    const response = await api.get('/bourses/', { params });
    return response.data;
  },

  // Récupérer une bourse par ID
  getById: async (id: string): Promise<Bourse> => {
    const response = await api.get(`/bourses/${id}/`);
    return response.data;
  },

  // Créer une nouvelle bourse
  create: async (data: BourseFormData): Promise<Bourse> => {
    const response = await api.post('/bourses/', data);
    return response.data;
  },

  // Mettre à jour une bourse
  update: async (id: string, data: Partial<BourseFormData>): Promise<Bourse> => {
    const response = await api.put(`/bourses/${id}/`, data);
    return response.data;
  },

  // Supprimer une bourse
  delete: async (id: string): Promise<void> => {
    await api.delete(`/bourses/${id}/`);
  },
};

// ============ STATISTIQUES FINANCIÈRES ============

export const financeApi = {
  // Récupérer les statistiques financières
  getStatistiques: async (params?: {
    annee_academique?: string;
    date_debut?: string;
    date_fin?: string;
  }): Promise<FinanceStatistiques> => {
    const response = await api.get('/finance/statistiques/', { params });
    return response.data;
  },

  // Récupérer les informations de paiement d'un étudiant
  getStudentPayments: async (etudiantId: string): Promise<StudentPaymentInfo> => {
    const response = await api.get(`/finance/etudiants/${etudiantId}/paiements/`);
    return response.data;
  },
};

// ============ ÉTUDIANTS (pour autocomplete) ============

export const etudiantsApi = {
  // Rechercher des étudiants
  search: async (query: string): Promise<Etudiant[]> => {
    const response = await api.get('/etudiants/', {
      params: { search: query },
    });
    return response.data;
  },

  // Récupérer tous les étudiants
  getAll: async (): Promise<Etudiant[]> => {
    const response = await api.get('/etudiants/');
    return response.data;
  },

  // Récupérer un étudiant par ID
  getById: async (id: string): Promise<Etudiant> => {
    const response = await api.get(`/etudiants/${id}/`);
    return response.data;
  },
};

export default api;