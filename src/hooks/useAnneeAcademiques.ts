/**
 * React Query hooks pour les Années Académiques
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { anneeAcademiqueApi } from '@/api/academic.api';
import type { AnneeAcademiqueCreate, AnneeAcademiqueUpdate, AnneeAcademiqueFilters } from '@/types/academic.types';
import { toast } from 'react-hot-toast';

// Query Keys
export const anneeAcademiqueKeys = {
  all: ['annees-academiques'] as const,
  lists: () => [...anneeAcademiqueKeys.all, 'list'] as const,
  list: (filters?: AnneeAcademiqueFilters) => [...anneeAcademiqueKeys.lists(), filters] as const,
  details: () => [...anneeAcademiqueKeys.all, 'detail'] as const,
  detail: (id: number) => [...anneeAcademiqueKeys.details(), id] as const,
};

/**
 * Hook pour récupérer toutes les années académiques
 */
export const useAnneeAcademiques = (filters?: AnneeAcademiqueFilters) => {
  return useQuery({
    queryKey: anneeAcademiqueKeys.list(filters),
    queryFn: () => anneeAcademiqueApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer une année académique par ID
 */
export const useAnneeAcademique = (id: number) => {
  return useQuery({
    queryKey: anneeAcademiqueKeys.detail(id),
    queryFn: () => anneeAcademiqueApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour créer une année académique
 */
export const useCreateAnneeAcademique = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnneeAcademiqueCreate) => anneeAcademiqueApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: anneeAcademiqueKeys.lists() });
      toast.success('Année académique créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création');
    },
  });
};

/**
 * Hook pour mettre à jour une année académique
 */
export const useUpdateAnneeAcademique = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AnneeAcademiqueUpdate }) =>
      anneeAcademiqueApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: anneeAcademiqueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: anneeAcademiqueKeys.detail(variables.id) });
      toast.success('Année académique modifiée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la modification');
    },
  });
};

/**
 * Hook pour supprimer une année académique
 */
export const useDeleteAnneeAcademique = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => anneeAcademiqueApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: anneeAcademiqueKeys.lists() });
      toast.success('Année académique supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression');
    },
  });
};

/**
 * Hook pour activer une année académique
 */
export const useActivateAnneeAcademique = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => anneeAcademiqueApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: anneeAcademiqueKeys.lists() });
      toast.success('Année académique activée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de l'activation");
    },
  });
};

/**
 * Hook pour fermer une année académique
 */
export const useCloseAnneeAcademique = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => anneeAcademiqueApi.close(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: anneeAcademiqueKeys.lists() });
      toast.success('Année académique fermée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la fermeture');
    },
  });
};
