/**
 * Page Résultats par Filière
 */

import { useState } from 'react';
import { Download, TrendingUp, Users, Award } from 'lucide-react';
import { useResultatsFiliere, useExportResultatsExcel } from '@/hooks/useEvaluations';
import { useFilieres } from '@/hooks/useFilieres';
import { useAnneeAcademiques } from '@/hooks/useAnneeAcademiques';
import Button from '@/components/ui/Button';
import NativeSelect from '@/components/ui/NativeSelect';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function ResultatsFiliere() {
  const [filiere, setFiliere] = useState<number | undefined>();
  const [semestre, setSemestre] = useState<number>(1);
  const [anneeAcademique, setAnneeAcademique] = useState<number | undefined>();

  const { data: resultats, isLoading } = useResultatsFiliere({
    filiere: filiere!,
    semestre,
    annee_academique: anneeAcademique,
  });
  const { data: filieres } = useFilieres({ page_size: 100 });
  const { data: annees } = useAnneeAcademiques();
  const exportExcel = useExportResultatsExcel();

  const handleExport = () => {
    if (!filiere) return;
    exportExcel.mutate({ filiere, semestre, annee_academique: anneeAcademique });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Résultats par Filière</h1>
          <Button onClick={handleExport} disabled={!filiere}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <NativeSelect label="Filière" value={filiere || ''} onChange={(e) => setFiliere(Number(e.target.value))}>
            <option value="">Sélectionner</option>
            {filieres?.results.map((f) => (
              <option key={f.id} value={f.id}>{f.code} - {f.nom}</option>
            ))}
          </NativeSelect>
          <NativeSelect label="Semestre" value={semestre} onChange={(e) => setSemestre(Number(e.target.value))}>
            <option value={1}>Semestre 1</option>
            <option value={2}>Semestre 2</option>
          </NativeSelect>
          <NativeSelect label="Année" value={anneeAcademique || ''} onChange={(e) => setAnneeAcademique(Number(e.target.value))}>
            <option value="">En cours</option>
            {annees?.results.map((a) => (
              <option key={a.id} value={a.id}>{a.code}</option>
            ))}
          </NativeSelect>
        </div>
      </div>

      {resultats && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Moyenne classe</p>
                  <p className="text-2xl font-bold">{resultats.statistiques?.moyenne_classe?.toFixed(2) || '0.00'}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux réussite</p>
                  <p className="text-2xl font-bold">{resultats.statistiques?.taux_reussite?.toFixed(1) || '0.0'}%</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Admis</p>
                  <p className="text-2xl font-bold text-green-600">{resultats.statistiques?.admis || 0}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ajournés</p>
                  <p className="text-2xl font-bold text-red-600">{resultats.statistiques?.ajournes || 0}</p>
                </div>
                <Users className="w-8 h-8 text-red-600" />
              </div>
            </Card>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Rang</th>
                  <th className="px-6 py-3 text-left">Matricule</th>
                  <th className="px-6 py-3 text-left">Nom</th>
                  <th className="px-6 py-3 text-center">Moyenne</th>
                  <th className="px-6 py-3 text-center">Crédits</th>
                  <th className="px-6 py-3 text-center">Mention</th>
                  <th className="px-6 py-3 text-center">Décision</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {resultats.etudiants?.length > 0 ? (
                  resultats.etudiants.map((etudiant) => (
                    <tr key={etudiant.etudiant_id}>
                      <td className="px-6 py-4 font-bold">{etudiant.rang}</td>
                      <td className="px-6 py-4">{etudiant.matricule}</td>
                      <td className="px-6 py-4">{etudiant.nom} {etudiant.prenom}</td>
                      <td className="px-6 py-4 text-center font-semibold">{etudiant.moyenne_generale?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 text-center">{etudiant.credits_obtenus || 0}/{etudiant.credits_total || 0}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="info">{etudiant.mention || 'N/A'}</Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={etudiant.decision === 'ADMIS' ? 'success' : 'error'}>
                          {etudiant.decision || 'N/A'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Aucun étudiant trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}