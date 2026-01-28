import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input } from '@/components/ui';
import { useCreateFaculte, useUpdateFaculte } from '@/hooks';
import type { Faculte } from '@/types';

// Schéma de validation Zod
const facultySchema = z.object({
  code: z
    .string()
    .min(2, 'Le code doit contenir au moins 2 caractères')
    .max(10, 'Le code ne peut pas dépasser 10 caractères')
    .regex(/^[A-Z0-9]+$/, 'Le code doit contenir uniquement des lettres majuscules et des chiffres'),
  nom: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z
    .string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional(),
  is_active: z.boolean().optional(),
});

type FacultyFormData = z.infer<typeof facultySchema>;

interface FacultyFormProps {
  faculty: Faculte | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FacultyForm({ faculty, onClose, onSuccess }: FacultyFormProps) {
  const isEditing = !!faculty;

  const createFaculte = useCreateFaculte();
  const updateFaculte = useUpdateFaculte();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      code: '',
      nom: '',
      description: '',
      is_active: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (faculty) {
      setValue('code', faculty.code);
      setValue('nom', faculty.nom);
      setValue('description', faculty.description || '');
      setValue('is_active', faculty.is_active);
    }
  }, [faculty, setValue]);

  const onSubmit = async (data: FacultyFormData) => {
    try {
      if (isEditing) {
        await updateFaculte.mutateAsync({
          id: faculty.id,
          data: {
            code: data.code,
            nom: data.nom,
            description: data.description,
            is_active: data.is_active,
          },
        });
      } else {
        await createFaculte.mutateAsync({
          code: data.code,
          nom: data.nom,
          description: data.description,
          is_active: data.is_active ?? true,
        });
      }
      onSuccess();
    } catch (error) {
      // Error handled by hooks with toast
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={isEditing ? 'Modifier la faculté' : 'Nouvelle faculté'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Code */}
        <Input
          label="Code"
          type="text"
          placeholder="Ex: FST, FSE, FDEG..."
          error={errors.code?.message}
          disabled={isSubmitting}
          helperText="Code unique de la faculté (lettres majuscules et chiffres uniquement)"
          {...register('code', {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase();
            },
          })}
        />

        {/* Nom */}
        <Input
          label="Nom de la faculté"
          type="text"
          placeholder="Ex: Faculté des Sciences et Techniques"
          error={errors.nom?.message}
          disabled={isSubmitting}
          {...register('nom')}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description (optionnelle)
          </label>
          <textarea
            {...register('description')}
            placeholder="Description de la faculté..."
            disabled={isSubmitting}
            rows={4}
            className={`
              w-full px-4 py-2.5 text-base
              border-2 rounded-lg
              transition-all
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${errors.description ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
          <p className="mt-1.5 text-sm text-gray-500">
            Maximum 500 caractères
          </p>
        </div>

        {/* Active */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register('is_active')}
            disabled={isSubmitting}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label className="text-sm font-medium text-gray-700">
            Faculté active
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEditing ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
