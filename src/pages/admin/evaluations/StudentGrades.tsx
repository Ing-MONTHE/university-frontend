/**
 * Page: Notes d'un Étudiant
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotes } from '../../../hooks/useEvaluations';
import { Card, Button, Spinner, Badge } from '../../../components/ui';

export default function StudentGrades() {
  const { etudiantId } = useParams();
  const navigate = useNavigate();

  const [filters] = useState({
    matiere: undefined as number | undefined,
  });

  const { data, isLoading } = useNotes({
    etudiant: Number(etudiantId),
    ...filters,
  });

  const notes = data?.results || [];

  // Stats
  const notesPresentes = notes.filter((n) => !n.absence && n.note_obtenue);
  const moyenne = notesPresentes.length > 0
    ? notesPresentes.reduce((acc, n) => acc + ((n.note_obtenue! / n.note_sur) * 20), 0) / notesPresentes.length
    : 0;
  
  const notes20 = notesPresentes.map((n) => (n.note_obtenue! / n.note_sur) * 20);
  const meilleure = notes20.length > 0 ? Math.max(...notes20) : 0;
  const pire = notes20.length > 0 ? Math.min(...notes20) : 0;

  // Evolution
  const chartData = notesPresentes
    .sort((a, b) => new Date(a.date_saisie).getTime() - new Date(b.date_saisie).getTime())
    .map((n) => ({
      date: format(new Date(n.date_saisie), 'dd/MM'),
      note: ((n.note_obtenue! / n.note_sur) * 20).toFixed(2),
    }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="primary" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes de l'étudiant</h1>
          <p className="text-gray-600 mt-1">Historique des notes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Moyenne générale</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{moyenne.toFixed(2)}/20</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Meilleure note</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{meilleure.toFixed(2)}/20</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Note la plus basse</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{pire.toFixed(2)}/20</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total notes</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{notes.length}</div>
        </Card>
      </div>

      {/* Évolution */}
      {chartData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des notes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 20]} />
              <Tooltip />
              <Line type="monotone" dataKey="note" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Liste */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Évaluation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note obtenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note /20</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(note.date_saisie), 'dd MMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Évaluation #{note.evaluation}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {note.absence ? (
                      <Badge variant="danger">Absent</Badge>
                    ) : (
                      <span className="font-medium">
                        {note.note_obtenue}/{note.note_sur}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {!note.absence && note.note_obtenue && (
                      <span className="font-medium text-blue-600">
                        {((note.note_obtenue / note.note_sur) * 20).toFixed(2)}/20
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {note.appreciations && (
                      <span className="text-sm text-gray-600">{note.appreciations}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}