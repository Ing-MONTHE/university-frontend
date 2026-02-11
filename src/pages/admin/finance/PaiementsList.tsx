// src/pages/admin/finance/PaiementsList.tsx

import React, { useEffect, useState } from 'react';
import { usePaiements } from '@/hooks/useFinances';
import { Paiement } from '@/types/finance.types';
import { Plus, Search, Download, Eye, FileText, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { paiementsApi } from '@/api/finance.api';

const PaiementsList: React.FC = () => {
  const navigate = useNavigate();
  const { paiements, loading, error, fetchPaiements, downloadFacture } = usePaiements();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    date_debut: '',
    date_fin: '',
    statut: '',
    mode_paiement: '',
    type_frais: '',
  });
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);

  useEffect(() => {
    fetchPaiements();
  }, [fetchPaiements]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchPaiements(filters);
  };

  const resetFilters = () => {
    setFilters({
      date_debut: '',
      date_fin: '',
      statut: '',
      mode_paiement: '',
      type_frais: '',
    });
    fetchPaiements();
  };

  const filteredPaiements = paiements.filter((p) => {
    const matchSearch =
      p.etudiant_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.etudiant_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.etudiant_matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.reference_paiement.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (statut: string) => {
    const styles = {
      VALIDE: 'bg-green-100 text-green-800',
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
      REJETE: 'bg-red-100 text-red-800',
      ANNULE: 'bg-gray-100 text-gray-800',
    };
    return styles[statut as keyof typeof styles] || styles.EN_ATTENTE;
  };

  const openPDFModal = (paiement: Paiement) => {
    setSelectedPaiement(paiement);
    setShowPDFModal(true);
  };

  if (loading && paiements.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-600 mt-1">Liste de tous les paiements enregistrés</p>
        </div>
        <button
          onClick={() => navigate('/admin/finance/paiements/nouveau')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Paiement
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

          <input
            type="date"
            value={filters.date_debut}
            onChange={(e) => handleFilterChange('date_debut', e.target.value)}
            placeholder="Date début"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <input
            type="date"
            value={filters.date_fin}
            onChange={(e) => handleFilterChange('date_fin', e.target.value)}
            placeholder="Date fin"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <select
            value={filters.statut}
            onChange={(e) => handleFilterChange('statut', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="VALIDE">Validé</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="REJETE">Rejeté</option>
            <option value="ANNULE">Annulé</option>
          </select>

          <select
            value={filters.mode_paiement}
            onChange={(e) => handleFilterChange('mode_paiement', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les modes</option>
            <option value="ESPECES">Espèces</option>
            <option value="CARTE">Carte</option>
            <option value="VIREMENT">Virement</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="CHEQUE">Chèque</option>
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={resetFilters}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Réinitialiser
          </button>
          <button
            onClick={applyFilters}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Appliquer
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Paiements</p>
          <p className="text-2xl font-bold text-gray-900">{filteredPaiements.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Montant Total</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(filteredPaiements.reduce((sum, p) => sum + p.montant, 0))}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Validés</p>
          <p className="text-2xl font-bold text-blue-600">
            {filteredPaiements.filter((p) => p.statut === 'VALIDE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">En Attente</p>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredPaiements.filter((p) => p.statut === 'EN_ATTENTE').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPaiements.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {p.reference_paiement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {p.etudiant_nom} {p.etudiant_prenom}
                      </div>
                      <div className="text-gray-500">{p.etudiant_matricule}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(p.date_paiement)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(p.montant)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {p.mode_paiement.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.type_frais}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(p.statut)}`}
                    >
                      {p.statut.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openPDFModal(p)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir facture"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => downloadFacture(p.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Télécharger facture"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPaiements.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Aucun paiement trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Modal */}
      {showPDFModal && selectedPaiement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Facture - {selectedPaiement.reference_paiement}
              </h3>
              <button
                onClick={() => setShowPDFModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={paiementsApi.getFactureURL(selectedPaiement.id)}
                className="w-full h-full"
                title="Facture PDF"
              />
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => downloadFacture(selectedPaiement.id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Télécharger
              </button>
              <button
                onClick={() => setShowPDFModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaiementsList;