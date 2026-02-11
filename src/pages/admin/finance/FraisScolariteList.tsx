// src/pages/admin/finance/FraisScolariteList.tsx

import React, { useEffect, useState } from 'react';
import { useFraisScolarite } from '@/hooks/useFinances';
import { FraisScolarite } from '@/types/finance.types';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FraisScolariteList: React.FC = () => {
  const navigate = useNavigate();
  const { frais, loading, error, fetchFrais, deleteFrais } = useFraisScolarite();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('');
  const [filterNiveau, setFilterNiveau] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFrais, setSelectedFrais] = useState<FraisScolarite | null>(null);

  useEffect(() => {
    fetchFrais();
  }, [fetchFrais]);

  const handleDelete = async () => {
    if (selectedFrais) {
      try {
        await deleteFrais(selectedFrais.id);
        setShowDeleteModal(false);
        setSelectedFrais(null);
      } catch (err) {
        console.error('Erreur lors de la suppression', err);
      }
    }
  };

  const filteredFrais = frais.filter((f) => {
    const matchSearch =
      f.filiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.niveau.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.annee_academique.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFiliere = !filterFiliere || f.filiere === filterFiliere;
    const matchNiveau = !filterNiveau || f.niveau === filterNiveau;
    return matchSearch && matchFiliere && matchNiveau;
  });

  const filieres = Array.from(new Set(frais.map((f) => f.filiere)));
  const niveaux = Array.from(new Set(frais.map((f) => f.niveau)));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && frais.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Frais de Scolarité</h1>
          <p className="text-gray-600 mt-1">Gestion des frais par filière et niveau</p>
        </div>
        <button
          onClick={() => navigate('/admin/finance/frais-scolarite/nouveau')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Frais
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterFiliere}
            onChange={(e) => setFilterFiliere(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Toutes les filières</option>
            {filieres.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select
            value={filterNiveau}
            onChange={(e) => setFilterNiveau(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les niveaux</option>
            {niveaux.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterFiliere('');
              setFilterNiveau('');
            }}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Année Académique
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tranches
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFrais.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {f.filiere}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.niveau}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {f.annee_academique}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(f.montant_total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(f.montant_inscription)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {f.nombre_tranches} × {formatCurrency(f.montants_tranches[0])}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/finance/frais-scolarite/${f.id}/modifier`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFrais(f);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFrais.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucun frais de scolarité trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce frais de scolarité ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedFrais(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraisScolariteList;