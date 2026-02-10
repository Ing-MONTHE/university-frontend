import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { batimentApi, salleApi, creneauApi, coursApi, conflitApi } from '@/api/schedule.api';
import type {
  Batiment,
  BatimentCreate,
  BatimentUpdate,
  BatimentFilters,
  Salle,
  SalleCreate,
  SalleUpdate,
  SalleFilters,
  Creneau,
  CreneauCreate,
  CreneauUpdate,
  CreneauFilters,
  Cours,
  CoursCreate,
  CoursUpdate,
  CoursFilters,
  ConflitSalle,
  ConflitSalleUpdate,
  ConflitFilters,
} from '@/types/schedule.types';

// ============== BÂTIMENTS ==============
export const useBatiments = (filters?: BatimentFilters) => {
  return useQuery({
    queryKey: ['batiments', filters],
    queryFn: () => batimentApi.getAll(filters),
  });
};

export const useBatiment = (id: number) => {
  return useQuery({
    queryKey: ['batiment', id],
    queryFn: () => batimentApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateBatiment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BatimentCreate) => batimentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batiments'] });
    },
  });
};

export const useUpdateBatiment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BatimentUpdate }) =>
      batimentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batiments'] });
    },
  });
};

export const useDeleteBatiment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => batimentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batiments'] });
    },
  });
};

// ============== SALLES ==============
export const useSalles = (filters?: SalleFilters) => {
  return useQuery({
    queryKey: ['salles', filters],
    queryFn: () => salleApi.getAll(filters),
  });
};

export const useSalle = (id: number) => {
  return useQuery({
    queryKey: ['salle', id],
    queryFn: () => salleApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSalle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SalleCreate) => salleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salles'] });
    },
  });
};

export const useUpdateSalle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SalleUpdate }) =>
      salleApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salles'] });
    },
  });
};

export const useDeleteSalle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => salleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salles'] });
    },
  });
};

// ============== CRÉNEAUX ==============
export const useCreneaux = (filters?: CreneauFilters) => {
  return useQuery({
    queryKey: ['creneaux', filters],
    queryFn: () => creneauApi.getAll(filters),
  });
};

export const useCreneau = (id: number) => {
  return useQuery({
    queryKey: ['creneau', id],
    queryFn: () => creneauApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCreneau = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreneauCreate) => creneauApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creneaux'] });
    },
  });
};

export const useUpdateCreneau = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreneauUpdate }) =>
      creneauApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creneaux'] });
    },
  });
};

export const useDeleteCreneau = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => creneauApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creneaux'] });
    },
  });
};

// ============== COURS ==============
export const useCours = (filters?: CoursFilters) => {
  return useQuery({
    queryKey: ['cours', filters],
    queryFn: () => coursApi.getAll(filters),
  });
};

export const useCoursById = (id: number) => {
  return useQuery({
    queryKey: ['cours', id],
    queryFn: () => coursApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCours = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CoursCreate) => coursApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cours'] });
      queryClient.invalidateQueries({ queryKey: ['conflits'] });
    },
  });
};

export const useUpdateCours = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CoursUpdate }) =>
      coursApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cours'] });
      queryClient.invalidateQueries({ queryKey: ['conflits'] });
    },
  });
};

export const useDeleteCours = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => coursApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cours'] });
    },
  });
};

export const useEmploiTemps = (filiereId: number, semestre?: number) => {
  return useQuery({
    queryKey: ['emploi-temps', filiereId, semestre],
    queryFn: () => coursApi.getEmploiTemps(filiereId, { semestre }),
    enabled: !!filiereId,
  });
};

// ============== CONFLITS ==============
export const useConflits = (filters?: ConflitFilters) => {
  return useQuery({
    queryKey: ['conflits', filters],
    queryFn: () => conflitApi.getAll(filters),
  });
};

export const useResolveConflit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ConflitSalleUpdate }) =>
      conflitApi.resolve(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conflits'] });
    },
  });
};