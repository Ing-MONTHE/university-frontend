/**
 * Service API pour la gestion des documents
 */

import apiClient from './client';
import type {
  Document,
  DocumentGenerate,
  DocumentTemplate,
  DocumentTemplateCreate,
  DocumentTemplateUpdate,
  DocumentFilters,
  TemplateFilters,
  PaginatedResponse,
  DocumentStats,
} from '../types/documents.types';

const DOCUMENTS_BASE_URL = '/documents';
const TEMPLATES_BASE_URL = '/templates';

export const documentsApi = {
  // ==================== DOCUMENTS ====================
  
  /**
   * Liste des documents générés avec pagination et filtres
   */
  getAll: async (filters?: DocumentFilters): Promise<PaginatedResponse<Document>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type_document) params.append('type_document', filters.type_document);
    if (filters?.etudiant_id) params.append('etudiant_id', filters.etudiant_id.toString());
    if (filters?.date_debut) params.append('date_debut', filters.date_debut);
    if (filters?.date_fin) params.append('date_fin', filters.date_fin);
    if (filters?.email_envoye !== undefined) params.append('email_envoye', filters.email_envoye.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    
    const response = await apiClient.get<PaginatedResponse<Document>>(
      `${DOCUMENTS_BASE_URL}/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Obtenir un document par ID
   */
  getById: async (id: number): Promise<Document> => {
    const response = await apiClient.get<Document>(`${DOCUMENTS_BASE_URL}/${id}/`);
    return response.data;
  },

  /**
   * Générer un ou plusieurs documents
   */
  generate: async (data: DocumentGenerate): Promise<Document | Document[]> => {
    const response = await apiClient.post<Document | Document[]>(
      `${DOCUMENTS_BASE_URL}/`,
      data
    );
    return response.data;
  },

  /**
   * Télécharger le PDF d'un document
   */
  downloadPdf: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`${DOCUMENTS_BASE_URL}/${id}/pdf/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Supprimer un document
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${DOCUMENTS_BASE_URL}/${id}/`);
  },

  /**
   * Renvoyer le document par email
   */
  resendEmail: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`${DOCUMENTS_BASE_URL}/${id}/resend-email/`);
    return response.data;
  },

  /**
   * Obtenir les statistiques des documents
   */
  getStats: async (): Promise<DocumentStats> => {
    const response = await apiClient.get<DocumentStats>(`${DOCUMENTS_BASE_URL}/stats/`);
    return response.data;
  },

  // ==================== TEMPLATES ====================

  /**
   * Liste des templates avec pagination et filtres
   */
  getAllTemplates: async (filters?: TemplateFilters): Promise<PaginatedResponse<DocumentTemplate>> => {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.type_document) params.append('type_document', filters.type_document);
    if (filters?.est_actif !== undefined) params.append('est_actif', filters.est_actif.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());
    
    const response = await apiClient.get<PaginatedResponse<DocumentTemplate>>(
      `${TEMPLATES_BASE_URL}/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Obtenir un template par ID
   */
  getTemplateById: async (id: number): Promise<DocumentTemplate> => {
    const response = await apiClient.get<DocumentTemplate>(`${TEMPLATES_BASE_URL}/${id}/`);
    return response.data;
  },

  /**
   * Créer un nouveau template
   */
  createTemplate: async (data: DocumentTemplateCreate): Promise<DocumentTemplate> => {
    const response = await apiClient.post<DocumentTemplate>(`${TEMPLATES_BASE_URL}/`, data);
    return response.data;
  },

  /**
   * Mettre à jour un template
   */
  updateTemplate: async (id: number, data: DocumentTemplateUpdate): Promise<DocumentTemplate> => {
    const response = await apiClient.put<DocumentTemplate>(`${TEMPLATES_BASE_URL}/${id}/`, data);
    return response.data;
  },

  /**
   * Supprimer un template
   */
  deleteTemplate: async (id: number): Promise<void> => {
    await apiClient.delete(`${TEMPLATES_BASE_URL}/${id}/`);
  },

  /**
   * Prévisualiser un template avec des données de test
   */
  previewTemplate: async (id: number, testData?: Record<string, any>): Promise<{ html: string }> => {
    const response = await apiClient.post(`${TEMPLATES_BASE_URL}/${id}/preview/`, testData || {});
    return response.data;
  },
};

export default documentsApi;