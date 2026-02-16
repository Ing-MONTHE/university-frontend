/**
 * Page Liste des Types d'Évaluation - Style Card View
 * Amélioration inspirée du module Academic (Facultés)
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Search, 
  FileCheck, 
  Pencil, 
  Trash2,
  TrendingUp,
  Hash,
  Info
} from 'lucide-react';
import {
  useTypesEvaluation,
  useCreateTypeEvaluation,
  useUpdateTypeEvaluation,
  useDeleteTypeEvaluation,
} from '@/hooks/useEvaluations';
import type { 
  TypeEvaluation, 
  TypeEvaluationCreate, 
  TypeEvaluationFilters 
} from '@/types/evaluation.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

// Schéma de validation Zod
const typeEvaluationSchema = z.object({
  code: z.string()
    .min(2, 'Le code doit contenir au moins 2 caractères')
    .max(10, 'Le code ne peut pas dépasser 10 caractères')
    .regex(/^[A-Z0-9_-]+$/, 'Le code doit contenir uniquement des majuscules, chiffres, tirets et underscores'),
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  coefficient_min: z.coerce
    .number()
    .min(0, 'Le coefficient minimum doit être positif')
    .max(10, 'Le coefficient minimum ne peut pas dépasser 10'),
  coefficient_max: z.coerce
    .number()
    .min(0, 'Le coefficient maximum doit être positif')
    .max(10, 'Le coefficient maximum ne peut pas dépasser 10'),
}).refine((data) => data.coefficient_max >= data.coefficient_min, {
  message: 'Le coefficient maximum doit être supérieur ou égal au minimum',
  path: ['coefficient_max'],
});

type FormData = z.infer<typeof typeEvaluationSchema>;

export default function TypesEvaluationList() {
  // États locaux
  const [filters, setFilters] = useState<TypeEvaluationFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TypeEvaluation | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    item: TypeEvaluation | null;
  }>({
    isOpen: false,
    item: null,
  });

  // React Query
  const { data, isLoading } = useTypesEvaluation(filters);
  const createMutation = useCreateTypeEvaluation();
  const updateMutation = useUpdateTypeEvaluation();
  const deleteMutation = useDeleteTypeEvaluation();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(typeEvaluationSchema),
  });

  // Handlers
  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleOpenModal = (item?: TypeEvaluation) => {
    if (item) {
      setEditingItem(item);
      setValue('code', item.code);
      setValue('nom', item.nom);
      setValue('description', item.description || '');
      setValue('coefficient_min', item.coefficient_min);
      setValue('coefficient_max', item.coefficient_max);
    } else {
      setEditingItem(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data });
      } else {
        await createMutation.mutateAsync(data as TypeEvaluationCreate);
      }
      handleCloseModal();
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm.item) {
      try {
        await deleteMutation.mutateAsync(deleteConfirm.item.id);
        setDeleteConfirm({ isOpen: false, item: null });
      } catch (error) {
        // L'erreur est gérée par le hook
      }
    }
  };

  // Render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" message="Chargement des types d'évaluation..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Types d'Évaluation</h1>
          <p className="text-gray-600 mt-1">
            Gérer les types d'évaluation (CC, TP, Examen, etc.)
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Type
        </Button>
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Rechercher un type d'évaluation..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total types</p>
              <p className="text-2xl font-bold text-gray-900">{data?.count || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Coef. moyen min</p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.results?.length 
                  ? (data.results.reduce((acc, t) => acc + t.coefficient_min, 0) / data.results.length).toFixed(1)
                  : '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Coef. moyen max</p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.results?.length 
                  ? (data.results.reduce((acc, t) => acc + t.coefficient_max, 0) / data.results.length).toFixed(1)
                  : '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des types en cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results && data.results.length > 0 ? (
          data.results.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border-l-4 border-purple-500"
            >
              <div className="p-6">
                {/* En-tête de la carte */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{type.nom}</h3>
                      <p className="text-sm text-gray-500 font-mono font-semibold">{type.code}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {type.description && (
                  <div className="mb-4 flex items-start gap-2">
                    <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">{type.description}</p>
                  </div>
                )}

                {/* Coefficients */}
                <div className="space-y-2 mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Coefficient Min
                    </span>
                    <span className="font-semibold text-blue-600 text-lg">
                      {type.coefficient_min}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Coefficient Max
                    </span>
                    <span className="font-semibold text-green-600 text-lg">
                      {type.coefficient_max}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Plage</span>
                      <span className="font-semibold text-purple-600">
                        {type.coefficient_min} - {type.coefficient_max}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statistiques (si disponibles) */}
                {type.evaluations_count !== undefined && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Évaluations créées</span>
                      <span className="text-lg font-bold text-blue-600">
                        {type.evaluations_count}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenModal(type)}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteConfirm({ isOpen: true, item: type })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun type d'évaluation trouvé</p>
            <Button 
              onClick={() => handleOpenModal()} 
              variant="primary" 
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer le premier type
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.count > 0 && (
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

      {/* Modal de création/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Modifier le type d\'évaluation' : 'Nouveau type d\'évaluation'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Code"
              placeholder="Ex: CC, TP, EX"
              error={errors.code?.message}
              {...register('code')}
              className="uppercase"
            />

            <Input
              label="Nom"
              placeholder="Ex: Contrôle Continu"
              error={errors.nom?.message}
              {...register('nom')}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Description du type d'évaluation..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Coefficient Minimum"
              type="number"
              step="0.5"
              min="0"
              max="10"
              placeholder="Ex: 1"
              error={errors.coefficient_min?.message}
              {...register('coefficient_min')}
            />

            <Input
              label="Coefficient Maximum"
              type="number"
              step="0.5"
              min="0"
              max="10"
              placeholder="Ex: 3"
              error={errors.coefficient_max?.message}
              {...register('coefficient_max')}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note :</strong> Les coefficients définissent la plage autorisée pour ce type d'évaluation.
              Par exemple, un CC peut avoir un coefficient entre 1 et 2.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingItem ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer le type d'évaluation"
        message={`Êtes-vous sûr de vouloir supprimer le type "${deleteConfirm.item?.nom}" ? Cette action est irréversible et affectera toutes les évaluations utilisant ce type.`}
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}