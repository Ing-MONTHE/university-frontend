/**
 * Page: Session de Délibération
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  useSession,
  useSessionDecisions,
  useSessionStats,
  useGenererDecisions,
  useValiderSession,
} from '../../../hooks/useEvaluations';
import { Card, Button, Spinner, Badge } from '../../../components/ui';

export default function DeliberationSession() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const id = Number(sessionId);

  const { data: session, isLoading: loadingSession } = useSession(id);
  const { data: decisions = [], isLoading: loadingDecisions } = useSessionDecisions(id);
  const { data: stats, isLoading: loadingStats } = useSessionStats(id);

  const genererMutation = useGenererDecisions();
  const validerMutation = useValiderSession();

  // TODO: activer une édition fine des décisions si nécessaire
  // const [editingDecision, setEditingDecision] = useState<number | null>(null);

  const handleGenererDecisions = async () => {
    await genererMutation.mutateAsync(id);
  };

  const handleValider = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir valider cette session ? Cette action est irréversible.')) {
      await validerMutation.mutateAsync(id);
    }
  };

  // const handleUpdateDecision = async (decisionId: number, newDecision: DecisionType, observations: string) => {
  //   await updateDecisionMutation.mutateAsync({
  //     id: decisionId,
  //     data: { decision: newDecision, observations, session: id },
  //   });
  //   setEditingDecision(null);
  // };

  if (loadingSession || loadingDecisions || loadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const isValidee = session?.statut === 'VALIDEE';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="primary" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Session de délibération</h1>
            <p className="text-gray-600 mt-1">
              {session?.filiere_details?.nom} - Niveau {session?.niveau} - Semestre {session?.semestre}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isValidee && decisions.length === 0 && (
            <Button
              variant="primary"
              onClick={handleGenererDecisions}
              disabled={genererMutation.isPending}
            >
              {genererMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  Génération...
                </>
              ) : (
                'Générer les décisions'
              )}
            </Button>
          )}

          {!isValidee && decisions.length > 0 && (
            <Button
              variant="success"
              onClick={handleValider}
              disabled={validerMutation.isPending}
            >
              {validerMutation.isPending ? (
                <>
                  <Spinner size="sm" />
                  Validation...
                </>
              ) : (
                  <>
                  <CheckCircle2 className="w-5 h-5" />
                  Valider la session
                </>
              )}
            </Button>
          )}

          {isValidee && <Badge variant="success">Session validée</Badge>}
        </div>
      </div>

      {/* Infos session */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Date délibération</div>
            <div className="font-medium mt-1">
              {session?.date_deliberation &&
                format(new Date(session.date_deliberation), 'dd MMMM yyyy HH:mm', { locale: fr })}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Lieu</div>
            <div className="font-medium mt-1">{session?.lieu}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Président jury</div>
            <div className="font-medium mt-1">{session?.president_jury}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Statut</div>
            <div className="mt-1">
              <Badge variant={isValidee ? 'success' : 'warning'}>{session?.statut}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-600">Total étudiants</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {stats.statistiques.total_etudiants}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Admis</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {stats.statistiques.admis}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Ajournés</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {stats.statistiques.ajourne}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Taux réussite</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {stats.statistiques.taux_reussite.toFixed(1)}%
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600">Moyenne promo</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {stats.moyenne_promotion.toFixed(2)}/20
            </div>
          </Card>
        </div>
      )}

      {/* Liste des décisions */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Étudiant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Moyenne
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Crédits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mention
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Décision
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rang
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {decisions.map((decision) => (
                <tr key={decision.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {decision.etudiant_details?.matricule}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {decision.etudiant_details?.nom} {decision.etudiant_details?.prenom}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-blue-600">
                      {decision.moyenne_generale.toFixed(2)}/20
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {decision.total_credits_obtenus}/{decision.total_credits_requis}
                  </td>
                  <td className="px-6 py-4">
                    {decision.mention && <Badge variant="info">{decision.mention}</Badge>}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        decision.decision === 'ADMIS'
                          ? 'success'
                          : decision.decision === 'AJOURNE'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {decision.decision}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {decision.rang_classe ? `#${decision.rang_classe}` : '-'}
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