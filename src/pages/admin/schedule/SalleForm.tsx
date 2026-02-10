import { Button, Input, Select } from "@/components/ui";
import {
  useBatiments,
  useCreateSalle,
  useUpdateSalle,
} from "@/hooks/useSchedule";
import type { Salle, SalleCreate } from "@/types/schedule.types";
import { useForm } from "react-hook-form";

interface SalleFormProps {
  salle?: Salle | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const TYPE_OPTIONS = [
  { value: "COURS", label: "Cours" },
  { value: "TD", label: "TD" },
  { value: "TP", label: "TP" },
  { value: "AMPHI", label: "Amphithéâtre" },
];

export default function SalleForm({
  salle,
  onSuccess,
  onCancel,
}: SalleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SalleCreate>({
    defaultValues: salle || {
      nom: "",
      code: "",
      batiment: 0,
      etage: 0,
      type_salle: "COURS",
      capacite: 30,
      equipements: "",
      is_accessible_pmr: false,
      is_active: true,
    },
  });

  const { data: batimentsData } = useBatiments();
  const createMutation = useCreateSalle();
  const updateMutation = useUpdateSalle();

  const batimentOptions = (batimentsData?.results || []).map((b) => ({
    value: b.id.toString(),
    label: `${b.code} - ${b.nom}`,
  }));

  const onSubmit = async (data: SalleCreate) => {
    try {
      if (salle) {
        await updateMutation.mutateAsync({ id: salle.id, data });
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("code", { required: "Le code est requis" })}
            placeholder="Ex: S-A101"
            error={errors.code?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom <span className="text-red-500">*</span>
          </label>
          <Input
            {...register("nom", { required: "Le nom est requis" })}
            placeholder="Ex: Salle 101"
            error={errors.nom?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bâtiment <span className="text-red-500">*</span>
          </label>
          <Select
            {...register("batiment", {
              required: "Le bâtiment est requis",
              valueAsNumber: true,
            })}
            options={batimentOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Étage
          </label>
          <Input
            type="number"
            {...register("etage", { valueAsNumber: true })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <Select
            {...register("type_salle", { required: "Le type est requis" })}
            options={TYPE_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Capacité <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            {...register("capacite", {
              required: "La capacité est requise",
              valueAsNumber: true,
              min: 1,
            })}
            placeholder="30"
            error={errors.capacite?.message}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Équipements
        </label>
        <textarea
          {...register("equipements")}
          placeholder="Ex: Vidéoprojecteur, Tableau blanc"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_accessible_pmr")}
            id="is_accessible_pmr"
            className="rounded"
          />
          <label htmlFor="is_accessible_pmr" className="text-sm text-gray-700">
            Accessible PMR
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_active")}
            id="is_active"
            className="rounded"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">
            Active
          </label>
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
          {salle ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
