// React Query hooks pour la gestion des étudiants

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import studentApi from '../api/student.api';
import type {
  Etudiant,
  EtudiantCreate,
  EtudiantUpdate,
  EtudiantFilters,
} from '../types/student.types';

// Query keys
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters?: EtudiantFilters) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: number) => [...studentKeys.details(), id] as const,
  statistics: () => [...studentKeys.all, 'statistics'] as const,
  inscriptions: (id: number) => [...studentKeys.all, 'inscriptions', id] as const,
  bulletin: (id: number) => [...studentKeys.all, 'bulletin', id] as const,
};

// Hook pour obtenir la liste des étudiants
export const useStudents = (filters?: EtudiantFilters) => {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour obtenir un étudiant par ID
export const useStudent = (id: number) => {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentApi.getById(id),
    enabled: !!id,
  });
};

// Hook pour obtenir les statistiques
export const useStudentStatistics = () => {
  return useQuery({
    queryKey: studentKeys.statistics(),
    queryFn: () => studentApi.getStatistics(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour obtenir les inscriptions d'un étudiant
export const useStudentInscriptions = (id: number) => {
  return useQuery({
    queryKey: studentKeys.inscriptions(id),
    queryFn: () => studentApi.getInscriptions(id),
    enabled: !!id,
  });
};

// Hook pour obtenir le bulletin
export const useStudentBulletin = (id: number) => {
  return useQuery({
    queryKey: studentKeys.bulletin(id),
    queryFn: () => studentApi.getBulletin(id),
    enabled: !!id,
  });
};

// Hook pour créer un étudiant
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EtudiantCreate) => studentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });
      toast.success('Étudiant créé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

// Hook pour mettre à jour un étudiant
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EtudiantUpdate }) =>
      studentApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success('Étudiant mis à jour avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(message);
    },
  });
};

// Hook pour supprimer un étudiant
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => studentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });
      toast.success('Étudiant supprimé avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};

// Hook pour uploader une photo
export const useUploadStudentPhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, photo }: { id: number; photo: File }) =>
      studentApi.uploadPhoto(id, photo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });
      toast.success('Photo uploadée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de l'upload";
      toast.error(message);
    },
  });
};

// Hook pour importer un CSV
export const useImportStudentsCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => studentApi.importCSV(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.statistics() });
      
      if (data.erreurs.length > 0) {
        toast.error(`Import terminé avec ${data.erreurs.length} erreur(s)`);
      } else {
        toast.success(`${data.crees} étudiant(s) importé(s) avec succès`);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de l'import";
      toast.error(message);
    },
  });
};