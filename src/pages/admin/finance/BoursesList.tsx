import React, { useEffect, useState } from 'react';
import { useBourses } from '@/hooks/useFinances';
import { Bourse } from '@/types/finance.types';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BoursesList: React.FC = () => {
  const navigate = useNavigate();
  const { bourses, loading, error, fetchBourses, deleteBourse } = useBourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBourse, setSelectedBourse] = useState<Bourse | null>(null);

  useEffect(() => {
    fetchBourses();
  }, [fetchBourses]);

  const handleDelete = async () => {
    if (selectedBourse) {
      try {
        await deleteBourse(selectedBourse.id);
        setShowDeleteModal(false);
        setSelectedBourse(null);
      } catch (err) {
        console.error('Erreur lors de la suppression', err);
      }
    }
  };

  const filteredBourses = bourses.filter((b) => {
    const matchSearch =
      b.etudiant_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.etudiant_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.etudiant_matricule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = !filterType || b.type_bourse === filterType;
    const matchStatut = !filterStatut || b.statut === filterStatut;
    return matchSearch && matchType && matchStatut;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (statut: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      EXPIREE: 'bg-gray-100 text-gray-800',
      SUSPENDUE: 'bg-yellow-100 text-yellow-800',
      ANNULEE: 'bg-red-100 text-red-800',
    };
    return styles[statut as keyof typeof styles] || styles.ACTIVE;
  };

  const getTypeBadge = (type: string) => {
    const styles = {
      ETAT: 'bg-blue-100 text-blue-800',
      EXCELLENCE: 'bg-purple-100 text-purple-800',
      SOCIALE: 'bg-orange-100 text-orange-800',
      MERITE: 'bg-pink-100 text-pink-800',
      AUTRE: 'bg-gray-100 text-gray-800',
    };
    return styles[type as keyof typeof styles] || styles.AUTRE;
  };

  if (loading && bourses.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Bourses et Exonérations</h1>
          <p className="text-gray-600 mt-1">Gestion des bourses et aides financières</p>
        </div>
        <button
          onClick={() => navigate('/admin/finance/bourses/nouveau')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouvelle Bourse
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les types</option>
            <option value="ETAT">Bourse État</option>
            <option value="EXCELLENCE">Excellence</option>
            <option value="SOCIALE">Sociale</option>
            <option value="MERITE">Mérite</option>
            <option value="AUTRE">Autre</option>
          </select>
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIREE">Expirée</option>
            <option value="SUSPENDUE">Suspendue</option>
            <option value="ANNULEE">Annulée</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('');
              setFilterStatut('');
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total Bourses</p>
          <p className="text-2xl font-bold text-gray-900">{filteredBourses.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Actives</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredBourses.filter((b) => b.statut === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Montant Total</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(filteredBourses.reduce((sum, b) => sum + b.montant_bourse, 0))}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Exonération Moyenne</p>
          <p className="text-2xl font-bold text-purple-600">
            {filteredBourses.length > 0
              ? (
                  filteredBourses.reduce((sum, b) => sum + b.pourcentage_exoneration, 0) /
                  filteredBourses.length
                ).toFixed(0)
              : 0}
            %
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
                  Étudiant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exonération
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
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
              {filteredBourses.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <div className="font-medium text-gray-900">
                        {b.etudiant_nom} {b.etudiant_prenom}
                      </div>
                      <div className="text-gray-500">{b.etudiant_matricule}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(b.type_bourse)}`}>
                      {b.type_bourse}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {b.pourcentage_exoneration}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(b.montant_bourse)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(b.date_debut)} - {formatDate(b.date_fin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(b.statut)}`}>
                      {b.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/finance/bourses/${b.id}/modifier`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBourse(b);
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
              {filteredBourses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucune bourse trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cette bourse ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBourse(null);
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

export default BoursesList;