/**
 * Page Bulletin de Notes
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Award } from 'lucide-react';
import { useBulletinEtudiant, useExportBulletinPDF } from '@/hooks/useEvaluations';
import { useAnneeAcademiques } from '@/hooks/useAnneeAcademiques';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { MENTION_CHOICES } from '@/types/evaluation.types';

export default function BulletinView() {
  const { id } = useParams<{ id: string }>();
  const [semestre, setSemestre] = useState<number>(1);
  const [anneeAcademique, setAnneeAcademique] = useState<number | undefined>();

  const { data: bulletin, isLoading } = useBulletinEtudiant(Number(id), {
    semestre,
    annee_academique: anneeAcademique!,
  });
  const { data: annees } = useAnneeAcademiques();
  const exportPDF = useExportBulletinPDF();

  const handleExport = () => {
    if (!anneeAcademique) return;
    exportPDF.mutate({
      etudiantId: Number(id),
      params: { semestre, annee_academique: anneeAcademique },
    });
  };

  const getMentionBadge = (mention: string) => {
    const config = MENTION_CHOICES.find((m) => m.value === mention);
    return config ? (
      <Badge variant={config.color as any}>{config.label}</Badge>
    ) : null;
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bulletin de Notes</h1>
          <Button onClick={handleExport} disabled={!anneeAcademique}>
            <Download className="w-4 h-4 mr-2" />
            Exporter PDF
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Semestre" value={semestre} onChange={(e) => setSemestre(Number(e.target.value))}>
            <option value={1}>Semestre 1</option>
            <option value={2}>Semestre 2</option>
          </Select>
          <Select label="Année" value={anneeAcademique || ''} onChange={(e) => setAnneeAcademique(Number(e.target.value))}>
            <option value="">Sélectionner</option>
            {annees?.results.map((a) => (
              <option key={a.id} value={a.id}>{a.code}</option>
            ))}
          </Select>
        </div>
      </div>

      {bulletin && (
        <>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">BULLETIN DE NOTES</h2>
              <p className="text-lg text-gray-600 mt-2">{bulletin.annee_academique}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500">Étudiant</p>
                <p className="font-semibold">{bulletin.etudiant_nom} {bulletin.etudiant_prenom}</p>
                <p className="text-sm text-gray-600">{bulletin.etudiant_matricule}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Filière</p>
                <p className="font-semibold">{bulletin.filiere_nom}</p>
                <p className="text-sm text-gray-600">Semestre {bulletin.semestre}</p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Matière</th>
                  <th className="px-4 py-3 text-center">Coef</th>
                  <th className="px-4 py-3 text-center">Moyenne</th>
                  <th className="px-4 py-3 text-center">Crédits</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bulletin.matieres.map((m) => (
                  <tr key={m.matiere_id}>
                    <td className="px-4 py-3">{m.matiere_code} - {m.matiere_nom}</td>
                    <td className="px-4 py-3 text-center">{m.coefficient}</td>
                    <td className="px-4 py-3 text-center font-semibold">{m.moyenne?.toFixed(2) || '-'}</td>
                    <td className="px-4 py-3 text-center">{m.credits_obtenus || 0}/{m.credits}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-bold">
                <tr>
                  <td className="px-4 py-3" colSpan={2}>MOYENNE GÉNÉRALE</td>
                  <td className="px-4 py-3 text-center text-lg">{bulletin.moyenne_generale?.toFixed(2)}/20</td>
                  <td className="px-4 py-3 text-center">{bulletin.total_credits_obtenus}/{bulletin.total_credits_possibles}</td>
                </tr>
              </tfoot>
            </table>

            <div className="flex justify-between items-center pt-6 border-t">
              <div>
                <p className="text-sm text-gray-500">Mention</p>
                {bulletin.mention && getMentionBadge(bulletin.mention)}
              </div>
              <div>
                <p className="text-sm text-gray-500">Décision</p>
                <Badge variant={bulletin.decision === 'ADMIS' ? 'success' : 'error'}>
                  {bulletin.decision}
                </Badge>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}