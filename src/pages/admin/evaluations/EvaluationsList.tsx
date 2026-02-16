/**
 * Page Liste des Évaluations - Enhanced Table View
 * Améliorations inspirées des modules Academic, Student et Teacher
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  FileText,
  Pencil,
  Trash2,
  Eye,
  ClipboardList,
  Filter,
  Download,
  Upload,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  useEvaluations,
  useDeleteEvaluation,
  useTypesEvaluation,
} from '@/hooks/useEvaluations';
import { useMatieres } from '@/hooks/useMatieres';
import { useFilieres } from '@/hooks/useFilieres';
import type {
  Evaluation,
  EvaluationFilters,
  StatutEvaluation,
} from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Badge from '@/components/ui/Badge';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import { STATUT_EVALUATION_CHOICES } from '@/types/evaluation.types';

export default function EvaluationsList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<EvaluationFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    item: Evaluation | null;
  }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useEvaluations(filters);
  const deleteMutation = useDeleteEvaluation();
  const { data: matieres } = useMatieres({ page_size: 1000 });
  const { data: typesEval } = useTypesEvaluation({ page_size: 100 });
  const { data: filieres } = useFilieres({ page_size: 100 });

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleDelete = async () => {
    if (deleteConfirm.item) {
      await deleteMutation.mutateAsync(deleteConfirm.item.id);
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  const getStatutBadge = (statut: StatutEvaluation) => {
    const config = STATUT_EVALUATION_CHOICES.find((s) => s.value === statut);
    return (
      <Badge variant={config?.color as any}>
        {config?.label || statut}
      </Badge>
    );
  };

  const getStatutIcon = (statut: StatutEvaluation) => {
    const icons = {
      PLANIFIEE: <Clock className="w-4 h-4 text-blue-500" />,
      EN_COURS: <AlertCircle className="w-4 h-4 text-yellow-500" />,
      TERMINEE: <CheckCircle className="w-4 h-4 text-green-500" />,
      ANNULEE: <XCircle className="w-4 h-4 text-red-500" />,
    };
    return icons[statut] || null;
  };

  const getProgressionBadge = (evaluation: Evaluation) => {
    if (!evaluation.total_etudiants) return null;

    const progression = evaluation.progression || 0;
    const variant =
      progression === 100 ? 'success' : progression > 0 ? 'warning' : 'gray';

    return (
      <Badge variant={variant}>
        {evaluation.notes_saisies || 0}/{evaluation.total_etudiants}
      </Badge>
    );
  };

  // Calcul des statistiques
  const stats = data?.results
    ? {
        total: data.count,
        planifiees: data.results.filter((e) => e.statut === 'PLANIFIEE').length,
        enCours: data.results.filter((e) => e.statut === 'EN_COURS').length,
        terminees: data.results.filter((e) => e.statut === 'TERMINEE').length,
        progression: data.results.length > 0
          ? Math.round(
              data.results.reduce((acc, e) => acc + (e.progression || 0), 0) /
                data.results.length
            )
          : 0,
      }
    : { total: 0, planifiees: 0, enCours: 0, terminees: 0, progression: 0 };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Planifiées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.planifiees}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.enCours}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.terminees}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              Gestion des Évaluations
            </h1>
            <p className="text-gray-600 mt-1">
              {data?.count || 0} évaluation(s) • Progression moyenne: {stats.progression}%
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {/* TODO: Import */}}
              variant="secondary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
            <Button
              onClick={() => {/* TODO: Export */}}
              variant="secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button
              onClick={() => navigate('/admin/evaluations/statistiques')}
              variant="secondary"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistiques
            </Button>
            <Button onClick={() => navigate('/admin/evaluations/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Évaluation
            </Button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher une évaluation (titre, matière, type)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres {showFilters ? '▲' : '▼'}
          </Button>
          <Button onClick={handleSearch}>Rechercher</Button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <Select
              label="Matière"
              value={filters.matiere?.toString() || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  matiere: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
            >
              <option value="">Toutes les matières</option>
              {matieres?.results.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} - {m.nom}
                </option>
              ))}
            </Select>

            <Select
              label="Type"
              value={filters.type_evaluation?.toString() || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type_evaluation: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                  page: 1,
                })
              }
            >
              <option value="">Tous les types</option>
              {typesEval?.results.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nom}
                </option>
              ))}
            </Select>

            <Select
              label="Statut"
              value={filters.statut || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  statut: e.target.value as StatutEvaluation | undefined,
                  page: 1,
                })
              }
            >
              <option value="">Tous les statuts</option>
              {STATUT_EVALUATION_CHOICES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>

            <Select
              label="Filière"
              value={filters.filiere?.toString() || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  filiere: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                })
              }
            >
              <option value="">Toutes les filières</option>
              {filieres?.results.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code} - {f.nom}
                </option>
              ))}
            </Select>

            {/* Bouton reset filtres */}
            <div className="col-span-4 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFilters({ page: 1, page_size: DEFAULT_PAGE_SIZE });
                  setSearchTerm('');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : !data?.results.length ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucune évaluation trouvée</p>
            <Button onClick={() => navigate('/admin/evaluations/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Créer la première évaluation
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Matière
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Coef
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Progression
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.results.map((evaluation) => (
                    <tr key={evaluation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900">
                              {evaluation.matiere_details?.code}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {evaluation.matiere_details?.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {evaluation.titre}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {evaluation.type_evaluation_details?.nom}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(evaluation.date_evaluation).toLocaleDateString(
                            'fr-FR'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                          {evaluation.coefficient}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatutIcon(evaluation.statut)}
                          {getStatutBadge(evaluation.statut)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {getProgressionBadge(evaluation)}
                          {evaluation.total_etudiants > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  (evaluation.progression || 0) === 100
                                    ? 'bg-green-500'
                                    : (evaluation.progression || 0) > 0
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-300'
                                }`}
                                style={{ width: `${evaluation.progression || 0}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/evaluations/${evaluation.id}`)
                            }
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/admin/evaluations/${evaluation.id}/saisie-notes`
                              )
                            }
                            title="Saisir les notes"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/evaluations/${evaluation.id}/edit`)
                            }
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              setDeleteConfirm({ isOpen: true, item: evaluation })
                            }
                            title="Supprimer"
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

            {/* Pagination */}
            {data && data.count > DEFAULT_PAGE_SIZE && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={Math.ceil(data.count / DEFAULT_PAGE_SIZE)}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                  pageSize={filters.page_size || DEFAULT_PAGE_SIZE}
                  onPageSizeChange={(size) => 
                    setFilters({ ...filters, page_size: size, page: 1 })
                  }
                  totalItems={data.count}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer cette évaluation ?"
        message={`Êtes-vous sûr de vouloir supprimer l'évaluation "${deleteConfirm.item?.titre}" ? Toutes les notes associées seront également supprimées. Cette action est irréversible.`}
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}