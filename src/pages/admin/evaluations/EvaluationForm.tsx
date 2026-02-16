/**
 * Formulaire de création/édition d'Évaluation
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  useEvaluation,
  useCreateEvaluation,
  useUpdateEvaluation,
  useTypesEvaluation,
} from '@/hooks/useEvaluations';
import { useMatieres } from '@/hooks/useMatieres';
import { useTeachers } from '@/hooks/useTeachers';
import type { EvaluationCreate } from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import NativeSelect from '@/components/ui/NativeSelect';
import Spinner from '@/components/ui/Spinner';
import { STATUT_EVALUATION_CHOICES } from '@/types/evaluation.types';

export default function EvaluationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: evaluation, isLoading: loadingEval } = useEvaluation(
    Number(id),
  );
  const { data: matieres, isLoading: loadingMatieres } = useMatieres({ page_size: 1000 });
  const { data: typesEval, isLoading: loadingTypes } = useTypesEvaluation({ page_size: 100 });
  const { data: enseignants, isLoading: loadingEnseignants } = useTeachers({ page_size: 1000 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EvaluationCreate>({
    defaultValues: {
      bareme: 20,
      coefficient: 1,
      statut: 'EN_COURS',
    },
  });

  const createMutation = useCreateEvaluation();
  const updateMutation = useUpdateEvaluation();

  const typeEvalId = watch('type_evaluation_id');

  // Charger les données de l'évaluation en mode édition
  useEffect(() => {
    if (evaluation) {
      reset({
        matiere_id: evaluation.matiere,
        type_evaluation_id: evaluation.type_evaluation,
        titre: evaluation.titre,
        date_evaluation: evaluation.date_evaluation ? evaluation.date_evaluation.split('T')[0] : '',
        bareme: evaluation.bareme,
        coefficient: evaluation.coefficient,
        enseignant_id: evaluation.enseignant || undefined,
        statut: evaluation.statut,
        description: evaluation.description || '',
        duree: evaluation.duree || undefined,
      });
    }
  }, [evaluation, reset]);

  // Valider le coefficient selon le type d'évaluation
  useEffect(() => {
    if (typeEvalId && typesEval?.results) {
      const type = typesEval.results.find((t) => t.id === Number(typeEvalId));
      if (type) {
        const currentCoef = watch('coefficient');
        if (currentCoef < type.coefficient_min) {
          setValue('coefficient', type.coefficient_min);
        } else if (currentCoef > type.coefficient_max) {
          setValue('coefficient', type.coefficient_max);
        }
      }
    }
  }, [typeEvalId, typesEval, watch, setValue]);

  const onSubmit = async (data: EvaluationCreate) => {
    try {
      // Nettoyer et formater les données
      const cleanData = {
        matiere_id: Number(data.matiere_id),
        type_evaluation_id: Number(data.type_evaluation_id),
        titre: data.titre,
        date: data.date_evaluation, // ✅ Backend attend "date" pas "date_evaluation"
        coefficient: Number(data.coefficient),
        note_totale: Number(data.bareme), // ✅ Backend attend "note_totale" pas "bareme"
        enseignant_id: data.enseignant_id ? Number(data.enseignant_id) : undefined,
        description: data.description || undefined,
        duree: data.duree ? Number(data.duree) : undefined,
        annee_academique_id: 1,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({
          id: Number(id),
          data: cleanData,
        });
      } else {
        await createMutation.mutateAsync(cleanData);
      }
      navigate('/admin/evaluations');
    } catch (error) {
      console.error('Error saving evaluation:', error);
    }
  };

  const getCoefRange = () => {
    if (!typeEvalId || !typesEval?.results) return null;
    const type = typesEval.results.find((t) => t.id === Number(typeEvalId));
    return type
      ? `${type.coefficient_min} - ${type.coefficient_max}`
      : null;
  };

  if ((loadingEval && isEdit) || loadingMatieres || loadingTypes || loadingEnseignants) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" message="Chargement du formulaire..." />
      </div>
    );
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/evaluations')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Modifier l\'évaluation' : 'Nouvelle évaluation'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Modifiez les informations' : 'Créez une nouvelle évaluation'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations principales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Informations principales
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <NativeSelect
                label="Matière"
                {...register('matiere_id', {
                  required: 'La matière est requise',
                  valueAsNumber: true,
                })}
                error={errors.matiere_id?.message}
              >
                <option value="">Sélectionnez une matière</option>
                {matieres?.results.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.code} - {m.nom}
                  </option>
                ))}
              </NativeSelect>

              <NativeSelect
                label="Type d'évaluation"
                {...register('type_evaluation_id', {
                  required: 'Le type est requis',
                  valueAsNumber: true,
                })}
                error={errors.type_evaluation_id?.message}
              >
                <option value="">Sélectionnez un type</option>
                {typesEval?.results.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nom}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <Input
              label="Titre"
              {...register('titre', {
                required: 'Le titre est requis',
              })}
              error={errors.titre?.message}
              placeholder="Ex: Examen Final"
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Date"
                type="date"
                {...register('date_evaluation', {
                  required: 'La date est requise',
                })}
                error={errors.date_evaluation?.message}
              />

              <div>
                <Input
                  label="Barème"
                  type="number"
                  step="0.5"
                  {...register('bareme', {
                    required: 'Le barème est requis',
                    min: {
                      value: 1,
                      message: 'Le barème doit être ≥ 1',
                    },
                    valueAsNumber: true,
                  })}
                  error={errors.bareme?.message}
                />
              </div>

              <div>
                <Input
                  label="Coefficient"
                  type="number"
                  step="0.5"
                  {...register('coefficient', {
                    required: 'Le coefficient est requis',
                    min: {
                      value: 0.5,
                      message: 'Le coefficient doit être ≥ 0.5',
                    },
                    valueAsNumber: true,
                  })}
                  error={errors.coefficient?.message}
                />
                {getCoefRange() && (
                  <p className="text-xs text-gray-500 mt-1">
                    Range autorisé: {getCoefRange()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Informations complémentaires
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <NativeSelect
                label="Enseignant (optionnel)"
                {...register('enseignant_id', {
                  setValueAs: (v) => (v === '' ? undefined : Number(v)),
                })}
              >
                <option value="">Sélectionnez un enseignant</option>
                {enseignants?.results.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nom} {e.prenom}
                  </option>
                ))}
              </NativeSelect>

              <NativeSelect
                label="Statut"
                {...register('statut')}
              >
                {STATUT_EVALUATION_CHOICES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description optionnelle..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/evaluations')}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? 'Enregistrement...'
                : isEdit
                ? 'Modifier'
                : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}