import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import libraryApi from '@/api/library.api';
import type {
  Livre,
  LivreFormData,
  LivreFilters,
  Emprunt,
  EmpruntFormData,
  EmpruntRetourData,
  EmpruntFilters,
  CategoriesLivre,
  CategoriesLivreFormData,
  BibliothequeStats,
} from '@/types/library.types';

// ==================== CATÉGORIES ====================
export const useCategories = () => {
  return useQuery<CategoriesLivre[]>({
    queryKey: ['categories'],
    queryFn: () => libraryApi.categories.getAll().then((res) => res.data),
  });
};

export const useCreateCategorie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CategoriesLivreFormData) => 
      libraryApi.categories.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategorie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoriesLivreFormData> }) =>
      libraryApi.categories.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategorie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => libraryApi.categories.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// ==================== LIVRES ====================
export const useLivres = (filters?: LivreFilters) => {
  return useQuery<Livre[]>({
    queryKey: ['livres', filters],
    queryFn: () => libraryApi.livres.getAll(filters).then((res) => res.data),
  });
};

export const useLivre = (id: number) => {
  return useQuery<Livre>({
    queryKey: ['livre', id],
    queryFn: () => libraryApi.livres.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateLivre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LivreFormData) => libraryApi.livres.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livres'] });
      queryClient.invalidateQueries({ queryKey: ['library-stats'] });
    },
  });
};

export const useUpdateLivre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LivreFormData> }) =>
      libraryApi.livres.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['livres'] });
      queryClient.invalidateQueries({ queryKey: ['livre', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['library-stats'] });
    },
  });
};

export const useDeleteLivre = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => libraryApi.livres.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livres'] });
      queryClient.invalidateQueries({ queryKey: ['library-stats'] });
    },
  });
};

export const useLivresDisponibles = () => {
  return useQuery<Livre[]>({
    queryKey: ['livres-disponibles'],
    queryFn: () => libraryApi.livres.getDisponibles().then((res) => res.data),
  });
};

export const useLivreHistorique = (id: number) => {
  return useQuery<Emprunt[]>({
    queryKey: ['livre-historique', id],
    queryFn: () => libraryApi.livres.getHistorique(id).then((res) => res.data),
    enabled: !!id,
  });
};

// ==================== EMPRUNTS ====================
export const useEmprunts = (filters?: EmpruntFilters) => {
  return useQuery<Emprunt[]>({
    queryKey: ['emprunts', filters],
    queryFn: () => libraryApi.emprunts.getAll(filters).then((res) => res.data),
  });
};

export const useEmprunt = (id: number) => {
  return useQuery<Emprunt>({
    queryKey: ['emprunt', id],
    queryFn: () => libraryApi.emprunts.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateEmprunt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EmpruntFormData) => libraryApi.emprunts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprunts'] });
      queryClient.invalidateQueries({ queryKey: ['livres'] });
      queryClient.invalidateQueries({ queryKey: ['library-stats'] });
    },
  });
};

export const useUpdateEmprunt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EmpruntFormData> }) =>
      libraryApi.emprunts.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['emprunts'] });
      queryClient.invalidateQueries({ queryKey: ['emprunt', variables.id] });
    },
  });
};

export const useDeleteEmprunt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => libraryApi.emprunts.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprunts'] });
      queryClient.invalidateQueries({ queryKey: ['livres'] });
      queryClient.invalidateQueries({ queryKey: ['library-stats'] });
    },
  });
};

export const useRetournerEmprunt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: EmpruntRetourData }) =>
      libraryApi.emprunts.retourner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emprunts'] });
      queryClient.invalidateQueries({ queryKey: ['livres'] });
      queryClient.invalidateQueries({ queryKey: ['library-stats'] });
    },
  });
};

export const useEmpruntsEnCours = () => {
  return useQuery<Emprunt[]>({
    queryKey: ['emprunts-en-cours'],
    queryFn: () => libraryApi.emprunts.getEnCours().then((res) => res.data),
  });
};

export const useEmpruntsEnRetard = () => {
  return useQuery<Emprunt[]>({
    queryKey: ['emprunts-en-retard'],
    queryFn: () => libraryApi.emprunts.getEnRetard().then((res) => res.data),
  });
};

export const useEmpruntsHistorique = () => {
  return useQuery<Emprunt[]>({
    queryKey: ['emprunts-historique'],
    queryFn: () => libraryApi.emprunts.getHistorique().then((res) => res.data),
  });
};

// ==================== STATISTIQUES ====================
export const useLibraryStats = () => {
  return useQuery<BibliothequeStats>({
    queryKey: ['library-stats'],
    queryFn: () => libraryApi.statistiques.getStatistiques().then((res) => res.data),
  });
};