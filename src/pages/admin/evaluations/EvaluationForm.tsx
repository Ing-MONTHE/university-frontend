/**
 * Formulaire de création/édition d'évaluations
 * VERSION COMPLÈTE avec validation et cascade
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  Calendar,
  BookOpen,
  FileText,
  Award,
  Clock,
} from "lucide-react";
import {
  useEvaluation,
  useCreateEvaluation,
  useUpdateEvaluation,
  useTypesEvaluations,
} from "@/hooks/useEvaluations";
import { useMatieres } from "@/hooks/useMatieres";
import { useAnneeAcademiques } from "@/hooks/useAnneeAcademiques";
import type { Matiere } from "@/types/academic.types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";

// Schéma de validation Zod
const evaluationSchema = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  type_evaluation: z.number({ message: "Le type est requis" }),
  matiere: z.number({ message: "La matière est requise" }),
  annee_academique: z.number({ message: "L'année académique est requise" }),
  date: z.string().min(1, "La date est requise"),
  coefficient: z
    .number({ message: "Le coefficient est requis" })
    .min(0.5, "Le coefficient doit être au moins 0.5")
    .max(10, "Le coefficient ne peut pas dépasser 10"),
  note_totale: z
    .number({ message: "Le barème est requis" })
    .positive("Le barème doit être positif")
    .max(100, "Le barème ne peut pas dépasser 100"),
  duree: z
    .number()
    .int("La durée doit être un nombre entier")
    .positive("La durée doit être positive")
    .optional()
    .or(z.literal(undefined)),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof evaluationSchema>;

export default function EvaluationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [selectedFiliere, setSelectedFiliere] = useState<number | null>(null);

  // Queries
  const { data: evaluation, isLoading: loadingEvaluation } = useEvaluation(
    Number(id),
    { enabled: isEditing },
  );
  const { data: typesData, isLoading: loadingTypes } = useTypesEvaluations();
  const { data: matieresData, isLoading: loadingMatieres } = useMatieres({
    filiere: selectedFiliere || undefined,
    page_size: 1000,
  });
  const { data: anneesData, isLoading: loadingAnnees } = useAnneeAcademiques();

  // Mutations
  const createMutation = useCreateEvaluation();
  const updateMutation = useUpdateEvaluation();

  // Form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      note_totale: 20,
      coefficient: 1,
    },
  });

  const watchTypeEvaluation = watch("type_evaluation");
  const watchMatiere = watch("matiere");

  // Charger les données de l'évaluation en mode édition
  useEffect(() => {
    if (evaluation && isEditing) {
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

      // Set filiere for cascade (API may return filiere or first of filieres)
      const filiere = evaluation.matiere_details?.filiere;
      if (filiere) {
        setSelectedFiliere(typeof filiere === 'object' && 'id' in filiere ? filiere.id : Number(filiere));
      }
    }
  }, [evaluation, isEditing, reset]);

  // Ajuster les limites de coefficient selon le type d'évaluation
  useEffect(() => {
    if (watchTypeEvaluation && typesData) {
      const typeEval = typesData.find((t) => t.id === watchTypeEvaluation);
      if (typeEval) {
        const currentCoef = watch("coefficient");
        if (currentCoef < typeEval.coefficient_min) {
          setValue("coefficient", typeEval.coefficient_min);
        }
        if (currentCoef > typeEval.coefficient_max) {
          setValue("coefficient", typeEval.coefficient_max);
        }
      }
    }
  }, [watchTypeEvaluation, typesData, setValue, watch]);

  // Cascade: Récupérer la filière de la matière sélectionnée (Matiere a filieres[] ou filiere selon l'API)
  useEffect(() => {
    if (watchMatiere && matieresData) {
      type MatiereApi = (Matiere | { id: number; filiere?: number | { id: number }; filieres?: Array<number | { id: number }> }) & { filiere?: number | { id: number }; filieres?: Array<number | { id: number }> };
      const matiere = matieresData.results?.find((m: MatiereApi) => m.id === watchMatiere) as MatiereApi | undefined;
      if (!matiere) return;
      const filiereId = matiere.filiere != null
        ? (typeof matiere.filiere === "object" ? matiere.filiere.id : matiere.filiere)
        : matiere.filieres?.[0] != null
          ? (typeof matiere.filieres[0] === "object" ? matiere.filieres[0].id : matiere.filieres[0])
          : undefined;
      if (filiereId != null) setSelectedFiliere(Number(filiereId));
    }
  }, [watchMatiere, matieresData]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: Number(id), data });
        navigate("/admin/evaluations");
      } else {
        await createMutation.mutateAsync(data);
        navigate("/admin/evaluations");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  // Loading state
  if (
    (isEditing && loadingEvaluation) ||
    loadingTypes ||
    loadingMatieres ||
    loadingAnnees
  ) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const selectedTypeEval = watchTypeEvaluation
    ? typesData?.find((t) => t.id === watchTypeEvaluation)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/evaluations")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Modifier l'évaluation" : "Nouvelle Évaluation"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing
                  ? "Modifiez les informations de l'évaluation"
                  : "Créez une nouvelle évaluation pour une matière"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Titre de l'évaluation *
              </label>
              <Input
                {...register("titre")}
                placeholder="Ex: Examen Final Algorithmique"
                error={errors.titre?.message}
              />
            </div>

            {/* Type d'évaluation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-2" />
                Type d'évaluation *
              </label>
              <Controller
                name="type_evaluation"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() ?? ""}
                    onChange={(val) => field.onChange(Number(val))}
                    options={[
                      { value: "", label: "-- Sélectionner --" },
                      ...(typesData?.map((type) => ({ value: type.id, label: type.nom })) ?? []),
                    ]}
                    placeholder="-- Sélectionner --"
                    error={errors.type_evaluation?.message}
                  />
                )}
              />
              {selectedTypeEval && (
                <p className="text-xs text-gray-500 mt-1">
                  Coefficient: {selectedTypeEval.coefficient_min} -{" "}
                  {selectedTypeEval.coefficient_max}
                </p>
              )}
            </div>

            {/* Matière */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Matière *
              </label>
              <Controller
                name="matiere"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() ?? ""}
                    onChange={(val) => field.onChange(Number(val))}
                    options={[
                      { value: "", label: "-- Sélectionner --" },
                      ...(matieresData?.results?.map((matiere: Matiere & { filiere?: { id?: number; code?: string }; filieres?: Array<{ id?: number; code?: string }> }) => {
                        const filiereLabel = (matiere.filieres?.[0] && typeof matiere.filieres[0] === 'object' ? (matiere.filieres[0] as { code?: string }).code : null) ?? (matiere.filiere && typeof matiere.filiere === 'object' ? (matiere.filiere as { code?: string }).code : null) ?? "";
                        return {
                          value: matiere.id,
                          label: `${matiere.code} - ${matiere.nom}${filiereLabel ? ` (${filiereLabel})` : ""}`,
                        };
                      }) ?? []),
                    ]}
                    placeholder="-- Sélectionner --"
                    error={errors.matiere?.message}
                  />
                )}
              />
            </div>

            {/* Année académique */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Année académique *
              </label>
              <Controller
                name="annee_academique"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() ?? ""}
                    onChange={(val) => field.onChange(Number(val))}
                    options={[
                      { value: "", label: "-- Sélectionner --" },
                      ...(anneesData?.results?.map((annee: { id: number; libelle?: string; code?: string }) => ({ value: annee.id, label: annee.libelle ?? annee.code ?? String(annee.id) })) ?? []),
                    ]}
                    placeholder="-- Sélectionner --"
                    error={errors.annee_academique?.message}
                  />
                )}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <Input
                type="date"
                {...register("date")}
                error={errors.date?.message}
              />
            </div>

            {/* Barème */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barème (Note totale) *
              </label>
              <Controller
                name="note_totale"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    step="0.5"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="20"
                    error={errors.note_totale?.message}
                  />
                )}
              />
              <p className="text-xs text-gray-500 mt-1">Ex: 20, 40, 100</p>
            </div>

            {/* Coefficient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coefficient *
              </label>
              <Controller
                name="coefficient"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    step="0.5"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={errors.coefficient?.message}
                  />
                )}
              />
            </div>

            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Durée (minutes)
              </label>
              <Controller
                name="duree"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    step="15"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="120"
                    error={errors.duree?.message}
                  />
                )}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consignes / Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Consignes pour l'évaluation..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Informations */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Veuillez corriger les erreurs suivantes:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                {Object.entries(errors).map(([key, error]) => (
                  <li key={key}>{error.message}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 bg-white rounded-xl shadow-sm p-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/evaluations")}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Enregistrer" : "Créer l'évaluation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
