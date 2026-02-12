import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEquipments } from '@/hooks/useResources';
import { resourcesApi } from '@/api/resources.api';
import { MAINTENANCE_TYPES, MAINTENANCE_FREQUENCIES } from '@/types/resources.types';
import { Card } from '@/components/ui';

export default function MaintenanceScheduler() {
  const navigate = useNavigate();
  const { equipments } = useEquipments();
  const [formData, setFormData] = useState({
    equipement: 0,
    type_maintenance: 'PREVENTIVE' as const,
    frequence: 'MENSUELLE' as const,
    date_debut: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resourcesApi.createMaintenance({
        equipement: formData.equipement,
        type_maintenance: formData.type_maintenance,
        date_planifiee: formData.date_debut,
        description: formData.description,
      });
      navigate('/admin/resources/maintenances');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Planifier une maintenance</h1>
      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Équipement</label>
            <select
              required
              value={formData.equipement}
              onChange={(e) => setFormData({ ...formData, equipement: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Sélectionner</option>
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.nom}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Type</label>
              <select
                value={formData.type_maintenance}
                onChange={(e) => setFormData({ ...formData, type_maintenance: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {MAINTENANCE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Fréquence</label>
              <select
                value={formData.frequence}
                onChange={(e) => setFormData({ ...formData, frequence: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {MAINTENANCE_FREQUENCIES.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Date de début</label>
            <input
              type="date"
              required
              value={formData.date_debut}
              onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate('/admin/resources/maintenances')} className="px-4 py-2 border rounded-lg">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Planifier
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
}