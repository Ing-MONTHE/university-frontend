// Hooks React Query pour les enseignants

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import * as teacherApi from '@/api/teacher.api';
import type {
  Enseignant,
  EnseignantCreate,
  EnseignantUpdate,
  EnseignantFilters,
} from '@/types/teacher.types';

// Keys pour le cache
export const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (filters?: EnseignantFilters) => [...teacherKeys.lists(), filters] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (id: number) => [...teacherKeys.details(), id] as const,
  stats: () => [...teacherKeys.all, 'stats'] as const,
  attributions: (id: number) => [...teacherKeys.all, 'attributions', id] as const,
  chargeHoraire: (id: number) => [...teacherKeys.all, 'charge-horaire', id] as const,
};

/**
 * Hook pour récupérer la liste des enseignants
 */
export const useTeachers = (filters?: EnseignantFilters) => {
  return useQuery({
    queryKey: teacherKeys.list(filters),
    queryFn: () => teacherApi.getTeachers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer un enseignant par ID
 */
export const useTeacher = (id: number) => {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: () => teacherApi.getTeacherById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer les statistiques des enseignants
 */
export const useTeacherStatistics = () => {
  return useQuery({
    queryKey: teacherKeys.stats(),
    queryFn: teacherApi.getTeacherStatistics,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pour récupérer les attributions d'un enseignant
 */
export const useTeacherAttributions = (id: number) => {
  return useQuery({
    queryKey: teacherKeys.attributions(id),
    queryFn: () => teacherApi.getTeacherAttributions(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour récupérer la charge horaire d'un enseignant
 */
export const useTeacherChargeHoraire = (id: number) => {
  return useQuery({
    queryKey: teacherKeys.chargeHoraire(id),
    queryFn: () => teacherApi.getTeacherChargeHoraire(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook pour créer un enseignant
 */
export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnseignantCreate) => teacherApi.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.stats() });
      toast.success('Enseignant créé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });
};

/**
 * Hook pour mettre à jour un enseignant
 */
export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EnseignantUpdate }) =>
      teacherApi.updateTeacher(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      toast.success('Enseignant modifié avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    },
  });
};

/**
 * Hook pour supprimer un enseignant
 */
export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teacherApi.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.stats() });
      toast.success('Enseignant supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
};

/**
 * Hook pour uploader la photo d'un enseignant
 */
export const useUploadTeacherPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, photo }: { id: number; photo: File }) =>
      teacherApi.uploadTeacherPhoto(id, photo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      toast.success('Photo uploadée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload');
    },
  });
};

/**
 * Hook pour uploader le CV d'un enseignant
 */
export const useUploadTeacherCV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cv }: { id: number; cv: File }) =>
      teacherApi.uploadTeacherCV(id, cv),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teacherKeys.detail(variables.id) });
      toast.success('CV uploadé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload');
    },
  });
};