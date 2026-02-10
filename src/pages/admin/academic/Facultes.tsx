/**
 * Page Liste des Facultés
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Search, Building2, Pencil, Trash2, Users, BookOpen } from 'lucide-react';
import {
  useFacultes,
  useCreateFaculte,
  useUpdateFaculte,
  useDeleteFaculte,
} from '@/hooks/useFacultes';
import type { Faculte, FaculteCreate, FaculteFilters } from '@/types/academic.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import ConfirmModal from "@/components/ui/ConfirmModal";
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

// Schéma de validation Zod
const faculteSchema = z.object({
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères').max(20),
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  doyen: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  telephone: z.string().optional(),
});

type FormData = z.infer<typeof faculteSchema>;

export default function FacultesPage() {
  // États locaux
  const [filters, setFilters] = useState<FaculteFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Faculte | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Faculte | null }>({
    isOpen: false,
    item: null,
  });

  // React Query
  const { data, isLoading } = useFacultes(filters);
  const createMutation = useCreateFaculte();
  const updateMutation = useUpdateFaculte();
  const deleteMutation = useDeleteFaculte();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(faculteSchema),
  });

  // Handlers
  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleOpenModal = (item?: Faculte) => {
    if (item) {
      setEditingItem(item);
      setValue('code', item.code);
      setValue('nom', item.nom);
      setValue('description', item.description || '');
      setValue('doyen', item.doyen || '');
      setValue('email', item.email || '');
      setValue('telephone', item.telephone || '');
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
        await createMutation.mutateAsync(data as FaculteCreate);
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
        <Spinner size="lg" message="Chargement des facultés..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facultés</h1>
          <p className="text-gray-600 mt-1">Gérer les facultés de l'université</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Faculté
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
              placeholder="Rechercher une faculté..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>
      </div>

      {/* Liste des facultés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.results && data.results.length > 0 ? (
          data.results.map((faculte) => (
            <div
              key={faculte.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{faculte.nom}</h3>
                      <p className="text-sm text-gray-500">{faculte.code}</p>
                    </div>
                  </div>
                </div>

                {faculte.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{faculte.description}</p>
                )}

                {faculte.doyen && (
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Doyen:</span> {faculte.doyen}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{faculte.departements_count || 0} dép.</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{faculte.etudiants_count || 0} étud.</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleOpenModal(faculte)}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setDeleteConfirm({ isOpen: true, item: faculte })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucune faculté trouvée
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
        title={editingItem ? 'Modifier la faculté' : 'Nouvelle faculté'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Code" placeholder="Ex: FST" error={errors.code?.message} {...register('code')} />

            <Input label="Nom" placeholder="Ex: Faculté des Sciences" error={errors.nom?.message} {...register('nom')} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Description de la faculté..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <Input
            label="Doyen"
            placeholder="Nom du doyen"
            error={errors.doyen?.message}
            {...register('doyen')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="email@university.cm"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Téléphone"
              placeholder="+237 6XX XX XX XX"
              error={errors.telephone?.message}
              {...register('telephone')}
            />
          </div>

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

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer la faculté"
        message={`Êtes-vous sûr de vouloir supprimer la faculté "${deleteConfirm.item?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
      />
    </div>
  );
}