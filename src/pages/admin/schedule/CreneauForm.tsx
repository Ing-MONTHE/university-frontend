import { Button, Input, Select } from "@/components/ui";
import { useCreateCreneau, useUpdateCreneau } from "@/hooks/useSchedule";
import type { Creneau, CreneauCreate } from "@/types/schedule.types";
import { useForm, Controller } from "react-hook-form";

interface CreneauFormProps {
  creneau?: Creneau | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const JOUR_OPTIONS = [
  { value: "LUNDI", label: "Lundi" },
  { value: "MARDI", label: "Mardi" },
  { value: "MERCREDI", label: "Mercredi" },
  { value: "JEUDI", label: "Jeudi" },
  { value: "VENDREDI", label: "Vendredi" },
  { value: "SAMEDI", label: "Samedi" },
];

export default function CreneauForm({
  creneau,
  onSuccess,
  onCancel,
}: CreneauFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreneauCreate>({
    defaultValues: creneau || {
      jour: "LUNDI",
      heure_debut: "08:00",
      heure_fin: "10:00",
    },
  });

  const createMutation = useCreateCreneau();
  const updateMutation = useUpdateCreneau();

  const onSubmit = async (data: CreneauCreate) => {
    try {
      if (creneau) {
        await updateMutation.mutateAsync({ id: creneau.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Jour <span className="text-red-500">*</span>
        </label>
        <Controller
          name="jour"
          control={control}
          rules={{ required: "Le jour est requis" }}
          render={({ field }) => (
            <Select
              options={JOUR_OPTIONS}
              value={field.value}
              onChange={(value) => field.onChange(value)}
              error={errors.jour?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Heure début <span className="text-red-500">*</span>
          </label>
          <Input
            type="time"
            {...register("heure_debut", {
              required: "L'heure de début est requise",
            })}
            error={errors.heure_debut?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Heure fin <span className="text-red-500">*</span>
          </label>
          <Input
            type="time"
            {...register("heure_fin", {
              required: "L'heure de fin est requise",
            })}
            error={errors.heure_fin?.message}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="primary" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          isLoading={createMutation.isPending || updateMutation.isPending}
        >
          {creneau ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}