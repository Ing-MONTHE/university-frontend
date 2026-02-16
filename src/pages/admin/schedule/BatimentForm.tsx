import { Button, Input } from "@/components/ui";
import { useCreateBatiment, useUpdateBatiment } from "@/hooks/useSchedule";
import type { Batiment, BatimentCreate } from "@/types/schedule.types";
import { useForm } from "react-hook-form";

interface BatimentFormProps {
  batiment?: Batiment | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BatimentForm({
  batiment,
  onSuccess,
  onCancel,
}: BatimentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BatimentCreate>({
    defaultValues: batiment || {
      nom: "",
      code: "",
      adresse: "",
      nombre_etages: 1,
      is_active: true,
    },
  });

  const createMutation = useCreateBatiment();
  const updateMutation = useUpdateBatiment();

  const onSubmit = async (data: BatimentCreate) => {
    console.log('📤 Données envoyées:', data);
    try {
      if (batiment) {
        await updateMutation.mutateAsync({ id: batiment.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
    } catch (error: any) {
      console.error("❌ Erreur complète:", error);
      console.error("❌ Error.message:", error?.message);
      console.error("❌ Error.errors:", error?.errors);
      console.error("❌ Error.status:", error?.status);
      
      // L'intercepteur transforme l'erreur en ApiError {message, status, errors}
      const errorMessage = error?.message || "Erreur lors de l'enregistrement";
      const fieldErrors = error?.errors;
      
      if (fieldErrors && typeof fieldErrors === 'object') {
        // Afficher les erreurs de champs spécifiques
        const errorDetails = Object.entries(fieldErrors)
          .map(([field, msgs]: [string, any]) => {
            if (Array.isArray(msgs)) {
              return `${field}: ${msgs.join(', ')}`;
            }
            return `${field}: ${msgs}`;
          })
          .join('\n');
        alert(`Erreur de validation:\n${errorDetails}`);
      } else {
        alert(`Erreur: ${errorMessage}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Code <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("code", { required: "Le code est requis" })}
          placeholder="Ex: BAT-A"
          error={errors.code?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("nom", { required: "Le nom est requis" })}
          placeholder="Ex: Bâtiment A"
          error={errors.nom?.message}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <Input {...register("adresse")} placeholder="Ex: Campus Principal" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre d'étages
        </label>
        <Input
          type="number"
          {...register("nombre_etages", { valueAsNumber: true, min: 1 })}
          placeholder="1"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("is_active")}
          id="is_active"
          className="rounded"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          Actif
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="primary" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          isLoading={createMutation.isPending || updateMutation.isPending}
        >
          {batiment ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}