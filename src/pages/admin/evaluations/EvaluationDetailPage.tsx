/**
 * Page de Détails d'une Évaluation
 */

import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText,
  Edit,
  ClipboardList,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useEvaluation, useEvaluationStats } from '@/hooks/useEvaluations';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function EvaluationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: evaluation, isLoading } = useEvaluation(Number(id));
  const { data: stats } = useEvaluationStats(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" message="Chargement..." />
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Évaluation non trouvée
          </h2>
          <Button onClick={() => navigate('/admin/evaluations')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="secondary" onClick={() => navigate('/admin/evaluations')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{evaluation.titre}</h1>
            <p className="text-gray-600 mt-1">
              {evaluation.matiere_details?.nom}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => navigate(`/admin/evaluations/${evaluation.id}/saisie-notes`)}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Saisir les notes
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/admin/evaluations/${evaluation.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <p className="text-sm text-gray-600">Moyenne</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.moyenne_classe?.toFixed(2) || '-'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Min / Max</p>
              <p className="text-lg font-bold text-gray-900">
                {stats?.note_min?.toFixed(1) || '-'} / {stats?.note_max?.toFixed(1) || '-'}
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
              <Users className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Informations détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informations générales
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium text-gray-900">
                  {evaluation.type_evaluation_details?.nom}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(evaluation.date_evaluation).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Coefficient</p>
                <p className="font-medium text-gray-900">{evaluation.coefficient}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Barème</p>
                <p className="font-medium text-gray-900">/{evaluation.bareme}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Statut et description
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Statut</p>
              <Badge variant={
                evaluation.statut === 'TERMINEE' ? 'success' :
                evaluation.statut === 'EN_COURS' ? 'warning' :
                evaluation.statut === 'PLANIFIEE' ? 'info' : 'gray'
              }>
                {evaluation.statut}
              </Badge>
            </div>

            {evaluation.description && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900">{evaluation.description}</p>
              </div>
            )}

            {evaluation.duree && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Durée</p>
                  <p className="font-medium text-gray-900">{evaluation.duree} minutes</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}