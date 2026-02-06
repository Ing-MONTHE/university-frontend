/**
 * DeliberationSession - Interface de gestion des sessions de délibération
 * MODULE CRITIQUE pour la validation des résultats
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  Award,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Lock,
  FileText,
} from 'lucide-react';
import {
  useSession,
  useSessionDecisions,
  useGenererDecisions,
  useCloturerSession,
  useValiderSession,
  useUpdateDecision,
} from '@/hooks/useEvaluations';
import type { DecisionJuryItem, DecisionType, MentionType } from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import ConfirmModal from '@/components/layout/ConfirmModal';
import Badge from '@/components/ui/Badge';

export default function DeliberationSessionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading: sessionLoading } = useSession(Number(id));
  const { data: decisionsData, isLoading: decisionsLoading, refetch: refetchDecisions } =
    useSessionDecisions(Number(id));

  const genererDecisionsMutation = useGenererDecisions();
  const cloturerMutation = useCloturerSession();
  const validerMutation = useValiderSession();
  const updateDecisionMutation = useUpdateDecision();

  const [editingDecision, setEditingDecision] = useState<number | null>(null);
  const [confirmGenerate, setConfirmGenerate] = useState(false);
  const [confirmCloturer, setConfirmCloturer] = useState(false);
  const [confirmValider, setConfirmValider] = useState(false);

  // État local pour les modifications
  const [localDecisions, setLocalDecisions] = useState<Record<number, Partial<DecisionJuryItem>>>({});

  // Extraire les décisions de la réponse
  const decisions = decisionsData?.decisions || [];

  const handleGenererDecisions = async () => {
    try {
      await genererDecisionsMutation.mutateAsync(Number(id));
      refetchDecisions();
      setConfirmGenerate(false);
    } catch (error) {
      console.error('Erreur génération décisions:', error);
    }
  };

  const handleCloturerSession = async () => {
    try {
      await cloturerMutation.mutateAsync(Number(id));
      setConfirmCloturer(false);
    } catch (error) {
      console.error('Erreur clôture session:', error);
    }
  };

  const handleValiderSession = async () => {
    try {
      await validerMutation.mutateAsync(Number(id));
      setConfirmValider(false);
    } catch (error) {
      console.error('Erreur validation session:', error);
    }
  };

  const handleUpdateDecision = (
    decisionId: number,
    field: 'decision' | 'observations',
    value: any
  ) => {
    setLocalDecisions((prev) => ({
      ...prev,
      [decisionId]: {
        ...prev[decisionId],
        [field]: value,
      },
    }));
  };

  const saveDecision = async (decisionId: number) => {
    const changes = localDecisions[decisionId];
    if (!changes) return;

    try {
      await updateDecisionMutation.mutateAsync({
        id: decisionId,
        data: changes,
      });
      setEditingDecision(null);
      setLocalDecisions((prev) => {
        const newState = { ...prev };
        delete newState[decisionId];
        return newState;
      });
      refetchDecisions();
    } catch (error) {
      console.error('Erreur sauvegarde décision:', error);
    }
  };

  const getDecisionColor = (decision: DecisionType) => {
    const colors: Record<DecisionType, string> = {
      ADMIS: 'bg-green-100 text-green-800 border-green-300',
      ADMIS_RESERVE: 'bg-blue-100 text-blue-800 border-blue-300',
      AJOURNE: 'bg-orange-100 text-orange-800 border-orange-300',
      REDOUBLEMENT: 'bg-red-100 text-red-800 border-red-300',
      EXCLUSION: 'bg-gray-800 text-white border-gray-900',
    };
    return colors[decision] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getMentionColor = (mention?: MentionType) => {
    if (!mention) return 'text-gray-400';
    const colors: Record<MentionType, string> = {
      EXCELLENT: 'text-purple-600',
      TRES_BIEN: 'text-green-600',
      BIEN: 'text-blue-600',
      ASSEZ_BIEN: 'text-yellow-600',
      PASSABLE: 'text-gray-600',
    };
    return colors[mention] || 'text-gray-600';
  };

  // Stats calculées
  const stats = decisions.length > 0
    ? {
        total: decisions.length,
        admis: decisions.filter((d) => d.decision === 'ADMIS').length,
        admis_reserve: decisions.filter((d) => d.decision === 'ADMIS_RESERVE').length,
        ajourne: decisions.filter((d) => d.decision === 'AJOURNE').length,
        redoublement: decisions.filter((d) => d.decision === 'REDOUBLEMENT').length,
        exclusion: decisions.filter((d) => d.decision === 'EXCLUSION').length,
        moyenne:
          decisions.reduce((sum, d) => sum + d.moyenne_generale, 0) / decisions.length || 0,
      }
    : null;

  const tauxReussite = stats
    ? ((stats.admis + stats.admis_reserve) / stats.total) * 100
    : 0;

  if (sessionLoading || decisionsLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-center text-red-600">Session introuvable</p>
      </div>
    );
  }

  const isSessionClosed = ['TERMINEE', 'VALIDEE'].includes(session.statut);
  const isSessionValidated = session.statut === 'VALIDEE';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => navigate('/admin/evaluations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux évaluations
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">SESSION DE DÉLIBÉRATION</h1>
              <Badge
                variant={
                  session.statut === 'VALIDEE'
                    ? 'success'
                    : session.statut === 'TERMINEE'
                    ? 'info'
                    : session.statut === 'EN_COURS'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {session.statut}
              </Badge>
            </div>
            <div className="text-gray-600 space-y-1">
              <p className="font-medium">
                {session.filiere_details?.nom} - Niveau {session.niveau} - Semestre{' '}
                {session.semestre}
              </p>
              <p className="text-sm">
                {new Date(session.date_deliberation).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                • {session.lieu}
              </p>
              <p className="text-sm">Président du jury : {session.president_jury}</p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="flex gap-2">
            {!isSessionClosed && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setConfirmGenerate(true)}
                  disabled={genererDecisionsMutation.isPending}
                  isLoading={genererDecisionsMutation.isPending}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Générer décisions
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setConfirmCloturer(true)}
                  disabled={cloturerMutation.isPending}
                  isLoading={cloturerMutation.isPending}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Clôturer
                </Button>
              </>
            )}
            {isSessionClosed && !isSessionValidated && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setConfirmValider(true)}
                disabled={validerMutation.isPending}
                isLoading={validerMutation.isPending}
              >
                <Lock className="w-4 h-4 mr-2" />
                Valider
              </Button>
            )}
            <Button variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter PV
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total étudiants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Admis</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.admis + stats.admis_reserve}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Ajournés</p>
              <p className="text-2xl font-bold text-orange-600">{stats.ajourne}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Redoublement</p>
              <p className="text-2xl font-bold text-red-600">{stats.redoublement}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Moyenne promo</p>
              <p className="text-2xl font-bold text-blue-600">{stats.moyenne.toFixed(2)}/20</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Taux réussite</p>
              <p className="text-2xl font-bold text-purple-600">{tauxReussite.toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Avertissement si pas de décisions */}
      {decisions.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Aucune décision générée</p>
            <p className="text-sm text-yellow-700 mt-1">
              Cliquez sur "Générer décisions" pour calculer automatiquement les décisions du jury
              pour tous les étudiants.
            </p>
          </div>
        </div>
      )}

      {/* Tableau des décisions */}
      {decisions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Rang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nom complet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Moyenne
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Crédits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Décision
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Mention
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Observations
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {decisions.map((decision) => {
                  const isEditing = editingDecision === decision.id;
                  const localData = localDecisions[decision.id] || {};
                  const currentDecision = (localData.decision || decision.decision) as DecisionType;

                  return (
                    <tr
                      key={decision.id}
                      className="hover:bg-gray-50 transition-colors"
                      onDoubleClick={() => !isSessionValidated && setEditingDecision(decision.id)}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-semibold text-gray-700">
                          {decision.rang_classe || '--'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm">
                        {decision.etudiant_details?.matricule}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">
                          {decision.etudiant_details?.nom} {decision.etudiant_details?.prenom}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-lg">{decision.moyenne_generale.toFixed(2)}/20</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          {decision.total_credits_obtenus}/{decision.total_credits_requis}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing && !isSessionValidated ? (
                          <Select
                            value={currentDecision}
                            onChange={(e) =>
                              handleUpdateDecision(decision.id, 'decision', e.target.value)
                            }
                            className="w-40"
                          >
                            <option value="ADMIS">Admis</option>
                            <option value="ADMIS_RESERVE">Admis avec réserve</option>
                            <option value="AJOURNE">Ajourné</option>
                            <option value="REDOUBLEMENT">Redoublement</option>
                            <option value="EXCLUSION">Exclusion</option>
                          </Select>
                        ) : (
                          <Badge
                            variant={
                              decision.decision === 'ADMIS' || decision.decision === 'ADMIS_RESERVE'
                                ? 'success'
                                : decision.decision === 'AJOURNE'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {decision.decision}
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${getMentionColor(decision.mention)}`}>
                          {decision.mention || '--'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing && !isSessionValidated ? (
                          <div className="flex items-center gap-2">
                            <textarea
                              value={localData.observations || decision.observations || ''}
                              onChange={(e) =>
                                handleUpdateDecision(decision.id, 'observations', e.target.value)
                              }
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs"
                              placeholder="Observations..."
                            />
                            <div className="flex flex-col gap-1">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => saveDecision(decision.id)}
                                disabled={updateDecisionMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => {
                                  setEditingDecision(null);
                                  setLocalDecisions((prev) => {
                                    const newState = { ...prev };
                                    delete newState[decision.id];
                                    return newState;
                                  });
                                }}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600">
                            {decision.observations || '--'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modales de confirmation */}
      <ConfirmModal
        isOpen={confirmGenerate}
        onClose={() => setConfirmGenerate(false)}
        onConfirm={handleGenererDecisions}
        title="Générer les décisions automatiquement"
        message="Cette action va calculer automatiquement les décisions pour tous les étudiants de cette session en fonction de leurs moyennes et crédits. Les décisions existantes seront mises à jour. Voulez-vous continuer ?"
        confirmText="Générer"
        cancelText="Annuler"
      />

      <ConfirmModal
        isOpen={confirmCloturer}
        onClose={() => setConfirmCloturer(false)}
        onConfirm={handleCloturerSession}
        title="Clôturer la session"
        message="Une fois clôturée, les décisions ne pourront plus être modifiées avant validation. Voulez-vous continuer ?"
        confirmText="Clôturer"
        cancelText="Annuler"
      />

      <ConfirmModal
        isOpen={confirmValider}
        onClose={() => setConfirmValider(false)}
        onConfirm={handleValiderSession}
        title="Valider la session"
        message="La validation de la session est définitive et irréversible. Les décisions seront figées et le procès-verbal sera généré. Voulez-vous continuer ?"
        confirmText="Valider définitivement"
        cancelText="Annuler"
      />
    </div>
  );
}
