import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBourses, useEtudiants } from '@/hooks/useFinances';
import { BourseFormData, Etudiant } from '@/types/finance.types';
import { ArrowLeft, Save, Search, Check } from 'lucide-react';

const BourseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createBourse, updateBourse, bourses } = useBourses();
  const { etudiants, searchEtudiants } = useEtudiants();

  const [formData, setFormData] = useState<BourseFormData>({
      etudiant_id: '',
      type_bourse: 'ETAT',
      pourcentage_exoneration: 0,
      montant_bourse: 0,
      date_debut: '',
      date_fin: '',
      statut: 'ACTIVE',
      organisme_financeur: '',
      remarques: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (id && bourses.length > 0) {
        const existingBourse = bourses.find((b) => b.id === id);
        if (existingBourse) {
          setFormData({
            etudiant_id: existingBourse.etudiant_id,
            type_bourse: existingBourse.type_bourse,
            pourcentage_exoneration: existingBourse.pourcentage_exoneration,
            montant_bourse: existingBourse.montant_bourse,
            date_debut: existingBourse.date_debut.split('T')[0],
            date_fin: existingBourse.date_fin.split('T')[0],
            statut: existingBourse.statut,
            organisme_financeur: existingBourse.organisme_financeur || '',
            remarques: existingBourse.remarques || '',
          });
          setSearchQuery(`${existingBourse.etudiant_nom} ${existingBourse.etudiant_prenom} - ${existingBourse.etudiant_matricule}');}`)
        }
      }
    }, [id, bourses]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setShowSuggestions(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
      if (searchQuery.length >= 2 && !id) {
        const timer = setTimeout(() => {
          searchEtudiants(searchQuery);
          setShowSuggestions(true);
        }, 300);
        return () => clearTimeout(timer);
      }
      else {
        setShowSuggestions(false);
      }
    }, [searchQuery, searchEtudiants, id]);

    const handleEtudiantSelect = (etudiant: Etudiant) => {
      setSelectedEtudiant(etudiant);
      setFormData((prev) => ({ ...prev, etudiant_id: etudiant.id}));
      setSearchQuery(`${etudiant.nom} ${etudiant.prenom} - ${etudiant.matricule}`);
      setShowSuggestions(false)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name.includes('pourcentages') || name.includes('montant') ? Number(value) : value,
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      if (!formData.etudiant_id && !id) {
        setError('veillez selectionner un etudiant');
        setLoading(false);
        return;
      }

      try {
        if (id) {
          await updateBourse(id, formData);
        }
        else {
          await createBourse(formData);
        }
        navigate('/admin/finances/bourses');
      }
      catch (err: any) {
        setError(err.response?.data?.message || 'Une erreur est survenue');
      }
      finally {
        setLoading(false);
      }
    };

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/finance/bourses')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à la liste
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Modifier la Bourse' : 'Nouvelle Bourse'}
          </h1>
        </div>
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {!id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etudiant <span className="text-red-500">*</span>
              </label>
              <div className="relative ref={searchRef}">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Recherche par nom, prenom ou matricule..."
                      className="w-full pl-10 pr-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    {selectedEtudiant && <Check className="absolute right-3 top-3 w-5 h-5 text-green-600" />}
                  </Search>
                </div>
                {showSuggestions && etudiants.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {etudiants.map((etudiant) => (
                      <button
                        key={etudiant.id}
                        type="button"
                        onClick={() => handleEtudiantSelect(etudiant)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{etudiant.nom} {etudiant.prenom}</div>
                        <div className="text-sm text-gray-600">{etudiant.matricule} - {etudiant.filiere} - {etudiant.niveau}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de Bourse <span className="text-red-500">*</span>
              </label>
              <select
                name="type_bourse"
                value={formData.type_bourse}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ETAT">Bourse Etat</option>
                <option value="EXCELLENCE">Excellence</option>
                <option value="SOCIALE">Sociale</option>
                <option value="MERITE">Mérite</option>
                <option value="AUTRE">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pourcentage d'Exonération (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="pourcentage_exoneration"
                value={formData.pourcentage_exoneration}
                onChange={handleChange}
                min="0"
                max="100"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant de la Bourse (XAF) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="montant_bourse"
                value={formData.montant_bourse}
                onChange={handleChange}
                min="0"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="EXPIREE">Expirée</option>
                <option value="SUSPENDUE">Suspendue</option>
                <option value="ANNULEE">Annulée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de Début <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de Fin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organisme Financeur
            </label>
            <input
              type="text"
              name="organisme_financeur"
              value={formData.organisme_financeur}
              onChange={handleChange}
              placeholder="Ex: Ministère de l'Enseignement Supérieur, Fondation XYZ..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarques
            </label>
            <textarea
              name="remarques"
              value={formData.remarques}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/finance/bourses')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || (!formData.etudiant_id && !id)}
              className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? 'Enregistrement...' : id ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  export default BourseForm;