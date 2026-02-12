import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useReservations, useEquipments } from '@/hooks/useResources';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';
import type { CalendarEvent, Reservation } from '@/types/resources.types';

const locales = { 'fr': fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function ReservationCalendar() {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<number | null>(null);

  const { reservations, loading: loadingReservations } = useReservations();
  const { equipments, loading: loadingEquipments } = useEquipments();

  const events = useMemo((): CalendarEvent[] => {
    return reservations
      .filter(r => !selectedEquipment || r.equipements_reserves?.some(e => e.equipement === selectedEquipment))
      .map(r => ({
        id: r.id,
        title: `${r.motif} - ${r.demandeur_info?.username || ''}`,
        start: new Date(`${r.date_debut}T${r.heure_debut}`),
        end: new Date(`${r.date_fin}T${r.heure_fin}`),
        resource: r,
        type: 'reservation' as const,
        status: r.statut,
      }));
  }, [reservations, selectedEquipment]);

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const colors = {
      EN_ATTENTE: { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' },
      VALIDEE: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
      REJETEE: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
      ANNULEE: { backgroundColor: '#E5E7EB', borderColor: '#6B7280' },
      TERMINEE: { backgroundColor: '#DBEAFE', borderColor: '#3B82F6' },
    };
    return { style: colors[event.status as keyof typeof colors] || {} };
  }, []);

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    console.log('Nouvelle réservation:', { start, end });
  }, []);

  if (loadingReservations || loadingEquipments) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calendrier des réservations</h1>
        <div className="flex gap-3">
          <select
            value={selectedEquipment || ''}
            onChange={(e) => setSelectedEquipment(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">Tous les équipements</option>
            {equipments.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.nom}</option>
            ))}
          </select>
        </div>
      </div>

      <Card className="p-6">
        <div style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            onSelectSlot={handleSelectSlot}
            selectable
            culture="fr"
            messages={{
              next: 'Suivant',
              previous: 'Précédent',
              today: "Aujourd'hui",
              month: 'Mois',
              week: 'Semaine',
              day: 'Jour',
            }}
          />
        </div>
      </Card>
    </div>
  );
}