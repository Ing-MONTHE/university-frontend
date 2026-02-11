import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useCreateEmprunt, useLivresDisponibles } from '@/hooks/useLibrary';
import Spinner from '@/components/ui/Spinner';
import type { EmpruntFormData } from '@/types/library.types';

export default function BorrowingForm() {
  const navigate = useNavigate();
  const { data: livresDisponibles = [] } = useLivresDisponibles();
  const createEmprunt = useCreateEmprunt();

  const [formData, setFormData] = useState<EmpruntFormData>({
    livre: 0,
    etudiant: 0,
    date_retour_prevue: '',
    notes: '',
  });

  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Simuler la recherche d'étudiants (à remplacer par une vraie API)
  const searchStudents = async (query: string) => {
    // Cette fonction devrait appeler votre API d'étudiants
    // Pour l'exemple, on retourne un tableau vide
    return [];
  };

  const handleStudentSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setStudentSearch(query);
    
    if (query.length >= 3) {
      const results = await searchStudents(query);
      // Gérer les résultats
    }
  };

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setFormData((prev) => ({ ...prev, etudiant: student.id }));
    setStudentSearch(`${student.user.first_name} ${student.user.last_name} - ${student.matricule}`);
    
    // Vérifier les conditions d'emprunt
    validateBorrowingConditions(student);
  };

  const validateBorrowingConditions = (student: any) => {
    const warnings: string[] = [];

    // Vérifier le nombre d'emprunts en cours (limite: 5)
    if (student.emprunts_en_cours >= 5) {
      warnings.push('Cet étudiant a déjà atteint la limite de 5 emprunts simultanés');
    }

    // Vérifier s'il y a des pénalités impayées
    if (student.penalites_impayees > 0) {
      warnings.push(
        `Cet étudiant a ${student.penalites_impayees.toLocaleString()} FCFA de pénalités impayées`
      );
    }

    // Vérifier s'il y a des retards
    if (student.emprunts_en_retard > 0) {
      warnings.push(
        `Cet étudiant a ${student.emprunts_en_retard} emprunt${
          student.emprunts_en_retard > 1 ? 's' : ''
        } en retard`
      );
    }

    setValidationWarnings(warnings);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'livre' || name === 'etudiant' ? Number(value) : value,
    }));
    
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const setDefaultReturnDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 15); // 15 jours par défaut
    const dateString = today.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, date_retour_prevue: dateString as string }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.etudiant || formData.etudiant === 0) {
      newErrors.etudiant = 'Veuillez sélectionner un étudiant';
    }

    if (!formData.livre || formData.livre === 0) {
      newErrors.livre = 'Veuillez sélectionner un livre';
    }

    if (!formData.date_retour_prevue) {
      newErrors.date_retour_prevue = 'La date de retour est requise';
    } else {
      const dateRetour = new Date(formData.date_retour_prevue);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateRetour <= today) {
        newErrors.date_retour_prevue = 'La date de retour doit être dans le futur';
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

    // Si des avertissements, demander confirmation
    if (validationWarnings.length > 0) {
      const confirmed = window.confirm(
        `Attention:\n${validationWarnings.join('\n')}\n\nVoulez-vous continuer quand même ?`
      );
      if (!confirmed) return;
    }

    setIsSubmitting(true);

    try {
      await createEmprunt.mutateAsync(formData);
      navigate('/admin/library/borrowings');
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLivre = livresDisponibles.find((l) => l.id === formData.livre);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/library/borrowings')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nouvel emprunt</h1>
          <p className="text-gray-600 mt-1">Enregistrer un nouvel emprunt de livre</p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Sélection étudiant */}
          <div>
            <label htmlFor="student-search" className="block text-sm font-medium text-gray-700 mb-1">
              Étudiant *
            </label>
            <input
              type="text"
              id="student-search"
              value={studentSearch}
              onChange={handleStudentSearch}
              placeholder="Rechercher par nom, prénom ou matricule..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.etudiant ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.etudiant && <p className="text-sm text-red-600 mt-1">{errors.etudiant}</p>}
            
            {/* Informations étudiant sélectionné */}
            {selectedStudent && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-blue-900">
                      {selectedStudent.user.first_name} {selectedStudent.user.last_name}
                    </p>
                    <p className="text-sm text-blue-700">Matricule: {selectedStudent.matricule}</p>
                    <p className="text-sm text-blue-700">
                      Emprunts en cours: {selectedStudent.emprunts_en_cours || 0}/5
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            )}
          </div>

          {/* Avertissements */}
          {validationWarnings.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-orange-900 mb-2">Avertissements</p>
                  <ul className="space-y-1">
                    {validationWarnings.map((warning, index) => (
                      <li key={index} className="text-sm text-orange-700">
                        • {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Sélection livre */}
          <div>
            <label htmlFor="livre" className="block text-sm font-medium text-gray-700 mb-1">
              Livre *
            </label>
            <select
              id="livre"
              name="livre"
              value={formData.livre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.livre ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un livre disponible</option>
              {livresDisponibles.map((livre) => (
                <option key={livre.id} value={livre.id}>
                  {livre.titre} - {livre.auteur} (
                  {livre.nombre_exemplaires_disponibles} disponible
                  {livre.nombre_exemplaires_disponibles > 1 ? 's' : ''})
                </option>
              ))}
            </select>
            {errors.livre && <p className="text-sm text-red-600 mt-1">{errors.livre}</p>}
            
            {/* Informations livre sélectionné */}
            {selectedLivre && (
              <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-green-900">{selectedLivre.titre}</p>
                    <p className="text-sm text-green-700">Par {selectedLivre.auteur}</p>
                    <p className="text-sm text-green-700">
                      ISBN: {selectedLivre.isbn} | Éditeur: {selectedLivre.editeur}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Stock disponible: {selectedLivre.nombre_exemplaires_disponibles} sur{' '}
                      {selectedLivre.nombre_exemplaires_total}
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                </div>
              </div>
            )}
          </div>

          {/* Date de retour prévue */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="date_retour_prevue"
                className="block text-sm font-medium text-gray-700"
              >
                Date de retour prévue *
              </label>
              <button
                type="button"
                onClick={setDefaultReturnDate}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Définir à 15 jours
              </button>
            </div>
            <input
              type="date"
              id="date_retour_prevue"
              name="date_retour_prevue"
              value={formData.date_retour_prevue}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.date_retour_prevue ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date_retour_prevue && (
              <p className="text-sm text-red-600 mt-1">{errors.date_retour_prevue}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Durée standard d'emprunt: 15 jours
            </p>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Observations particulières sur cet emprunt..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Récapitulatif */}
          {selectedStudent && selectedLivre && formData.date_retour_prevue && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Récapitulatif</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Étudiant</p>
                  <p className="font-medium text-gray-900">
                    {selectedStudent.user.first_name} {selectedStudent.user.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Livre</p>
                  <p className="font-medium text-gray-900">{selectedLivre.titre}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date d'emprunt</p>
                  <p className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Date de retour prévue</p>
                  <p className="font-medium text-gray-900">
                    {new Date(formData.date_retour_prevue).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/library/borrowings')}
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
                  Enregistrer l'emprunt
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}