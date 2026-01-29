/**
 * Page Liste des Départements
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Building, Pencil, Trash2, Users } from 'lucide-react';
import {
  useDepartements,
  useCreateDepartement,
  useUpdateDepartement,
  useDeleteDepartement,
} from '@/hooks/useDepartements';
import { useFacultes } from '@/hooks/useFacultes';
import type { Departement, DepartementCreate, DepartementFilters } from '@/types/academic.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

const departementSchema = z.object({
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères').max(20),
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  faculte_id: z.number({ message: 'La faculté est requise' }),
  chef_departement: z.string().optional(),
});

type FormData = z.infer<typeof departementSchema>;

export default function DepartementsPage() {
  const [filters, setFilters] = useState<DepartementFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Departement | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Departement | null }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useDepartements(filters);
  const { data: facultesData } = useFacultes({ page_size: 100 });
  const createMutation = useCreateDepartement();
  const updateMutation = useUpdateDepartement();
  const deleteMutation = useDeleteDepartement();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(departementSchema),
  });

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleOpenModal = (item?: Departement) => {
    if (item) {
      setEditingItem(item);
      setValue('code', item.code);
      setValue('nom', item.nom);
      setValue('description', item.description || '');
      setValue('faculte_id', item.faculte);
      setValue('chef_departement', item.chef_departement || '');
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
        await createMutation.mutateAsync(data as DepartementCreate);
      }
      handleCloseModal();
    } catch (error) {
      // Géré par le hook
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm.item) {
      try {
        await deleteMutation.mutateAsync(deleteConfirm.item.id);
        setDeleteConfirm({ isOpen: false, item: null });
      } catch (error) {
        // Géré par le hook
      }
    }
  };

  const handleFilterFaculte = (faculteId: number | undefined) => {
    setFilters({ ...filters, faculte: faculteId, page: 1 });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" message="Chargement des départements..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Départements</h1>
          <p className="text-gray-600 mt-1">Gérer les départements de l'université</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Département
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Rechercher un département..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>

        {/* Filtre par faculté */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={!filters.faculte ? 'primary' : 'secondary'}
            onClick={() => handleFilterFaculte(undefined)}
          >
            Toutes les facultés
          </Button>
          {facultesData?.results.map((faculte) => (
            <Button
              key={faculte.id}
              size="sm"
              variant={filters.faculte === faculte.id ? 'primary' : 'secondary'}
              onClick={() => handleFilterFaculte(faculte.id)}
            >
              {faculte.code}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results && data.results.length > 0 ? (
          data.results.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{dept.nom}</h3>
                      <p className="text-sm text-gray-500">{dept.code}</p>
                    </div>
                  </div>
                </div>

                {dept.faculte_details && (
                  <div className="mb-3 text-sm">
                    <span className="text-gray-600">Faculté: </span>
                    <span className="font-medium text-gray-900">{dept.faculte_details.code}</span>
                  </div>
                )}

                {dept.chef_departement && (
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Chef:</span> {dept.chef_departement}
                  </div>
                )}

                <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                  <Users className="w-4 h-4" />
                  <span>{dept.filieres_count || 0} filières</span>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenModal(dept)}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteConfirm({ isOpen: true, item: dept })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucun département trouvé
          </div>
        )}
      </div>

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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Modifier le département' : 'Nouveau département'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Code" placeholder="Ex: INFO" error={errors.code?.message} {...register('code')} />
            <Input label="Nom" placeholder="Ex: Informatique" error={errors.nom?.message} {...register('nom')} />
          </div>

          <Controller
            name="faculte_id"
            control={control}
            render={({ field }) => (
                <Select
                label="Faculté"
                options={[
                    { value: '', label: 'Sélectionner une faculté' },
                    ...(facultesData?.results.map((faculte) => ({
                    value: faculte.id,
                    label: faculte.nom,
                    })) || [])
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.faculte_id?.message}
                />
            )}
            />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Description du département..."
              {...register('description')}
            />
          </div>

          <Input
            label="Chef de département"
            placeholder="Nom du chef"
            error={errors.chef_departement?.message}
            {...register('chef_departement')}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="primary" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
              {editingItem ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer le département"
        message={`Êtes-vous sûr de vouloir supprimer le département "${deleteConfirm.item?.nom}" ?`}
        confirmText="Supprimer"
      />
    </div>
  );
}