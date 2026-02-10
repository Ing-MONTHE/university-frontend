/**
 * Page Liste des Filières
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, GraduationCap, Pencil, Trash2, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import {
  useFilieres,
  useCreateFiliere,
  useUpdateFiliere,
  useDeleteFiliere,
} from '@/hooks/useFilieres';
import { useDepartements } from '@/hooks/useDepartements';
import type { Filiere, FiliereCreate, FiliereFilters, CycleFiliere } from '@/types/academic.types';
import { CYCLE_CHOICES } from '@/types/academic.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import ConfirmModal from "@/components/ui/ConfirmModal";;
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

const filiereSchema = z.object({
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères').max(20),
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  departement_id: z.number({ message: 'Le département est requis' }),
  cycle: z.enum(['LICENCE', 'MASTER', 'DOCTORAT', 'DUT', 'BTS']),
  duree_annees: z.number().min(1).max(8),
  frais_inscription: z.number().min(0).optional(),
  is_active: z.boolean().optional(),
});

type FormData = z.infer<typeof filiereSchema>;

export default function FilieresPage() {
  const [filters, setFilters] = useState<FiliereFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Filiere | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Filiere | null }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useFilieres(filters);
  const { data: departementsData } = useDepartements({ page_size: 100 });
  const createMutation = useCreateFiliere();
  const updateMutation = useUpdateFiliere();
  const deleteMutation = useDeleteFiliere();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(filiereSchema),
  });

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleOpenModal = (item?: Filiere) => {
    if (item) {
      setEditingItem(item);
      setValue('code', item.code);
      setValue('nom', item.nom);
      setValue('description', item.description || '');
      setValue('departement_id', item.departement);
      setValue('cycle', item.cycle);
      setValue('duree_annees', item.duree_annees);
      setValue('frais_inscription', parseFloat(item.frais_inscription || '0'));
      setValue('is_active', item.is_active);
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
        await createMutation.mutateAsync(data as FiliereCreate);
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

  const handleFilterCycle = (cycle: CycleFiliere | undefined) => {
    setFilters({ ...filters, cycle, page: 1 });
  };

  const handleFilterStatus = (isActive: boolean | undefined) => {
    setFilters({ ...filters, is_active: isActive, page: 1 });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" message="Chargement des filières..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Filières</h1>
          <p className="text-gray-600 mt-1">Gérer les filières et programmes d'études</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Filière
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
              placeholder="Rechercher une filière..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={!filters.cycle ? 'primary' : 'secondary'}
            onClick={() => handleFilterCycle(undefined)}
          >
            Tous les cycles
          </Button>
          {CYCLE_CHOICES.map((choice) => (
            <Button
              key={choice.value}
              size="sm"
              variant={filters.cycle === choice.value ? 'primary' : 'secondary'}
              onClick={() => handleFilterCycle(choice.value)}
            >
              {choice.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filters.is_active === undefined ? 'primary' : 'secondary'}
            onClick={() => handleFilterStatus(undefined)}
          >
            Toutes
          </Button>
          <Button
            size="sm"
            variant={filters.is_active === true ? 'primary' : 'secondary'}
            onClick={() => handleFilterStatus(true)}
          >
            Actives
          </Button>
          <Button
            size="sm"
            variant={filters.is_active === false ? 'primary' : 'secondary'}
            onClick={() => handleFilterStatus(false)}
          >
            Inactives
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results && data.results.length > 0 ? (
          data.results.map((filiere) => (
            <div
              key={filiere.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{filiere.nom}</h3>
                      <p className="text-sm text-gray-500">{filiere.code}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{filiere.cycle_display || filiere.cycle}</Badge>
                    {filiere.is_active ? (
                      <Badge variant="success">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="info">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                  
                  {filiere.departement_details && (
                    <div className="text-sm text-gray-600">
                      Dép: {filiere.departement_details.code}
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    Durée: {filiere.duree_annees} an{filiere.duree_annees > 1 ? 's' : ''}
                  </div>

                  {filiere.frais_inscription && parseFloat(filiere.frais_inscription) > 0 && (
                    <div className="text-sm font-medium text-green-600">
                      {parseFloat(filiere.frais_inscription).toLocaleString()} FCFA
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                  <BookOpen className="w-4 h-4" />
                  <span>{filiere.matieres_count || 0} matières</span>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenModal(filiere)}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteConfirm({ isOpen: true, item: filiere })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucune filière trouvée
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
        title={editingItem ? 'Modifier la filière' : 'Nouvelle filière'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Code" placeholder="Ex: L3-INFO" error={errors.code?.message} {...register('code')} />
            <Input label="Nom" placeholder="Ex: Licence 3 Informatique" error={errors.nom?.message} {...register('nom')} />
          </div>

          <Controller
            name="departement_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Département"
                options={[
                  { value: '', label: 'Sélectionner un département' },
                  ...(departementsData?.results.map((dept) => ({
                    value: dept.id,
                    label: dept.nom,
                  })) || [])
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.departement_id?.message}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="cycle"
              control={control}
              render={({ field }) => (
                <Select
                  label="Cycle"
                  options={[
                    { value: '', label: 'Sélectionner' },
                    ...CYCLE_CHOICES.map((choice) => ({
                      value: choice.value,
                      label: choice.label,
                    }))
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.cycle?.message}
                />
              )}
            />

            <Input
              label="Durée (années)"
              type="number"
              min="1"
              max="8"
              error={errors.duree_annees?.message}
              {...register('duree_annees', { valueAsNumber: true })}
            />
          </div>

          <Input
            label="Frais d'inscription (FCFA)"
            type="number"
            min="0"
            error={errors.frais_inscription?.message}
            {...register('frais_inscription', { valueAsNumber: true })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Description de la filière..."
              {...register('description')}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...register('is_active')}
            />
            <span className="text-sm text-gray-700">Filière active</span>
          </label>

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
        title="Supprimer la filière"
        message={`Êtes-vous sûr de vouloir supprimer la filière "${deleteConfirm.item?.nom}" ?`}
        confirmText="Supprimer"
      />
    </div>
  );
}