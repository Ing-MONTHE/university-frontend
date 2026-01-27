import { default as apiClient } from './client';

// Types
export interface Student {
  id: number;
  matricule: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  date_of_birth: string;
  gender: 'M' | 'F';
  phone: string;
  address: string;
  city: string;
  guardian_name?: string;
  guardian_phone?: string;
  emergency_contact?: string;
  enrollment_date: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'EXPELLED';
  current_class?: {
    id: number;
    name: string;
    level: string;
  };
  photo?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentCreateData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F';
  phone: string;
  address: string;
  city: string;
  guardian_name?: string;
  guardian_phone?: string;
  emergency_contact?: string;
  class_id?: number;
}

export interface StudentUpdateData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F';
  address?: string;
  city?: string;
  guardian_name?: string;
  guardian_phone?: string;
  emergency_contact?: string;
  class_id?: number;
  status?: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'EXPELLED';
}

export interface StudentFilters {
  search?: string;
  status?: string;
  class_id?: number;
  gender?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Service API pour la gestion des étudiants
 */
export const studentsApi = {
  /**
   * Récupérer la liste des étudiants avec filtres et pagination
   */
  getAll: async (filters?: StudentFilters): Promise<PaginatedResponse<Student>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.class_id) params.append('class_id', filters.class_id.toString());
    if (filters?.gender) params.append('gender', filters.gender);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());

    const response = await apiClient.get<PaginatedResponse<Student>>(
      `/students/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Récupérer un étudiant par son ID
   */
  getById: async (id: number): Promise<Student> => {
    const response = await apiClient.get<Student>(`/students/${id}/`);
    return response.data;
  },

  /**
   * Créer un nouvel étudiant
   */
  create: async (data: StudentCreateData): Promise<Student> => {
    const response = await apiClient.post<Student>('/students/', data);
    return response.data;
  },

  /**
   * Mettre à jour un étudiant
   */
  update: async (id: number, data: StudentUpdateData): Promise<Student> => {
    const response = await apiClient.patch<Student>(`/students/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer un étudiant
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/students/${id}/`);
  },

  /**
   * Supprimer plusieurs étudiants
   */
  bulkDelete: async (ids: number[]): Promise<void> => {
    await apiClient.post('/students/bulk_delete/', { ids });
  },

  /**
   * Changer le statut d'un étudiant
   */
  updateStatus: async (
    id: number, 
    status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'EXPELLED'
  ): Promise<Student> => {
    const response = await apiClient.patch<Student>(`/students/${id}/`, { status });
    return response.data;
  },

  /**
   * Upload photo de profil
   */
  uploadPhoto: async (id: number, file: File): Promise<Student> => {
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await apiClient.patch<Student>(
      `/students/${id}/`,
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
   * Exporter les étudiants en CSV
   */
  exportCSV: async (filters?: StudentFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.class_id) params.append('class_id', filters.class_id.toString());

    const response = await apiClient.get(`/students/export/?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Obtenir les statistiques des étudiants
   */
  getStats: async (): Promise<{
    total: number;
    active: number;
    suspended: number;
    graduated: number;
    by_gender: { M: number; F: number };
    by_class: { class_name: string; count: number }[];
  }> => {
    const response = await apiClient.get('/students/stats/');
    return response.data;
  },
};
