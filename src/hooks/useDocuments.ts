/**
 * Hook personnalisé pour la gestion des documents
 */

import { useState, useCallback } from 'react';
import { documentsApi } from '@/api/documents.api';
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
} from '@/types/documents.types';

export const useDocuments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==================== DOCUMENTS ====================

  const getAllDocuments = useCallback(async (filters?: DocumentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentsApi.getAll(filters);
      return data;
    } catch (err: any) {
      const message = err.message || 'Erreur lors du chargement des documents';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentsApi.getById(id);
      return data;
    } catch (err: any) {
      const message = err.message || 'Erreur lors du chargement du document';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateDocument = useCallback(async (data: DocumentGenerate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await documentsApi.generate(data);
      return result;
    } catch (err: any) {
      const message = err.message || 'Erreur lors de la génération du document';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadPdf = useCallback(async (id: number, filename?: string) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await documentsApi.downloadPdf(id);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `document-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return blob;
    } catch (err: any) {
      const message = err.message || 'Erreur lors du téléchargement du PDF';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await documentsApi.delete(id);
    } catch (err: any) {
      const message = err.message || 'Erreur lors de la suppression du document';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const resendEmail = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await documentsApi.resendEmail(id);
      return result;
    } catch (err: any) {
      const message = err.message || "Erreur lors de l'envoi de l'email";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocumentStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentsApi.getStats();
      return data;
    } catch (err: any) {
      const message = err.message || 'Erreur lors du chargement des statistiques';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== TEMPLATES ====================

  const getAllTemplates = useCallback(async (filters?: TemplateFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentsApi.getAllTemplates(filters);
      return data;
    } catch (err: any) {
      const message = err.message || 'Erreur lors du chargement des templates';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTemplateById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentsApi.getTemplateById(id);
      return data;
    } catch (err: any) {
      const message = err.message || 'Erreur lors du chargement du template';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (data: DocumentTemplateCreate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await documentsApi.createTemplate(data);
      return result;
    } catch (err: any) {
      const message = err.message || 'Erreur lors de la création du template';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTemplate = useCallback(async (id: number, data: DocumentTemplateUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await documentsApi.updateTemplate(id, data);
      return result;
    } catch (err: any) {
      const message = err.message || 'Erreur lors de la mise à jour du template';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTemplate = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await documentsApi.deleteTemplate(id);
    } catch (err: any) {
      const message = err.message || 'Erreur lors de la suppression du template';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const previewTemplate = useCallback(async (id: number, testData?: Record<string, any>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await documentsApi.previewTemplate(id, testData);
      return result;
    } catch (err: any) {
      const message = err.message || 'Erreur lors de la prévisualisation du template';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    // Documents
    getAllDocuments,
    getDocumentById,
    generateDocument,
    downloadPdf,
    deleteDocument,
    resendEmail,
    getDocumentStats,
    // Templates
    getAllTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    previewTemplate,
  };
};

export default useDocuments;