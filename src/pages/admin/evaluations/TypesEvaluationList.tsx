/**
 * Page Liste des Types d'Évaluation
 */

import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, FileCheck } from 'lucide-react';
import {
  useTypesEvaluation,
  useDeleteTypeEvaluation,
} from '@/hooks/useEvaluations';
import type { TypeEvaluation, TypeEvaluationFilters } from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Modal from '@/components/ui/Modal';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';
import TypeEvaluationForm from './TypeEvaluationForm';

export default function TypesEvaluationList() {
  const [filters, setFilters] = useState<TypeEvaluationFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    item: TypeEvaluation | null;
  }>({
    isOpen: false,
    item: null,
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: TypeEvaluation | null;
  }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useTypesEvaluation(filters);
  const deleteMutation = useDeleteTypeEvaluation();

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleDelete = async () => {
    if (deleteConfirm.item) {
      await deleteMutation.mutateAsync(deleteConfirm.item.id);
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-purple-600" />
              </div>
              Types d'Évaluation
            </h1>
            <p className="text-gray-600 mt-1">
              {data?.count || 0} type(s) d'évaluation
            </p>
          </div>

          <Button onClick={() => setEditModal({ isOpen: true, item: null })}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Type
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Rechercher un type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button onClick={handleSearch}>Rechercher</Button>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : !data?.results.length ? (
          <div className="text-center py-12">
            <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun type d'évaluation trouvé</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coefficient Min
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coefficient Max
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.results.map((type) => (
                    <tr key={type.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {type.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{type.nom}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {type.coefficient_min}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {type.coefficient_max}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {type.description || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditModal({ isOpen: true, item: type })}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              setDeleteConfirm({ isOpen: true, item: type })
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

      {/* Modal de modification */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null })}
        title={editModal.item ? 'Modifier le type' : 'Nouveau type'}
      >
        <TypeEvaluationForm
          typeEvaluation={editModal.item || undefined}
          onSuccess={() => setEditModal({ isOpen: false, item: null })}
        />
      </Modal>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer ce type d'évaluation ?"
        message={`Êtes-vous sûr de vouloir supprimer le type "${deleteConfirm.item?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}