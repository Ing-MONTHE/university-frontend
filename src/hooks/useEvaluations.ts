/**
 * Hooks React Query pour le module Évaluations
 * VERSION COMPLÈTE avec tous les hooks nécessaires
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  evaluationApi,
  noteApi,
  resultatApi,
  sessionDeliberationApi,
  decisionJuryApi,
} from '@/api/evaluation.api';
import type {
  Evaluation,
  EvaluationFormData,
  EvaluationFilters,
  SaisieNotesLotPayload,
  CalculerMoyennePayload,
} from '@/types/evaluation.types';

// ============ QUERY KEYS ============

export const evaluationKeys = {
  all: ['evaluations'] as const,
  lists: () => [...evaluationKeys.all, 'list'] as const,
  list: (filters?: EvaluationFilters) => [...evaluationKeys.lists(), { filters }] as const,
  details: () => [...evaluationKeys.all, 'detail'] as const,
  detail: (id: number) => [...evaluationKeys.details(), id] as const,
  stats: (id: number) => [...evaluationKeys.all, 'stats', id] as const,
  notes: (id: number) => [...evaluationKeys.all, 'notes', id] as const,
  types: () => [...evaluationKeys.all, 'types'] as const,
};

export const resultatKeys = {
  all: ['resultats'] as const,
  bulletin: (etudiantId: number, anneeAcademiqueId?: number) =>
    [...resultatKeys.all, 'bulletin', etudiantId, anneeAcademiqueId] as const,
};

export const sessionKeys = {
  all: ['sessions-deliberation'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters?: any) => [...sessionKeys.lists(), { filters }] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: number) => [...sessionKeys.details(), id] as const,
  decisions: (id: number) => [...sessionKeys.all, 'decisions', id] as const,
};

// ============ EVALUATIONS ============

/**
 * Hook pour récupérer la liste des types d'évaluations
 */
export function useTypesEvaluations() {
  return useQuery({
    queryKey: evaluationKeys.types(),
    queryFn: () => evaluationApi.getTypesEvaluations(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook pour récupérer la liste des évaluations
 */
export function useEvaluations(filters?: EvaluationFilters) {
  return useQuery({
    queryKey: evaluationKeys.list(filters),
    queryFn: () => evaluationApi.getEvaluations(filters),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook pour récupérer une évaluation
 */
export function useEvaluation(id: number, options?: UseQueryOptions<Evaluation>) {
  return useQuery({
    queryKey: evaluationKeys.detail(id),
    queryFn: () => evaluationApi.getEvaluation(id),
    enabled: !!id,
    ...options,
  });
}

/**
 * Hook pour récupérer les statistiques d'une évaluation
 */
export function useEvaluationStats(id: number) {
  return useQuery({
    queryKey: evaluationKeys.stats(id),
    queryFn: () => evaluationApi.getEvaluationStats(id),
    enabled: !!id,
  });
}

/**
 * Hook pour récupérer les notes d'une évaluation
 */
export function useEvaluationNotes(id: number) {
  return useQuery({
    queryKey: evaluationKeys.notes(id),
    queryFn: () => evaluationApi.getEvaluationNotes(id),
    enabled: !!id,
  });
}

/**
 * Hook pour créer une évaluation
 */
export function useCreateEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EvaluationFormData) => evaluationApi.createEvaluation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.lists() });
      toast.success('Évaluation créée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
}

/**
 * Hook pour modifier une évaluation
 */
export function useUpdateEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EvaluationFormData> }) =>
      evaluationApi.updateEvaluation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.detail(variables.id) });
      toast.success('Évaluation modifiée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
}

/**
 * Hook pour supprimer une évaluation
 */
export function useDeleteEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => evaluationApi.deleteEvaluation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.lists() });
      toast.success('Évaluation supprimée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
}

/**
 * Hook pour dupliquer une évaluation
 */
export function useDuplicateEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, titre, date }: { id: number; titre: string; date: string }) =>
      evaluationApi.duplicateEvaluation(id, titre, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.lists() });
      toast.success('Évaluation dupliquée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la duplication';
      toast.error(message);
    },
  });
}

/**
 * ✨ NOUVEAU: Hook pour la saisie de notes en lot
 */
export function useSaisieNotesLot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ evaluationId, payload }: { evaluationId: number; payload: SaisieNotesLotPayload }) =>
      evaluationApi.saisieNotesLot(evaluationId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: evaluationKeys.notes(variables.evaluationId) });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.stats(variables.evaluationId) });
      queryClient.invalidateQueries({ queryKey: evaluationKeys.detail(variables.evaluationId) });
      
      if (data.errors && data.errors.length > 0) {
        toast.error(`${data.total_processed} notes enregistrées avec ${data.errors.length} erreur(s)`);
      } else {
        toast.success(`${data.total_processed} notes enregistrées avec succès`);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la saisie des notes';
      toast.error(message);
    },
  });
}

// ============ NOTES ============

/**
 * Hook pour créer une note
 */
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => noteApi.createNote(data),
    onSuccess: (_, variables) => {
      // Invalider toutes les queries de notes pour cette évaluation
      if (variables.evaluation) {
        queryClient.invalidateQueries({ queryKey: evaluationKeys.notes(variables.evaluation) });
      }
      // Invalider aussi toutes les queries de notes en général
      queryClient.invalidateQueries({ queryKey: [...evaluationKeys.all, 'notes'] });
      toast.success('Note enregistrée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de l\'enregistrement';
      toast.error(message);
    },
  });
}

/**
 * Hook pour modifier une note
 */
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => noteApi.updateNote(id, data),
    onSuccess: (_, variables) => {
      // Invalider toutes les queries de notes pour cette évaluation
      if (variables.data.evaluation) {
        queryClient.invalidateQueries({ queryKey: evaluationKeys.notes(variables.data.evaluation) });
      }
      // Invalider aussi toutes les queries de notes en général
      queryClient.invalidateQueries({ queryKey: [...evaluationKeys.all, 'notes'] });
      toast.success('Note modifiée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
}

// ============ RESULTATS ============

/**
 * ✨ NOUVEAU: Hook pour calculer la moyenne d'un étudiant
 */
export function useCalculerMoyenne() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CalculerMoyennePayload) => resultatApi.calculerMoyenne(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: resultatKeys.all });
      toast.success(`Moyenne calculée: ${data.moyenne}/20`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors du calcul';
      toast.error(message);
    },
  });
}

/**
 * ✨ NOUVEAU: Hook pour récupérer le bulletin d'un étudiant
 */
export function useBulletinEtudiant(etudiantId: number, anneeAcademiqueId?: number) {
  return useQuery({
    queryKey: resultatKeys.bulletin(etudiantId, anneeAcademiqueId),
    queryFn: () => resultatApi.getBulletin(etudiantId, anneeAcademiqueId),
    enabled: !!etudiantId,
  });
}

// ============ SESSIONS DE DELIBERATION ============

/**
 * Hook pour récupérer la liste des sessions
 */
export function useSessions(filters?: any) {
  return useQuery({
    queryKey: sessionKeys.list(filters),
    queryFn: () => sessionDeliberationApi.getSessions(filters),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook pour récupérer une session
 */
export function useSession(id: number) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: () => sessionDeliberationApi.getSession(id),
    enabled: !!id,
  });
}

/**
 * Hook pour récupérer les décisions d'une session
 */
export function useSessionDecisions(sessionId: number) {
  return useQuery({
    queryKey: sessionKeys.decisions(sessionId),
    queryFn: () => sessionDeliberationApi.getDecisions(sessionId),
    enabled: !!sessionId,
  });
}

/**
 * Hook pour créer une session
 */
export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => sessionDeliberationApi.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success('Session créée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(message);
    },
  });
}

/**
 * Hook pour modifier une session
 */
export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      sessionDeliberationApi.updateSession(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.id) });
      toast.success('Session modifiée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
}

/**
 * Hook pour supprimer une session
 */
export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionDeliberationApi.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success('Session supprimée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
}

/**
 * ✨ NOUVEAU (AMÉLIORÉ): Hook pour générer les décisions automatiquement
 */
export function useGenererDecisions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => sessionDeliberationApi.genererDecisions(sessionId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.decisions(variables) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables) });
      
      if (data.erreurs && data.erreurs.length > 0) {
        toast.error(`${data.total} décisions générées avec ${data.erreurs.length} erreur(s)`);
      } else {
        toast.success(`${data.total} décisions générées avec succès`);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la génération';
      toast.error(message);
    },
  });
}

/**
 * Hook pour clôturer une session
 */
export function useCloturerSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => sessionDeliberationApi.cloturerSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(sessionId) });
      toast.success('Session clôturée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la clôture';
      toast.error(message);
    },
  });
}

/**
 * Hook pour valider une session
 */
export function useValiderSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => sessionDeliberationApi.validerSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(sessionId) });
      toast.success('Session validée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la validation';
      toast.error(message);
    },
  });
}

// ============ DECISIONS JURY ============

/**
 * Hook pour modifier une décision
 */
export function useUpdateDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      decisionJuryApi.updateDecision(id, data),
    onSuccess: (_, variables) => {
      // Invalider les décisions de la session si on a l'ID de session
      if (variables.data.session) {
        queryClient.invalidateQueries({ queryKey: sessionKeys.decisions(variables.data.session) });
      }
      // Invalider aussi toutes les queries de décisions
      queryClient.invalidateQueries({ queryKey: [...sessionKeys.all, 'decisions'] });
      toast.success('Décision modifiée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
}