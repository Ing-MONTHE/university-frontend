/**
 * Page Liste des Salles - Style Card View (Academic/Evaluations)
 */

import { useState } from 'react';
import { Plus, Search, DoorOpen, Edit, Trash2, Building2, Users, Gauge } from 'lucide-react';
import { useSalles, useDeleteSalle } from '@/hooks/useSchedule';
import { Button, Modal, ConfirmModal } from '@/components/ui';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import type { Salle } from '@/types/schedule.types';
import SalleForm from './SalleForm';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

export default function SallesList() {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    search: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSalle, setEditingSalle] = useState<Salle | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Salle | null }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useSalles(filters);
  const deleteMutation = useDeleteSalle();

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleOpenModal = (item?: Salle) => {
    if (item) {
      setEditingSalle(item);
    } else {
      setEditingSalle(null);
    }
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setEditingSalle(null);
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

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      COURS: 'bg-blue-100 text-blue-700',
      TD: 'bg-green-100 text-green-700',
      TP: 'bg-orange-100 text-orange-700',
      AMPHI: 'bg-purple-100 text-purple-700',
      LABO: 'bg-red-100 text-red-700',
      SALLE_INFORMATIQUE: 'bg-cyan-100 text-cyan-700',
      AUTRE: 'bg-gray-100 text-gray-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  // Render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" message="Chargement des salles..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salles</h1>
          <p className="text-gray-600 mt-1">Gérer les salles de cours</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Salle
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
              placeholder="Rechercher une salle..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>
      </div>

      {/* Liste des salles en cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results && data.results.length > 0 ? (
          data.results.map((salle) => (
            <div
              key={salle.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DoorOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{salle.nom}</h3>
                      <p className="text-sm text-gray-500 font-mono">{salle.code}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      salle.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {salle.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getTypeColor(salle.type_salle)}`}>
                    {salle.type_salle.replace('_', ' ')}
                  </span>
                </div>

                {salle.batiment_nom && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>{salle.batiment_nom} - Étage {salle.etage}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{salle.capacite} places</span>
                  </div>
                  {salle.superficie && (
                    <div className="flex items-center gap-1">
                      <Gauge className="w-4 h-4" />
                      <span>{salle.superficie} m²</span>
                    </div>
                  )}
                </div>

                {salle.equipements && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {(() => {
                        // Parser equipements si c'est un JSON string, sinon le split
                        let equipArray: string[] = [];
                        try {
                          if (typeof salle.equipements === 'string') {
                            // Essayer de parser comme JSON
                            try {
                              equipArray = JSON.parse(salle.equipements);
                            } catch {
                              // Si pas JSON, split par virgule
                              equipArray = salle.equipements.split(',').map(e => e.trim()).filter(Boolean);
                            }
                          } else if (Array.isArray(salle.equipements)) {
                            equipArray = salle.equipements;
                          }
                        } catch (e) {
                          console.error('Erreur parsing equipements:', e);
                        }
                        
                        if (equipArray.length === 0) return null;
                        
                        return (
                          <>
                            {equipArray.slice(0, 3).map((eq, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                {eq}
                              </span>
                            ))}
                            {equipArray.length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                                +{equipArray.length - 3}
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenModal(salle)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteConfirm({ isOpen: true, item: salle })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucune salle trouvée
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
        title={editingSalle ? 'Modifier la salle' : 'Nouvelle salle'}
      >
        <SalleForm
          salle={editingSalle}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer la salle"
        message={`Êtes-vous sûr de vouloir supprimer la salle "${deleteConfirm.item?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
      />
    </div>
  );
}