/**
 * React Query Hooks pour le module Évaluations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as evaluationApi from '@/api/evaluation.api';
import type {
  EvaluationFilters,
  EvaluationFormData,
  NoteFilters,
  NoteFormData,
  SaisieNotesLotPayload,
  ResultatFilters,
  CalculerMoyennePayload,
} from '@/types/evaluation.types';

// ============ TYPES D'ÉVALUATIONS ============

export const useTypesEvaluations = () => {
  return useQuery({
    queryKey: ['types-evaluations'],
    queryFn: evaluationApi.getTypesEvaluations,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============ ÉVALUATIONS ============

export const useEvaluations = (filters?: EvaluationFilters) => {
  return useQuery({
    queryKey: ['evaluations', filters],
    queryFn: () => evaluationApi.getEvaluations(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEvaluation = (id: number) => {
  return useQuery({
    queryKey: ['evaluations', id],
    queryFn: () => evaluationApi.getEvaluationById(id),
    enabled: !!id,
  });
};

export const useCreateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EvaluationFormData) => evaluationApi.createEvaluation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
    },
  });
};

export const useUpdateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EvaluationFormData> }) =>
      evaluationApi.updateEvaluation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      queryClient.invalidateQueries({ queryKey: ['evaluations', variables.id] });
    },
  });
};

export const useDeleteEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => evaluationApi.deleteEvaluation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
    },
  });
};

// ============ NOTES ============

export const useNotes = (filters?: NoteFilters) => {
  return useQuery({
    queryKey: ['notes', filters],
    queryFn: () => evaluationApi.getNotes(filters),
    enabled: !!filters?.evaluation,
  });
};

export const useNotesByEvaluation = (evaluationId: number) => {
  return useQuery({
    queryKey: ['notes', 'evaluation', evaluationId],
    queryFn: () => evaluationApi.getNotesByEvaluation(evaluationId),
    enabled: !!evaluationId,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoteFormData) => evaluationApi.createNote(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', 'evaluation', variables.evaluation] });
      queryClient.invalidateQueries({ queryKey: ['evaluation-stats'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NoteFormData> }) =>
      evaluationApi.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['evaluation-stats'] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => evaluationApi.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['evaluation-stats'] });
    },
  });
};

// ============ SAISIE EN LOT ============

export const useSaisieNotesLot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ evaluationId, payload }: { evaluationId: number; payload: SaisieNotesLotPayload }) =>
      evaluationApi.saisieNotesLot(evaluationId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes', 'evaluation', variables.evaluationId] });
      queryClient.invalidateQueries({ queryKey: ['evaluation-stats', variables.evaluationId] });
      queryClient.invalidateQueries({ queryKey: ['evaluations', variables.evaluationId] });
    },
  });
};

// ============ STATISTIQUES ============

export const useEvaluationStats = (evaluationId: number) => {
  return useQuery({
    queryKey: ['evaluation-stats', evaluationId],
    queryFn: () => evaluationApi.getEvaluationStats(evaluationId),
    enabled: !!evaluationId,
    staleTime: 30 * 1000, // 30 secondes
  });
};

// ============ RÉSULTATS ============

export const useResultats = (filters?: ResultatFilters) => {
  return useQuery({
    queryKey: ['resultats', filters],
    queryFn: () => evaluationApi.getResultats(filters),
  });
};

export const useCalculerMoyenne = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CalculerMoyennePayload) => evaluationApi.calculerMoyenne(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resultats'] });
      queryClient.invalidateQueries({ queryKey: ['bulletin'] });
    },
  });
};

export const useBulletinEtudiant = (etudiantId: number, anneeAcademiqueId?: number) => {
  return useQuery({
    queryKey: ['bulletin', etudiantId, anneeAcademiqueId],
    queryFn: () => evaluationApi.getBulletinEtudiant(etudiantId, anneeAcademiqueId),
    enabled: !!etudiantId,
  });
};

// ============ SESSIONS DE DÉLIBÉRATION ============

export const useSessionsDeliberation = (filters?: any) => {
  return useQuery({
    queryKey: ['sessions-deliberation', filters],
    queryFn: () => evaluationApi.getSessionsDeliberation(filters),
  });
};

export const useSessionDeliberation = (id: number) => {
  return useQuery({
    queryKey: ['sessions-deliberation', id],
    queryFn: () => evaluationApi.getSessionDeliberationById(id),
    enabled: !!id,
  });
};

export const useCreateSessionDeliberation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => evaluationApi.createSessionDeliberation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation'] });
    },
  });
};

export const useUpdateSessionDeliberation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      evaluationApi.updateSessionDeliberation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation'] });
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation', variables.id] });
    },
  });
};

export const useDeleteSessionDeliberation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => evaluationApi.deleteSessionDeliberation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation'] });
    },
  });
};

// ============ DÉCISIONS JURY ============

export const useGenererDecisions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => evaluationApi.genererDecisions(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions-jury'] });
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation'] });
      queryClient.invalidateQueries({ queryKey: ['statistiques-session'] });
    },
  });
};

export const useStatistiquesSession = (sessionId: number) => {
  return useQuery({
    queryKey: ['statistiques-session', sessionId],
    queryFn: () => evaluationApi.getStatistiquesSession(sessionId),
    enabled: !!sessionId,
  });
};

export const useDecisionsJury = (sessionId: number) => {
  return useQuery({
    queryKey: ['decisions-jury', sessionId],
    queryFn: () => evaluationApi.getDecisionsJury(sessionId),
    enabled: !!sessionId,
  });
};

export const useUpdateDecisionJury = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      evaluationApi.updateDecisionJury(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions-jury'] });
      queryClient.invalidateQueries({ queryKey: ['statistiques-session'] });
    },
  });
};