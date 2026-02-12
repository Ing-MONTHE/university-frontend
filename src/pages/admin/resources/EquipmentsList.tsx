import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, Package } from 'lucide-react';
import { useEquipments } from '@/hooks/useResources';
import type { Equipment, EquipmentFilters } from '@/types/resources.types';
import { EQUIPMENT_CATEGORIES, EQUIPMENT_STATUSES } from '@/types/resources.types';
import { DataTable } from '@/components/ui/DataTable';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui';
import { Alert, AlertDescription } from '@/components/ui/Alert';

export default function EquipmentsList() {
  const [filters, setFilters] = useState<EquipmentFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; equipment: Equipment | null }>({
    open: false,
    equipment: null,
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { equipments, loading, error, setFilters: updateFilters, refetch, deleteEquipment } = useEquipments(filters);

  const handleFilterChange = (key: keyof EquipmentFilters, value: any) => {
    const newFilters = { ...filters, [key]: value === '' ? undefined : value };
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handleDelete = async () => {
    if (!deleteModal.equipment) return;

    try {
      await deleteEquipment(deleteModal.equipment.id);
      setAlert({ type: 'success', message: 'Équipement supprimé avec succès' });
      setDeleteModal({ open: false, equipment: null });
      refetch();
    } catch (err: any) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'RESERVE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'EN_MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'HORS_SERVICE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'INFORMATIQUE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'AUDIOVISUEL':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'MOBILIER':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'SPORTIF':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'SCIENTIFIQUE':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const columns = [
    {
      key: 'reference',
      label: 'Référence',
      render: (equipment: Equipment) => (
        <div className="font-medium text-gray-900 dark:text-white">{equipment.reference}</div>
      ),
    },
    {
      key: 'nom',
      label: 'Nom',
      render: (equipment: Equipment) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{equipment.nom}</div>
          {equipment.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
              {equipment.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'categorie',
      label: 'Catégorie',
      render: (equipment: Equipment) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(equipment.categorie)}`}>
          {EQUIPMENT_CATEGORIES.find((c) => c.value === equipment.categorie)?.label}
        </span>
      ),
    },
    {
      key: 'etat',
      label: 'État',
      render: (equipment: Equipment) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(equipment.etat)}`}>
          {EQUIPMENT_STATUSES.find((s) => s.value === equipment.etat)?.label}
        </span>
      ),
    },
    {
      key: 'quantite',
      label: 'Quantité',
      render: (equipment: Equipment) => (
        <div className="text-sm">
          <span className="font-medium text-gray-900 dark:text-white">
            {equipment.quantite_disponible}
          </span>
          <span className="text-gray-500 dark:text-gray-400"> / {equipment.quantite_totale}</span>
        </div>
      ),
    },
    {
      key: 'salle',
      label: 'Salle',
      render: (equipment: Equipment) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {equipment.salle_info ? (
            <div>
              <div>{equipment.salle_info.nom}</div>
              {equipment.salle_info.batiment_info && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {equipment.salle_info.batiment_info.nom}
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (equipment: Equipment) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/resources/equipments/${equipment.id}/edit`}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, equipment })}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Équipements</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez l'inventaire des équipements de l'université
          </p>
        </div>
        <Link
          to="/admin/resources/equipments/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel équipement
        </Link>
      </div>

      {/* Alerts */}
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou référence..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Toggle Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Catégorie
                </label>
                <select
                  value={filters.categorie || ''}
                  onChange={(e) => handleFilterChange('categorie', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Toutes</option>
                  {EQUIPMENT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  État
                </label>
                <select
                  value={filters.etat || ''}
                  onChange={(e) => handleFilterChange('etat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Tous</option>
                  {EQUIPMENT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reservable Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Réservable
                </label>
                <select
                  value={filters.reservable === undefined ? '' : filters.reservable.toString()}
                  onChange={(e) => handleFilterChange('reservable', e.target.value === '' ? undefined : e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Tous</option>
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        {equipments.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Aucun équipement"
            description="Commencez par ajouter votre premier équipement"
          />
        ) : (
          <DataTable
            data={equipments}
            columns={columns}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, equipment: null })}
        title="Supprimer l'équipement"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Êtes-vous sûr de vouloir supprimer l'équipement{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {deleteModal.equipment?.nom}
            </span>{' '}
            ?
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setDeleteModal({ open: false, equipment: null })}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
      </Modal>
    </div>
  );
}