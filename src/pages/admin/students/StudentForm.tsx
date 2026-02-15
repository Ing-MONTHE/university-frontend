// Formulaire de création/édition d'étudiant (3 étapes)

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Upload, X, User, GraduationCap, FileText } from 'lucide-react';
import { useStudent, useCreateStudent, useUpdateStudent } from '@/hooks/useStudents';
import { Card, Button, Input, Select, Spinner } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import type { EtudiantCreate } from '@/types/student.types';

const StudentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Queries
  const { data: student, isLoading: loadingStudent } = useStudent(Number(id));
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  // États
  const [currentStep, setCurrentStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EtudiantCreate>>({
    sexe: 'M',
    nationalite: 'Camerounaise',
    pays: 'Cameroun',
    statut: 'ACTIF',
  });

  // Charger les données en mode édition
  useEffect(() => {
    if (student && isEditMode) {
      setFormData({
        nom: student.nom,
        prenom: student.prenom,
        sexe: student.sexe,
        date_naissance: student.date_naissance,
        lieu_naissance: student.lieu_naissance,
        nationalite: student.nationalite,
        telephone: student.telephone,
        email: student.email_personnel || student.email,
        adresse: student.adresse,
        ville: student.ville,
        pays: student.pays,
        tuteur_nom: student.tuteur_nom,
        tuteur_telephone: student.tuteur_telephone,
        tuteur_email: student.tuteur_email,
        statut: student.statut,
      });
      if (student.photo_url) {
        setPhotoPreview(student.photo_url);
      }
    }
  }, [student, isEditMode]);

  // Handlers
  const handleChange = <K extends keyof Partial<EtudiantCreate>>(
    field: K,
    value: Partial<EtudiantCreate>[K]
  ) => {
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

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(
        formData.nom &&
        formData.prenom &&
        formData.sexe &&
        formData.date_naissance &&
        formData.lieu_naissance &&
        formData.nationalite
      );
    }
    if (step === 2) {
      return !!(formData.telephone && formData.email);
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
      const submitData = {
        ...formData,
        email: formData.email!,
        telephone: formData.telephone!,
      };
      
      if (isEditMode) {
        // Mettre à jour les données
        await updateStudent.mutateAsync({
          id: Number(id),
          data: submitData,
        });
        
        // Upload photo séparément si elle a changé
        if (formData.photo instanceof File) {
          const { uploadPhoto } = await import('@/api/student.api');
          await uploadPhoto(Number(id), formData.photo);
        }
      } else {
        await createStudent.mutateAsync(submitData as EtudiantCreate);
      }
      navigate('/admin/students');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  if (loadingStudent && isEditMode) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Informations personnelles', icon: User },
    { number: 2, title: 'Contact & Tuteur', icon: GraduationCap },
    { number: 3, title: 'Documents', icon: FileText },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/students')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Modifier un étudiant' : 'Nouvel étudiant'}
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
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <p
                    className={`text-sm font-medium text-center ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
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
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700">
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
                onChange={(value) => handleChange('sexe', value as 'M' | 'F')}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Lieu de naissance"
                value={formData.lieu_naissance || ''}
                onChange={(e) => handleChange('lieu_naissance', e.target.value)}
                required
              />
              <Input
                label="Nationalité"
                value={formData.nationalite || ''}
                onChange={(e) => handleChange('nationalite', e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Étape 2 : Contact & Tuteur */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact & Tuteur
            </h2>

            {/* Contact de l'étudiant */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-3">Contact de l'étudiant</h3>
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
                  placeholder="etudiant@example.com"
                  required
                />
                <Input
                  label="Ville"
                  value={formData.ville || ''}
                  onChange={(e) => handleChange('ville', e.target.value)}
                />
                <Input
                  label="Pays"
                  value={formData.pays || 'Cameroun'}
                  onChange={(e) => handleChange('pays', e.target.value)}
                />
              </div>
              <div className="mt-4">
                <Input
                  label="Adresse complète"
                  value={formData.adresse || ''}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  placeholder="Rue, quartier..."
                />
              </div>
            </div>

            {/* Informations du tuteur */}
            <div className="pt-4 border-t">
              <h3 className="text-md font-medium text-gray-700 mb-3">Informations du tuteur/parent</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom du tuteur"
                  value={formData.tuteur_nom || ''}
                  onChange={(e) => handleChange('tuteur_nom', e.target.value)}
                />
                <Input
                  label="Téléphone du tuteur"
                  type="tel"
                  value={formData.tuteur_telephone || ''}
                  onChange={(e) => handleChange('tuteur_telephone', e.target.value)}
                />
                <Input
                  label="Email du tuteur"
                  type="email"
                  value={formData.tuteur_email || ''}
                  onChange={(e) => handleChange('tuteur_email', e.target.value)}
                />
                <Select
                  label="Statut"
                  value={formData.statut || 'ACTIF'}
                  onChange={(value) => handleChange('statut', value as any)}
                  options={[
                    { value: 'ACTIF', label: 'Actif' },
                    { value: 'SUSPENDU', label: 'Suspendu' },
                    { value: 'DIPLOME', label: 'Diplômé' },
                    { value: 'EXCLU', label: 'Exclu' },
                    { value: 'ABANDONNE', label: 'Abandon' },
                  ]}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Le matricule sera généré automatiquement lors de la création
                (format: ETU-ANNÉE-XXX)
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
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Uploader des documents
                    </span>
                    <span className="text-gray-600"> ou glisser-déposer</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG - max 5MB</p>
                </div>
              </label>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Remarque :</strong> Les documents peuvent être uploadés après la création
                  du profil dans l'onglet "Documents".
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
              onClick={() => navigate('/admin/students')}
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
                disabled={createStudent.isPending || updateStudent.isPending}
                icon={<Save className="w-4 h-4" />}
              >
                {isEditMode ? 'Enregistrer' : 'Créer l\'étudiant'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentForm;