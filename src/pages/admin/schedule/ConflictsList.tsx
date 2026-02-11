import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useConflits, useResolveConflit } from '@/hooks/useSchedule';
import { DataTable, Button, Card, Modal } from '@/components/ui';
import type { ColumnDef } from '@/components/ui/DataTable/DataTable';
import type { ConflitSalle } from '@/types/schedule.types';

const CONFLIT_TYPE_LABELS = {
  DOUBLE_BOOKING: 'Salle occupée',
  CONFLIT_ENSEIGNANT: 'Enseignant occupé',
  CAPACITE_DEPASSEE: 'Capacité dépassée',
};

export default function ConflictsList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showResolve, setShowResolve] = useState(false);
  const [selectedConflit, setSelectedConflit] = useState<ConflitSalle | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const { data, isLoading } = useConflits({ page, page_size: pageSize });
  const resolveMutation = useResolveConflit();

  const handleResolve = async () => {
    if (selectedConflit) {
      await resolveMutation.mutateAsync({
        id: selectedConflit.id,
        data: {
          resolu: true,
          date_resolution: new Date().toISOString().split('T')[0],
          resolution_note: resolutionNote,
        },
      });
      setShowResolve(false);
      setSelectedConflit(null);
      setResolutionNote('');
    }
  };

  const columns: ColumnDef<ConflitSalle>[] = [
    {
      key: 'type',
      header: 'Type',
      render: (_, conflit: ConflitSalle) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          {CONFLIT_TYPE_LABELS[conflit.type_conflit]}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (_, conflit: ConflitSalle) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-900">{conflit.description}</p>
          {conflit.cours_1_details && (
            <p className="text-xs text-gray-500 mt-1">
              Cours 1: {conflit.cours_1_details.matiere_details?.nom}
            </p>
          )}
          {conflit.cours_2_details && (
            <p className="text-xs text-gray-500">
              Cours 2: {conflit.cours_2_details.matiere_details?.nom}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'date_detection',
      header: 'Détecté le',
      render: (_, conflit: ConflitSalle) => (
        <span className="text-sm text-gray-600">
          {new Date(conflit.date_detection).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (_, conflit: ConflitSalle) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            conflit.resolu
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {conflit.resolu ? 'Résolu' : 'En attente'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, conflit: ConflitSalle) => (
        !conflit.resolu && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedConflit(conflit);
              setShowResolve(true);
            }}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Résoudre
          </Button>
        )
      ),
    },
  ];

  const nonResolus = data?.results?.filter((c) => !c.resolu).length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-7 h-7 text-red-600" />
            Conflits
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {nonResolus > 0 ? (
              <span className="text-red-600 font-medium">
                {nonResolus} conflit{nonResolus > 1 ? 's' : ''} non résolu{nonResolus > 1 ? 's' : ''}
              </span>
            ) : (
              'Aucun conflit en attente'
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total conflits</p>
                <p className="text-2xl font-bold text-gray-900">{data.count}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{nonResolus}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.count - nonResolus}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

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

      {/* Resolve Modal */}
      <Modal
        isOpen={showResolve}
        onClose={() => {
          setShowResolve(false);
          setSelectedConflit(null);
          setResolutionNote('');
        }}
        title="Résoudre le Conflit"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700">
              {selectedConflit?.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note de résolution
            </label>
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Décrivez comment le conflit a été résolu..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowResolve(false);
                setSelectedConflit(null);
                setResolutionNote('');
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleResolve}
              isLoading={resolveMutation.isPending}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Marquer comme résolu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}