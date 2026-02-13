/**
 * React Query hooks pour le module Évaluations & Délibérations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  typeEvaluationApi,
  evaluationApi,
  noteApi,
  resultatApi,
  sessionDeliberationApi,
  decisionJuryApi,
} from '@/api/evaluation.api';
import type {
  TypeEvaluationCreate,
  TypeEvaluationUpdate,
  TypeEvaluationFilters,
  EvaluationCreate,
  EvaluationUpdate,
  EvaluationFilters,
  NoteUpdate,
  NoteFilters,
  NoteSaisieLot,
  SessionDeliberationCreate,
  SessionDeliberationUpdate,
  SessionDeliberationFilters,
  DecisionJuryUpdate,
} from '@/types/evaluation.types';

// ============== QUERY KEYS ==============

export const evaluationKeys = {
  // Types d'évaluation
  typesEvaluation: {
    all: ['types-evaluation'] as const,
    lists: () => [...evaluationKeys.typesEvaluation.all, 'list'] as const,
    list: (filters?: TypeEvaluationFilters) => [...evaluationKeys.typesEvaluation.lists(), filters] as const,
    details: () => [...evaluationKeys.typesEvaluation.all, 'detail'] as const,
    detail: (id: number) => [...evaluationKeys.typesEvaluation.details(), id] as const,
  },
  
  // Évaluations
  evaluations: {
    all: ['evaluations'] as const,
    lists: () => [...evaluationKeys.evaluations.all, 'list'] as const,
    list: (filters?: EvaluationFilters) => [...evaluationKeys.evaluations.lists(), filters] as const,
    details: () => [...evaluationKeys.evaluations.all, 'detail'] as const,
    detail: (id: number) => [...evaluationKeys.evaluations.details(), id] as const,
    stats: (id: number) => [...evaluationKeys.evaluations.all, 'stats', id] as const,
  },
  
  // Notes
  notes: {
    all: ['notes'] as const,
    lists: () => [...evaluationKeys.notes.all, 'list'] as const,
    list: (filters?: NoteFilters) => [...evaluationKeys.notes.lists(), filters] as const,
    byEvaluation: (evaluationId: number) => [...evaluationKeys.notes.all, 'evaluation', evaluationId] as const,
  },
  
  // Résultats
  resultats: {
    all: ['resultats'] as const,
    etudiant: (etudiantId: number, params?: any) => [...evaluationKeys.resultats.all, 'etudiant', etudiantId, params] as const,
    bulletin: (etudiantId: number, params: any) => [...evaluationKeys.resultats.all, 'bulletin', etudiantId, params] as const,
    filiere: (params: any) => [...evaluationKeys.resultats.all, 'filiere', params] as const,
    evolution: (etudiantId: number, matiereId: number) => [...evaluationKeys.resultats.all, 'evolution', etudiantId, matiereId] as const,
  },
  
  // Sessions de délibération
  sessions: {
    all: ['sessions-deliberation'] as const,
    lists: () => [...evaluationKeys.sessions.all, 'list'] as const,
    list: (filters?: SessionDeliberationFilters) => [...evaluationKeys.sessions.lists(), filters] as const,
    details: () => [...evaluationKeys.sessions.all, 'detail'] as const,
    detail: (id: number) => [...evaluationKeys.sessions.details(), id] as const,
  },
};

// ============== TYPES D'ÉVALUATION ==============

export const useTypesEvaluation = (filters?: TypeEvaluationFilters) => {
  return useQuery({
    queryKey: evaluationKeys.typesEvaluation.list(filters),
    queryFn: () => typeEvaluationApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTypeEvaluation = (id: number) => {
  return useQuery({
    queryKey: evaluationKeys.typesEvaluation.detail(id),
    queryFn: () => typeEvaluationApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateTypeEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TypeEvaluationCreate) => typeEvaluationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.typesEvaluation.lists() });
      toast.success("Type d'évaluation créé avec succès");
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création');
    },
  });
};

export const useUpdateTypeEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TypeEvaluationUpdate }) =>
      typeEvaluationApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.typesEvaluation.lists() });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.typesEvaluation.detail(variables.id) });
      toast.success("Type d'évaluation modifié avec succès");
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la modification');
    },
  });
};

export const useDeleteTypeEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => typeEvaluationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.typesEvaluation.lists() });
      toast.success("Type d'évaluation supprimé avec succès");
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression');
    },
  });
};

// ============== ÉVALUATIONS ==============

export const useEvaluations = (filters?: EvaluationFilters) => {
  return useQuery({
    queryKey: evaluationKeys.evaluations.list(filters),
    queryFn: () => evaluationApi.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEvaluation = (id: number) => {
  return useQuery({
    queryKey: evaluationKeys.evaluations.detail(id),
    queryFn: () => evaluationApi.getById(id),
    enabled: !!id,
  });
};

export const useEvaluationStats = (id: number) => {
  return useQuery({
    queryKey: evaluationKeys.evaluations.stats(id),
    queryFn: () => evaluationApi.getStats(id),
    enabled: !!id,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
  });
};

export const useCreateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EvaluationCreate) => evaluationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.evaluations.lists() });
      toast.success('Évaluation créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création');
    },
  });
};

export const useUpdateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EvaluationUpdate }) =>
      evaluationApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.evaluations.lists() });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.evaluations.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.evaluations.stats(variables.id) });
      toast.success('Évaluation modifiée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la modification');
    },
  });
};

export const useDeleteEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => evaluationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.evaluations.lists() });
      toast.success('Évaluation supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression');
    },
  });
};

// ============== NOTES ==============

export const useNotes = (filters?: NoteFilters) => {
  return useQuery({
    queryKey: evaluationKeys.notes.list(filters),
    queryFn: () => noteApi.getAll(filters),
  });
};

export const useNotesByEvaluation = (evaluationId: number) => {
  return useQuery({
    queryKey: evaluationKeys.notes.byEvaluation(evaluationId),
    queryFn: () => noteApi.getByEvaluation(evaluationId),
    enabled: !!evaluationId,
    staleTime: 30000, // 30 secondes
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NoteUpdate }) => noteApi.update(id, data),
    onSuccess: (data) => {
      // Invalider les listes de notes
      queryClient.invalidateQueries({ queryKey: evaluationKeys.notes.lists() });
      if (data.evaluation) {
        queryClient.invalidateQueries({ queryKey: evaluationKeys.notes.byEvaluation(data.evaluation) });
        queryClient.invalidateQueries({ queryKey: evaluationKeys.evaluations.stats(data.evaluation) });
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la mise à jour de la note');
    },
  });
};

export const useSaisieLotNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoteSaisieLot) => noteApi.saisieLot(data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.notes.lists() });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.notes.byEvaluation(variables.evaluation_id) });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.evaluations.stats(variables.evaluation_id) });
      toast.success(`${result.created + result.updated} notes enregistrées avec succès`);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la sauvegarde des notes');
    },
  });
};

// ============== RÉSULTATS & BULLETINS ==============

export const useNotesEtudiant = (etudiantId: number, params?: { semestre?: number; annee_academique?: number }) => {
  return useQuery({
    queryKey: evaluationKeys.resultats.etudiant(etudiantId, params),
    queryFn: () => resultatApi.getNotesEtudiant(etudiantId, params),
    enabled: !!etudiantId,
  });
};

export const useBulletinEtudiant = (
  etudiantId: number,
  params: { semestre: number; annee_academique: number }
) => {
  return useQuery({
    queryKey: evaluationKeys.resultats.bulletin(etudiantId, params),
    queryFn: () => resultatApi.getBulletinEtudiant(etudiantId, params),
    enabled: !!etudiantId && !!params.semestre && !!params.annee_academique,
  });
};

export const useResultatsFiliere = (params: {
  filiere: number;
  semestre: number;
  annee_academique?: number;
}) => {
  return useQuery({
    queryKey: evaluationKeys.resultats.filiere(params),
    queryFn: () => resultatApi.getResultatsFiliere(params),
    enabled: !!params.filiere && !!params.semestre,
  });
};

export const useEvolutionNotes = (etudiantId: number, matiereId: number) => {
  return useQuery({
    queryKey: evaluationKeys.resultats.evolution(etudiantId, matiereId),
    queryFn: () => resultatApi.getEvolutionNotes(etudiantId, matiereId),
    enabled: !!etudiantId && !!matiereId,
  });
};

export const useExportBulletinPDF = () => {
  return useMutation({
    mutationFn: ({
      etudiantId,
      params,
    }: {
      etudiantId: number;
      params: { semestre: number; annee_academique: number };
    }) => resultatApi.exportBulletinPDF(etudiantId, params),
    onSuccess: (blob) => {
      // Télécharger le PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Bulletin téléchargé avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors du téléchargement du bulletin');
    },
  });
};

export const useExportResultatsExcel = () => {
  return useMutation({
    mutationFn: (params: { filiere: number; semestre: number; annee_academique?: number }) =>
      resultatApi.exportResultatsExcel(params),
    onSuccess: (blob) => {
      // Télécharger l'Excel
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resultats-${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Résultats téléchargés avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors du téléchargement des résultats');
    },
  });
};

// ============== SESSIONS DE DÉLIBÉRATION ==============

export const useSessionsDeliberation = (filters?: SessionDeliberationFilters) => {
  return useQuery({
    queryKey: evaluationKeys.sessions.list(filters),
    queryFn: () => sessionDeliberationApi.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSessionDeliberation = (id: number) => {
  return useQuery({
    queryKey: evaluationKeys.sessions.detail(id),
    queryFn: () => sessionDeliberationApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSessionDeliberation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SessionDeliberationCreate) => sessionDeliberationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.sessions.lists() });
      toast.success('Session de délibération créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création');
    },
  });
};

export const useUpdateSessionDeliberation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SessionDeliberationUpdate }) =>
      sessionDeliberationApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.sessions.lists() });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.sessions.detail(variables.id) });
      toast.success('Session modifiée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la modification');
    },
  });
};

export const useDeleteSessionDeliberation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionDeliberationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.sessions.lists() });
      toast.success('Session supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression');
    },
  });
};

export const useValiderSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionDeliberationApi.valider(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.sessions.lists() });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.sessions.detail(id) });
      toast.success('Session validée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la validation');
    },
  });
};

export const useCloturerSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionDeliberationApi.cloturer(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.sessions.lists() });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.sessions.detail(id) });
      toast.success('Session clôturée avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la clôture');
    },
  });
};

export const useGenererPVDeliberation = () => {
  return useMutation({
    mutationFn: (id: number) => sessionDeliberationApi.genererPV(id),
    onSuccess: (blob) => {
      // Télécharger le PV
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pv-deliberation-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PV de délibération téléchargé avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la génération du PV');
    },
  });
};

// ============== DÉCISIONS JURY ==============

export const useUpdateDecisionJury = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DecisionJuryUpdate }) =>
      decisionJuryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.sessions.all });
      toast.success('Décision mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la mise à jour');
    },
  });
};