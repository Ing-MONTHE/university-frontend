import { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Button,
  Badge,
  Card,
  Table,
  SearchBar,
  Pagination,
  Select,
  toastSuccess,
  toastError,
  type TableColumn,
  type SelectOption,
} from '@/components/ui';
import FacultyForm from './Facultyform';
import ConfirmModal from '@/components/layout/ConfirmModal';
import {
  useFacultes,
  useDeleteFaculte,
  useFaculteStats,
} from '@/hooks';
import {
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Building2,
  Users,
  BookOpen,
  Trash,
} from 'lucide-react';
import type { Faculte } from '@/types';

export default function FacultiesList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFacultes, setSelectedFacultes] = useState<Set<string | number>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [facultyToEdit, setFacultyToEdit] = useState<Faculte | null>(null);
  const [facultyToDelete, setFacultyToDelete] = useState<number | null>(null);

  const pageSize = 10;

  // Hooks API
  const { data, isLoading, refetch } = useFacultes({
    search: searchQuery || undefined,
    is_active: filterStatus === 'all' ? undefined : filterStatus === 'active',
    page: currentPage,
    page_size: pageSize,
  });

  const deleteFaculte = useDeleteFaculte();

  const facultes = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Stats
  const stats = [
    {
      label: 'Total Facultés',
      value: totalCount,
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Actives',
      value: facultes.filter((f) => f.is_active).length,
      icon: BookOpen,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Étudiants',
      value: facultes.reduce((sum, f) => sum + (f.nombre_etudiants || 0), 0),
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  // Select options
  const statusOptions: SelectOption[] = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actives' },
    { value: 'inactive', label: 'Inactives' },
  ];

  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string | number) => {
    setFilterStatus(value.toString());
    setCurrentPage(1);
  };

  const handleEdit = (faculte: Faculte) => {
    setFacultyToEdit(faculte);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (facultyToDelete) {
      try {
        await deleteFaculte.mutateAsync(facultyToDelete);
        setShowDeleteModal(false);
        setFacultyToDelete(null);
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      const ids = Array.from(selectedFacultes) as number[];
      await Promise.all(ids.map((id) => deleteFaculte.mutateAsync(id)));
      setSelectedFacultes(new Set());
      setShowBulkDeleteModal(false);
      toastSuccess(`${ids.length} faculté(s) supprimée(s)`);
    } catch (error) {
      toastError('Erreur lors de la suppression');
    }
  };

  const handleExport = () => {
    // TODO: Implement CSV export
    toastSuccess('Export en cours...');
  };

  const openDeleteModal = (id: number) => {
    setFacultyToDelete(id);
    setShowDeleteModal(true);
  };

  // Table columns
  const columns: TableColumn<Faculte>[] = useMemo(
    () => [
      {
        key: 'code',
        label: 'CODE',
        sortable: true,
        width: '100px',
        align: 'center',
        render: (value) => (
          <span className="font-mono font-semibold text-gray-900">{value}</span>
        ),
      },
      {
        key: 'nom',
        label: 'NOM',
        sortable: true,
        align: 'left',
        width: '200px',
        render: (value, row) => (
          <div className="flex items-center gap-3">
            {row.logo ? (
              <img
                src={row.logo}
                alt={value}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        ),
      },
      {
        key: 'description',
        label: 'DESCRIPTION',
        align: 'left',
        render: (value) => (
          <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
            {value || 'Aucune description'}
          </p>
        ),
      },
      {
        key: 'nombre_departements',
        label: 'DÉPARTEMENTS',
        align: 'center',
        width: '140px',
        render: (value) => (
          <span className="text-sm font-medium text-gray-900">
            {value || 0}
          </span>
        ),
      },
      {
        key: 'nombre_filieres',
        label: 'FILIÈRES',
        align: 'center',
        width: '120px',
        render: (value) => (
          <span className="text-sm font-medium text-gray-900">
            {value || 0}
          </span>
        ),
      },
      {
        key: 'nombre_etudiants',
        label: 'ÉTUDIANTS',
        align: 'center',
        width: '120px',
        render: (value) => (
          <span className="text-sm font-medium text-gray-900">
            {value || 0}
          </span>
        ),
      },
      {
        key: 'is_active',
        label: 'STATUT',
        align: 'center',
        width: '120px',
        render: (value) => (
          <Badge variant={value ? 'success' : 'danger'}>
            {value ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        key: 'actions',
        label: 'ACTIONS',
        align: 'center',
        width: '140px',
        render: (_, row) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              icon={<Eye className="w-4 h-4" />}
              className="p-2"
              title="Voir statistiques"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Show stats modal
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
              className="p-2"
              title="Modifier"
            />
            <Button
              variant="ghost"
              size="sm"
              icon={<Trash2 className="w-4 h-4 text-red-600" />}
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(row.id);
              }}
              className="p-2 hover:bg-red-50"
              title="Supprimer"
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Facultés
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les facultés de l'établissement
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            icon={<Plus />}
            onClick={() => {
              setFacultyToEdit(null);
              setShowForm(true);
            }}
          >
            Nouvelle Faculté
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                padding="md"
                className="hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <Icon
                      className={`w-6 h-6 ${stat.color}`}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Filters Card */}
      <Card padding="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Rechercher par nom, code..."
              onSearch={handleSearchChange}
              debounceMs={500}
            />
          </div>

          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={handleFilterChange}
            placeholder="Filtrer par statut"
            className="w-full md:w-64"
          />

          <Button
            variant="secondary"
            size="md"
            icon={<Download />}
            onClick={handleExport}
            disabled={isLoading}
          >
            Exporter CSV
          </Button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedFacultes.size > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Trash className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-900">
                    {selectedFacultes.size} faculté(s) sélectionnée(s)
                  </p>
                  <p className="text-xs text-red-700">
                    Prêt pour la suppression
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setSelectedFacultes(new Set())}
                  className="border-2 border-gray-300"
                >
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  icon={<Trash className="w-4 h-4" />}
                  onClick={() => setShowBulkDeleteModal(true)}
                  className="shadow-md hover:shadow-lg"
                >
                  Supprimer la sélection
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={facultes}
          keyExtractor={(row) => row.id}
          loading={isLoading}
          emptyMessage="Aucune faculté trouvée"
          selectable
          selectedRows={selectedFacultes}
          onSelectionChange={setSelectedFacultes}
          sortable
          striped
          hoverable
        />

        {/* Pagination */}
        {totalCount > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Modals */}
      {showForm && (
        <FacultyForm
          faculty={facultyToEdit}
          onClose={() => {
            setShowForm(false);
            setFacultyToEdit(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setFacultyToEdit(null);
            refetch();
          }}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setFacultyToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer la faculté"
        message="Êtes-vous sûr de vouloir supprimer cette faculté ? Cette action est irréversible et supprimera également tous les départements et filières associés."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      <ConfirmModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        title="Suppression multiple"
        message={`Êtes-vous sûr de vouloir supprimer ${selectedFacultes.size} faculté(s) ? Cette action est irréversible.`}
        confirmText="Supprimer tout"
        cancelText="Annuler"
        type="danger"
      />
    </MainLayout>
  );
}