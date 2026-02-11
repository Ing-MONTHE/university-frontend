// src/pages/admin/finance/FraisScolariteForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFraisScolarite } from '@/hooks/useFinances';
import { FraisScolariteFormData } from '@/types/finance.types';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

const FraisScolariteForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createFrais, updateFrais, frais } = useFraisScolarite();

  const [formData, setFormData] = useState<FraisScolariteFormData>({
    filiere: '',
    niveau: '',
    annee_academique: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
    montant_total: 0,
    montant_inscription: 0,
    nombre_tranches: 3,
    montants_tranches: [0, 0, 0],
    date_limite_paiement: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && frais.length > 0) {
      const existingFrais = frais.find((f) => f.id === id);
      if (existingFrais) {
        setFormData({
          filiere: existingFrais.filiere,
          niveau: existingFrais.niveau,
          annee_academique: existingFrais.annee_academique,
          montant_total: existingFrais.montant_total,
          montant_inscription: existingFrais.montant_inscription,
          nombre_tranches: existingFrais.nombre_tranches,
          montants_tranches: existingFrais.montants_tranches,
          date_limite_paiement: existingFrais.date_limite_paiement.split('T')[0],
        });
      }
    }
  }, [id, frais]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('montant') || name === 'nombre_tranches' ? Number(value) : value,
    }));
  };

  const handleTrancheChange = (index: number, value: number) => {
    const newTranches = [...formData.montants_tranches];
    newTranches[index] = value;
    setFormData((prev) => ({ ...prev, montants_tranches: newTranches }));
  };

  const addTranche = () => {
    setFormData((prev) => ({
      ...prev,
      nombre_tranches: prev.nombre_tranches + 1,
      montants_tranches: [...prev.montants_tranches, 0],
    }));
  };

  const removeTranche = (index: number) => {
    if (formData.nombre_tranches > 1) {
      const newTranches = formData.montants_tranches.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        nombre_tranches: prev.nombre_tranches - 1,
        montants_tranches: newTranches,
      }));
    }
  };

  const distributeEqually = () => {
    const montantParTranche = Math.floor(
      (formData.montant_total - formData.montant_inscription) / formData.nombre_tranches
    );
    const newTranches = Array(formData.nombre_tranches).fill(montantParTranche);
    setFormData((prev) => ({ ...prev, montants_tranches: newTranches }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await updateFrais(id, formData);
      } else {
        await createFrais(formData);
      }
      navigate('/admin/finance/frais-scolarite');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const filieres = ['Informatique', 'Gestion', 'Marketing', 'Finance', 'Droit', 'Médecine'];
  const niveaux = ['L1', 'L2', 'L3', 'M1', 'M2'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/finance/frais-scolarite')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à la liste
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Modifier les Frais' : 'Nouveau Frais de Scolarité'}
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filière <span className="text-red-500">*</span>
            </label>
            <select
              name="filiere"
              value={formData.filiere}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner une filière</option>
              {filieres.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau <span className="text-red-500">*</span>
            </label>
            <select
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner un niveau</option>
              {niveaux.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Année Académique <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="annee_academique"
              value={formData.annee_academique}
              onChange={handleChange}
              placeholder="2024-2025"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Limite de Paiement <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date_limite_paiement"
              value={formData.date_limite_paiement}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Montants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant Total (XAF) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="montant_total"
              value={formData.montant_total}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant Inscription (XAF) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="montant_inscription"
              value={formData.montant_inscription}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tranches */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tranches de Paiement <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={distributeEqually}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Répartir équitablement
              </button>
              <button
                type="button"
                onClick={addTranche}
                className="flex items-center text-sm text-green-600 hover:text-green-800"
              >
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {formData.montants_tranches.map((montant, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700 w-24">
                  Tranche {index + 1}
                </span>
                <input
                  type="number"
                  value={montant}
                  onChange={(e) => handleTrancheChange(index, Number(e.target.value))}
                  min="0"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.nombre_tranches > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTranche(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 mt-2">
            Total des tranches:{' '}
            {formData.montants_tranches.reduce((a, b) => a + b, 0).toLocaleString()} XAF
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/finance/frais-scolarite')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <Save className="w-5 h-5 mr-2" />
            {loading ? 'Enregistrement...' : id ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FraisScolariteForm;