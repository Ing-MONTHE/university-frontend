/**
 * React Query hooks pour les Étudiants
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { etudiantApi } from '@/api/students.api';
import type { EtudiantCreate, EtudiantUpdate, EtudiantFilters } from '@/types/students.types';
import { toast } from 'react-hot-toast';

// Query Keys
export const etudiantKeys = {
  all: ['etudiants'] as const,
  lists: () => [...etudiantKeys.all, 'list'] as const,
  list: (filters?: EtudiantFilters) => [...etudiantKeys.lists(), filters] as const,
  details: () => [...etudiantKeys.all, 'detail'] as const,
  detail: (id: number) => [...etudiantKeys.details(), id] as const,
  statistiques: () => [...etudiantKeys.all, 'statistiques'] as const,
};

/**
 * Hook pour récupérer tous les étudiants
 */
export const useEtudiants = (filters?: EtudiantFilters) => {
  return useQuery({
    queryKey: etudiantKeys.list(filters),
    queryFn: () => etudiantApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook pour récupérer un étudiant par ID
 */
export const useEtudiant = (id: number) => {
  return useQuery({
    queryKey: etudiantKeys.detail(id),
    queryFn: () => etudiantApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook pour récupérer un étudiant par matricule
 */
export const useEtudiantByMatricule = (matricule: string) => {
  return useQuery({
    queryKey: [...etudiantKeys.all, 'matricule', matricule],
    queryFn: () => etudiantApi.getByMatricule(matricule),
    enabled: !!matricule,
  });
};

/**
 * Hook pour créer un étudiant
 */
export const useCreateEtudiant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EtudiantCreate) => etudiantApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: etudiantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: etudiantKeys.statistiques() });
      toast.success('Étudiant créé avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

/**
 * Hook pour mettre à jour un étudiant
 */
export const useUpdateEtudiant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EtudiantUpdate }) =>
      etudiantApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: etudiantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: etudiantKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: etudiantKeys.statistiques() });
      toast.success('Étudiant modifié avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

/**
 * Hook pour supprimer un étudiant
 */
export const useDeleteEtudiant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => etudiantApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: etudiantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: etudiantKeys.statistiques() });
      toast.success('Étudiant supprimé avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};

/**
 * Hook pour uploader une photo d'étudiant
 */
export const useUploadEtudiantPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      etudiantApi.uploadPhoto(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: etudiantKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: etudiantKeys.lists() });
      toast.success('Photo uploadée avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de l\'upload';
      toast.error(message);
    },
  });
};

/**
 * Hook pour changer le statut d'un étudiant
 */
export const useChangeEtudiantStatut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, statut }: { id: number; statut: string }) =>
      etudiantApi.changeStatut(id, statut),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: etudiantKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: etudiantKeys.lists() });
      queryClient.invalidateQueries({ queryKey: etudiantKeys.statistiques() });
      toast.success('Statut modifié avec succès');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors du changement de statut';
      toast.error(message);
    },
  });
};

/**
 * Hook pour obtenir les statistiques des étudiants
 */
export const useEtudiantStatistiques = () => {
  return useQuery({
    queryKey: etudiantKeys.statistiques(),
    queryFn: () => etudiantApi.getStatistiques(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook pour générer un matricule unique
 */
export const useGenerateEtudiantMatricule = () => {
  return useMutation({
    mutationFn: () => etudiantApi.generateMatricule(),
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Erreur lors de la génération du matricule';
      toast.error(message);
    },
  });
};