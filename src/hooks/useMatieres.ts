/**
 * React Query hooks pour les Matières
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matiereApi } from '@/api/academic.api';
import type { MatiereCreate, MatiereUpdate, MatiereFilters } from '@/types/academic.types';
import { toast } from 'react-hot-toast';

// Query Keys
export const matiereKeys = {
  all: ['matieres'] as const,
  lists: () => [...matiereKeys.all, 'list'] as const,
  list: (filters?: MatiereFilters) => [...matiereKeys.lists(), filters] as const,
  details: () => [...matiereKeys.all, 'detail'] as const,
  detail: (id: number) => [...matiereKeys.details(), id] as const,
};

/**
 * Hook pour récupérer toutes les matières
 */
export const useMatieres = (filters?: MatiereFilters) => {
  return useQuery({
    queryKey: matiereKeys.list(filters),
    queryFn: () => matiereApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer une matière par ID
 */
export const useMatiere = (id: number) => {
  return useQuery({
    queryKey: matiereKeys.detail(id),
    queryFn: () => matiereApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour créer une matière
 */
export const useCreateMatiere = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MatiereCreate) => matiereApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matiereKeys.lists() });
      toast.success('Matière créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création');
    },
  });
};

/**
 * Hook pour mettre à jour une matière
 */
export const useUpdateMatiere = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MatiereUpdate }) =>
      matiereApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: matiereKeys.lists() });
      queryClient.invalidateQueries({ queryKey: matiereKeys.detail(variables.id) });
      toast.success('Matière modifiée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la modification');
    },
  });
};

/**
 * Hook pour supprimer une matière
 */
export const useDeleteMatiere = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => matiereApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: matiereKeys.lists() });
      toast.success('Matière supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression');
    },
  });
};