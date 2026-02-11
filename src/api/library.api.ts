import apiClient from './client';
import type {
  Livre,
  LivreFormData,
  LivreFilters,
  Emprunt,
  EmpruntFormData,
  EmpruntRetourData,
  EmpruntFilters,
  CategoriesLivre,
  CategoriesLivreFormData,
  BibliothequeStats,
  PaginatedResponse,
} from '@/types/library.types';

const BASE_URL = '/bibliotheque';

// ==================== CATÉGORIES ====================
export const categoriesApi = {
  getAll: () =>
    apiClient.get<CategoriesLivre[]>(`${BASE_URL}/categories/`),

  getById: (id: number) =>
    apiClient.get<CategoriesLivre>(`${BASE_URL}/categories/${id}/`),

  create: (data: CategoriesLivreFormData) =>
    apiClient.post<CategoriesLivre>(`${BASE_URL}/categories/`, data),

  update: (id: number, data: Partial<CategoriesLivreFormData>) =>
    apiClient.patch<CategoriesLivre>(`${BASE_URL}/categories/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`${BASE_URL}/categories/${id}/`),

  getLivres: (id: number) =>
    apiClient.get<Livre[]>(`${BASE_URL}/categories/${id}/livres/`),
};

// ==================== LIVRES ====================
export const livresApi = {
  getAll: (filters?: LivreFilters) => {
    const params = new URLSearchParams();
    if (filters?.categorie) params.append('categorie', filters.categorie.toString());
    if (filters?.auteur) params.append('auteur', filters.auteur);
    if (filters?.disponible !== undefined) params.append('disponible', filters.disponible.toString());
    if (filters?.q) params.append('q', filters.q);
    
    return apiClient.get<Livre[]>(
      `${BASE_URL}/livres/${params.toString() ? `?${params.toString()}` : ''}`
    );
  },

  getById: (id: number) =>
    apiClient.get<Livre>(`${BASE_URL}/livres/${id}/`),

  create: (data: LivreFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return apiClient.post<Livre>(`${BASE_URL}/livres/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  update: (id: number, data: Partial<LivreFormData>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return apiClient.patch<Livre>(`${BASE_URL}/livres/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: (id: number) =>
    apiClient.delete(`${BASE_URL}/livres/${id}/`),

  getDisponibles: () =>
    apiClient.get<Livre[]>(`${BASE_URL}/livres/disponibles/`),

  getHistorique: (id: number) =>
    apiClient.get<Emprunt[]>(`${BASE_URL}/livres/${id}/historique/`),

  getStatistiques: () =>
    apiClient.get<BibliothequeStats>(`${BASE_URL}/livres/statistiques/`),
};

// ==================== EMPRUNTS ====================
export const empruntsApi = {
  getAll: (filters?: EmpruntFilters) => {
    const params = new URLSearchParams();
    if (filters?.etudiant) params.append('etudiant', filters.etudiant.toString());
    if (filters?.livre) params.append('livre', filters.livre.toString());
    if (filters?.statut) params.append('statut', filters.statut);
    
    return apiClient.get<Emprunt[]>(
      `${BASE_URL}/emprunts/${params.toString() ? `?${params.toString()}` : ''}`
    );
  },

  getById: (id: number) =>
    apiClient.get<Emprunt>(`${BASE_URL}/emprunts/${id}/`),

  create: (data: EmpruntFormData) =>
    apiClient.post<Emprunt>(`${BASE_URL}/emprunts/`, data),

  update: (id: number, data: Partial<EmpruntFormData>) =>
    apiClient.patch<Emprunt>(`${BASE_URL}/emprunts/${id}/`, data),

  delete: (id: number) =>
    apiClient.delete(`${BASE_URL}/emprunts/${id}/`),

  retourner: (id: number, data?: EmpruntRetourData) =>
    apiClient.post<{ message: string; emprunt: Emprunt }>(
      `${BASE_URL}/emprunts/${id}/retour/`,
      data || {}
    ),

  getEnCours: () =>
    apiClient.get<Emprunt[]>(`${BASE_URL}/emprunts/en_cours/`),

  getEnRetard: () =>
    apiClient.get<Emprunt[]>(`${BASE_URL}/emprunts/en_retard/`),

  getHistorique: () =>
    apiClient.get<Emprunt[]>(`${BASE_URL}/emprunts/historique/`),

  getStatistiques: () =>
    apiClient.get<BibliothequeStats>(`${BASE_URL}/emprunts/statistiques/`),
};

// ==================== STATISTIQUES GLOBALES ====================
export const bibliothequeApi = {
  getStatistiques: () =>
    apiClient.get<BibliothequeStats>(`${BASE_URL}/statistiques/`),
};

export default {
  categories: categoriesApi,
  livres: livresApi,
  emprunts: empruntsApi,
  statistiques: bibliothequeApi,
};