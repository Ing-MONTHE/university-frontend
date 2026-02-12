import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { resourcesApi } from '@/api/resources.api';
import { useEquipments } from '@/hooks/useResources';
import { RESERVATION_TYPES } from '@/types/resources.types';
import type { ReservationFormData } from '@/types/resources.types';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';

export default function ReservationForm() {
  const navigate = useNavigate();
  useEquipments();
  const [formData, setFormData] = useState<ReservationFormData>({
    type_reservation: 'EQUIPEMENT',
    date_debut: '',
    heure_debut: '08:00',
    date_fin: '',
    heure_fin: '10:00',
    motif: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resourcesApi.createReservation(formData);
      navigate('/admin/resources/reservations');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nouvelle réservation</h1>
      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              value={formData.type_reservation}
              onChange={(e) => setFormData({ ...formData, type_reservation: e.target.value as any })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {RESERVATION_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Date début</label>
              <input
                type="date"
                required
                value={formData.date_debut}
                onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Heure début</label>
              <input
                type="time"
                required
                value={formData.heure_debut}
                onChange={(e) => setFormData({ ...formData, heure_debut: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Date fin</label>
              <input
                type="date"
                required
                value={formData.date_fin}
                onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Heure fin</label>
              <input
                type="time"
                required
                value={formData.heure_fin}
                onChange={(e) => setFormData({ ...formData, heure_fin: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Motif</label>
            <textarea
              required
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/resources/reservations')}
              className="px-4 py-2 border rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
              Enregistrer
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
}