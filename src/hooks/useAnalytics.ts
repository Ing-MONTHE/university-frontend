// src/hooks/useAnalytics.ts

import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '@/api/analytics.api';
import type {
  DashboardData,
  Rapport,
  KPI,
  KPIDetail,
  RapportFormData,
  AnalyticsFilters,
  PeriodFilter,
} from '@/types/analytics.types';

export const useAnalytics = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (filters?: AnalyticsFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsApi.getDashboard(filters);
      setDashboardData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportDashboard = useCallback(async (filters?: AnalyticsFilters) => {
    try {
      const blob = await analyticsApi.exportDashboardPDF(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-analytics-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'export du dashboard');
      console.error('Error exporting dashboard:', err);
    }
  }, []);

  return {
    dashboardData,
    loading,
    error,
    loadDashboard,
    exportDashboard,
  };
};

export const useRapports = () => {
  const [rapports, setRapports] = useState<Rapport[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRapports = useCallback(async (params?: {
    type?: string;
    format?: string;
    date_debut?: string;
    date_fin?: string;
    created_by?: string;
    page?: number;
    page_size?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsApi.getRapports(params);
      setRapports(response.data);
      setTotalCount(response.count);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des rapports');
      console.error('Error loading rapports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const genererRapport = useCallback(async (data: RapportFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsApi.genererRapport(data);
      await loadRapports(); // Recharger la liste
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la génération du rapport');
      console.error('Error generating rapport:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRapports]);

  const deleteRapport = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await analyticsApi.deleteRapport(id);
      await loadRapports(); // Recharger la liste
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression du rapport');
      console.error('Error deleting rapport:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadRapports]);

  const downloadRapport = useCallback(async (rapport: Rapport) => {
    try {
      const blob = await analyticsApi.downloadRapport(rapport.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const extension = rapport.format === 'pdf' ? 'pdf' : rapport.format === 'excel' ? 'xlsx' : 'csv';
      link.download = `${rapport.titre.replace(/\s+/g, '-')}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du téléchargement du rapport');
      console.error('Error downloading rapport:', err);
      throw err;
    }
  }, []);

  return {
    rapports,
    totalCount,
    loading,
    error,
    loadRapports,
    genererRapport,
    deleteRapport,
    downloadRapport,
  };
};

export const useKPIs = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadKPIs = useCallback(async (params?: {
    categorie?: string;
    code?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsApi.getKPIs(params);
      setKpis(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des KPIs');
      console.error('Error loading KPIs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    kpis,
    loading,
    error,
    loadKPIs,
  };
};

export const useKPIDetail = (kpiId: string | null) => {
  const [kpiDetail, setKpiDetail] = useState<KPIDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadKPIDetail = useCallback(async (filters?: {
    periode_debut?: string;
    periode_fin?: string;
    comparaison_type?: 'mois' | 'trimestre' | 'annee';
  }) => {
    if (!kpiId) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsApi.getKPIDetail(kpiId, filters);
      setKpiDetail(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des détails du KPI');
      console.error('Error loading KPI detail:', err);
    } finally {
      setLoading(false);
    }
  }, [kpiId]);

  useEffect(() => {
    if (kpiId) {
      loadKPIDetail();
    }
  }, [kpiId, loadKPIDetail]);

  return {
    kpiDetail,
    loading,
    error,
    loadKPIDetail,
  };
};

// Helper pour créer des filtres de période
export const usePeriodFilters = () => {
  const createPeriodFilter = useCallback((type: PeriodFilter['type']): PeriodFilter => {
    const now = new Date();
    let date_debut: string | undefined;
    let date_fin: string | undefined;

    switch (type) {
      case 'jour':
        date_debut = date_fin = now.toISOString().split('T')[0];
        break;
      case 'semaine':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        date_debut = weekStart.toISOString().split('T')[0];
        date_fin = now.toISOString().split('T')[0];
        break;
      case 'mois':
        date_debut = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        date_fin = now.toISOString().split('T')[0];
        break;
      case 'annee':
        date_debut = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        date_fin = now.toISOString().split('T')[0];
        break;
    }

    return { type, date_debut, date_fin };
  }, []);

  return { createPeriodFilter };
};