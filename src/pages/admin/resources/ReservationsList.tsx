import { Link } from 'react-router-dom';
import { Plus, CheckCircle, XCircle, Ban, } from 'lucide-react';
import { useReservations } from '@/hooks/useResources';
import { RESERVATION_TYPES, RESERVATION_STATUSES } from '@/types/resources.types';
import type { Reservation } from '@/types/resources.types';
import { DataTable } from '@/components/ui/DataTable';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function ReservationsList() {
  const { reservations, loading, validateReservation, rejectReservation, cancelReservation } = useReservations();

  const getStatusBadge = (status: string) => {
    const classes = {
      EN_ATTENTE: 'bg-yellow-100 text-yellow-800',
      VALIDEE: 'bg-green-100 text-green-800',
      REJETEE: 'bg-red-100 text-red-800',
      ANNULEE: 'bg-gray-100 text-gray-800',
      TERMINEE: 'bg-blue-100 text-blue-800',
    }[status] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
        {RESERVATION_STATUSES.find(s => s.value === status)?.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (r: Reservation) => <span className="font-medium">#{r.id}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (r: Reservation) => RESERVATION_TYPES.find(t => t.value === r.type_reservation)?.label,
    },
    {
      key: 'demandeur',
      label: 'Demandeur',
      render: (r: Reservation) => r.demandeur_info?.username || '-',
    },
    {
      key: 'periode',
      label: 'Période',
      render: (r: Reservation) => (
        <div className="text-sm">
          <div>{format(new Date(r.date_debut), 'dd MMM yyyy', { locale: fr })}</div>
          <div className="text-gray-500">{r.heure_debut} - {r.heure_fin}</div>
        </div>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (r: Reservation) => getStatusBadge(r.statut),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r: Reservation) => (
        <div className="flex gap-2">
          {r.statut === 'EN_ATTENTE' && (
            <>
              <button onClick={() => validateReservation(r.id)} className="text-green-600 hover:text-green-900">
                <CheckCircle className="w-4 h-4" />
              </button>
              <button onClick={() => rejectReservation(r.id, 'Rejeté')} className="text-red-600 hover:text-red-900">
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          {r.statut === 'VALIDEE' && (
            <button onClick={() => cancelReservation(r.id)} className="text-gray-600 hover:text-gray-900">
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Réservations</h1>
        <Link to="/admin/resources/reservations/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Nouvelle réservation
        </Link>
      </div>

      <Card>
        <DataTable data={reservations} columns={columns} keyExtractor={(r) => r.id.toString()} />
      </Card>
    </div>
  );
}