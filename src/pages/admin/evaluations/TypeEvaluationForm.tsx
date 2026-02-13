/**
 * Formulaire de création/édition de Type d'Évaluation
 */

import { useForm } from 'react-hook-form';
import {
  useCreateTypeEvaluation,
  useUpdateTypeEvaluation,
} from '@/hooks/useEvaluations';
import type {
  TypeEvaluation,
  TypeEvaluationCreate,
} from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface TypeEvaluationFormProps {
  typeEvaluation?: TypeEvaluation;
  onSuccess: () => void;
}

export default function TypeEvaluationForm({
  typeEvaluation,
  onSuccess,
}: TypeEvaluationFormProps) {
  const isEdit = !!typeEvaluation;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TypeEvaluationCreate>({
    defaultValues: typeEvaluation
      ? {
          nom: typeEvaluation.nom,
          code: typeEvaluation.code,
          coefficient_min: typeEvaluation.coefficient_min,
          coefficient_max: typeEvaluation.coefficient_max,
          description: typeEvaluation.description,
        }
      : {
          coefficient_min: 1,
          coefficient_max: 4,
        },
  });

  const createMutation = useCreateTypeEvaluation();
  const updateMutation = useUpdateTypeEvaluation();

  const coeffMin = watch('coefficient_min');

  const onSubmit = async (data: TypeEvaluationCreate) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: typeEvaluation.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving type evaluation:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Code"
          {...register('code', {
            required: 'Le code est requis',
            pattern: {
              value: /^[A-Z0-9_]+$/,
              message: 'Format invalide (ex: EXAM, DEV, TP)',
            },
          })}
          error={errors.code?.message}
          placeholder="Ex: EXAM"
        />

        <Input
          label="Nom"
          {...register('nom', {
            required: 'Le nom est requis',
          })}
          error={errors.nom?.message}
          placeholder="Ex: Examen"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Coefficient Minimum"
          type="number"
          step="0.5"
          {...register('coefficient_min', {
            required: 'Le coefficient minimum est requis',
            min: {
              value: 0.5,
              message: 'Le coefficient doit être ≥ 0.5',
            },
            valueAsNumber: true,
          })}
          error={errors.coefficient_min?.message}
        />

        <Input
          label="Coefficient Maximum"
          type="number"
          step="0.5"
          {...register('coefficient_max', {
            required: 'Le coefficient maximum est requis',
            min: {
              value: coeffMin || 1,
              message: `Le coefficient max doit être ≥ ${coeffMin || 1}`,
            },
            valueAsNumber: true,
          })}
          error={errors.coefficient_max?.message}
        />
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

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}