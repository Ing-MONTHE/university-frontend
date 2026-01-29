/**
 * React Query hooks pour les Départements
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { departementApi } from '@/api/academic.api';
import type { DepartementCreate, DepartementUpdate, DepartementFilters } from '@/types/academic.types';
import { toast } from 'react-hot-toast';

// Query Keys
export const departementKeys = {
  all: ['departements'] as const,
  lists: () => [...departementKeys.all, 'list'] as const,
  list: (filters?: DepartementFilters) => [...departementKeys.lists(), filters] as const,
  details: () => [...departementKeys.all, 'detail'] as const,
  detail: (id: number) => [...departementKeys.details(), id] as const,
};

/**
 * Hook pour récupérer tous les départements
 */
export const useDepartements = (filters?: DepartementFilters) => {
  return useQuery({
    queryKey: departementKeys.list(filters),
    queryFn: () => departementApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer un département par ID
 */
export const useDepartement = (id: number) => {
  return useQuery({
    queryKey: departementKeys.detail(id),
    queryFn: () => departementApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour créer un département
 */
export const useCreateDepartement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepartementCreate) => departementApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departementKeys.lists() });
      toast.success('Département créé avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création');
    },
  });
};

/**
 * Hook pour mettre à jour un département
 */
export const useUpdateDepartement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartementUpdate }) =>
      departementApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: departementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departementKeys.detail(variables.id) });
      toast.success('Département modifié avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la modification');
    },
  });
};

/**
 * Hook pour supprimer un département
 */
export const useDeleteDepartement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => departementApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departementKeys.lists() });
      toast.success('Département supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression');
    },
  });
};
