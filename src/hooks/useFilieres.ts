/**
 * React Query hooks pour les Filières
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filiereApi } from '@/api/academic.api';
import type { FiliereCreate, FiliereUpdate, FiliereFilters } from '@/types/academic.types';
import { toast } from 'react-hot-toast';

// Query Keys
export const filiereKeys = {
  all: ['filieres'] as const,
  lists: () => [...filiereKeys.all, 'list'] as const,
  list: (filters?: FiliereFilters) => [...filiereKeys.lists(), filters] as const,
  details: () => [...filiereKeys.all, 'detail'] as const,
  detail: (id: number) => [...filiereKeys.details(), id] as const,
};

/**
 * Hook pour récupérer toutes les filières
 */
export const useFilieres = (filters?: FiliereFilters) => {
  return useQuery({
    queryKey: filiereKeys.list(filters),
    queryFn: () => filiereApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer une filière par ID
 */
export const useFiliere = (id: number) => {
  return useQuery({
    queryKey: filiereKeys.detail(id),
    queryFn: () => filiereApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour créer une filière
 */
export const useCreateFiliere = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FiliereCreate) => filiereApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filiereKeys.lists() });
      toast.success('Filière créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création');
    },
  });
};

/**
 * Hook pour mettre à jour une filière
 */
export const useUpdateFiliere = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FiliereUpdate }) =>
      filiereApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: filiereKeys.lists() });
      queryClient.invalidateQueries({ queryKey: filiereKeys.detail(variables.id) });
      toast.success('Filière modifiée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la modification');
    },
  });
};

/**
 * Hook pour supprimer une filière
 */
export const useDeleteFiliere = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => filiereApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filiereKeys.lists() });
      toast.success('Filière supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression');
    },
  });
};