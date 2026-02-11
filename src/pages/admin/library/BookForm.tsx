import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, BookOpen } from 'lucide-react';
import {
  useLivre,
  useCreateLivre,
  useUpdateLivre,
  useCategories,
} from '@/hooks/useLibrary';
import Spinner from '@/components/ui/Spinner';
import type { LivreFormData } from '@/types/library.types';

export default function BookForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: livre, isLoading: isLoadingLivre } = useLivre(Number(id));
  const { data: categories = [] } = useCategories();
  const createLivre = useCreateLivre();
  const updateLivre = useUpdateLivre();

  const [formData, setFormData] = useState<LivreFormData>({
    isbn: '',
    titre: '',
    auteur: '',
    editeur: '',
    annee_publication: new Date().getFullYear(),
    edition: '',
    categorie: 0,
    resume: '',
    nombre_exemplaires_total: 1,
    nombre_exemplaires_disponibles: 1,
    emplacement: '',
    photo_couverture: null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (livre && isEditMode) {
      setFormData({
        isbn: livre.isbn,
        titre: livre.titre,
        auteur: livre.auteur,
        editeur: livre.editeur,
        annee_publication: livre.annee_publication,
        edition: livre.edition || '',
        categorie: typeof livre.categorie === 'object' ? livre.categorie.id : livre.categorie,
        resume: livre.resume || '',
        nombre_exemplaires_total: livre.nombre_exemplaires_total,
        nombre_exemplaires_disponibles: livre.nombre_exemplaires_disponibles,
        emplacement: livre.emplacement || '',
        photo_couverture: null,
      });
      if (livre.photo_couverture) {
        setPreviewImage(livre.photo_couverture);
      }
    }
  }, [livre, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? Number(value) : 0,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo_couverture: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, photo_couverture: null }));
    setPreviewImage(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'L\'ISBN est requis';
    } else if (!/^\d{10}(\d{3})?$/.test(formData.isbn.replace(/-/g, ''))) {
      newErrors.isbn = 'L\'ISBN doit contenir 10 ou 13 chiffres';
    }

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }

    if (!formData.auteur.trim()) {
      newErrors.auteur = 'L\'auteur est requis';
    }

    if (!formData.editeur.trim()) {
      newErrors.editeur = 'L\'éditeur est requis';
    }

    if (!formData.annee_publication || formData.annee_publication < 1000 || formData.annee_publication > 9999) {
      newErrors.annee_publication = 'L\'année doit être entre 1000 et 9999';
    }

    if (!formData.categorie || formData.categorie === 0) {
      newErrors.categorie = 'La catégorie est requise';
    }

    if (formData.nombre_exemplaires_total < 1) {
      newErrors.nombre_exemplaires_total = 'Le nombre d\'exemplaires doit être au moins 1';
    }

    if (isEditMode) {
      if (
        formData.nombre_exemplaires_disponibles! < 0 ||
        formData.nombre_exemplaires_disponibles! > formData.nombre_exemplaires_total
      ) {
        newErrors.nombre_exemplaires_disponibles =
          'Le nombre disponible doit être entre 0 et le total';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateLivre.mutateAsync({
          id: Number(id),
          data: formData,
        });
      } else {
        await createLivre.mutateAsync(formData);
      }
      navigate('/admin/library/books');
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingLivre && isEditMode) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/library/books')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Modifier le livre' : 'Ajouter un livre'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? 'Modifiez les informations du livre'
              : 'Ajoutez un nouveau livre au catalogue'}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Photo de couverture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo de couverture
            </label>
            <div className="flex items-start gap-4">
              <div className="w-48 h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {previewImage ? 'Changer l\'image' : 'Télécharger une image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {previewImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span className="text-sm font-medium">Supprimer l\'image</span>
                  </button>
                )}
                <p className="text-xs text-gray-500">
                  Format recommandé: JPG, PNG. Taille max: 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Informations bibliographiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN *
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="978-3-16-148410-0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.isbn ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.isbn && <p className="text-sm text-red-600 mt-1">{errors.isbn}</p>}
            </div>

            <div>
              <label htmlFor="categorie" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                id="categorie"
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.categorie ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
              {errors.categorie && <p className="text-sm text-red-600 mt-1">{errors.categorie}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Le titre complet du livre"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.titre ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.titre && <p className="text-sm text-red-600 mt-1">{errors.titre}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="auteur" className="block text-sm font-medium text-gray-700 mb-1">
                Auteur *
              </label>
              <input
                type="text"
                id="auteur"
                name="auteur"
                value={formData.auteur}
                onChange={handleChange}
                placeholder="Nom de l'auteur"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.auteur ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.auteur && <p className="text-sm text-red-600 mt-1">{errors.auteur}</p>}
            </div>

            <div>
              <label htmlFor="editeur" className="block text-sm font-medium text-gray-700 mb-1">
                Éditeur *
              </label>
              <input
                type="text"
                id="editeur"
                name="editeur"
                value={formData.editeur}
                onChange={handleChange}
                placeholder="Nom de l'éditeur"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.editeur ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.editeur && <p className="text-sm text-red-600 mt-1">{errors.editeur}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="annee_publication"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Année de publication *
              </label>
              <input
                type="number"
                id="annee_publication"
                name="annee_publication"
                value={formData.annee_publication}
                onChange={handleNumberChange}
                min="1000"
                max="9999"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.annee_publication ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.annee_publication && (
                <p className="text-sm text-red-600 mt-1">{errors.annee_publication}</p>
              )}
            </div>

            <div>
              <label htmlFor="edition" className="block text-sm font-medium text-gray-700 mb-1">
                Édition
              </label>
              <input
                type="text"
                id="edition"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
                placeholder="1ère édition, 2e édition révisée..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
              Résumé
            </label>
            <textarea
              id="resume"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              rows={4}
              placeholder="Bref résumé du contenu du livre..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Gestion des exemplaires */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des exemplaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="nombre_exemplaires_total"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre total d'exemplaires *
                </label>
                <input
                  type="number"
                  id="nombre_exemplaires_total"
                  name="nombre_exemplaires_total"
                  value={formData.nombre_exemplaires_total}
                  onChange={handleNumberChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nombre_exemplaires_total ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nombre_exemplaires_total && (
                  <p className="text-sm text-red-600 mt-1">{errors.nombre_exemplaires_total}</p>
                )}
              </div>

              {isEditMode && (
                <div>
                  <label
                    htmlFor="nombre_exemplaires_disponibles"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Exemplaires disponibles *
                  </label>
                  <input
                    type="number"
                    id="nombre_exemplaires_disponibles"
                    name="nombre_exemplaires_disponibles"
                    value={formData.nombre_exemplaires_disponibles}
                    onChange={handleNumberChange}
                    min="0"
                    max={formData.nombre_exemplaires_total}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.nombre_exemplaires_disponibles ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.nombre_exemplaires_disponibles && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.nombre_exemplaires_disponibles}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="emplacement" className="block text-sm font-medium text-gray-700 mb-1">
                  Emplacement
                </label>
                <input
                  type="text"
                  id="emplacement"
                  name="emplacement"
                  value={formData.emplacement}
                  onChange={handleChange}
                  placeholder="Rayon A3, Étagère 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/library/books')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? 'Modifier' : 'Ajouter'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}