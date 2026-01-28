/**
 * Hooks React Query pour le module Académique  
 * Gestion du cache, mutations et invalidations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicApi } from '@/api';
import { toastSuccess, toastError } from '@/components/ui';
import type {
  Faculte,
  FaculteCreate,
  FaculteUpdate,
  FaculteFilters,
  Departement,
  DepartementCreate,
  DepartementUpdate,
  DepartementFilters,
  Filiere,
  FiliereCreate,
  FiliereUpdate,
  FiliereFilters,
  Matiere,
  MatiereCreate,
  MatiereUpdate,
  MatiereFilters,
} from '@/types';

// Query keys pour le cache
export const academicKeys = {
  all: ['academic'] as const,
  annees: () => [...academicKeys.all, 'annees'] as const,
  anneeActive: () => [...academicKeys.annees(), 'active'] as const,
  
  facultes: () => [...academicKeys.all, 'facultes'] as const,
  faculte: (id: number) => [...academicKeys.facultes(), id] as const,
  facultesList: (filters?: FaculteFilters) => [...academicKeys.facultes(), 'list', filters] as const,
  faculteStats: (id: number) => [...academicKeys.faculte(id), 'stats'] as const,
  
  departements: () => [...academicKeys.all, 'departements'] as const,
  departement: (id: number) => [...academicKeys.departements(), id] as const,
  departementsList: (filters?: DepartementFilters) => [...academicKeys.departements(), 'list', filters] as const,
  
  filieres: () => [...academicKeys.all, 'filieres'] as const,
  filiere: (id: number) => [...academicKeys.filieres(), id] as const,
  filieresList: (filters?: FiliereFilters) => [...academicKeys.filieres(), 'list', filters] as const,
  
  matieres: () => [...academicKeys.all, 'matieres'] as const,
  matiere: (id: number) => [...academicKeys.matieres(), id] as const,
  matieresList: (filters?: MatiereFilters) => [...academicKeys.matieres(), 'list', filters] as const,
};

// ============== HOOKS FACULTÉS ==============

export function useFacultes(filters?: FaculteFilters) {
  return useQuery({
    queryKey: academicKeys.facultesList(filters),
    queryFn: async () => {
      const response = await academicApi.facultes.getAll(filters);
      return response.data;
    },
  });
}

export function useFaculte(id: number, enabled = true) {
  return useQuery({
    queryKey: academicKeys.faculte(id),
    queryFn: async () => {
      const response = await academicApi.facultes.getById(id);
      return response.data;
    },
    enabled,
  });
}

export function useFaculteStats(id: number, enabled = true) {
  return useQuery({
    queryKey: academicKeys.faculteStats(id),
    queryFn: async () => {
      const response = await academicApi.facultes.getStats(id);
      return response.data;
    },
    enabled,
  });
}

export function useCreateFaculte() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FaculteCreate) => {
      const response = await academicApi.facultes.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicKeys.facultes() });
      toastSuccess('Faculté créée avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la création de la faculté');
    },
  });
}

export function useUpdateFaculte() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FaculteUpdate }) => {
      const response = await academicApi.facultes.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: academicKeys.facultes() });
      queryClient.invalidateQueries({ queryKey: academicKeys.faculte(variables.id) });
      toastSuccess('Faculté modifiée avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la modification');
    },
  });
}

export function useDeleteFaculte() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => academicApi.facultes.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicKeys.facultes() });
      toastSuccess('Faculté supprimée avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la suppression');
    },
  });
}

// ============== HOOKS DÉPARTEMENTS ==============

export function useDepartements(filters?: DepartementFilters) {
  return useQuery({
    queryKey: academicKeys.departementsList(filters),
    queryFn: async () => {
      const response = await academicApi.departements.getAll(filters);
      return response.data;
    },
  });
}

export function useDepartement(id: number, enabled = true) {
  return useQuery({
    queryKey: academicKeys.departement(id),
    queryFn: async () => {
      const response = await academicApi.departements.getById(id);
      return response.data;
    },
    enabled,
  });
}

export function useCreateDepartement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: DepartementCreate) => {
      const response = await academicApi.departements.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicKeys.departements() });
      toastSuccess('Département créé avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la création');
    },
  });
}

export function useUpdateDepartement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DepartementUpdate }) => {
      const response = await academicApi.departements.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: academicKeys.departements() });
      queryClient.invalidateQueries({ queryKey: academicKeys.departement(variables.id) });
      toastSuccess('Département modifié avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la modification');
    },
  });
}

export function useDeleteDepartement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => academicApi.departements.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicKeys.departements() });
      toastSuccess('Département supprimé avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la suppression');
    },
  });
}

// ============== HOOKS FILIÈRES ==============

export function useFilieres(filters?: FiliereFilters) {
  return useQuery({
    queryKey: academicKeys.filieresList(filters),
    queryFn: async () => {
      const response = await academicApi.filieres.getAll(filters);
      return response.data;
    },
  });
}

export function useFiliere(id: number, enabled = true) {
  return useQuery({
    queryKey: academicKeys.filiere(id),
    queryFn: async () => {
      const response = await academicApi.filieres.getById(id);
      return response.data;
    },
    enabled,
  });
}

export function useCreateFiliere() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FiliereCreate) => {
      const response = await academicApi.filieres.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicKeys.filieres() });
      toastSuccess('Filière créée avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la création');
    },
  });
}

export function useUpdateFiliere() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FiliereUpdate }) => {
      const response = await academicApi.filieres.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: academicKeys.filieres() });
      queryClient.invalidateQueries({ queryKey: academicKeys.filiere(variables.id) });
      toastSuccess('Filière modifiée avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la modification');
    },
  });
}

export function useDeleteFiliere() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => academicApi.filieres.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicKeys.filieres() });
      toastSuccess('Filière supprimée avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la suppression');
    },
  });
}

// ============== HOOKS MATIÈRES ==============

export function useMatieres(filters?: MatiereFilters) {
  return useQuery({
    queryKey: academicKeys.matieresList(filters),
    queryFn: async () => {
      const response = await academicApi.matieres.getAll(filters);
      return response.data;
    },
  });
}

export function useMatiere(id: number, enabled = true) {
  return useQuery({
    queryKey: academicKeys.matiere(id),
    queryFn: async () => {
      const response = await academicApi.matieres.getById(id);
      return response.data;
    },
    enabled,
  });
}

export function useCreateMatiere() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: MatiereCreate) => {
      const response = await academicApi.matieres.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicKeys.matieres() });
      toastSuccess('Matière créée avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la création');
    },
  });
}

export function useUpdateMatiere() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: MatiereUpdate }) => {
      const response = await academicApi.matieres.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: academicKeys.matieres() });
      queryClient.invalidateQueries({ queryKey: academicKeys.matiere(variables.id) });
      toastSuccess('Matière modifiée avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la modification');
    },
  });
}

export function useDeleteMatiere() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => academicApi.matieres.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicKeys.matieres() });
      toastSuccess('Matière supprimée avec succès');
    },
    onError: () => {
      toastError('Erreur lors de la suppression');
    },
  });
}