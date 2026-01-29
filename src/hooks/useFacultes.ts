/**
 * React Query hooks pour les Facultés
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faculteApi } from '@/api/academic.api';
import type { FaculteCreate, FaculteUpdate, FaculteFilters } from '@/types/academic.types';
import { toast } from 'react-hot-toast';

// Query Keys
export const faculteKeys = {
  all: ['facultes'] as const,
  lists: () => [...faculteKeys.all, 'list'] as const,
  list: (filters?: FaculteFilters) => [...faculteKeys.lists(), filters] as const,
  details: () => [...faculteKeys.all, 'detail'] as const,
  detail: (id: number) => [...faculteKeys.details(), id] as const,
};

/**
 * Hook pour récupérer toutes les facultés
 */
export const useFacultes = (filters?: FaculteFilters) => {
  return useQuery({
    queryKey: faculteKeys.list(filters),
    queryFn: () => faculteApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer une faculté par ID
 */
export const useFaculte = (id: number) => {
  return useQuery({
    queryKey: faculteKeys.detail(id),
    queryFn: () => faculteApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour créer une faculté
 */
export const useCreateFaculte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FaculteCreate) => faculteApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faculteKeys.lists() });
      toast.success('Faculté créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création');
    },
  });
};

/**
 * Hook pour mettre à jour une faculté
 */
export const useUpdateFaculte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FaculteUpdate }) =>
      faculteApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: faculteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: faculteKeys.detail(variables.id) });
      toast.success('Faculté modifiée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la modification');
    },
  });
};

/**
 * Hook pour supprimer une faculté
 */
export const useDeleteFaculte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => faculteApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faculteKeys.lists() });
      toast.success('Faculté supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression');
    },
  });
};
