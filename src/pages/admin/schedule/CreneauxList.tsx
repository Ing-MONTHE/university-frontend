/**
 * Page Liste des Créneaux Horaires - Style Card View
 */

import { useState } from 'react';
import { Plus, Search, Clock, Edit, Trash2, Calendar } from 'lucide-react';
import { useCreneaux, useDeleteCreneau } from '@/hooks/useSchedule';
import { Button, Modal, ConfirmModal } from '@/components/ui';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import type { Creneau } from '@/types/schedule.types';
import CreneauForm from './CreneauForm';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

export default function CreneauxList() {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    search: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCreneau, setEditingCreneau] = useState<Creneau | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Creneau | null }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useCreneaux(filters);
  const deleteMutation = useDeleteCreneau();

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleOpenModal = (item?: Creneau) => {
    if (item) {
      setEditingCreneau(item);
    } else {
      setEditingCreneau(null);
    }
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingCreneau(null);
  };

  const handleDelete = async () => {
    if (deleteConfirm.item) {
      try {
        await deleteMutation.mutateAsync(deleteConfirm.item.id);
        setDeleteConfirm({ isOpen: false, item: null });
      } catch (error) {
        // L'erreur est gérée par le hook
      }
    }
  };

  const getJourLabel = (jour: string) => {
    const jours: Record<string, string> = {
      LUNDI: 'Lundi',
      MARDI: 'Mardi',
      MERCREDI: 'Mercredi',
      JEUDI: 'Jeudi',
      VENDREDI: 'Vendredi',
      SAMEDI: 'Samedi',
      DIMANCHE: 'Dimanche',
    };
    return jours[jour] || jour;
  };

  // Render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" message="Chargement des créneaux..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Créneaux Horaires</h1>
          <p className="text-gray-600 mt-1">Gérer les créneaux horaires des cours</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Créneau
        </Button>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Rechercher un créneau..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>
      </div>

      {/* Liste des créneaux en cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results && data.results.length > 0 ? (
          data.results.map((creneau) => (
            <div
              key={creneau.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{creneau.nom}</h3>
                      <p className="text-sm text-gray-500 font-mono">{creneau.code}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">{getJourLabel(creneau.jour_semaine)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Début:</span>
                      <span className="font-mono">{creneau.heure_debut}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Fin:</span>
                      <span className="font-mono">{creneau.heure_fin}</span>
                    </div>
                  </div>
                </div>

                {creneau.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {creneau.description}
                  </p>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenModal(creneau)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteConfirm({ isOpen: true, item: creneau })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucun créneau trouvé
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.count > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <Pagination
            currentPage={filters.page || 1}
            totalPages={Math.ceil(data.count / (filters.page_size || DEFAULT_PAGE_SIZE))}
            onPageChange={(page) => setFilters({ ...filters, page })}
            pageSize={filters.page_size || DEFAULT_PAGE_SIZE}
            onPageSizeChange={(size) => setFilters({ ...filters, page_size: size, page: 1 })}
            totalItems={data.count}
          />
        </div>
      )}

      {/* Modal de création/édition */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseModal}
        title={editingCreneau ? 'Modifier le créneau' : 'Nouveau créneau'}
      >
        <CreneauForm
          creneau={editingCreneau}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer le créneau"
        message={`Êtes-vous sûr de vouloir supprimer le créneau "${deleteConfirm.item?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
      />
    </div>
  );
}