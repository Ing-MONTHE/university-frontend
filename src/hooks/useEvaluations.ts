/**
 * React Query Hooks - Module Évaluations
 * Gestion du state et du cache pour les évaluations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  evaluationApi,
  noteApi,
  resultatApi,
  sessionDeliberationApi,
  typeEvaluationApi,
  decisionJuryApi,
} from '../api/evaluation.api';
import type {
  EvaluationFilters,
  NoteFilters,
  ResultatFilters,
  SessionFilters,
  EvaluationFormData,
  NoteFormData,
  SaisieNotesLotPayload,
  SessionFormData,
  DecisionUpdateData,
} from '../types/evaluation.types';

// ============ TYPES ÉVALUATION ============

export const useTypesEvaluation = () => {
  return useQuery({
    queryKey: ['types-evaluation'],
    queryFn: typeEvaluationApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============ ÉVALUATIONS ============

export const useEvaluations = (filters?: EvaluationFilters) => {
  return useQuery({
    queryKey: ['evaluations', filters],
    queryFn: () => evaluationApi.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEvaluation = (id: number) => {
  return useQuery({
    queryKey: ['evaluations', id],
    queryFn: () => evaluationApi.getById(id),
    enabled: !!id,
  });
};

export const useEvaluationNotes = (evaluationId: number) => {
  return useQuery({
    queryKey: ['evaluations', evaluationId, 'notes'],
    queryFn: () => evaluationApi.getNotes(evaluationId),
    enabled: !!evaluationId,
  });
};

export const useEvaluationStats = (evaluationId: number) => {
  return useQuery({
    queryKey: ['evaluations', evaluationId, 'stats'],
    queryFn: () => evaluationApi.getStats(evaluationId),
    enabled: !!evaluationId,
  });
};

export const useCreateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EvaluationFormData) => evaluationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      toast.success('Évaluation créée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

export const useUpdateEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EvaluationFormData> }) =>
      evaluationApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      queryClient.invalidateQueries({ queryKey: ['evaluations', variables.id] });
      toast.success('Évaluation modifiée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

export const useDeleteEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => evaluationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
      toast.success('Évaluation supprimée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la suppression';
      toast.error(message);
    },
  });
};

// ============ NOTES ============

export const useNotes = (filters?: NoteFilters) => {
  return useQuery({
    queryKey: ['notes', filters],
    queryFn: () => noteApi.getAll(filters),
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoteFormData) => noteApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({
        queryKey: ['evaluations', variables.evaluation, 'notes'],
      });
      toast.success('Note enregistrée');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la saisie';
      toast.error(message);
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NoteFormData> }) =>
      noteApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['evaluations'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

export const useSaisieNotesLot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ evaluationId, notes }: { evaluationId: number; notes: SaisieNotesLotPayload }) =>
      evaluationApi.saisieNotesLot(evaluationId, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({
        queryKey: ['evaluations', variables.evaluationId, 'notes'],
      });
      queryClient.invalidateQueries({
        queryKey: ['evaluations', variables.evaluationId, 'stats'],
      });

      if (data.errors && data.errors.length > 0) {
        toast.error(`${data.total_processed} notes enregistrées, ${data.errors.length} erreur(s)`);
      } else {
        toast.success(`${data.total_processed} notes enregistrées avec succès`);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la saisie';
      toast.error(message);
    },
  });
};

// ============ RÉSULTATS ============

export const useResultats = (filters?: ResultatFilters) => {
  return useQuery({
    queryKey: ['resultats', filters],
    queryFn: () => resultatApi.getAll(filters),
  });
};

export const useStudentResults = (etudiantId: number) => {
  return useQuery({
    queryKey: ['resultats', 'etudiant', etudiantId],
    queryFn: () => resultatApi.getByEtudiant(etudiantId),
    enabled: !!etudiantId,
  });
};

export const useStudentBulletin = (etudiantId: number, anneeAcademiqueId?: number) => {
  return useQuery({
    queryKey: ['bulletin', etudiantId, anneeAcademiqueId],
    queryFn: () => resultatApi.getBulletin(etudiantId, anneeAcademiqueId),
    enabled: !!etudiantId,
  });
};

// ============ SESSIONS DÉLIBÉRATION ============

export const useSessions = (filters?: SessionFilters) => {
  return useQuery({
    queryKey: ['sessions-deliberation', filters],
    queryFn: () => sessionDeliberationApi.getAll(filters),
  });
};

export const useSession = (id: number) => {
  return useQuery({
    queryKey: ['sessions-deliberation', id],
    queryFn: () => sessionDeliberationApi.getById(id),
    enabled: !!id,
  });
};

export const useSessionDecisions = (sessionId: number) => {
  return useQuery({
    queryKey: ['sessions-deliberation', sessionId, 'decisions'],
    queryFn: () => sessionDeliberationApi.getDecisions(sessionId),
    enabled: !!sessionId,
  });
};

export const useSessionStats = (sessionId: number) => {
  return useQuery({
    queryKey: ['sessions-deliberation', sessionId, 'stats'],
    queryFn: () => sessionDeliberationApi.getStatistiques(sessionId),
    enabled: !!sessionId,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SessionFormData) => sessionDeliberationApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation'] });
      toast.success('Session créée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la création';
      toast.error(message);
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SessionFormData> }) =>
      sessionDeliberationApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation'] });
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation', variables.id] });
      toast.success('Session modifiée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};

export const useGenererDecisions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => sessionDeliberationApi.genererDecisions(sessionId),
    onSuccess: (data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation', sessionId, 'decisions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation', sessionId, 'stats'] });
      
      if (data.erreurs && data.erreurs.length > 0) {
        toast.success(
          `${data.total} décisions générées, ${data.erreurs.length} erreur(s)`
        );
      } else {
        toast.success(`${data.total} décisions générées avec succès`);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la génération';
      toast.error(message);
    },
  });
};

export const useValiderSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => sessionDeliberationApi.valider(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation'] });
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation', sessionId] });
      toast.success('Session validée avec succès');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la validation';
      toast.error(message);
    },
  });
};

export const useUpdateDecision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DecisionUpdateData }) =>
      decisionJuryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessions-deliberation'] });
      if (variables.data.session) {
        queryClient.invalidateQueries({
          queryKey: ['sessions-deliberation', variables.data.session, 'decisions'],
        });
      }
      toast.success('Décision modifiée');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erreur lors de la modification';
      toast.error(message);
    },
  });
};