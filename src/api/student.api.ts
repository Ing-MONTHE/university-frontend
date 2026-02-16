// Service API pour la gestion des étudiants

import axios from 'axios';
import type {
  Etudiant,
  EtudiantCreate,
  EtudiantUpdate,
  EtudiantFilters,
  EtudiantStats,
  ImportCSVResponse,
  BulletinData,
  PaginatedResponse,
  Inscription,
} from '../types/student.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Créer une instance Axios avec configuration de base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const studentApi = {
  // Liste des étudiants avec pagination et filtres
  getAll: async (filters?: EtudiantFilters): Promise<PaginatedResponse<Etudiant>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sexe) params.append('sexe', filters.sexe);
    if (filters?.statut) params.append('statut', filters.statut);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    
    const response = await apiClient.get<PaginatedResponse<Etudiant>>(
      `/etudiants/?${params.toString()}`
    );
    return response.data;
  },

  // Obtenir un étudiant par ID
  getById: async (id: number): Promise<Etudiant> => {
    const response = await apiClient.get<Etudiant>(`/etudiants/${id}/`);
    return response.data;
  },

  // Créer un nouvel étudiant
  create: async (data: EtudiantCreate): Promise<Etudiant> => {
    // Créer FormData pour gérer l'upload de fichiers
    const formData = new FormData();
    
    formData.append('nom', data.nom);
    formData.append('prenom', data.prenom);
    formData.append('sexe', data.sexe);
    formData.append('date_naissance', data.date_naissance);
    formData.append('lieu_naissance', data.lieu_naissance);
    formData.append('nationalite', data.nationalite);
    formData.append('telephone', data.telephone);
    formData.append('email', data.email);
    
    if (data.adresse) formData.append('adresse', data.adresse);
    if (data.ville) formData.append('ville', data.ville);
    if (data.pays) formData.append('pays', data.pays);
    if (data.tuteur_nom) formData.append('tuteur_nom', data.tuteur_nom);
    if (data.tuteur_telephone) formData.append('tuteur_telephone', data.tuteur_telephone);
    if (data.tuteur_email) formData.append('tuteur_email', data.tuteur_email);
    if (data.statut) formData.append('statut', data.statut);
    if (data.photo) formData.append('photo', data.photo);

    const response = await apiClient.post<Etudiant>('/etudiants/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mettre à jour un étudiant
  update: async (id: number, data: EtudiantUpdate): Promise<Etudiant> => {
    const response = await apiClient.patch<Etudiant>(`/etudiants/${id}/`, data);
    return response.data;
  },

  // Supprimer un étudiant
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/etudiants/${id}/`);
  },

  // Upload photo de profil
  uploadPhoto: async (id: number, photo: File): Promise<{ message: string; photo_url: string | null }> => {
    const formData = new FormData();
    formData.append('photo', photo);

    const response = await apiClient.post(`/etudiants/${id}/upload-photo/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Import CSV
  importCSV: async (file: File): Promise<ImportCSVResponse> => {
    const formData = new FormData();
    formData.append('fichier', file);

    const response = await apiClient.post<ImportCSVResponse>(
      '/etudiants/import-csv/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Obtenir le bulletin d'un étudiant
  getBulletin: async (id: number): Promise<BulletinData> => {
    const response = await apiClient.get<BulletinData>(`/etudiants/${id}/bulletin/`);
    return response.data;
  },

  // Obtenir les statistiques
  getStatistics: async (): Promise<EtudiantStats> => {
    const response = await apiClient.get<EtudiantStats>('/etudiants/statistiques/');
    return response.data;
  },

  // Obtenir les inscriptions d'un étudiant
  getInscriptions: async (id: number): Promise<{ inscriptions: Inscription[]; count: number }> => {
    const response = await apiClient.get(`/etudiants/${id}/inscriptions/`);
    return response.data;
  },

  // Télécharger le template CSV
  downloadCSVTemplate: (): void => {
    const csvContent = `nom,prenom,sexe,date_naissance,email,telephone,lieu_naissance,nationalite,ville,pays,adresse,tuteur_nom,tuteur_telephone,statut
KAMGA,Jean,M,2000-05-15,jean.kamga@email.com,+237600000000,Douala,Camerounaise,Douala,Cameroun,Akwa,KAMGA Paul,+237699999999,ACTIF
NGONO,Marie,F,2001-03-20,marie.ngono@email.com,+237677777777,Yaoundé,Camerounaise,Yaoundé,Cameroun,Bastos,NGONO Pierre,+237688888888,ACTIF`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_etudiants.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};

// Exporter uploadPhoto séparément pour utilisation directe
export const uploadPhoto = studentApi.uploadPhoto;

// ============= INSCRIPTION API =============
export const inscriptionApi = {
  getAll: async (filters?: any): Promise<PaginatedResponse<Inscription>> => {
    const { data } = await apiClient.get('/students/inscriptions/', { params: filters });
    return data;
  },

  getById: async (id: number): Promise<Inscription> => {
    const { data } = await apiClient.get(`/students/inscriptions/${id}/`);
    return data;
  },

  create: async (inscriptionData: any): Promise<Inscription> => {
    const { data } = await apiClient.post('/students/inscriptions/', inscriptionData);
    return data;
  },

  update: async (id: number, inscriptionData: any): Promise<Inscription> => {
    const { data } = await apiClient.patch(`/students/inscriptions/${id}/`, inscriptionData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/students/inscriptions/${id}/`);
  },
};

// ============= ATTRIBUTION API =============
export const attributionApi = {
  getAll: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const { data } = await apiClient.get('/students/attributions/', { params: filters });
    return data;
  },

  getById: async (id: number): Promise<any> => {
    const { data } = await apiClient.get(`/students/attributions/${id}/`);
    return data;
  },

  create: async (attributionData: any): Promise<any> => {
    const { data } = await apiClient.post('/students/attributions/', attributionData);
    return data;
  },

  update: async (id: number, attributionData: any): Promise<any> => {
    const { data } = await apiClient.patch(`/students/attributions/${id}/`, attributionData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/students/attributions/${id}/`);
  },
};

export default studentApi;