import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMaintenances } from '@/hooks/useResources';
import { MAINTENANCE_TYPES, MAINTENANCE_STATUSES } from '@/types/resources.types';
import { DataTable } from '@/components/ui/DataTable';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MaintenancesList() {
  const { maintenances, loading } = useMaintenances();

  const columns = [
    { key: 'id', label: 'ID', render: (m: any) => `#${m.id}` },
    { key: 'equipement', label: 'Équipement', render: (m: any) => m.equipement_info?.nom || '-' },
    { key: 'type', label: 'Type', render: (m: any) => MAINTENANCE_TYPES.find(t => t.value === m.type_maintenance)?.label },
    { key: 'date', label: 'Date planifiée', render: (m: any) => format(new Date(m.date_planifiee), 'dd MMM yyyy', { locale: fr }) },
    { key: 'statut', label: 'Statut', render: (m: any) => MAINTENANCE_STATUSES.find(s => s.value === m.statut)?.label },
  ];

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Maintenances</h1>
        <Link to="/admin/resources/maintenances/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Planifier maintenance
        </Link>
      </div>
      <Card>
        <DataTable data={maintenances} columns={columns} keyExtractor={(m) => m.id.toString()} />
      </Card>
    </div>
  );
}