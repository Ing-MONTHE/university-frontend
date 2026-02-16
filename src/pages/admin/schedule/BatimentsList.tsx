/**
 * Page Liste des Bâtiments - Style Card View (Academic/Evaluations)
 */

import { useState } from 'react';
import { Plus, Building2, Edit, Trash2, Search, MapPin, Layers } from 'lucide-react';
import { useBatiments, useDeleteBatiment } from '@/hooks/useSchedule';
import { Button, Modal, ConfirmModal } from '@/components/ui';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import type { Batiment } from '@/types/schedule.types';
import BatimentForm from './BatimentForm';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

export default function BatimentsList() {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    search: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBatiment, setEditingBatiment] = useState<Batiment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Batiment | null }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useBatiments(filters);
  const deleteMutation = useDeleteBatiment();

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleOpenModal = (item?: Batiment) => {
    if (item) {
      setEditingBatiment(item);
    } else {
      setEditingBatiment(null);
    }
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingBatiment(null);
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

  // Render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" message="Chargement des bâtiments..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bâtiments</h1>
          <p className="text-gray-600 mt-1">Gérer les bâtiments de l'université</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Bâtiment
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
              placeholder="Rechercher un bâtiment..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>
      </div>

      {/* Liste des bâtiments en cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results && data.results.length > 0 ? (
          data.results.map((batiment) => (
            <div
              key={batiment.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{batiment.nom}</h3>
                      <p className="text-sm text-gray-500 font-mono">{batiment.code}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      batiment.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {batiment.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                {batiment.adresse && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{batiment.adresse}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Layers className="w-4 h-4" />
                    <span>{batiment.nombre_etages} étage(s)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>{batiment.nombre_salles || 0} salle(s)</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenModal(batiment)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteConfirm({ isOpen: true, item: batiment })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucun bâtiment trouvé
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
        title={editingBatiment ? 'Modifier le bâtiment' : 'Nouveau bâtiment'}
      >
        <BatimentForm
          batiment={editingBatiment}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer le bâtiment"
        message={`Êtes-vous sûr de vouloir supprimer le bâtiment "${deleteConfirm.item?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
      />
    </div>
  );
}