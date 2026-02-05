/**
 * Bulletin de notes d'un étudiant
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Award, TrendingUp } from 'lucide-react';
import { useBulletinEtudiant } from '@/hooks/useEvaluations';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function StudentGradesPage() {
  const { id: etudiantId } = useParams();
  const navigate = useNavigate();

  const { data: bulletin, isLoading } = useBulletinEtudiant(Number(etudiantId));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!bulletin) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-center text-red-600">Bulletin non disponible</p>
      </div>
    );
  }

  const getDecisionColor = (decision: string) => {
    const colors: Record<string, string> = {
      ADMIS: 'bg-green-100 text-green-800',
      AJOURNE: 'bg-red-100 text-red-800',
      RATTRAPAGE: 'bg-yellow-100 text-yellow-800',
    };
    return colors[decision] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => navigate('/admin/students')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {bulletin.etudiant.photo_url && (
              <img
                src={bulletin.etudiant.photo_url}
                alt=""
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bulletin de Notes
              </h1>
              <div className="mt-2 space-y-1 text-gray-600">
                <p>
                  <span className="font-medium">Étudiant :</span>{' '}
                  {bulletin.etudiant.nom_complet}
                </p>
                <p>
                  <span className="font-medium">Matricule :</span>{' '}
                  {bulletin.etudiant.matricule}
                </p>
                <p>
                  <span className="font-medium">Filière :</span>{' '}
                  {bulletin.etudiant.filiere} - Niveau {bulletin.etudiant.niveau}
                </p>
                <p>
                  <span className="font-medium">Année académique :</span>{' '}
                  {bulletin.annee_academique.libelle}
                </p>
              </div>
            </div>
          </div>

          <Button variant="primary">
            <Download className="w-4 h-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      {/* Matières */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Matière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Évaluations
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Moyenne
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Coef.
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Crédits
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bulletin.matieres.map((matiere, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {matiere.matiere_code}
                      </p>
                      <p className="text-sm text-gray-600">{matiere.matiere_nom}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {matiere.notes.map((note, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-gray-600">{note.evaluation} :</span>{' '}
                          <span className="font-medium">
                            {note.note}/{note.bareme}
                          </span>
                          <span className="text-gray-500">
                            {' '}
                            ({note.note_sur_20}/20)
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {matiere.moyenne !== null ? (
                      <span
                        className={`text-lg font-bold ${
                          matiere.moyenne >= 10 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {matiere.moyenne.toFixed(2)}/20
                      </span>
                    ) : (
                      <span className="text-gray-400">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium">{matiere.coefficient}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium">{matiere.credits_ects}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {matiere.acquis ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        Acquis
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                        Non acquis
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Moyenne Générale</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">
            {bulletin.moyenne_generale.toFixed(2)}/20
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Crédits</h3>
          </div>
          <p className="text-4xl font-bold text-green-600">
            {bulletin.credits_obtenus}/{bulletin.total_credits}
          </p>
          <p className="text-sm text-gray-600 mt-1">ECTS obtenus</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="font-semibold text-gray-900">Décision</h3>
          </div>
          <p className="mb-2">
            <span
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-bold ${getDecisionColor(
                bulletin.decision
              )}`}
            >
              {bulletin.decision}
            </span>
          </p>
          {bulletin.mention && (
            <p className="text-sm text-gray-600">
              Mention : <span className="font-medium">{bulletin.mention}</span>
            </p>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Total matières</p>
            <p className="text-2xl font-bold text-gray-900">
              {bulletin.nb_matieres}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Matières acquises</p>
            <p className="text-2xl font-bold text-green-600">
              {bulletin.nb_matieres_acquises}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Taux de réussite</p>
            <p className="text-2xl font-bold text-blue-600">
              {bulletin.nb_matieres > 0
                ? ((bulletin.nb_matieres_acquises / bulletin.nb_matieres) * 100).toFixed(
                    0
                  )
                : 0}
              %
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Taux crédits</p>
            <p className="text-2xl font-bold text-purple-600">
              {bulletin.total_credits > 0
                ? ((bulletin.credits_obtenus / bulletin.total_credits) * 100).toFixed(0)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
