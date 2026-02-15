// Formulaire de création/édition d'enseignant (3 étapes)

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Upload, X, User, Briefcase, FileText } from 'lucide-react';
import {
  useTeacher,
  useCreateTeacher,
  useUpdateTeacher,
  useUploadTeacherPhoto,
} from '@/hooks/useTeachers';
import { useDepartements } from '@/hooks/useDepartements';
import { Card, Button, Input, Select, Spinner } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import type { EnseignantCreate } from '@/types/teacher.types';

const TeacherForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Queries
  const { data: teacher, isLoading: loadingTeacher } = useTeacher(Number(id));
  const { data: departementsData } = useDepartements({ page_size: 100 });
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();
  const uploadPhoto = useUploadTeacherPhoto();

  // États
  const [currentStep, setCurrentStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EnseignantCreate>>({
    sexe: 'M',
    nationalite: 'Camerounaise',
    grade: 'ASSISTANT',
    statut: 'ACTIF',
  });

  // Charger les données en mode édition
  useEffect(() => {
    if (teacher && isEditMode) {
      setFormData({
        nom: teacher.nom,
        prenom: teacher.prenom,
        sexe: teacher.sexe,
        date_naissance: teacher.date_naissance,
        nationalite: teacher.nationalite,
        telephone: teacher.telephone,
        email: teacher.email_personnel,
        adresse: teacher.adresse,
        grade: teacher.grade,
        specialite: teacher.specialite,
        departement_id: teacher.departement,
        date_embauche: teacher.date_embauche,
        statut: teacher.statut,
      });
      if (teacher.photo_url) {
        setPhotoPreview(teacher.photo_url);
      }
    }
  }, [teacher, isEditMode]);

  // Handlers
  const handleChange = (field: keyof EnseignantCreate, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange('cv', file);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(
        formData.nom &&
        formData.prenom &&
        formData.sexe &&
        formData.date_naissance &&
        formData.telephone &&
        formData.email
      );
    }
    if (step === 2) {
      return !!(
        formData.grade &&
        formData.specialite &&
        formData.departement_id &&
        formData.date_embauche
      );
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Veuillez remplir tous les champs obligatoires');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateTeacher.mutateAsync({
          id: Number(id),
          data: formData as any,
        });
        
        // Upload photo séparément si elle a changé
        if (formData.photo instanceof File) {
          await uploadPhoto.mutateAsync({
            id: Number(id),
            photo: formData.photo,
          });
        }
      } else {
        await createTeacher.mutateAsync(formData as EnseignantCreate);
      }
      navigate('/admin/teachers');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  if (loadingTeacher && isEditMode) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: User },
    { number: 2, title: 'Informations académiques', icon: Briefcase },
    { number: 3, title: 'Documents', icon: FileText },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/teachers')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Modifier un enseignant' : 'Nouvel enseignant'}
        </h1>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <p
                    className={`text-sm font-medium text-center ${
                      isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Steps */}
      <Card padding="lg">
        {/* Étape 1 : Informations personnelles */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations personnelles
            </h2>

            {/* Photo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <Avatar
                    name={`${formData.prenom || ''} ${formData.nom || ''}`}
                    size="2xl"
                    variant="rounded"
                  />
                )}
                <label className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full cursor-pointer hover:bg-purple-700">
                  <Upload className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-600">Photo de profil</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom"
                value={formData.nom || ''}
                onChange={(e) => handleChange('nom', e.target.value)}
                required
              />
              <Input
                label="Prénom"
                value={formData.prenom || ''}
                onChange={(e) => handleChange('prenom', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Sexe"
                value={formData.sexe || 'M'}
                onChange={(value) => handleChange('sexe', value)}
                options={[
                  { value: 'M', label: 'Masculin' },
                  { value: 'F', label: 'Féminin' },
                ]}
              />
              <Input
                label="Date de naissance"
                type="date"
                value={formData.date_naissance || ''}
                onChange={(e) => handleChange('date_naissance', e.target.value)}
                required
              />
            </div>

            <Input
              label="Nationalité"
              value={formData.nationalite || ''}
              onChange={(e) => handleChange('nationalite', e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Téléphone"
                type="tel"
                value={formData.telephone || ''}
                onChange={(e) => handleChange('telephone', e.target.value)}
                placeholder="+237600000000"
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="enseignant@example.com"
                required
              />
            </div>

            <Input
              label="Adresse"
              value={formData.adresse || ''}
              onChange={(e) => handleChange('adresse', e.target.value)}
              placeholder="Adresse complète"
            />
          </div>
        )}

        {/* Étape 2 : Informations académiques */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations académiques
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Grade"
                value={formData.grade || ''}
                onChange={(value) => handleChange('grade', value)}
                options={[
                  { value: 'ASSISTANT', label: 'Assistant' },
                  { value: 'MC', label: 'Maître de conférences' },
                  { value: 'PROFESSEUR', label: 'Professeur' },
                ]}
              />
              <Input
                label="Spécialité"
                value={formData.specialite || ''}
                onChange={(e) => handleChange('specialite', e.target.value)}
                placeholder="Ex: Informatique, Mathématiques..."
                required
              />
            </div>

            <Select
              label="Département"
              value={formData.departement_id || ''}
              onChange={(value) => handleChange('departement_id', Number(value))}
              options={[
                { value: '', label: 'Sélectionner un département' },
                ...(departementsData?.results || []).map((dept) => ({
                  value: dept.id.toString(),
                  label: `${dept.code} - ${dept.nom}`,
                })),
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Date de recrutement"
                type="date"
                value={formData.date_embauche || ''}
                onChange={(e) => handleChange('date_embauche', e.target.value)}
              />
              <Select
                label="Statut"
                value={formData.statut || 'ACTIF'}
                onChange={(value) => handleChange('statut', value)}
                options={[
                  { value: 'ACTIF', label: 'Actif' },
                  { value: 'INACTIF', label: 'Inactif' },
                  { value: 'EN_CONGE', label: 'En congé' },
                  { value: 'RETIRE', label: 'Retraité' },
                ]}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Le matricule sera généré automatiquement lors de la création
                (format: ENS-ANNÉE-XXX)
              </p>
            </div>
          </div>
        )}

        {/* Étape 3 : Documents */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>

            <div className="space-y-4">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-purple-600 hover:text-purple-700 font-medium">
                      Uploader le CV
                    </span>
                    <span className="text-gray-600"> ou glisser-déposer</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleCVChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF uniquement, max 5MB</p>
                  {formData.cv && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Fichier sélectionné : {(formData.cv as File).name}
                    </p>
                  )}
                </div>
              </label>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Remarque :</strong> Le CV peut être uploadé après la création du profil
                  dans l'onglet "Documents".
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <Button
                variant="secondary"
                onClick={handlePrevious}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Précédent
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/teachers')}
              icon={<X className="w-4 h-4" />}
            >
              Annuler
            </Button>

            {currentStep < 3 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={createTeacher.isPending || updateTeacher.isPending}
                icon={<Save className="w-4 h-4" />}
              >
                {isEditMode ? 'Enregistrer' : 'Créer l\'enseignant'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeacherForm;