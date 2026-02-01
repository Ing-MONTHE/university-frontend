// Formulaire multi-étapes pour créer/modifier un étudiant

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, X, Upload, User, GraduationCap, Users as UsersIcon, FileText } from 'lucide-react';
import { useCreateStudent, useUpdateStudent, useStudent } from '../../../hooks/useStudents';
import type { EtudiantCreate, SexeEtudiant, StatutEtudiant } from '../../../types/student.types';

interface FormData extends Omit<EtudiantCreate, 'photo'> {
  photo?: File | null;
  photoPreview?: string;
}

const STEPS = [
  { id: 1, title: 'Informations personnelles', icon: User },
  { id: 2, title: 'Informations académiques', icon: GraduationCap },
  { id: 3, title: 'Informations tuteur', icon: UsersIcon },
  { id: 4, title: 'Documents', icon: FileText },
];

const StudentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Queries et mutations
  const { data: existingStudent, isLoading: loadingStudent } = useStudent(Number(id));
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  // États
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    sexe: 'M',
    date_naissance: '',
    lieu_naissance: '',
    nationalite: 'Camerounaise',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    pays: 'Cameroun',
    tuteur_nom: '',
    tuteur_telephone: '',
    tuteur_email: '',
    statut: 'ACTIF',
    photo: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Charger les données existantes en mode édition
  useEffect(() => {
    if (existingStudent) {
      setFormData({
        nom: existingStudent.user.last_name,
        prenom: existingStudent.user.first_name,
        sexe: existingStudent.sexe,
        date_naissance: existingStudent.date_naissance,
        lieu_naissance: existingStudent.lieu_naissance,
        nationalite: existingStudent.nationalite,
        telephone: existingStudent.telephone,
        email: existingStudent.email_personnel,
        adresse: existingStudent.adresse,
        ville: existingStudent.ville,
        pays: existingStudent.pays,
        tuteur_nom: existingStudent.tuteur_nom,
        tuteur_telephone: existingStudent.tuteur_telephone,
        tuteur_email: existingStudent.tuteur_email,
        statut: existingStudent.statut,
        photo: null,
        photoPreview: existingStudent.photo,
      });
    }
  }, [existingStudent]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Effacer l'erreur du champ
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.nom) newErrors.nom = 'Le nom est requis';
      if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
      if (!formData.date_naissance) newErrors.date_naissance = 'La date de naissance est requise';
      if (!formData.lieu_naissance) newErrors.lieu_naissance = 'Le lieu de naissance est requis';
      if (!formData.telephone) newErrors.telephone = 'Le téléphone est requis';
      if (!formData.email) {
        newErrors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    try {
      if (isEditing && id) {
        // Mode édition
        const updateData = {
          date_naissance: formData.date_naissance,
          lieu_naissance: formData.lieu_naissance,
          sexe: formData.sexe,
          nationalite: formData.nationalite,
          telephone: formData.telephone,
          email_personnel: formData.email,
          adresse: formData.adresse,
          ville: formData.ville,
          pays: formData.pays,
          tuteur_nom: formData.tuteur_nom,
          tuteur_telephone: formData.tuteur_telephone,
          tuteur_email: formData.tuteur_email,
          statut: formData.statut,
        };
        await updateStudent.mutateAsync({ id: Number(id), data: updateData });
      } else {
        // Mode création
        const createData: EtudiantCreate = {
          nom: formData.nom,
          prenom: formData.prenom,
          sexe: formData.sexe,
          date_naissance: formData.date_naissance,
          lieu_naissance: formData.lieu_naissance,
          nationalite: formData.nationalite,
          telephone: formData.telephone,
          email: formData.email,
          adresse: formData.adresse,
          ville: formData.ville,
          pays: formData.pays,
          tuteur_nom: formData.tuteur_nom,
          tuteur_telephone: formData.tuteur_telephone,
          tuteur_email: formData.tuteur_email,
          statut: formData.statut,
          photo: formData.photo || undefined,
        };
        await createStudent.mutateAsync(createData);
      }
      navigate('/admin/students');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  if (loadingStudent) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/students')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Modifier l\'étudiant' : 'Nouvel étudiant'}
        </h1>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4 hidden md:block">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                      Étape {step.id}
                    </p>
                    <p className="text-sm text-gray-500">{step.title}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
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

      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Étape 1: Informations personnelles */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informations personnelles
              </h2>

              {/* Photo */}
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {formData.photoPreview ? (
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-2">
                    <span className="sr-only">Choisir une photo</span>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-flex">
                      <Upload className="w-4 h-4" />
                      Choisir une photo
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Photo de profil (optionnel)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.nom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isEditing}
                  />
                  {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.prenom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isEditing}
                  />
                  {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexe *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sexe"
                        value="M"
                        checked={formData.sexe === 'M'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Masculin
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sexe"
                        value="F"
                        checked={formData.sexe === 'F'}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      Féminin
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    value={formData.date_naissance}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.date_naissance ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date_naissance && (
                    <p className="mt-1 text-sm text-red-600">{errors.date_naissance}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de naissance *
                  </label>
                  <input
                    type="text"
                    name="lieu_naissance"
                    value={formData.lieu_naissance}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lieu_naissance ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lieu_naissance && (
                    <p className="mt-1 text-sm text-red-600">{errors.lieu_naissance}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationalité *
                  </label>
                  <select
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Camerounaise">Camerounaise</option>
                    <option value="Française">Française</option>
                    <option value="Congolaise">Congolaise</option>
                    <option value="Gabonaise">Gabonaise</option>
                    <option value="Tchadienne">Tchadienne</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+237 6XX XXX XXX"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.telephone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.telephone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <input
                    type="text"
                    name="pays"
                    value={formData.pays}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète
                </label>
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Étape 2: Informations académiques */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informations académiques
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut *
                  </label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ACTIF">Actif</option>
                    <option value="SUSPENDU">Suspendu</option>
                    <option value="DIPLOME">Diplômé</option>
                    <option value="EXCLU">Exclu</option>
                    <option value="ABANDONNE">Abandonné</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Les informations de filière, niveau et année d'inscription
                  seront gérées lors de l'inscription de l'étudiant.
                </p>
              </div>
            </div>
          )}

          {/* Étape 3: Informations tuteur */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informations du tuteur/parent
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du tuteur
                  </label>
                  <input
                    type="text"
                    name="tuteur_nom"
                    value={formData.tuteur_nom}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone du tuteur
                  </label>
                  <input
                    type="tel"
                    name="tuteur_telephone"
                    value={formData.tuteur_telephone}
                    onChange={handleChange}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email du tuteur
                  </label>
                  <input
                    type="email"
                    name="tuteur_email"
                    value={formData.tuteur_email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 4: Documents */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Documents
              </h2>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>À venir:</strong> La gestion des documents sera implémentée dans une
                  prochaine version.
                </p>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/students')}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={createStudent.isPending || updateStudent.isPending}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {createStudent.isPending || updateStudent.isPending
                    ? 'Enregistrement...'
                    : 'Enregistrer'}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
