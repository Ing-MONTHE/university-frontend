import { useState, useMemo } from 'react';
import { Plus, Calendar, Filter, AlertCircle } from 'lucide-react';
import { useCours, useCreneaux, useConflits, useSalles } from '@/hooks/useSchedule';
import { useFilieres } from '@/hooks/useFilieres';
import { useTeachers } from '@/hooks/useTeachers';
import { Card, Button, Select, Modal, Badge } from '@/components/ui';
import type { Cours, JourSemaine } from '@/types/schedule.types';
import CoursForm from './CoursForm';

const JOURS: JourSemaine[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
const JOUR_LABELS: Record<JourSemaine, string> = {
  LUNDI: 'Lundi',
  MARDI: 'Mardi',
  MERCREDI: 'Mercredi',
  JEUDI: 'Jeudi',
  VENDREDI: 'Vendredi',
  SAMEDI: 'Samedi',
};

// Couleurs par filière (exemple)
const COLORS = [
  'bg-blue-100 border-blue-400 text-blue-900',
  'bg-green-100 border-green-400 text-green-900',
  'bg-purple-100 border-purple-400 text-purple-900',
  'bg-orange-100 border-orange-400 text-orange-900',
  'bg-pink-100 border-pink-400 text-pink-900',
  'bg-indigo-100 border-indigo-400 text-indigo-900',
];

export default function CoursPlanning() {
  const [showForm, setShowForm] = useState(false);
  const [filiereFilter, setFiliereFilter] = useState('');
  const [enseignantFilter, setEnseignantFilter] = useState('');
  const [salleFilter, setSalleFilter] = useState('');

  const { data: coursData, isLoading } = useCours({
    page_size: 1000,
    matiere: undefined,
    enseignant: enseignantFilter ? parseInt(enseignantFilter) : undefined,
    salle: salleFilter ? parseInt(salleFilter) : undefined,
  });

  const { data: creneauxData } = useCreneaux({ page_size: 100 });
  const { data: conflitsData } = useConflits({ resolu: false });
  const { data: filieresData } = useFilieres({ page_size: 100 });
  const { data: enseignantsData } = useTeachers({ page_size: 1000 });
  const { data: sallesData } = useSalles({ page_size: 1000 });

  // Organiser cours par jour et créneau
  const coursByJourCreneau = useMemo(() => {
    const map: Record<string, Cours[]> = {};
    
    (coursData?.results || []).forEach((cours) => {
      if (cours.creneau_details) {
        const key = `${cours.creneau_details.jour}-${cours.creneau}`;
        if (!map[key]) map[key] = [];
        map[key].push(cours);
      }
    });
    
    return map;
  }, [coursData]);

  // Créneaux groupés par jour
  const creneauxByJour = useMemo(() => {
    const map: Record<JourSemaine, typeof creneauxData.results> = {
      LUNDI: [],
      MARDI: [],
      MERCREDI: [],
      JEUDI: [],
      VENDREDI: [],
      SAMEDI: [],
    };
    
    if (!creneauxData?.results) return map;
    
    creneauxData.results.forEach((creneau) => {
      map[creneau.jour].push(creneau);
    });
    
    // Trier par heure de début
    Object.keys(map).forEach((jour) => {
      map[jour as JourSemaine].sort((a, b) => 
        a.heure_debut.localeCompare(b.heure_debut)
      );
    });
    
    return map;
  }, [creneauxData]);

  // Trouver tous les créneaux uniques pour les lignes
  const allCreneaux = useMemo(() => {
    const set = new Set<string>();
    (creneauxData?.results || []).forEach((c) => {
      set.add(`${c.heure_debut}-${c.heure_fin}`);
    });
    return Array.from(set).sort();
  }, [creneauxData]);

  const filiereOptions = [
    { value: '', label: 'Toutes les filières' },
    ...(filieresData?.results || []).map((f) => ({ value: f.id.toString(), label: f.nom })),
  ];

  const enseignantOptions = [
    { value: '', label: 'Tous les enseignants' },
    ...(enseignantsData?.results || []).map((e) => ({ 
      value: e.id.toString(), 
      label: `${e.first_name} ${e.last_name}` 
    })),
  ];

  const salleOptions = [
    { value: '', label: 'Toutes les salles' },
    ...(sallesData?.results || []).map((s) => ({ value: s.id.toString(), label: s.nom })),
  ];

  const getColorForFiliere = (filiereId?: number) => {
    if (!filiereId) return COLORS[0];
    return COLORS[filiereId % COLORS.length];
  };

  const hasConflict = (coursId: number) => {
    return (conflitsData?.results || []).some(
      (c) => c.cours_1 === coursId || c.cours_2 === coursId
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7" />
            Emploi du Temps
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Vue hebdomadaire des cours
          </p>
        </div>
        <div className="flex gap-3">
          {conflitsData && conflitsData.count > 0 && (
            <Button variant="outline" className="text-red-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              {conflitsData.count} conflit{conflitsData.count > 1 ? 's' : ''}
            </Button>
          )}
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Cours
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtres</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            value={filiereFilter}
            onChange={(e) => setFiliereFilter(e.target.value)}
            options={filiereOptions}
          />
          <Select
            value={enseignantFilter}
            onChange={(e) => setEnseignantFilter(e.target.value)}
            options={enseignantOptions}
          />
          <Select
            value={salleFilter}
            onChange={(e) => setSalleFilter(e.target.value)}
            options={salleOptions}
          />
        </div>
      </Card>

      {/* Grille hebdomadaire */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r min-w-[120px]">
                  Horaire
                </th>
                {JOURS.map((jour) => (
                  <th
                    key={jour}
                    className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r last:border-r-0 min-w-[180px]"
                  >
                    {JOUR_LABELS[jour]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : allCreneaux.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    Aucun créneau défini. Créez des créneaux d'abord.
                  </td>
                </tr>
              ) : (
                allCreneaux.map((horaire) => {
                  const [debut, fin] = horaire.split('-');
                  
                  return (
                    <tr key={horaire} className="border-b hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 font-mono text-xs text-gray-600 border-r">
                        {debut}<br/>-<br/>{fin}
                      </td>
                      {JOURS.map((jour) => {
                        // Trouver le créneau correspondant
                        const creneau = creneauxByJour[jour]?.find(
                          (c) => `${c.heure_debut}-${c.heure_fin}` === horaire
                        );
                        
                        const key = creneau ? `${jour}-${creneau.id}` : `${jour}-${horaire}`;
                        const coursList = creneau ? coursByJourCreneau[key] || [] : [];

                        return (
                          <td
                            key={key}
                            className="px-2 py-2 border-r last:border-r-0 align-top"
                          >
                            <div className="space-y-1">
                              {coursList.map((cours, idx) => (
                                <div
                                  key={cours.id}
                                  className={`p-2 rounded border-l-4 text-xs ${getColorForFiliere(
                                    cours.matiere_details?.filiere
                                  )} relative group cursor-pointer hover:shadow-md transition-shadow`}
                                >
                                  {hasConflict(cours.id) && (
                                    <Badge variant="danger" className="absolute -top-1 -right-1 text-xs px-1">
                                      !
                                    </Badge>
                                  )}
                                  <div className="font-semibold truncate">
                                    {cours.matiere_details?.nom || 'Matière'}
                                  </div>
                                  <div className="text-gray-600 truncate">
                                    {cours.enseignant_details?.first_name || ''} {cours.enseignant_details?.last_name || ''}
                                  </div>
                                  <div className="text-gray-500 truncate">
                                    {cours.salle_details?.nom || 'Salle'}
                                  </div>
                                  
                                  {/* Tooltip au hover */}
                                  <div className="absolute hidden group-hover:block top-full left-0 mt-1 p-2 bg-gray-900 text-white rounded shadow-lg z-20 w-64 text-xs">
                                    <div className="font-semibold mb-1">{cours.matiere_details?.nom}</div>
                                    <div>Enseignant: {cours.enseignant_details?.first_name} {cours.enseignant_details?.last_name}</div>
                                    <div>Salle: {cours.salle_details?.nom}</div>
                                    <div>Effectif: {cours.effectif_prevu}</div>
                                    {hasConflict(cours.id) && (
                                      <div className="text-red-400 font-semibold mt-1">⚠️ Conflit détecté</div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nouveau Cours"
      >
        <CoursForm
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}