/**
 * Hook personnalisé pour gérer les présences
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFeuillesPresence,
  getFeuillePresence,
  createFeuillePresence,
  updateFeuillePresence,
  deleteFeuillePresence,
  fermerFeuillePresence,
  getPresencesByFeuille,
  marquerPresences,
  marquerToutPresent,
  marquerToutAbsent,
  getJustificatifs,
  createJustificatif,
  validerJustificatif,
  rejeterJustificatif,
  getJustificatifsEnAttente,
  getTauxPresenceEtudiant,
  getStatistiquesPresences,
  getStatistiquesJustificatifs,
} from '@/api/attendance.api';
import {
  FeuillePresenceFilters,
  JustificatifFilters,
  CreateFeuillePresenceDTO,
  MarquerPresencesDTO,
  CreateJustificatifDTO,
} from '@/types/attendance.types';
import { toast } from '@/components/ui/Toast';

/**
 * Hook pour gérer les feuilles de présence
 */
export const useFeuillesPresence = (filters?: FeuillePresenceFilters) => {
  const queryClient = useQueryClient();

  // Liste des feuilles
  const {
    data: feuilles,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['feuilles-presence', filters],
    queryFn: () => getFeuillesPresence(filters),
  });

  // Créer une feuille
  const createMutation = useMutation({
    mutationFn: (data: CreateFeuillePresenceDTO) => createFeuillePresence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feuilles-presence'] });
      toast.success('Feuille de présence créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la création');
    },
  });

  // Mettre à jour une feuille
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateFeuillePresenceDTO> }) =>
      updateFeuillePresence(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feuilles-presence'] });
      toast.success('Feuille de présence mise à jour');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  // Supprimer une feuille
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteFeuillePresence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feuilles-presence'] });
      toast.success('Feuille de présence supprimée');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  // Fermer une feuille
  const fermerMutation = useMutation({
    mutationFn: (id: number) => fermerFeuillePresence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feuilles-presence'] });
      queryClient.invalidateQueries({ queryKey: ['feuille-presence'] });
      toast.success('Feuille de présence fermée');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la fermeture');
    },
  });

  return {
    feuilles: feuilles?.results || [],
    count: feuilles?.count || 0,
    isLoading,
    error,
    refetch,
    createFeuille: createMutation.mutate,
    updateFeuille: updateMutation.mutate,
    deleteFeuille: deleteMutation.mutate,
    fermerFeuille: fermerMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isFermeture: fermerMutation.isPending,
  };
};

/**
 * Hook pour une feuille de présence spécifique
 */
export const useFeuillePresence = (id: number) => {
  const queryClient = useQueryClient();

  const {
    data: feuille,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['feuille-presence', id],
    queryFn: () => getFeuillePresence(id),
    enabled: !!id,
  });

  const {
    data: presences,
    isLoading: isLoadingPresences,
    refetch: refetchPresences,
  } = useQuery({
    queryKey: ['presences', id],
    queryFn: () => getPresencesByFeuille(id),
    enabled: !!id,
  });

  // Marquer les présences
  const marquerMutation = useMutation({
    mutationFn: (data: MarquerPresencesDTO) => marquerPresences(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presences', id] });
      queryClient.invalidateQueries({ queryKey: ['feuille-presence', id] });
      toast.success('Présences enregistrées');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de l\'enregistrement');
    },
  });

  // Tout présent
  const toutPresentMutation = useMutation({
    mutationFn: () => marquerToutPresent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presences', id] });
      queryClient.invalidateQueries({ queryKey: ['feuille-presence', id] });
      toast.success('Tous les étudiants marqués présents');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur');
    },
  });

  // Tout absent
  const toutAbsentMutation = useMutation({
    mutationFn: () => marquerToutAbsent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presences', id] });
      queryClient.invalidateQueries({ queryKey: ['feuille-presence', id] });
      toast.success('Tous les étudiants marqués absents');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur');
    },
  });

  return {
    feuille,
    presences: presences || [],
    isLoading,
    isLoadingPresences,
    error,
    refetch,
    refetchPresences,
    marquerPresences: marquerMutation.mutate,
    marquerToutPresent: toutPresentMutation.mutate,
    marquerToutAbsent: toutAbsentMutation.mutate,
    isMarquage: marquerMutation.isPending || toutPresentMutation.isPending || toutAbsentMutation.isPending,
  };
};

/**
 * Hook pour gérer les justificatifs
 */
export const useJustificatifs = (filters?: JustificatifFilters) => {
  const queryClient = useQueryClient();

  const {
    data: justificatifs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['justificatifs', filters],
    queryFn: () => getJustificatifs(filters),
  });

  // Créer un justificatif
  const createMutation = useMutation({
    mutationFn: (data: CreateJustificatifDTO) => createJustificatif(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['justificatifs'] });
      toast.success('Justificatif soumis avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la soumission');
    },
  });

  // Valider un justificatif
  const validerMutation = useMutation({
    mutationFn: ({ id, commentaire }: { id: number; commentaire?: string }) =>
      validerJustificatif(id, commentaire),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['justificatifs'] });
      toast.success('Justificatif validé');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la validation');
    },
  });

  // Rejeter un justificatif
  const rejeterMutation = useMutation({
    mutationFn: ({ id, commentaire }: { id: number; commentaire: string }) =>
      rejeterJustificatif(id, commentaire),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['justificatifs'] });
      toast.success('Justificatif rejeté');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors du rejet');
    },
  });

  return {
    justificatifs: justificatifs?.results || [],
    count: justificatifs?.count || 0,
    isLoading,
    error,
    refetch,
    createJustificatif: createMutation.mutate,
    validerJustificatif: validerMutation.mutate,
    rejeterJustificatif: rejeterMutation.mutate,
    isCreating: createMutation.isPending,
    isValidating: validerMutation.isPending,
    isRejecting: rejeterMutation.isPending,
  };
};

/**
 * Hook pour les justificatifs en attente
 */
export const useJustificatifsEnAttente = () => {
  const {
    data: justificatifs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['justificatifs-en-attente'],
    queryFn: getJustificatifsEnAttente,
  });

  return {
    justificatifs: justificatifs || [],
    isLoading,
    refetch,
  };
};

/**
 * Hook pour les statistiques de présence d'un étudiant
 */
export const useTauxPresenceEtudiant = (etudiantId: number) => {
  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['taux-presence-etudiant', etudiantId],
    queryFn: () => getTauxPresenceEtudiant(etudiantId),
    enabled: !!etudiantId,
  });

  return {
    stats,
    isLoading,
    refetch,
  };
};

/**
 * Hook pour les statistiques globales
 */
export const useStatistiquesPresences = () => {
  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['statistiques-presences'],
    queryFn: getStatistiquesPresences,
  });

  return {
    stats,
    isLoading,
    refetch,
  };
};

/**
 * Hook pour les statistiques des justificatifs
 */
export const useStatistiquesJustificatifs = () => {
  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['statistiques-justificatifs'],
    queryFn: getStatistiquesJustificatifs,
  });

  return {
    stats,
    isLoading,
    refetch,
  };
};