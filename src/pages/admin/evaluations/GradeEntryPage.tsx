/**
 * Page de Saisie des Notes - SAISIE NOTES ⭐
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Download,
  TrendingUp,
  Users,
  UserX,
  CheckCircle,
} from 'lucide-react';
import {
  useEvaluation,
  useNotesByEvaluation,
  useUpdateNote,
  useSaisieLotNotes,
  useEvaluationStats,
} from '@/hooks/useEvaluations';
import { useStudents } from '@/hooks/useStudents';
import type { Note, NoteUpdate } from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Avatar } from '@/components/ui';
import { toast } from 'react-hot-toast';

type FilterType = 'tous' | 'saisis' | 'non_saisis' | 'absents';

export default function GradeEntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterType>('tous');
  const [notesData, setNotesData] = useState<Record<number, NoteUpdate>>({});
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { data: evaluation, isLoading: loadingEval } = useEvaluation(
    Number(id)
  );
  const { data: notes, isLoading: loadingNotes } = useNotesByEvaluation(
    Number(id)
  );
  const { data: stats } = useEvaluationStats(Number(id));
  const updateNoteMutation = useUpdateNote();
  const saisieLotMutation = useSaisieLotNotes();

  // Charger les notes existantes dans l'état local
  useEffect(() => {
    if (notes) {
      const initialData: Record<number, NoteUpdate> = {};
      notes.forEach((note) => {
        initialData[note.etudiant] = {
          note: note.note,
          est_absent: note.est_absent,
          remarque: note.remarque,
        };
      });
      setNotesData(initialData);
    }
  }, [notes]);

  // Auto-save avec debounce de 1 seconde
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      handleSaveAll(true); // Silent save
    }, 1000);

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notesData]);

  const handleNoteChange = (etudiantId: number, value: string) => {
    setNotesData((prev) => ({
      ...prev,
      [etudiantId]: {
        ...prev[etudiantId],
        note: value ? Number(value) : undefined,
        est_absent: false,
      },
    }));
  };

  const handleAbsentToggle = (etudiantId: number, checked: boolean) => {
    setNotesData((prev) => ({
      ...prev,
      [etudiantId]: {
        ...prev[etudiantId],
        est_absent: checked,
        note: checked ? undefined : prev[etudiantId]?.note,
      },
    }));
  };

  const handleSaveAll = async (silent = false) => {
    if (!evaluation) return;

    const notesToSave = Object.entries(notesData)
      .filter(([, data]) => data.note !== undefined || data.est_absent)
      .map(([etudiantId, data]) => ({
        etudiant_id: Number(etudiantId),
        ...data,
      }));

    if (notesToSave.length === 0) {
      if (!silent) toast.error('Aucune note à enregistrer');
      return;
    }

    try {
      await saisieLotMutation.mutateAsync({
        evaluation_id: evaluation.id,
        notes: notesToSave,
      });
      setLastSaved(new Date());
      if (!silent) toast.success('Notes enregistrées avec succès');
    } catch (error) {
      if (!silent) toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    toast.success('Export Excel en cours...');
  };

  // Filtrer les notes selon le filtre actif
  const filteredNotes = useMemo(() => {
    if (!notes) return [];

    switch (filter) {
      case 'saisis':
        return notes.filter((n) => n.note !== null && n.note !== undefined);
      case 'non_saisis':
        return notes.filter((n) => n.note === null && !n.est_absent);
      case 'absents':
        return notes.filter((n) => n.est_absent);
      default:
        return notes;
    }
  }, [notes, filter]);

  // Calculer la note sur 20
  const calculateNoteSur20 = (note: number | undefined) => {
    if (!note || !evaluation) return null;
    if (evaluation.bareme === 20) return note;
    return ((note / evaluation.bareme) * 20).toFixed(2);
  };

  // Valider la note
  const isNoteValid = (note: number | undefined) => {
    if (!note || !evaluation) return true;
    return note >= 0 && note <= evaluation.bareme;
  };

  if (loadingEval || loadingNotes) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!evaluation) {
    return <div>Évaluation non trouvée</div>;
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/evaluations')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Saisie des notes
            </h1>
            <p className="text-gray-600 mt-1">
              {evaluation.titre} - {evaluation.matiere_details?.nom}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button onClick={() => handleSaveAll(false)}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>

        {/* Auto-save indicator */}
        {lastSaved && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            Dernière sauvegarde: {lastSaved.toLocaleTimeString('fr-FR')}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Progression</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.notes_saisies || 0}/{stats?.total_etudiants || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Moyenne classe</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.moyenne_classe?.toFixed(2) || '-'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Min / Max</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.note_min?.toFixed(2) || '-'} /{' '}
                {stats?.note_max?.toFixed(2) || '-'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Absents</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.absents || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-2">
          {[
            { key: 'tous', label: 'Tous', count: notes?.length || 0 },
            {
              key: 'saisis',
              label: 'Saisis',
              count: stats?.notes_saisies || 0,
            },
            {
              key: 'non_saisis',
              label: 'Non saisis',
              count:
                (stats?.total_etudiants || 0) -
                (stats?.notes_saisies || 0) -
                (stats?.absents || 0),
            },
            { key: 'absents', label: 'Absents', count: stats?.absents || 0 },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as FilterType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Tableau de saisie */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Étudiant
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Note /{evaluation.bareme}
                </th>
                {evaluation.bareme !== 20 && (
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Note /20
                  </th>
                )}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Absent
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotes.map((note) => {
                const currentNote = notesData[note.etudiant]?.note;
                const isAbsent = notesData[note.etudiant]?.est_absent;
                const isValid = isNoteValid(currentNote);

                return (
                  <tr key={note.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={note.etudiant_details?.photo}
                          alt={note.etudiant_details?.nom}
                          size="sm"
                        />
                        <div>
                          <div className="font-medium text-gray-900">
                            {note.etudiant_details?.nom}{' '}
                            {note.etudiant_details?.prenom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {note.etudiant_details?.matricule}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={evaluation.bareme}
                        value={currentNote || ''}
                        onChange={(e) =>
                          handleNoteChange(note.etudiant, e.target.value)
                        }
                        disabled={isAbsent}
                        className={`w-24 px-3 py-2 text-center border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                          !isValid
                            ? 'border-red-500'
                            : currentNote
                            ? 'border-green-500'
                            : 'border-gray-300'
                        }`}
                      />
                    </td>
                    {evaluation.bareme !== 20 && (
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {calculateNoteSur20(currentNote) || '-'}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isAbsent || false}
                        onChange={(e) =>
                          handleAbsentToggle(note.etudiant, e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isAbsent ? (
                        <Badge variant="error">Absent</Badge>
                      ) : currentNote ? (
                        <Badge variant="success">Saisi</Badge>
                      ) : (
                        <Badge variant="gray">Non saisi</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}