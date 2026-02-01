// Hook pour récupérer les statistiques du dashboard

import { useQuery } from '@tanstack/react-query';
import { useStudentStatistics } from './useStudents';

export interface DashboardStats {
  students: {
    total: number;
    actifs: number;
    nouveaux: number;
    taux_reussite: number;
  };
  teachers: {
    total: number;
    actifs: number;
  };
  finance: {
    revenus_mensuels: number;
    montant_impaye: number;
  };
}

export const useDashboardStats = () => {
  // Récupérer les stats étudiants
  const { data: studentStats, isLoading: loadingStudents } = useStudentStatistics();

  // TODO: Ajouter les autres stats (enseignants, finance) quand les endpoints seront prêts
  
  const dashboardData: DashboardStats = {
    students: {
      total: studentStats?.total || 0,
      actifs: studentStats?.actifs || 0,
      nouveaux: studentStats?.nouveaux || 0,
      taux_reussite: studentStats?.taux_reussite || 0,
    },
    teachers: {
      total: 0, // TODO: Récupérer depuis l'API
      actifs: 0,
    },
    finance: {
      revenus_mensuels: 0, // TODO: Récupérer depuis l'API
      montant_impaye: 0,
    },
  };

  return {
    data: dashboardData,
    isLoading: loadingStudents,
  };
};

export default useDashboardStats;