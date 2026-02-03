/**
 * Formulaire Étudiant - Style Module Académique
 */

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import { useStudent, useCreateStudent, useUpdateStudent } from '@/hooks/useStudents';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';

const studentSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  sexe: z.enum(['M', 'F']),
  date_naissance: z.string().min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().min(2, 'Le lieu de naissance est requis'),
  nationalite: z.string().default('Camerounaise'),
  telephone: z.string().min(8, 'Le téléphone doit contenir au moins 8 chiffres'),
  email: z.string().email('Email invalide'),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  pays: z.string().default('Cameroun'),
  tuteur_nom: z.string().optional(),
  tuteur_telephone: z.string().optional(),
  tuteur_email: z.string().email('Email invalide').optional().or(z.literal('')),
  statut: z.enum(['ACTIF', 'SUSPENDU', 'DIPLOME', 'EXCLU', 'ABANDONNE']).default('ACTIF'),
});

type FormData = z.infer<typeof studentSchema>;

export default function StudentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { data: student, isLoading: loadingStudent } = useStudent(Number(id));
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      sexe: 'M',
      nationalite: 'Camerounaise',
      pays: 'Cameroun',
      statut: 'ACTIF',
    },
  });

  useEffect(() => {
    if (student && isEditMode) {
      setValue('nom', student.nom);
      setValue('prenom', student.prenom);
      setValue('sexe', student.sexe);
      setValue('date_naissance', student.date_naissance);
      setValue('lieu_naissance', student.lieu_naissance);
      setValue('nationalite', student.nationalite);
      setValue('telephone', student.telephone);
      setValue('email', student.email_personnel || student.email);
      setValue('adresse', student.adresse || '');
      setValue('ville', student.ville || '');
      setValue('pays', student.pays || 'Cameroun');
      setValue('tuteur_nom', student.tuteur_nom || '');
      setValue('tuteur_telephone', student.tuteur_telephone || '');
      setValue('tuteur_email', student.tuteur_email || '');
      setValue('statut', student.statut);
    }
  }, [student, isEditMode, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({ id: Number(id), data: data as any });
      } else {
        await createMutation.mutateAsync(data as any);
      }
      navigate('/admin/students');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loadingStudent && isEditMode) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => navigate('/admin/students')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Modifier un étudiant' : 'Nouvel étudiant'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations personnelles */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom *"
                {...register('nom')}
                error={errors.nom?.message}
              />
              <Input
                label="Prénom *"
                {...register('prenom')}
                error={errors.prenom?.message}
              />
              <Select
                label="Sexe *"
                {...register('sexe')}
                options={[
                  { value: 'M', label: 'Masculin' },
                  { value: 'F', label: 'Féminin' },
                ]}
                error={errors.sexe?.message}
              />
              <Input
                label="Date de naissance *"
                type="date"
                {...register('date_naissance')}
                error={errors.date_naissance?.message}
              />
              <Input
                label="Lieu de naissance *"
                {...register('lieu_naissance')}
                error={errors.lieu_naissance?.message}
              />
              <Input
                label="Nationalité *"
                {...register('nationalite')}
                error={errors.nationalite?.message}
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Téléphone *"
                type="tel"
                {...register('telephone')}
                placeholder="+237600000000"
                error={errors.telephone?.message}
              />
              <Input
                label="Email *"
                type="email"
                {...register('email')}
                placeholder="etudiant@example.com"
                error={errors.email?.message}
              />
              <Input
                label="Ville"
                {...register('ville')}
              />
              <Input
                label="Pays"
                {...register('pays')}
              />
              <div className="md:col-span-2">
                <Input
                  label="Adresse complète"
                  {...register('adresse')}
                  placeholder="Rue, quartier..."
                />
              </div>
            </div>
          </div>

          {/* Tuteur */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du tuteur/parent</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom du tuteur"
                {...register('tuteur_nom')}
              />
              <Input
                label="Téléphone du tuteur"
                type="tel"
                {...register('tuteur_telephone')}
              />
              <Input
                label="Email du tuteur"
                type="email"
                {...register('tuteur_email')}
                error={errors.tuteur_email?.message}
              />
              <Select
                label="Statut *"
                {...register('statut')}
                options={[
                  { value: 'ACTIF', label: 'Actif' },
                  { value: 'SUSPENDU', label: 'Suspendu' },
                  { value: 'DIPLOME', label: 'Diplômé' },
                  { value: 'EXCLU', label: 'Exclu' },
                  { value: 'ABANDONNE', label: 'Abandon' },
                ]}
                error={errors.statut?.message}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/students')}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Enregistrer' : 'Créer l\'étudiant'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}