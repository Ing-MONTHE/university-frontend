/**
 * Page: Saisie des Notes
 * Deux modes: Tableau (défaut) et Vue Rapide
 */

import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEvaluationNotes, useSaisieNotesLot } from '@/hooks/useEvaluations';
import { Card, Button, Spinner, Badge } from '@/components/ui';
import type { Note } from '@/types/evaluation.types';
// import { debounce } from '@/utils';

type NoteState = Note & {
  modified?: boolean;
  saving?: boolean;
};

export default function GradeEntry() {
  const { id } = useParams();
  const navigate = useNavigate();
  const evaluationId = Number(id);

  // Queries
  const { data, isLoading, refetch } = useEvaluationNotes(evaluationId);
  const saisieNotesLot = useSaisieNotesLot();

  // State
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [notesState, setNotesState] = useState<NoteState[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const evaluation = data?.evaluation;
  // const stats = data?.statistiques; // Réservé pour un usage futur (statistiques serveur)

  // Initialiser les notes
  useEffect(() => {
    if (data?.notes) {
      const mapped: NoteState[] = data.notes.map((n, index) => ({
        ...(n as Note),
        id: n.id !== undefined ? n.id : index,
        modified: false,
        saving: false,
      }));

      setNotesState(mapped);
      setHasChanges(false);
    }
  }, [data]);

  // Modifier une note
  const handleNoteChange = (index: number, field: 'note_obtenue' | 'absence', value: any) => {
    setNotesState((prev) => {
      const updated = [...prev];
      const note = { ...updated[index] };

      if (field === 'absence') {
        note.absence = value;
        if (value) {
          note.note_obtenue = undefined;
        }
      } else {
        note.note_obtenue = value ? parseFloat(value) : undefined;
      }

      note.modified = true;
      updated[index] = note;
      setHasChanges(true);
      return updated;
    });
  };

  // Possibilité future de sauvegarde auto (debounced) :
  // const debouncedSave = useCallback(
  //   debounce(async () => {
  //     await handleSaveAll();
  //   }, 500),
  //   [notesState]
  // );

  // Sauvegarder toutes les notes
  const handleSaveAll = async () => {
    const notesToSave = notesState
      .filter((n) => n.modified)
      .map((n) => ({
        etudiant_id: n.etudiant,
        note_obtenue: n.absence ? undefined : n.note_obtenue,
        absence: n.absence,
      }));

    if (notesToSave.length === 0) {
      return;
    }

    await saisieNotesLot.mutateAsync({
      evaluationId,
      notes: { notes: notesToSave },
    });

    await refetch();
    setHasChanges(false);
  };

  // Calculs stats temps réel
  const realTimeStats = useMemo(() => {
    const notesPresentes = notesState.filter((n) => !n.absence && n.note_obtenue !== undefined && n.note_obtenue !== null);
    const total = notesState.length;
    const saisies = notesPresentes.length;
    const absents = notesState.filter((n) => n.absence).length;
    
    if (notesPresentes.length === 0) {
      return {
        moyenne: 0,
        min: 0,
        max: 0,
        saisies,
        total,
        absents,
        distribution: {
          excellent: 0,
          tres_bien: 0,
          bien: 0,
          assez_bien: 0,
          passable: 0,
          insuffisant: 0,
        },
      };
    }

    const notes20 = notesPresentes.map((n) =>
      ((n.note_obtenue! / (evaluation?.note_totale || 20)) * 20)
    );

    const moyenne = notes20.reduce((a, b) => a + b, 0) / notes20.length;
    const min = Math.min(...notes20);
    const max = Math.max(...notes20);

    const distribution = {
      excellent: notes20.filter((n) => n >= 18).length,
      tres_bien: notes20.filter((n) => n >= 16 && n < 18).length,
      bien: notes20.filter((n) => n >= 14 && n < 16).length,
      assez_bien: notes20.filter((n) => n >= 12 && n < 14).length,
      passable: notes20.filter((n) => n >= 10 && n < 12).length,
      insuffisant: notes20.filter((n) => n < 10).length,
    };

    return { moyenne, min, max, saisies, total, absents, distribution };
  }, [notesState, evaluation]);

  // Distribution chart data
  const chartData = [
    { name: 'Excellent', value: realTimeStats.distribution.excellent, fill: '#10b981' },
    { name: 'Très bien', value: realTimeStats.distribution.tres_bien, fill: '#3b82f6' },
    { name: 'Bien', value: realTimeStats.distribution.bien, fill: '#6366f1' },
    { name: 'Assez bien', value: realTimeStats.distribution.assez_bien, fill: '#f59e0b' },
    { name: 'Passable', value: realTimeStats.distribution.passable, fill: '#eab308' },
    { name: 'Insuffisant', value: realTimeStats.distribution.insuffisant, fill: '#ef4444' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="primary" onClick={() => navigate('/admin/evaluations')}>
          <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saisie des notes</h1>
            <p className="text-gray-600 mt-1">
              {evaluation?.titre} - {evaluation?.matiere}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tableau
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Vue Rapide
            </button>
          </div>

          <Button
            variant="primary"
            onClick={handleSaveAll}
            disabled={!hasChanges || saisieNotesLot.isPending}
          >
            {saisieNotesLot.isPending ? (
              <>
                <Spinner size="sm" />
                Sauvegarde...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Sauvegarder tout
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats temps réel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Moyenne classe</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {realTimeStats.moyenne.toFixed(2)}/20
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600">Min / Max</div>
          <div className="text-lg font-bold text-gray-900 mt-1">
            {realTimeStats.min.toFixed(1)} / {realTimeStats.max.toFixed(1)}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600">Taux saisie</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {realTimeStats.saisies}/{realTimeStats.total}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {((realTimeStats.saisies / realTimeStats.total) * 100).toFixed(0)}%
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600">Absents</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">
            {realTimeStats.absents}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-gray-600">Barème</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            /{evaluation?.note_totale || 20}
          </div>
        </Card>
      </div>

      {/* Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution des notes</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Liste des notes */}
      {viewMode === 'table' ? (
        <TableView
          notes={notesState}
          bareme={evaluation?.note_totale || 20}
          onChange={handleNoteChange}
        />
      ) : (
        <CardsView
          notes={notesState}
          bareme={evaluation?.note_totale || 20}
          onChange={handleNoteChange}
        />
      )}
    </div>
  );
}

// ============ TABLE VIEW ============
function TableView({
  notes,
  bareme,
  onChange,
}: {
  notes: NoteState[];
  bareme: number;
  onChange: (index: number, field: 'note_obtenue' | 'absence', value: any) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Matricule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Nom et Prénom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Note /{bareme}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Note /20
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Absent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notes.map((note, index) => {
              const note20 = note.note_obtenue
                ? ((note.note_obtenue / bareme) * 20).toFixed(2)
                : '-';

              return (
                <tr key={note.etudiant} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {note.etudiant_details?.photo_url ? (
                      <img
                        src={note.etudiant_details.photo_url}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {note.etudiant_details?.prenom?.[0]}
                        {note.etudiant_details?.nom?.[0]}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {note.etudiant_details?.matricule}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {note.etudiant_details?.nom} {note.etudiant_details?.prenom}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max={bareme}
                      value={note.note_obtenue || ''}
                      onChange={(e) => onChange(index, 'note_obtenue', e.target.value)}
                      disabled={note.absence}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-blue-600">{note20}</span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={note.absence}
                      onChange={(e) => onChange(index, 'absence', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {note.modified && (
                      <Badge variant="warning">Modifié</Badge>
                    )}
                    {note.saving && (
                      <Spinner size="sm" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ============ CARDS VIEW ============
function CardsView({
  notes,
  bareme,
  onChange,
}: {
  notes: NoteState[];
  bareme: number;
  onChange: (index: number, field: 'note_obtenue' | 'absence', value: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note, index) => {
        const note20 = note.note_obtenue
          ? ((note.note_obtenue / bareme) * 20).toFixed(2)
          : '-';

        return (
          <Card key={note.etudiant} className="p-4">
            <div className="flex items-start gap-4">
              {note.etudiant_details?.photo_url ? (
                <img
                  src={note.etudiant_details.photo_url}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl">
                  {note.etudiant_details?.prenom?.[0]}
                  {note.etudiant_details?.nom?.[0]}
                </div>
              )}

              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {note.etudiant_details?.nom} {note.etudiant_details?.prenom}
                </div>
                <div className="text-sm text-gray-600">
                  {note.etudiant_details?.matricule}
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max={bareme}
                      value={note.note_obtenue || ''}
                      onChange={(e) => onChange(index, 'note_obtenue', e.target.value)}
                      disabled={note.absence}
                      placeholder={`Note /${bareme}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <span className="text-sm font-medium text-blue-600 w-12">
                      {note20}/20
                    </span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={note.absence}
                      onChange={(e) => onChange(index, 'absence', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Absent</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}