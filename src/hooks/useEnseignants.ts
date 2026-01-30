/**
 * React Query hooks pour les Enseignants
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enseignantApi } from '@/api/students.api';
import type { EnseignantCreate, EnseignantUpdate, EnseignantFilters } from '@/types/students.types';
import { toast } from 'react-hot-toast';

// Query Keys
export const enseignantKeys = {
  all: ['enseignants'] as const,
  lists: () => [...enseignantKeys.all, 'list'] as const,
  list: (filters?: EnseignantFilters) => [...enseignantKeys.lists(), filters] as const,
  details: () => [...enseignantKeys.all, 'detail'] as const,
  detail: (id: number) => [...enseignantKeys.details(), id] as const,
  matieres: (id: number) => [...enseignantKeys.all, id, 'matieres'] as const,
  emploiDuTemps: (id: number) => [...enseignantKeys.all, id, 'emploi-du-temps'] as const,
  statistiques: () => [...enseignantKeys.all, 'statistiques'] as const,
};

/**
 * Hook pour récupérer tous les enseignants
 */
export const useEnseignants = (filters?: EnseignantFilters) => {
  return useQuery({
    queryKey: enseignantKeys.list(filters),
    queryFn: () => enseignantApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer un enseignant par ID
 */
export const useEnseignant = (id: number) => {
  return useQuery({
    queryKey: enseignantKeys.detail(id),
    queryFn: () => enseignantApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour récupérer un enseignant par matricule
 */
export const useEnseignantByMatricule = (matricule: string) => {
  return useQuery({
    queryKey: [...enseignantKeys.all, 'matricule', matricule],
    queryFn: () => enseignantApi.getByMatricule(matricule),
    enabled: !!matricule,
  });
};

/**
 * Hook pour créer un enseignant
 */
export const useCreateEnseignant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnseignantCreate) => enseignantApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enseignantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: enseignantKeys.statistiques() });
      toast.success('Enseignant créé avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

/**
 * Hook pour mettre à jour un enseignant
 */
export const useUpdateEnseignant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EnseignantUpdate }) =>
      enseignantApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: enseignantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: enseignantKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: enseignantKeys.statistiques() });
      toast.success('Enseignant modifié avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

/**
 * Hook pour supprimer un enseignant
 */
export const useDeleteEnseignant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => enseignantApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enseignantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: enseignantKeys.statistiques() });
      toast.success('Enseignant supprimé avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};

/**
 * Hook pour uploader une photo d'enseignant
 */
export const useUploadEnseignantPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      enseignantApi.uploadPhoto(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: enseignantKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: enseignantKeys.lists() });
      toast.success('Photo uploadée avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de l\'upload';
      toast.error(message);
    },
  });
};

/**
 * Hook pour changer le statut d'un enseignant
 */
export const useChangeEnseignantStatut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, statut }: { id: number; statut: string }) =>
      enseignantApi.changeStatut(id, statut),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: enseignantKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: enseignantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: enseignantKeys.statistiques() });
      toast.success('Statut modifié avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors du changement de statut';
      toast.error(message);
    },
  });
};

/**
 * Hook pour obtenir les matières d'un enseignant
 */
export const useEnseignantMatieres = (id: number) => {
  return useQuery({
    queryKey: enseignantKeys.matieres(id),
    queryFn: () => enseignantApi.getMatieres(id),
    enabled: !!id,
  });
};

/**
 * Hook pour obtenir l'emploi du temps d'un enseignant
 */
export const useEnseignantEmploiDuTemps = (id: number) => {
  return useQuery({
    queryKey: enseignantKeys.emploiDuTemps(id),
    queryFn: () => enseignantApi.getEmploiDuTemps(id),
    enabled: !!id,
  });
};

/**
 * Hook pour obtenir les statistiques des enseignants
 */
export const useEnseignantStatistiques = () => {
  return useQuery({
    queryKey: enseignantKeys.statistiques(),
    queryFn: () => enseignantApi.getStatistiques(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pour générer un matricule unique
 */
export const useGenerateEnseignantMatricule = () => {
  return useMutation({
    mutationFn: () => enseignantApi.generateMatricule(),
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de la génération du matricule';
      toast.error(message);
    },
  });
};
