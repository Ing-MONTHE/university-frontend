// src/pages/admin/finance/PaiementForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePaiements, useEtudiants } from '@/hooks/useFinances';
import { PaiementFormData, Etudiant } from '@/types/finance.types';
import { ArrowLeft, Save, Search, Check } from 'lucide-react';

const PaiementForm: React.FC = () => {
  const navigate = useNavigate();
  const { createPaiement } = usePaiements();
  const { etudiants, searchEtudiants } = useEtudiants();

  const [formData, setFormData] = useState<PaiementFormData>({
    etudiant_id: '',
    montant: 0,
    mode_paiement: 'ESPECES',
    reference_paiement: '',
    type_frais: 'SCOLARITE',
    date_paiement: new Date().toISOString().split('T')[0],
    remarques: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState<Etudiant | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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
    if (searchQuery.length >= 2) {
      const timer = setTimeout(() => {
        searchEtudiants(searchQuery);
        setShowSuggestions(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, searchEtudiants]);

  const handleEtudiantSelect = (etudiant: Etudiant) => {
    setSelectedEtudiant(etudiant);
    setFormData((prev) => ({ ...prev, etudiant_id: etudiant.id }));
    setSearchQuery(`${etudiant.nom} ${etudiant.prenom} - ${etudiant.matricule}`);
    setShowSuggestions(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'montant' ? Number(value) : value,
    }));
  };

  const generateReference = () => {
    const date = new Date();
    const ref = `PAY${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate()
    ).padStart(2, '0')}${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')}`;
    setFormData((prev) => ({ ...prev, reference_paiement: ref }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.etudiant_id) {
      setError('Veuillez sélectionner un étudiant');
      setLoading(false);
      return;
    }

    try {
      await createPaiement(formData);
      navigate('/admin/finance/paiements');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/finance/paiements')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à la liste
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Nouveau Paiement</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Student Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Étudiant <span className="text-red-500">*</span>
          </label>
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, prénom ou matricule..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {selectedEtudiant && (
                <Check className="absolute right-3 top-3 w-5 h-5 text-green-600" />
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && etudiants.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {etudiants.map((etudiant) => (
                  <button
                    key={etudiant.id}
                    type="button"
                    onClick={() => handleEtudiantSelect(etudiant)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">
                      {etudiant.nom} {etudiant.prenom}
                    </div>
                    <div className="text-sm text-gray-600">
                      {etudiant.matricule} - {etudiant.filiere} - {etudiant.niveau}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedEtudiant && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Sélectionné:</strong> {selectedEtudiant.nom} {selectedEtudiant.prenom} -{' '}
                {selectedEtudiant.matricule}
              </p>
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (XAF) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode de Paiement <span className="text-red-500">*</span>
            </label>
            <select
              name="mode_paiement"
              value={formData.mode_paiement}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ESPECES">Espèces</option>
              <option value="CARTE">Carte Bancaire</option>
              <option value="VIREMENT">Virement</option>
              <option value="MOBILE_MONEY">Mobile Money</option>
              <option value="CHEQUE">Chèque</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Référence de Paiement <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                name="reference_paiement"
                value={formData.reference_paiement}
                onChange={handleChange}
                placeholder="REF-XXXXX"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={generateReference}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Générer
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de Frais <span className="text-red-500">*</span>
            </label>
            <select
              name="type_frais"
              value={formData.type_frais}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SCOLARITE">Scolarité</option>
              <option value="INSCRIPTION">Inscription</option>
              <option value="EXAMEN">Examen</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de Paiement <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date_paiement"
              value={formData.date_paiement}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Remarques</label>
          <textarea
            name="remarques"
            value={formData.remarques}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Remarques optionnelles..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/finance/paiements')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || !formData.etudiant_id}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer et Générer Facture'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaiementForm;