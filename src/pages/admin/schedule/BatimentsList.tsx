import { useState } from 'react';
import { Plus, Building2, Edit, Trash2 } from 'lucide-react';
import { useBatiments, useDeleteBatiment } from '@/hooks/useSchedule';
import { DataTable, Button, Card, Modal, Input, ConfirmModal } from '@/components/ui';
import type { ColumnDef } from '@/components/ui/DataTable/DataTable';
import type { Batiment } from '@/types/schedule.types';
import BatimentForm from './BatimentForm';

export default function BatimentsList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingBatiment, setEditingBatiment] = useState<Batiment | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading } = useBatiments({ search, page, page_size: pageSize });
  const deleteMutation = useDeleteBatiment();

  const handleDelete = async () => {
    if (deletingId) {
      await deleteMutation.mutateAsync(deletingId);
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<Batiment>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (_, batiment: Batiment) => (
        <span className="font-mono text-sm font-medium">{batiment.code}</span>
      ),
    },
    {
      key: 'nom',
      header: 'Nom',
      render: (_, batiment: Batiment) => (
        <div>
          <div className="font-medium">{batiment.nom}</div>
          {batiment.adresse && (
            <div className="text-xs text-gray-500">{batiment.adresse}</div>
          )}
        </div>
      ),
    },
    {
      key: 'nombre_etages',
      header: 'Étages',
      render: (_, batiment: Batiment) => (
        <span className="text-sm">{batiment.nombre_etages}</span>
      ),
    },
    {
      key: 'nombre_salles',
      header: 'Salles',
      render: (_, batiment: Batiment) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {batiment.nombre_salles || 0}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Statut',
      render: (_, batiment: Batiment) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            batiment.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {batiment.is_active ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, batiment: Batiment) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingBatiment(batiment);
              setShowForm(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingId(batiment.id)}
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
            <Building2 className="w-7 h-7" />
            Bâtiments
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Gérez les bâtiments de l'université
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Bâtiment
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <Input
          placeholder="Rechercher un bâtiment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
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
          setEditingBatiment(null);
        }}
        title={editingBatiment ? 'Modifier le Bâtiment' : 'Nouveau Bâtiment'}
      >
        <BatimentForm
          batiment={editingBatiment}
          onSuccess={() => {
            setShowForm(false);
            setEditingBatiment(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingBatiment(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Supprimer le Bâtiment"
        message="Êtes-vous sûr de vouloir supprimer ce bâtiment ? Cette action est irréversible."
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
}