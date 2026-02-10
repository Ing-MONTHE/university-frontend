import { Button, Input, Select } from "@/components/ui";
import { useAnneeAcademiques } from "@/hooks/useAnneeAcademiques";
import { useMatieres } from "@/hooks/useMatieres";
import {
  useCreateCours,
  useCreneaux,
  useSalles,
  useUpdateCours,
} from "@/hooks/useSchedule";
import { useTeachers } from "@/hooks/useTeachers";
import type { Cours, CoursCreate } from "@/types/schedule.types";
import { useForm } from "react-hook-form";

interface CoursFormProps {
  cours?: Cours | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const RECURRENCE_OPTIONS = [
  { value: "HEBDOMADAIRE", label: "Hebdomadaire" },
  { value: "BIHEBDOMADAIRE", label: "Bihebdomadaire" },
  { value: "PONCTUEL", label: "Ponctuel" },
];

export default function CoursForm({
  cours,
  onSuccess,
  onCancel,
}: CoursFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CoursCreate>({
    defaultValues: cours || {
      matiere: 0,
      enseignant: 0,
      salle: 0,
      creneau: 0,
      annee_academique: 0,
      semestre: 1,
      date_debut: "",
      date_fin: "",
      recurrence: "HEBDOMADAIRE",
      effectif_prevu: 30,
      remarques: "",
      is_active: true,
    },
  });

  const { data: matieresData } = useMatieres();
  const { data: enseignantsData } = useTeachers();
  const { data: sallesData } = useSalles();
  const { data: creneauxData } = useCreneaux({ page_size: 100 });
  const { data: anneesData } = useAnneeAcademiques();

  const createMutation = useCreateCours();
  const updateMutation = useUpdateCours();

  const selectedSalle = watch("salle");
  const salle = sallesData?.results?.find(
    (s) => s.id === Number(selectedSalle),
  );

  const matiereOptions = (matieresData?.results || []).map((m) => ({
    value: m.id.toString(),
    label: m.nom,
  }));

  const enseignantOptions = (enseignantsData?.results || []).map((e) => ({
    value: e.id.toString(),
    label: `${e.first_name} ${e.last_name}`,
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
      alert(error?.response?.data?.detail || "Erreur lors de l'enregistrement");
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matière <span className="text-red-500">*</span>
          </label>
          <Select
            {...register("matiere", {
              required: "La matière est requise",
              valueAsNumber: true,
            })}
            options={matiereOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enseignant <span className="text-red-500">*</span>
          </label>
          <Select
            {...register("enseignant", {
              required: "L'enseignant est requis",
              valueAsNumber: true,
            })}
            options={enseignantOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salle <span className="text-red-500">*</span>
          </label>
          <Select
            {...register("salle", {
              required: "La salle est requise",
              valueAsNumber: true,
            })}
            options={salleOptions}
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
          <Select
            {...register("creneau", {
              required: "Le créneau est requis",
              valueAsNumber: true,
            })}
            options={creneauOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année Académique <span className="text-red-500">*</span>
          </label>
          <Select
            {...register("annee_academique", {
              required: "L'année est requise",
              valueAsNumber: true,
            })}
            options={anneeOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Semestre <span className="text-red-500">*</span>
          </label>
          <Select
            {...register("semestre", {
              required: "Le semestre est requis",
              valueAsNumber: true,
            })}
            options={[
              { value: "1", label: "Semestre 1" },
              { value: "2", label: "Semestre 2" },
            ]}
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
            {...register("date_debut", {
              required: "La date de début est requise",
            })}
            error={errors.date_debut?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date fin <span className="text-red-500">*</span>
          </label>
          <Input
            type="date"
            {...register("date_fin", {
              required: "La date de fin est requise",
            })}
            error={errors.date_fin?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Récurrence
          </label>
          <Select {...register("recurrence")} options={RECURRENCE_OPTIONS} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Effectif prévu <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            {...register("effectif_prevu", {
              required: "L'effectif est requis",
              valueAsNumber: true,
              min: 1,
            })}
            error={errors.effectif_prevu?.message}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remarques
        </label>
        <textarea
          {...register("remarques")}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Notes supplémentaires..."
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
          Cours actif
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
          {cours ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
