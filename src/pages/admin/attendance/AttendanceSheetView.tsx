/**
 * Page: AttendanceSheetsList.tsx
 * Liste des feuilles de présence avec filtres
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Lock,
  Filter,
  Calendar,
  Users,
  Search,
} from 'lucide-react';
import { useFeuillesPresence } from '@/hooks/useAttendance';
import { FeuillePresenceFilters, StatutFeuille } from '@/types/attendance.types';
import {
  Button,
  Card,
  Badge,
  SearchBar,
  Select,
  Spinner,
  Pagination,
} from '@/components/ui';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/Breadcrumb';
import { DatePicker } from '@/components/ui/DatePicker';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';

export default function AttendanceSheetsList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FeuillePresenceFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  const {
    feuilles,
    count,
    isLoading,
    deleteFeuille,
    fermerFeuille,
    isDeleting,
    isFermeture,
  } = useFeuillesPresence(filters);

  /**
   * Gérer la suppression
   */
  const handleDelete = () => {
    if (deleteModal.id) {
      deleteFeuille(deleteModal.id);
      setDeleteModal({ open: false, id: null });
    }
  };

  /**
   * Fermer une feuille
   */
  const handleFermer = (id: number) => {
    if (confirm('Voulez-vous fermer cette feuille ? Elle ne pourra plus être modifiée.')) {
      fermerFeuille(id);
    }
  };

  /**
   * Obtenir la couleur du badge selon le statut
   */
  const getStatutColor = (statut: StatutFeuille): 'blue' | 'gray' | 'red' => {
    const colors = {
      OUVERTE: 'blue' as const,
      FERMEE: 'gray' as const,
      ANNULEE: 'red' as const,
    };
    return colors[statut];
  };

  /**
   * Obtenir la couleur du badge selon le taux de présence
   */
  const getTauxColor = (taux: number): string => {
    if (taux >= 80) return 'text-green-600';
    if (taux >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbItem label="Gestion des présences" />
      </Breadcrumb>

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feuilles de présence</h1>
          <p className="text-gray-500 mt-1">Gérez les présences des cours</p>
        </div>
        <Button onClick={() => navigate('/admin/attendance/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle feuille
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="p-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar
                value={filters.search || ''}
                onChange={(value) => setFilters({ ...filters, search: value })}
                placeholder="Rechercher un cours, matière, enseignant..."
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-blue-50 border-blue-300' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <DatePicker
                label="Date du cours"
                value={filters.date_cours}
                onChange={(value) => setFilters({ ...filters, date_cours: value })}
              />

              <Select
                label="Statut"
                value={filters.statut || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    statut: e.target.value as StatutFeuille | undefined,
                  })
                }
                options={[
                  { value: '', label: 'Tous les statuts' },
                  { value: 'OUVERTE', label: 'Ouverte' },
                  { value: 'FERMEE', label: 'Fermée' },
                  { value: 'ANNULEE', label: 'Annulée' },
                ]}
              />

              <DatePicker
                label="Période du"
                value={filters.date_debut}
                onChange={(value) => setFilters({ ...filters, date_debut: value })}
              />

              <DatePicker
                label="Période au"
                value={filters.date_fin}
                onChange={(value) => setFilters({ ...filters, date_fin: value })}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total feuilles</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Feuilles ouvertes</p>
              <p className="text-2xl font-bold text-gray-900">
                {feuilles.filter((f) => f.statut === 'OUVERTE').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Lock className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Feuilles fermées</p>
              <p className="text-2xl font-bold text-gray-900">
                {feuilles.filter((f) => f.statut === 'FERMEE').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des feuilles */}
      <Card>
        {isLoading ? (
          <div className="p-12 text-center">
            <Spinner size="lg" />
          </div>
        ) : feuilles.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Aucune feuille de présence"
            description="Commencez par créer une feuille de présence pour un cours"
            action={{
              label: 'Créer une feuille',
              onClick: () => navigate('/admin/attendance/create'),
            }}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date & Heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Cours / Matière
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Enseignant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Filière
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Présences
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Taux
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {feuilles.map((feuille) => (
                    <tr key={feuille.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {new Date(feuille.date_cours).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-gray-500">
                            {feuille.heure_debut} - {feuille.heure_fin}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {feuille.cours_nom}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{feuille.enseignant_nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{feuille.filiere_nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            {feuille.nombre_presents}P
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                            {feuille.nombre_absents}A
                          </span>
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                            {feuille.nombre_retards}R
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-bold ${getTauxColor(feuille.taux_presence)}`}>
                          {feuille.taux_presence.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={getStatutColor(feuille.statut)}>{feuille.statut}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/attendance/${feuille.id}`)}
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {feuille.statut === 'OUVERTE' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFermer(feuille.id)}
                                disabled={isFermeture}
                                title="Fermer"
                              >
                                <Lock className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setDeleteModal({ open: true, id: feuille.id })
                                }
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {count > 10 && (
              <div className="p-5 border-t">
                <Pagination
                  currentPage={1}
                  totalPages={Math.ceil(count / 10)}
                  onPageChange={(page) => console.log('Page:', page)}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Supprimer la feuille de présence"
        message="Êtes-vous sûr de vouloir supprimer cette feuille ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}