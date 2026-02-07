/* eslint-disable react-hooks/set-state-in-effect */
/**
 * GradeEntry - Saisie des notes avec auto-save
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, AlertCircle, Search, Users } from 'lucide-react';
import { useEvaluation, useEvaluationNotes, useSaisieNotesLot, useEvaluationStats } from '@/hooks/useEvaluations';
import type { Note, NoteInput } from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { debounce } from 'lodash';

export default function GradeEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: evaluation, isLoading: evalLoading } = useEvaluation(Number(id));
  const { data: notesData, isLoading: notesLoading } = useEvaluationNotes(Number(id));
  const { data: stats, refetch: refetchStats } = useEvaluationStats(Number(id));
  const saisieNotesLotMutation = useSaisieNotesLot();

  const [notes, setNotes] = useState<Record<number, NoteInput>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialiser les notes depuis l'API
  useEffect(() => {
    if (notesData) {
      const initialNotes: Record<number, NoteInput> = {};
      notesData.forEach((note: Note) => {
        if (note.etudiant_details) {
          initialNotes[note.etudiant] = {
            etudiant_id: note.etudiant,
            note_obtenue: note.note_obtenue,
            absence: note.absence,
          };
        }
      });
      setNotes(initialNotes);
    }
  }, [notesData]);

  // Fonction de sauvegarde avec debounce
  const saveNotes = useCallback(
    async (notesToSave: Record<number, NoteInput>) => {
      setSaveStatus('saving');

      try {
        const notesArray = Object.values(notesToSave).filter(
          (note) => note.absence || note.note_obtenue !== undefined
        );

        await saisieNotesLotMutation.mutateAsync({
          evaluationId: Number(id),
          payload: { notes: notesArray },
        });

        setSaveStatus('saved');
        setLastSaved(new Date());
        refetchStats();

        // Réinitialiser le statut après 2 secondes
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        setSaveStatus('error');
        console.error('Erreur lors de la sauvegarde:', error);
      }
    },
    [id, saisieNotesLotMutation, refetchStats]
  );

  // Debounced save (1 seconde)
  const debouncedSave = useMemo(
    () => debounce(saveNotes, 1000),
    [saveNotes]
  );

  // Handler pour modification de note
  const handleNoteChange = (etudiantId: number, value: string) => {
    const newNotes = {
      ...notes,
      [etudiantId]: {
        ...notes[etudiantId],
        etudiant_id: etudiantId,
        note_obtenue: value ? parseFloat(value) : undefined,
        absence: notes[etudiantId]?.absence || false,
      },
    };

    setNotes(newNotes);
    debouncedSave(newNotes);
  };

  // Handler pour absence
  const handleAbsenceChange = (etudiantId: number, checked: boolean) => {
    const newNotes = {
      ...notes,
      [etudiantId]: {
        ...notes[etudiantId],
        etudiant_id: etudiantId,
        note_obtenue: checked ? undefined : notes[etudiantId]?.note_obtenue,
        absence: checked,
      },
    };

    setNotes(newNotes);
    debouncedSave(newNotes);
  };

  // Filtrer étudiants selon recherche
  const filteredNotes = useMemo(() => {
    if (!notesData) return [];

    return notesData.filter((note: Note) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        note.etudiant_details?.matricule?.toLowerCase().includes(search) ||
        note.etudiant_details?.nom?.toLowerCase().includes(search) ||
        note.etudiant_details?.prenom?.toLowerCase().includes(search)
      );
    });
  }, [notesData, searchTerm]);

  // Validation note
  const isValidNote = (note?: number) => {
    if (!note || !evaluation) return true;
    return note >= 0 && note <= evaluation.note_totale;
  };

  // Couleur de ligne selon note
  const getRowColor = (note?: number) => {
    if (!note || !evaluation) return '';
    const noteSur20 = (note / evaluation.note_totale) * 20;
    if (noteSur20 >= 10) return 'bg-green-50';
    return 'bg-red-50';
  };

  if (evalLoading || notesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-center text-red-600">Évaluation non trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => navigate('/admin/evaluations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{evaluation.titre}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <span>
                {evaluation.matiere_details?.code} - {evaluation.matiere_details?.nom}
              </span>
              <span>•</span>
              <span>Barème: /{evaluation.note_totale}</span>
              <span>•</span>
              <span>Coefficient: {evaluation.coefficient}</span>
              <span>•</span>
              <span>{new Date(evaluation.date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Indicateur de sauvegarde */}
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <span className="text-blue-600 flex items-center gap-2">
                <Spinner size="sm" />
                Enregistrement...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-green-600 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Sauvegardé
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Erreur
              </span>
            )}
            {lastSaved && saveStatus === 'idle' && (
              <span className="text-gray-500 text-sm">
                Dernière sauvegarde : {lastSaved.toLocaleTimeString('fr-FR')}
              </span>
            )}
          </div>
        </div>

        {/* Statistiques en temps réel */}
        {stats && (
          <div className="grid grid-cols-5 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Moyenne classe</p>
              <p className="text-xl font-bold text-blue-600">{stats.moyenne_classe}/20</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Note min</p>
              <p className="text-xl font-bold text-orange-600">{stats.note_min}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Note max</p>
              <p className="text-xl font-bold text-green-600">{stats.note_max}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Présents</p>
              <p className="text-xl font-bold text-purple-600">{stats.nb_notes}/{stats.nb_total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux réussite</p>
              <p className="text-xl font-bold text-green-600">{stats.taux_reussite}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un étudiant (matricule, nom)..."
            className="w-full pl-10"
          />
        </div>
      </div>

      {/* Tableau de saisie */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Note /{evaluation.note_totale}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Absent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredNotes.map((note: Note) => {
                const etudiantId = note.etudiant;
                const currentNote = notes[etudiantId];
                const isAbsent = currentNote?.absence || note.absence || false;
                const noteValue = currentNote?.note_obtenue ?? note.note_obtenue;

                return (
                  <tr
                    key={note.id || `etudiant-${etudiantId}`}
                    className={`${getRowColor(noteValue)} hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={note.etudiant_details?.photo_url || '/default-avatar.png'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {note.etudiant_details?.matricule}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">
                        {note.etudiant_details?.nom} {note.etudiant_details?.prenom}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Input
                        type="number"
                        min="0"
                        max={evaluation.note_totale}
                        step="0.5"
                        value={noteValue !== undefined ? noteValue : ''}
                        onChange={(e) => handleNoteChange(etudiantId, e.target.value)}
                        disabled={isAbsent}
                        className={`w-24 ${
                          noteValue !== undefined && !isValidNote(noteValue)
                            ? 'border-red-500'
                            : ''
                        }`}
                        placeholder="--"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={isAbsent}
                        onChange={(e) => handleAbsenceChange(etudiantId, e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun étudiant trouvé</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4 flex justify-end gap-3">
        <Button variant="secondary" onClick={() => navigate('/admin/evaluations')}>
          Fermer
        </Button>
        <Button
          variant="primary"
          onClick={() => saveNotes(notes)}
          disabled={saisieNotesLotMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {saisieNotesLotMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder tout'}
        </Button>
      </div>
    </div>
  );
}
