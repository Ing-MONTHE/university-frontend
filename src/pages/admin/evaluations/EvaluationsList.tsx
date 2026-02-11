/**
 * Page: Liste des Évaluations
 * Affichage et gestion des évaluations
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  ClipboardList,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEvaluations, useDeleteEvaluation, useTypesEvaluation } from '../../../hooks/useEvaluations';
import { useMatieres } from '../../../hooks/useMatieres';
import { useAnneeAcademiques } from '../../../hooks/useAnneeAcademiques';
import { Card, Button, Spinner, Badge, EmptyState, ConfirmModal } from '../../../components/ui';
import type { Evaluation } from '../../../types/evaluation.types';

export default function EvaluationsList() {
  const navigate = useNavigate();

  // State
  const [filters, setFilters] = useState({
    search: '',
    matiere: undefined as number | undefined,
    type_evaluation: undefined as number | undefined,
    annee_academique: undefined as number | undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Queries
  const { data: evaluationsData, isLoading } = useEvaluations(filters);
  const { data: typesEval = [] } = useTypesEvaluation();
  const { data: matieresData } = useMatieres({});
  const { data: anneesData } = useAnneeAcademiques({});
  const deleteMutation = useDeleteEvaluation();

  const evaluations = evaluationsData?.results || [];
  const matieres = matieresData?.results || [];
  const annees = anneesData?.results || [];

  // Stats
  const stats = useMemo(() => {
    const total = evaluations.length;
    const completes = evaluations.filter((e) => (e.nb_notes_saisies || 0) >= (e.nb_etudiants_total || 0)).length;
    const enCours = evaluations.filter(
      (e) => (e.nb_notes_saisies || 0) > 0 && (e.nb_notes_saisies || 0) < (e.nb_etudiants_total || 0)
    ).length;
    const vides = total - completes - enCours;
    const moyenneGlobale =
      evaluations.reduce((acc, e) => acc + (e.moyenne_classe || 0), 0) / (total || 1);

    return { total, completes, enCours, vides, moyenneGlobale: moyenneGlobale.toFixed(2) };
  }, [evaluations]);

  // Handlers
  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const getStatutBadge = (evaluation: Evaluation) => {
    const saisies = evaluation.nb_notes_saisies || 0;
    const total = evaluation.nb_etudiants_total || 0;

    if (total === 0)
      return <Badge variant="neutral">Aucun étudiant</Badge>;
    if (saisies >= total)
      return <Badge variant="success">Complète</Badge>;
    if (saisies > 0)
      return <Badge variant="warning">En cours ({saisies}/{total})</Badge>;
    return <Badge variant="neutral">Vide</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Évaluations</h1>
          <p className="text-gray-600 mt-1">Gestion des évaluations et saisie des notes</p>
        </div>
        <Button
          onClick={() => navigate('/admin/evaluations/create')}
          variant="primary"
          className="w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Créer une évaluation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Complètes</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.completes}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">En cours</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">{stats.enCours}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Vides</div>
          <div className="text-2xl font-bold text-gray-500 mt-1">{stats.vides}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Moyenne globale</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.moyenneGlobale}/20</div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Rechercher une évaluation..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              variant="primary"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-4"
            >
              <Filter className="w-5 h-5" />
              Filtres {showFilters ? '▲' : '▼'}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>
                <select
                  value={filters.matiere || ''}
                  onChange={(e) =>
                    setFilters({ ...filters, matiere: e.target.value ? +e.target.value : undefined })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes</option>
                  {matieres.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} - {m.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.type_evaluation || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      type_evaluation: e.target.value ? +e.target.value : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous</option>
                  {typesEval.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Année académique</label>
                <select
                  value={filters.annee_academique || ''}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      annee_academique: e.target.value ? +e.target.value : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes</option>
                  {annees.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Liste */}
      <Card className="overflow-hidden">
        {evaluations.length === 0 ? (
          <EmptyState
            // On passe une icône ReactNode JSX, ce qui correspond bien au type attendu
            icon={<ClipboardList className="w-10 h-10 text-gray-400" />}
            title="Aucune évaluation"
            description="Commencez par créer votre première évaluation"
            action={
              <Button onClick={() => navigate('/admin/evaluations/create')}>
                <Plus className="w-5 h-5" />
                Créer une évaluation
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Matière
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Coef / Barème
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Moyenne
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{evaluation.titre}</div>
                      <div className="text-sm text-gray-500">
                        {evaluation.annee_academique_details?.libelle}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span className="font-medium">{evaluation.matiere_details?.code}</span>
                        <br />
                        <span className="text-gray-600">{evaluation.matiere_details?.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="info">{evaluation.type_evaluation_details?.nom}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(evaluation.date), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {evaluation.coefficient} / {evaluation.note_totale}
                    </td>
                    <td className="px-6 py-4">{getStatutBadge(evaluation)}</td>
                    <td className="px-6 py-4">
                      {evaluation.moyenne_classe ? (
                        <span className="font-medium text-blue-600">
                          {evaluation.moyenne_classe.toFixed(2)}/20
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => navigate(`/admin/evaluations/${evaluation.id}/notes`)}
                          title="Saisir notes"
                        >
                          <ClipboardList className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/admin/evaluations/${evaluation.id}/edit`)}
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteId(evaluation.id)}
                          title="Supprimer"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer l'évaluation ?"
        message="Cette action est irréversible. Toutes les notes associées seront également supprimées."
        confirmText={deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
      />
    </div>
  );
}