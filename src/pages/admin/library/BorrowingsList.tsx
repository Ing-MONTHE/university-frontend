import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import {
  useEmprunts,
  useRetournerEmprunt,
  useDeleteEmprunt,
} from '@/hooks/useLibrary';
import { Badge, Spinner } from '@/components/ui';
import type { Emprunt, StatutEmprunt } from '@/types/library.types';

export default function BorrowingsList() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    statut?: StatutEmprunt;
  }>({});

  const { data: emprunts = [], isLoading, error } = useEmprunts(filters);
  const retournerEmprunt = useRetournerEmprunt();
  const deleteEmprunt = useDeleteEmprunt();

  const filteredEmprunts = emprunts.filter((emprunt) => {
    if (!searchTerm) return true;
    
    const livre = typeof emprunt.livre === 'object' ? emprunt.livre : null;
    const etudiant = typeof emprunt.etudiant === 'object' ? emprunt.etudiant : null;
    
    const term = searchTerm.toLowerCase();
    return (
      livre?.titre.toLowerCase().includes(term) ||
      livre?.auteur.toLowerCase().includes(term) ||
      etudiant?.user.first_name.toLowerCase().includes(term) ||
      etudiant?.user.last_name.toLowerCase().includes(term) ||
      etudiant?.matricule.toLowerCase().includes(term)
    );
  });

  const handleRetour = async (id: number) => {
    if (window.confirm('Confirmer le retour de ce livre ?')) {
      try {
        await retournerEmprunt.mutateAsync({ id });
      } catch (error) {
        console.error('Erreur lors du retour:', error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cet emprunt ?')) {
      try {
        await deleteEmprunt.mutateAsync(id);
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
      }
    }
  };

  const getStatutBadge = (statut: StatutEmprunt) => {
    switch (statut) {
      case 'EN_COURS':
        return { label: 'En cours', variant: 'info' as const };
      case 'EN_RETARD':
        return { label: 'En retard', variant: 'destructive' as const };
      case 'RETOURNE':
        return { label: 'Retourné', variant: 'success' as const };
      case 'ANNULE':
        return { label: 'Annulé', variant: 'secondary' as const };
      default:
        return { label: statut, variant: 'secondary' as const };
    }
  };

  const isRetardActive = (emprunt: Emprunt) => {
    if (emprunt.statut !== 'EN_RETARD') return false;
    const today = new Date();
    const dateRetour = new Date(emprunt.date_retour_prevue);
    return today > dateRetour;
  };

  const getJoursRestants = (dateRetourPrevue: string) => {
    const today = new Date();
    const dateRetour = new Date(dateRetourPrevue);
    const diffTime = dateRetour.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Erreur lors du chargement des emprunts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emprunts</h1>
          <p className="text-gray-600 mt-1">
            {filteredEmprunts.length} emprunt{filteredEmprunts.length !== 1 ? 's' : ''} enregistré
            {filteredEmprunts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/admin/library/borrowings/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvel emprunt
        </Link>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par étudiant, livre ou matricule..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtres
            {filters.statut && (
              <Badge variant="primary" size="sm">
                1
              </Badge>
            )}
          </button>
        </div>

        {/* Panel de filtres */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={filters.statut || ''}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      statut: e.target.value as StatutEmprunt | undefined,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="EN_COURS">En cours</option>
                  <option value="EN_RETARD">En retard</option>
                  <option value="RETOURNE">Retourné</option>
                  <option value="ANNULE">Annulé</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={() => {
                  setFilters({});
                  setSearchTerm('');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des emprunts */}
      {filteredEmprunts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun emprunt trouvé</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filters.statut
              ? 'Aucun emprunt ne correspond à vos critères'
              : 'Aucun emprunt enregistré pour le moment'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date emprunt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retour prévu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pénalité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmprunts.map((emprunt) => {
                const livre = typeof emprunt.livre === 'object' ? emprunt.livre : null;
                const etudiant = typeof emprunt.etudiant === 'object' ? emprunt.etudiant : null;
                const statutBadge = getStatutBadge(emprunt.statut);
                const joursRestants = getJoursRestants(emprunt.date_retour_prevue);
                const isRetard = isRetardActive(emprunt);

                return (
                  <tr
                    key={emprunt.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isRetard ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      {etudiant && (
                        <div>
                          <p className="font-medium text-gray-900">
                            {etudiant.user.first_name} {etudiant.user.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{etudiant.matricule}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {livre && (
                        <div>
                          <p className="font-medium text-gray-900">{livre.titre}</p>
                          <p className="text-sm text-gray-600">{livre.auteur}</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {new Date(emprunt.date_retour_prevue).toLocaleDateString('fr-FR')}
                        </p>
                        {emprunt.statut === 'EN_COURS' && (
                          <p
                            className={`text-xs ${
                              joursRestants < 0
                                ? 'text-red-600 font-semibold'
                                : joursRestants <= 3
                                ? 'text-orange-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {joursRestants < 0
                              ? `${Math.abs(joursRestants)} jour${Math.abs(joursRestants) > 1 ? 's' : ''} de retard`
                              : joursRestants === 0
                              ? "Aujourd'hui"
                              : `Dans ${joursRestants} jour${joursRestants > 1 ? 's' : ''}`}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={statutBadge.variant} size="sm">
                          {statutBadge.label}
                        </Badge>
                        {isRetard && (
                          <AlertCircle className="w-4 h-4 text-red-600 animate-pulse" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {emprunt.penalite > 0 ? (
                        <span className="text-sm font-semibold text-red-600">
                          {emprunt.penalite.toLocaleString()} FCFA
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {(emprunt.statut === 'EN_COURS' || emprunt.statut === 'EN_RETARD') && (
                          <button
                            onClick={() => handleRetour(emprunt.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                            title="Marquer comme retourné"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Retour
                          </button>
                        )}
                        {emprunt.statut === 'EN_COURS' && (
                          <button
                            onClick={() => handleDelete(emprunt.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                            title="Annuler l'emprunt"
                          >
                            <X className="w-4 h-4" />
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}