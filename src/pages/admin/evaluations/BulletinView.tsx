/**
 * Page: Bulletin Étudiant
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useStudentBulletin } from '@/hooks/useEvaluations';
import { Card, Button, Spinner, Badge } from '@/components/ui';

export default function BulletinView() {
  const { etudiantId, anneeId } = useParams();
  const navigate = useNavigate();

  const { data: bulletin, isLoading } = useStudentBulletin(
    Number(etudiantId),
    anneeId ? Number(anneeId) : undefined
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!bulletin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Bulletin non disponible</p>
      </div>
    );
  }

  const getMentionColor = (mention: string | null) => {
    if (!mention) return 'neutral';
    if (mention === 'EXCELLENT') return 'success';
    if (mention === 'TB' || mention === 'B') return 'info';
    if (mention === 'AB') return 'warning';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="primary" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bulletin de notes</h1>
            <p className="text-gray-600 mt-1">
              {bulletin.etudiant.nom_complet} - {bulletin.annee_academique.libelle}
            </p>
          </div>
        </div>

        <Button variant="primary">
          <Download className="w-5 h-5" />
          Télécharger PDF
        </Button>
      </div>

      {/* Infos étudiant */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          {bulletin.etudiant.photo_url && (
            <img
              src={bulletin.etudiant.photo_url}
              alt=""
              className="w-24 h-24 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Matricule</div>
              <div className="font-medium mt-1">{bulletin.etudiant.matricule}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Filière</div>
              <div className="font-medium mt-1">{bulletin.etudiant.filiere}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Niveau</div>
              <div className="font-medium mt-1">Niveau {bulletin.etudiant.niveau}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Résultats globaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Moyenne générale</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {bulletin.moyenne_generale.toFixed(2)}/20
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Crédits obtenus</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {bulletin.credits_obtenus}/{bulletin.total_credits}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Matières acquises</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {bulletin.nb_matieres_acquises}/{bulletin.nb_matieres}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Mention</div>
          <div className="mt-1">
            {bulletin.mention ? (
              <Badge variant={getMentionColor(bulletin.mention)}>{bulletin.mention}</Badge>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </Card>
      </div>

      {/* Notes par matière */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Matière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Évaluations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Moyenne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Coef
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Crédits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bulletin.matieres.map((matiere, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{matiere.matiere_nom}</div>
                    <div className="text-sm text-gray-500">{matiere.matiere_code}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      {matiere.notes.map((note, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-gray-600">{note.type}:</span>
                          <span className="font-medium">
                            {note.note}/{note.bareme} ({note.note_sur_20.toFixed(2)}/20)
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {matiere.moyenne !== null ? (
                      <span className="font-medium text-blue-600">
                        {matiere.moyenne.toFixed(2)}/20
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{matiere.coefficient}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{matiere.credits_ects}</td>
                  <td className="px-6 py-4">
                    <Badge variant={matiere.acquis ? 'success' : 'danger'}>
                      {matiere.acquis ? 'Acquise' : 'Non acquise'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Décision jury */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Décision du jury</h3>
        <div className="flex items-center gap-4">
          <Badge
            variant={
              bulletin.decision === 'ADMIS'
                ? 'success'
                : bulletin.decision === 'AJOURNE'
                ? 'danger'
                : 'warning'
            }
            className="text-lg px-4 py-2"
          >
            {bulletin.decision}
          </Badge>
          {bulletin.mention && (
            <Badge variant={getMentionColor(bulletin.mention)} className="text-lg px-4 py-2">
              Mention: {bulletin.mention}
            </Badge>
          )}
        </div>
      </Card>
    </div>
  );
}