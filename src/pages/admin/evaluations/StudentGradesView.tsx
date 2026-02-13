/**
 * Page Vue des Notes d'un Étudiant
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award } from 'lucide-react';
import { useNotesEtudiant } from '@/hooks/useEvaluations';
import { useAnneeAcademiques } from '@/hooks/useAnneeAcademiques';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

export default function StudentGradesView() {
  const { id } = useParams<{ id: string }>();
  const [semestre, setSemestre] = useState<number>(1);
  const [anneeAcademique, setAnneeAcademique] = useState<number | undefined>();

  const { data: notes, isLoading } = useNotesEtudiant(Number(id), {
    semestre,
    annee_academique: anneeAcademique,
  });
  const { data: annees } = useAnneeAcademiques({ is_active: true });

  // Grouper les notes par matière
  const notesByMatiere = notes?.reduce((acc: any, note: any) => {
    const matiereId = note.evaluation_details?.matiere;
    if (!acc[matiereId]) {
      acc[matiereId] = {
        matiere: note.evaluation_details?.matiere_details,
        evaluations: [],
      };
    }
    acc[matiereId].evaluations.push(note);
    return acc;
  }, {});

  // Calculer moyennes
  const calculateMoyenneMatiere = (evaluations: any[]) => {
    const validNotes = evaluations.filter((e) => e.note_sur_20 && !e.est_absent);
    if (validNotes.length === 0) return null;
    const sum = validNotes.reduce((acc, e) => acc + e.note_sur_20, 0);
    return (sum / validNotes.length).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Notes de l'étudiant</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Semestre"
            value={semestre}
            onChange={(e) => setSemestre(Number(e.target.value))}
          >
            <option value={1}>Semestre 1</option>
            <option value={2}>Semestre 2</option>
          </Select>

          <Select
            label="Année académique"
            value={anneeAcademique || ''}
            onChange={(e) => setAnneeAcademique(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">En cours</option>
            {annees?.results.map((a) => (
              <option key={a.id} value={a.id}>{a.code}</option>
            ))}
          </Select>
        </div>
      </div>

      {notesByMatiere && Object.values(notesByMatiere).map((data: any) => (
        <Card key={data.matiere.id}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {data.matiere.code} - {data.matiere.nom}
              </h3>
              <p className="text-sm text-gray-500">
                Coefficient: {data.matiere.coefficient} • Crédits: {data.matiere.credits}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Moyenne</div>
              <div className="text-2xl font-bold text-blue-600">
                {calculateMoyenneMatiere(data.evaluations) || '-'}/20
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Évaluation</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Note</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Note /20</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.evaluations.map((note: any) => (
                  <tr key={note.id}>
                    <td className="px-4 py-3">{note.evaluation_details?.titre}</td>
                    <td className="px-4 py-3 text-center text-sm">
                      {new Date(note.evaluation_details?.date_evaluation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {note.est_absent ? (
                        <Badge variant="error">Absent</Badge>
                      ) : note.note ? (
                        `${note.note}/${note.evaluation_details?.bareme}`
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {note.note_sur_20 || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ))}
    </div>
  );
}