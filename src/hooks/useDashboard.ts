// Hook pour récupérer les statistiques du dashboard

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface DashboardStats {
  students: {
    total: number;
    actifs: number;
    nouveaux: number;
    taux_reussite: number;
    par_statut: {
      actifs: number;
      suspendus: number;
      diplomes: number;
      exclus: number;
      abandonnes: number;
    };
    par_sexe: {
      masculin: number;
      feminin: number;
    };
  };
  finance: {
    total_a_payer: number;
    total_paye: number;
    montant_impaye: number;
    etudiants_impaye: number;
  };
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get(`${API_BASE_URL}/etudiants/dashboard-stats/`);
  return response.data;
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export default useDashboardStats;