/**
 * Liste des Évaluations - Style Module Académique
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  ClipboardList,
  Eye,
  Pencil,
  Trash2,
  TrendingUp,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useEvaluations, useDeleteEvaluation } from '@/hooks/useEvaluations';
import type { Evaluation, EvaluationFilters } from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

export default function EvaluationsListPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<EvaluationFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Evaluation | null }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useEvaluations(filters);
  const deleteMutation = useDeleteEvaluation();

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleDelete = async () => {
    if (deleteConfirm.item) {
      await deleteMutation.mutateAsync(deleteConfirm.item.id);
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      DEVOIR: 'bg-blue-100 text-blue-700',
      EXAMEN: 'bg-red-100 text-red-700',
      TP: 'bg-green-100 text-green-700',
      TD: 'bg-purple-100 text-purple-700',
      PROJET: 'bg-orange-100 text-orange-700',
      RATTRAPAGE: 'bg-yellow-100 text-yellow-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const calculateProgress = (saisies: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((saisies / total) * 100);
  };

  // Stats calculées
  const stats = {
    total: data?.count || 0,
    en_attente: data?.results?.filter((e: Evaluation) => !e.nb_notes_saisies || e.nb_notes_saisies < (e.nb_etudiants_total || 0)).length || 0,
    terminees: data?.results?.filter((e: Evaluation) => e.nb_notes_saisies === e.nb_etudiants_total && e.nb_etudiants_total > 0).length || 0,
    moyenne_globale: 0,
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              Gestion des Évaluations
            </h1>
            <p className="text-gray-600 mt-1">
              {stats.total} évaluation(s) • {stats.en_attente} en attente de notes
            </p>
          </div>

          <Button onClick={() => navigate('/admin/evaluations/new')} variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Évaluation
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente notes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.en_attente}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{stats.terminees}</p>
              </div>
              <BookOpen className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Moyenne</p>
                <p className="text-2xl font-bold text-purple-600">{stats.moyenne_globale}/20</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Rechercher une évaluation (titre, matière)..."
              className="w-full pl-10"
            />
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>
      </div>

      {/* Chargement */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {/* Liste des évaluations en cartes */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.results && data.results.length > 0 ? (
            data.results.map((evaluation: Evaluation) => {
              const progress = calculateProgress(
                evaluation.nb_notes_saisies || 0,
                evaluation.nb_etudiants_total || 0
              );

              return (
                <div
                  key={evaluation.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {evaluation.titre}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getTypeColor(
                            evaluation.type_evaluation_details?.code || 'AUTRE'
                          )}`}
                        >
                          {evaluation.type_evaluation_details?.nom || 'Autre'}
                        </span>
                      </div>
                    </div>

                    {/* Matière */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {evaluation.matiere_details?.code} - {evaluation.matiere_details?.nom}
                        </span>
                      </div>
                      {evaluation.matiere_details?.filiere && (
                        <div className="text-xs text-gray-500 pl-6">
                          {evaluation.matiere_details.filiere.nom}
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 text-xs">Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(evaluation.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Barème</p>
                        <p className="font-medium text-gray-900">/{evaluation.note_totale}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Coef.</p>
                        <p className="font-medium text-gray-900">{evaluation.coefficient}</p>
                      </div>
                    </div>

                    {/* Progression notes */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Notes saisies</span>
                        <span>
                          {evaluation.nb_notes_saisies || 0}/{evaluation.nb_etudiants_total || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t pt-4">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/admin/evaluations/${evaluation.id}/saisie-notes`)}
                        className="flex-1"
                      >
                        Saisir notes
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/admin/evaluations/${evaluation.id}/stats`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/admin/evaluations/${evaluation.id}/edit`)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => setDeleteConfirm({ isOpen: true, item: evaluation })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune évaluation trouvée</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && data && data.count > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <Pagination
            currentPage={filters.page || 1}
            totalPages={Math.ceil(data.count / (filters.page_size || DEFAULT_PAGE_SIZE))}
            onPageChange={(page) => setFilters({ ...filters, page })}
            pageSize={filters.page_size || DEFAULT_PAGE_SIZE}
            onPageSizeChange={(size) => setFilters({ ...filters, page_size: size, page: 1 })}
            totalItems={data.count}
          />
        </div>
      )}

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer l'évaluation"
        message={`Êtes-vous sûr de vouloir supprimer l'évaluation "${deleteConfirm.item?.titre}" ? Toutes les notes associées seront également supprimées. Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
