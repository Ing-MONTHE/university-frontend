/**
 * Page Liste des Évaluations
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

  return (
    <div className="space-y-6">
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
              {data?.count || 0} évaluation(s)
            </p>
          </div>

          <Button onClick={() => navigate('/admin/evaluations/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Évaluation
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Rechercher une évaluation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtres
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
                })
              }
            >
              <option value="">Toutes</option>
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
                })
              }
            >
              <option value="">Tous</option>
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
                })
              }
            >
              <option value="">Tous</option>
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
                })
              }
            >
              <option value="">Toutes</option>
              {filieres?.results.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.code}
                </option>
              ))}
            </Select>
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
            <p className="text-gray-500">Aucune évaluation trouvée</p>
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
                    <tr key={evaluation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {evaluation.matiere_details?.code}
                          </div>
                          <div className="text-gray-500">
                            {evaluation.matiere_details?.nom}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {evaluation.titre}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {evaluation.type_evaluation_details?.nom}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {new Date(evaluation.date_evaluation).toLocaleDateString(
                            'fr-FR'
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {evaluation.coefficient}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatutBadge(evaluation.statut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getProgressionBadge(evaluation)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              navigate(`/admin/evaluations/${evaluation.id}`)
                            }
                            title="Voir"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="secondary"
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
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              setDeleteConfirm({ isOpen: true, item: evaluation })
                            }
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
        message={`Êtes-vous sûr de vouloir supprimer l'évaluation "${deleteConfirm.item?.titre}" ? Toutes les notes seront également supprimées.`}
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}