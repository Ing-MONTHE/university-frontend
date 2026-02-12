/**
 * Page: Formulaire Évaluation
 * Création et édition d'une évaluation
 */

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import {
  useCreateEvaluation,
  useUpdateEvaluation,
  useEvaluation,
  useTypesEvaluation,
} from '../../../hooks/useEvaluations';
import { useMatieres } from '../../../hooks/useMatieres';
import { useAnneeAcademiques } from '../../../hooks/useAnneeAcademiques';
import { Card, Button, Spinner } from '../../../components/ui';
import type { EvaluationFormData } from '../../../types/evaluation.types';

// Schéma de validation
const evaluationSchema = z.object({
  titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  type_evaluation: z.number({ message: 'Sélectionnez un type' }),
  matiere: z.number({ message: 'Sélectionnez une matière' }),
  annee_academique: z.number({ message: 'Sélectionnez une année académique' }),
  date: z.string().min(1, 'La date est requise'),
  coefficient: z.number().min(0.5, 'Le coefficient minimum est 0.5').max(10, 'Le coefficient maximum est 10'),
  note_totale: z.number().min(1, 'Le barème minimum est 1').max(200, 'Le barème maximum est 200'),
  duree: z.number().optional(),
  description: z.string().optional(),
});

export default function EvaluationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // Queries
  const { data: evaluation, isLoading: loadingEval } = useEvaluation(Number(id));
  const { data: typesEval = [], isLoading: loadingTypes } = useTypesEvaluation();
  const { data: matieresData, isLoading: loadingMatieres } = useMatieres({});
  const { data: anneesData, isLoading: loadingAnnees } = useAnneeAcademiques({});

  const createMutation = useCreateEvaluation();
  const updateMutation = useUpdateEvaluation();

  const matieres = matieresData?.results || [];
  const annees = anneesData?.results || [];

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      note_totale: 20,
      coefficient: 1,
    },
  });

  const selectedTypeId = watch('type_evaluation');
  const selectedType = typesEval.find((t) => t.id === selectedTypeId);

  // Charger les données en mode édition
  useEffect(() => {
    if (evaluation && isEdit) {
      reset({
        titre: evaluation.titre,
        type_evaluation: evaluation.type_evaluation,
        matiere: evaluation.matiere,
        annee_academique: evaluation.annee_academique,
        date: evaluation.date,
        coefficient: evaluation.coefficient,
        note_totale: evaluation.note_totale,
        duree: evaluation.duree,
        description: evaluation.description,
      });
    }
  }, [evaluation, isEdit, reset]);

  // Validation du coefficient selon le type
  useEffect(() => {
    if (selectedType) {
      const coef = watch('coefficient');
      if (coef < selectedType.coefficient_min) {
        setValue('coefficient', selectedType.coefficient_min);
      } else if (coef > selectedType.coefficient_max) {
        setValue('coefficient', selectedType.coefficient_max);
      }
    }
  }, [selectedType, watch, setValue]);

  // Submit
  const onSubmit = async (data: EvaluationFormData) => {
    try {
      if (isEdit && id) {
        await updateMutation.mutateAsync({ id: Number(id), data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/admin/evaluations');
    } catch (error) {
      // Erreur gérée par le hook
    }
  };

  if (loadingEval || loadingTypes || loadingMatieres || loadingAnnees) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="primary" onClick={() => navigate('/admin/evaluations')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Modifier l\'évaluation' : 'Créer une évaluation'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Modifiez les informations de l\'évaluation' : 'Configurez une nouvelle évaluation'}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Informations générales</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matière */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('matiere', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez une matière</option>
                  {matieres.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} - {m.nom}
                    </option>
                  ))}
                </select>
                {errors.matiere && (
                  <p className="text-red-500 text-sm mt-1">{errors.matiere.message}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'évaluation <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('type_evaluation', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un type</option>
                  {typesEval.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom} (Coef: {t.coefficient_min} - {t.coefficient_max})
                    </option>
                  ))}
                </select>
                {errors.type_evaluation && (
                  <p className="text-red-500 text-sm mt-1">{errors.type_evaluation.message}</p>
                )}
              </div>

              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('titre')}
                  placeholder="Ex: Devoir 1, Examen final..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.titre && (
                  <p className="text-red-500 text-sm mt-1">{errors.titre.message}</p>
                )}
              </div>

              {/* Année académique */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année académique <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('annee_academique', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez une année</option>
                  {annees.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code}
                    </option>
                  ))}
                </select>
                {errors.annee_academique && (
                  <p className="text-red-500 text-sm mt-1">{errors.annee_academique.message}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Paramètres de notation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              {/* Coefficient */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coefficient <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  {...register('coefficient', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedType && (
                  <p className="text-xs text-gray-500 mt-1">
                    Entre {selectedType.coefficient_min} et {selectedType.coefficient_max}
                  </p>
                )}
                {errors.coefficient && (
                  <p className="text-red-500 text-sm mt-1">{errors.coefficient.message}</p>
                )}
              </div>

              {/* Barème */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barème (note totale) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  {...register('note_totale', { valueAsNumber: true })}
                  placeholder="Ex: 20, 100..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.note_totale && (
                  <p className="text-red-500 text-sm mt-1">{errors.note_totale.message}</p>
                )}
              </div>

              {/* Durée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  {...register('duree', { valueAsNumber: true })}
                  placeholder="Ex: 120"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Informations complémentaires..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/admin/evaluations')}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                {isEdit ? 'Modification...' : 'Création...'}
              </>
            ) : (
              <>{isEdit ? 'Modifier' : 'Créer'}</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}