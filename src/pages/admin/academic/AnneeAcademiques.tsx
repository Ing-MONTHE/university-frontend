/**
 * Page Liste des Années Académiques
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Pencil,
  Trash2,
  Lock,
  Unlock,
} from 'lucide-react';
import { 
  useAnneeAcademiques,
  useCreateAnneeAcademique,
  useUpdateAnneeAcademique,
  useDeleteAnneeAcademique,
  useActivateAnneeAcademique,
  useCloseAnneeAcademique,
} from '@/hooks/useAnneeAcademiques';
import type { AnneeAcademique, AnneeAcademiqueCreate, AnneeAcademiqueFilters } from '@/types/academic.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import ConfirmModal from "@/components/ui/ConfirmModal";
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

// Schéma de validation Zod
const anneeAcademiqueSchema = z.object({
  code: z.string().min(7, 'Format requis: YYYY-YYYY').regex(/^\d{4}-\d{4}$/, 'Format: 2024-2025'),
  date_debut: z.string().min(1, 'La date de début est requise'),
  date_fin: z.string().min(1, 'La date de fin est requise'),
  is_active: z.boolean().optional(),
}).refine(data => new Date(data.date_fin) > new Date(data.date_debut), {
  message: 'La date de fin doit être après la date de début',
  path: ['date_fin'],
});

type FormData = z.infer<typeof anneeAcademiqueSchema>;

export default function AnneeAcademiquesPage() {
  // États locaux
  const [filters, setFilters] = useState<AnneeAcademiqueFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnneeAcademique | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: AnneeAcademique | null }>({
    isOpen: false,
    item: null,
  });

  // React Query
  const { data, isLoading } = useAnneeAcademiques(filters);
  const createMutation = useCreateAnneeAcademique();
  const updateMutation = useUpdateAnneeAcademique();
  const deleteMutation = useDeleteAnneeAcademique();
  const activateMutation = useActivateAnneeAcademique();
  const closeMutation = useCloseAnneeAcademique();

  // React Hook Form
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(anneeAcademiqueSchema),
  });

  // Handlers
  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleOpenModal = (item?: AnneeAcademique) => {
    if (item) {
      setEditingItem(item);
      setValue('code', item.code);
      setValue('date_debut', item.date_debut);
      setValue('date_fin', item.date_fin);
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
        await createMutation.mutateAsync(data as AnneeAcademiqueCreate);
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

  const handleActivate = async (id: number) => {
    try {
      await activateMutation.mutateAsync(id);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const handleClose = async (id: number) => {
    try {
      await closeMutation.mutateAsync(id);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const handleFilterStatus = (isActive: boolean | undefined) => {
    setFilters({ ...filters, is_active: isActive, page: 1 });
  };

  // Render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" message="Chargement des années académiques..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Années Académiques</h1>
          <p className="text-gray-600 mt-1">Gérer les années académiques de l'université</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Année
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher une année académique..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>

        {/* Filtres de statut */}
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

      {/* Liste des années */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.results && data.results.length > 0 ? (
                data.results.map((annee) => (
                  <tr key={annee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{annee.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {format(new Date(annee.date_debut), 'dd MMM yyyy', { locale: fr })} →{' '}
                        {format(new Date(annee.date_fin), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {annee.is_active ? (
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(annee.created_at), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {!annee.is_active && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleActivate(annee.id)}
                          >
                            <Unlock className="w-4 h-4 mr-2" />
                            Activer
                          </Button>
                        )}
                        {annee.is_active && (
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => handleClose(annee.id)}
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Fermer
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenModal(annee)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteConfirm({ isOpen: true, item: annee })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucune année académique trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.count > 0 && (
          <div className="border-t border-gray-200 p-4">
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
      </div>

      {/* Modal de création/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Modifier l\'année académique' : 'Nouvelle année académique'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Code"
            placeholder="Ex: 2024-2025"
            error={errors.code?.message}
            {...register('code')}
          />
          
          <Input
            label="Date de début"
            type="date"
            error={errors.date_debut?.message}
            {...register('date_debut')}
          />
          
          <Input
            label="Date de fin"
            type="date"
            error={errors.date_fin?.message}
            {...register('date_fin')}
          />
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...register('is_active')}
            />
            <span className="text-sm text-gray-700">Activer cette année académique</span>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="primary" onClick={handleCloseModal}>
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
        title="Supprimer l'année académique"
        message={`Êtes-vous sûr de vouloir supprimer l'année académique "${deleteConfirm.item?.code}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
      />
    </div>
  );
}