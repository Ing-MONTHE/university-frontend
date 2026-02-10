import { Button, Card, ConfirmModal, DataTable, Modal } from "@/components/ui";
import { useCreneaux, useDeleteCreneau } from "@/hooks/useSchedule";
import type { Creneau, JourSemaine } from "@/types/schedule.types";
import { Clock, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import CreneauForm from "./CreneauForm";

const JOUR_LABELS: Record<JourSemaine, string> = {
  LUNDI: "Lundi",
  MARDI: "Mardi",
  MERCREDI: "Mercredi",
  JEUDI: "Jeudi",
  VENDREDI: "Vendredi",
  SAMEDI: "Samedi",
};

export default function CreneauxList() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingCreneau, setEditingCreneau] = useState<Creneau | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data, isLoading } = useCreneaux({ page, page_size: 20 });
  const deleteMutation = useDeleteCreneau();

  const handleDelete = async () => {
    if (deletingId) {
      await deleteMutation.mutateAsync(deletingId);
      setDeletingId(null);
    }
  };

  const columns = [
    {
      key: "jour",
      label: "Jour",
      render: (creneau: Creneau) => (
        <span className="font-medium">{JOUR_LABELS[creneau.jour]}</span>
      ),
    },
    {
      key: "horaire",
      label: "Horaire",
      render: (creneau: Creneau) => (
        <span className="font-mono text-sm">
          {creneau.heure_debut} - {creneau.heure_fin}
        </span>
      ),
    },
    {
      key: "duree",
      label: "Durée",
      render: (creneau: Creneau) => {
        const heures = Math.floor(creneau.duree_minutes / 60);
        const minutes = creneau.duree_minutes % 60;
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {heures}h{minutes > 0 ? `${minutes}min` : ""}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (creneau: Creneau) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingCreneau(creneau);
              setShowForm(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingId(creneau.id)}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-7 h-7" />
            Créneaux Horaires
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Gérez les créneaux horaires des cours
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Créneau
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={data?.results || []}
          isLoading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data ? Math.ceil(data.count / 20) : 1,
            onPageChange: setPage,
          }}
        />
      </Card>

      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCreneau(null);
        }}
        title={editingCreneau ? "Modifier le Créneau" : "Nouveau Créneau"}
      >
        <CreneauForm
          creneau={editingCreneau}
          onSuccess={() => {
            setShowForm(false);
            setEditingCreneau(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingCreneau(null);
          }}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Supprimer le Créneau"
        message="Êtes-vous sûr de vouloir supprimer ce créneau ?"
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
}
