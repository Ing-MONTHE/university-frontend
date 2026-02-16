import { useForm, Controller } from 'react-hook-form';
import { useCreateCours, useUpdateCours, useCreneaux, useSalles } from '@/hooks/useSchedule';
import { useMatieres } from '@/hooks/useMatieres';
import { useTeachers } from '@/hooks/useTeachers';
import { useAnneeAcademiques } from '@/hooks/useAnneeAcademiques';
import { Button, Input, Select } from '@/components/ui';
import type { Cours, CoursCreate } from '@/types/schedule.types';

interface CoursFormProps {
  cours?: Cours | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const RECURRENCE_OPTIONS = [
  { value: 'HEBDOMADAIRE', label: 'Hebdomadaire' },
  { value: 'BIHEBDOMADAIRE', label: 'Bihebdomadaire' },
  { value: 'PONCTUEL', label: 'Ponctuel' },
];

export default function CoursForm({ cours, onSuccess, onCancel }: CoursFormProps) {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<CoursCreate>({
    defaultValues: cours || {
      matiere: 0,
      enseignant: 0,
      salle: 0,
      creneau: 0,
      annee_academique: 0,
      semestre: 1,
      date_debut: '',
      date_fin: '',
      recurrence: 'HEBDOMADAIRE',
      effectif_prevu: 30,
      remarques: '',
      is_active: true,
    },
  });

  const { data: matieresData } = useMatieres({ page_size: 1000 });
  const { data: enseignantsData } = useTeachers({ page_size: 1000 });
  const { data: sallesData } = useSalles({ page_size: 1000 });
  const { data: creneauxData } = useCreneaux({ page_size: 100 });
  const { data: anneesData } = useAnneeAcademiques({ page_size: 100 });

  const createMutation = useCreateCours();
  const updateMutation = useUpdateCours();

  const selectedSalle = watch('salle');
  const salle = sallesData?.results?.find((s) => s.id === Number(selectedSalle));

  const matiereOptions = (matieresData?.results || []).map((m) => ({
    value: m.id.toString(),
    label: m.nom,
  }));

  const enseignantOptions = (enseignantsData?.results || []).map((e) => ({
    value: e.id.toString(),
    label: `${e.prenom} ${e.nom}`,
  }));

  const salleOptions = (sallesData?.results || []).map((s) => ({
    value: s.id.toString(),
    label: `${s.nom} (${s.type_salle} - ${s.capacite} places)`,
  }));

  const creneauOptions = (creneauxData?.results || []).map((c) => ({
    value: c.id.toString(),
    label: `${c.jour} ${c.heure_debut}-${c.heure_fin}`,
  }));

  const anneeOptions = (anneesData?.results || []).map((a) => ({
    value: a.id.toString(),
    label: a.annee,
  }));

  const onSubmit = async (data: CoursCreate) => {
    try {
      if (cours) {
        await updateMutation.mutateAsync({ id: cours.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
    } catch (error: any) {
      alert(error?.response?.data?.detail || 'Erreur lors de l\'enregistrement');
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matière <span className="text-red-500">*</span>
          </label>
          <Controller
            name="matiere"
            control={control}
            rules={{ required: 'La matière est requise' }}
            render={({ field }) => (
              <Select
                options={matiereOptions}
                value={field.value?.toString()}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.matiere?.message}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enseignant <span className="text-red-500">*</span>
          </label>
          <Controller
            name="enseignant"
            control={control}
            rules={{ required: 'L\'enseignant est requis' }}
            render={({ field }) => (
              <Select
                options={enseignantOptions}
                value={field.value?.toString()}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.enseignant?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salle <span className="text-red-500">*</span>
          </label>
          <Controller
            name="salle"
            control={control}
            rules={{ required: 'La salle est requise' }}
            render={({ field }) => (
              <Select
                options={salleOptions}
                value={field.value?.toString()}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.salle?.message}
              />
            )}
          />
          {salle && (
            <p className="text-xs text-gray-500 mt-1">
              Capacité: {salle.capacite} places
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Créneau <span className="text-red-500">*</span>
          </label>
          <Controller
            name="creneau"
            control={control}
            rules={{ required: 'Le créneau est requis' }}
            render={({ field }) => (
              <Select
                options={creneauOptions}
                value={field.value?.toString()}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.creneau?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année Académique <span className="text-red-500">*</span>
          </label>
          <Controller
            name="annee_academique"
            control={control}
            rules={{ required: 'L\'année est requise' }}
            render={({ field }) => (
              <Select
                options={anneeOptions}
                value={field.value?.toString()}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.annee_academique?.message}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semestre <span className="text-red-500">*</span>
          </label>
          <Controller
            name="semestre"
            control={control}
            rules={{ required: 'Le semestre est requis' }}
            render={({ field }) => (
              <Select
                options={[
                  { value: '1', label: 'Semestre 1' },
                  { value: '2', label: 'Semestre 2' },
                ]}
                value={field.value?.toString()}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.semestre?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date début <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            {...register('date_debut', { required: 'La date de début est requise' })}
            error={errors.date_debut?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date fin <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            {...register('date_fin', { required: 'La date de fin est requise' })}
            error={errors.date_fin?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Récurrence
          </label>
          <Controller
            name="recurrence"
            control={control}
            render={({ field }) => (
              <Select
                options={RECURRENCE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Effectif prévu <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            {...register('effectif_prevu', { required: 'L\'effectif est requis', valueAsNumber: true, min: 1 })}
            error={errors.effectif_prevu?.message}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remarques
        </label>
        <textarea
          {...register('remarques')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Notes supplémentaires..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('is_active')}
          id="is_active"
          className="rounded"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Cours actif
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          isLoading={createMutation.isPending || updateMutation.isPending}
        >
          {cours ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}