import { useState } from 'react';
import { Plus, DoorOpen, Edit, Trash2, Filter } from 'lucide-react';
import { useSalles, useDeleteSalle, useBatiments } from '@/hooks/useSchedule';
import { DataTable, Button, Card, Modal, Input, Select, ConfirmModal } from '@/components/ui';
import type { ColumnDef } from '@/components/ui/DataTable/DataTable';
import type { Salle, TypeSalle } from '@/types/schedule.types';
import SalleForm from './SalleForm';

const TYPE_SALLE_OPTIONS = [
  { value: '', label: 'Tous les types' },
  { value: 'COURS', label: 'Cours' },
  { value: 'TD', label: 'TD' },
  { value: 'TP', label: 'TP' },
  { value: 'AMPHI', label: 'Amphithéâtre' },
];

export default function SallesList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [batimentFilter, setBatimentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSalle, setEditingSalle] = useState<Salle | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading } = useSalles({
    search,
    page,
    page_size: pageSize,
    batiment: batimentFilter ? parseInt(batimentFilter) : undefined,
    type_salle: typeFilter as TypeSalle || undefined,
  });

  const { data: batimentsData } = useBatiments();
  const deleteMutation = useDeleteSalle();

  const batimentOptions = [
    { value: '', label: 'Tous les bâtiments' },
    ...(batimentsData?.results || []).map((b) => ({
      value: b.id.toString(),
      label: `${b.code} - ${b.nom}`,
    })),
  ];

  const handleDelete = async () => {
    if (deletingId) {
      await deleteMutation.mutateAsync(deletingId);
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<Salle>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (_, salle: Salle) => (
        <span className="font-mono text-sm font-medium">{salle.code}</span>
      ),
    },
    {
      key: 'nom',
      header: 'Nom',
      render: (_, salle: Salle) => (
        <div>
          <div className="font-medium">{salle.nom}</div>
          {salle.batiment_details && (
            <div className="text-xs text-gray-500">
              {salle.batiment_details.nom} - Étage {salle.etage}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type_salle',
      header: 'Type',
      render: (_, salle: Salle) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {salle.type_salle}
        </span>
      ),
    },
    {
      key: 'capacite',
      header: 'Capacité',
      render: (_, salle: Salle) => (
        <span className="text-sm font-medium">{salle.capacite} places</span>
      ),
    },
    {
      key: 'taux_occupation',
      header: 'Occupation',
      render: (_, salle: Salle) => {
        const taux = salle.taux_occupation || 0;
        const color =
          taux > 80 ? 'bg-red-100 text-red-800' :
          taux > 50 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {taux}%
          </span>
        );
      },
    },
    {
      key: 'is_active',
      header: 'Statut',
      render: (_, salle: Salle) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            salle.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {salle.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, salle: Salle) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingSalle(salle);
              setShowForm(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingId(salle.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DoorOpen className="w-7 h-7" />
            Salles
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Gérez les salles de cours
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Salle
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtres</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Rechercher une salle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={batimentFilter}
            onChange={(e) => setBatimentFilter(e.target.value)}
            options={batimentOptions}
          />
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={TYPE_SALLE_OPTIONS}
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={data?.results || []}
          isLoading={isLoading}
          pagination={{
            page: page,
            pageSize: pageSize,
            total: data?.count || 0,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
        />
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingSalle(null);
        }}
        title={editingSalle ? 'Modifier la Salle' : 'Nouvelle Salle'}
      >
        <SalleForm
          salle={editingSalle}
          onSuccess={() => {
            setShowForm(false);
            setEditingSalle(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingSalle(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Supprimer la Salle"
        message="Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible."
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
}