/**
 * Page Liste des Matières
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, BookOpen, Pencil, Trash2, Clock, Award } from 'lucide-react';
import {
  useMatieres,
  useCreateMatiere,
  useUpdateMatiere,
  useDeleteMatiere,
} from '@/hooks/useMatieres';
import { useFilieres } from '@/hooks/useFilieres';
import type { Matiere, MatiereCreate, MatiereFilters, SemestreChoice } from '@/types/academic.types';
import { SEMESTRE_CHOICES } from '@/types/academic.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import { ConfirmModal } from '@/components/ui';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

const matiereSchema = z.object({
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères').max(20),
  nom: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  coefficient: z.number().min(1).max(10),
  credits: z.number().min(1).max(30),
  volume_horaire_cm: z.number().min(0).optional(),
  volume_horaire_td: z.number().min(0).optional(),
  volume_horaire_tp: z.number().min(0).optional(),
  semestre: z.number().refine((val) => val === 1 || val === 2, {
    message: 'Le semestre doit être 1 ou 2',
  }),
  is_optionnelle: z.boolean().optional(),
  filiere_ids: z.array(z.number()).optional(),
});

type FormData = z.infer<typeof matiereSchema>;

export default function MatieresPage() {
  const [filters, setFilters] = useState<MatiereFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Matiere | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Matiere | null }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useMatieres(filters);
  const { data: filieresData } = useFilieres({ page_size: 100 });
  const createMutation = useCreateMatiere();
  const updateMutation = useUpdateMatiere();
  const deleteMutation = useDeleteMatiere();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(matiereSchema),
    defaultValues: {
      volume_horaire_cm: 0,
      volume_horaire_td: 0,
      volume_horaire_tp: 0,
      is_optionnelle: false,
    },
  });

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleOpenModal = (item?: Matiere) => {
    if (item) {
      setEditingItem(item);
      setValue('code', item.code);
      setValue('nom', item.nom);
      setValue('description', item.description || '');
      setValue('coefficient', item.coefficient);
      setValue('credits', item.credits);
      setValue('volume_horaire_cm', item.volume_horaire_cm);
      setValue('volume_horaire_td', item.volume_horaire_td);
      setValue('volume_horaire_tp', item.volume_horaire_tp);
      setValue('semestre', item.semestre);
      setValue('is_optionnelle', item.is_optionnelle);
      setValue('filiere_ids', item.filieres || []);
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
        await createMutation.mutateAsync(data as MatiereCreate);
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

  const handleFilterSemestre = (semestre: SemestreChoice | undefined) => {
    setFilters({ ...filters, semestre, page: 1 });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" message="Chargement des matières..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Matières</h1>
          <p className="text-gray-600 mt-1">Gérer les matières et unités d'enseignement</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Matière
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
              placeholder="Rechercher une matière..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button onClick={handleSearch} variant="primary">
            Rechercher
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={!filters.semestre ? 'primary' : 'secondary'}
            onClick={() => handleFilterSemestre(undefined)}
          >
            Tous les semestres
          </Button>
          {SEMESTRE_CHOICES.map((choice) => (
            <Button
              key={choice.value}
              size="sm"
              variant={filters.semestre === choice.value ? 'primary' : 'secondary'}
              onClick={() => handleFilterSemestre(choice.value)}
            >
              {choice.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matière
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semestre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coefficient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crédits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume horaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.results && data.results.length > 0 ? (
                data.results.map((matiere) => (
                  <tr key={matiere.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{matiere.nom}</div>
                          <div className="text-sm text-gray-500">{matiere.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">
                        {matiere.semestre_display || `Semestre ${matiere.semestre}`}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{matiere.coefficient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-blue-600">{matiere.credits} ECTS</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {matiere.volume_horaire_total || 
                            (matiere.volume_horaire_cm + matiere.volume_horaire_td + matiere.volume_horaire_tp)}h
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        CM:{matiere.volume_horaire_cm} TD:{matiere.volume_horaire_td} TP:{matiere.volume_horaire_tp}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {matiere.is_optionnelle ? (
                        <Badge variant="warning">Optionnelle</Badge>
                      ) : (
                        <Badge variant="success">Obligatoire</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleOpenModal(matiere)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteConfirm({ isOpen: true, item: matiere })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Aucune matière trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Modifier la matière' : 'Nouvelle matière'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Code" placeholder="Ex: INFO301" error={errors.code?.message} {...register('code')} />
            <Input label="Nom" placeholder="Ex: Programmation POO" error={errors.nom?.message} {...register('nom')} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="semestre"
              control={control}
              render={({ field }) => (
                <Select
                  label="Semestre"
                  options={[
                    { value: '', label: 'Sélectionner' },
                    ...SEMESTRE_CHOICES.map((choice) => ({ value: choice.value, label: choice.label }))
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.semestre?.message}
                />
              )}
            />

            <Input
              label="Coefficient"
              type="number"
              min="1"
              max="10"
              error={errors.coefficient?.message}
              {...register('coefficient', { valueAsNumber: true })}
            />

            <Input
              label="Crédits ECTS"
              type="number"
              min="1"
              max="30"
              error={errors.credits?.message}
              {...register('credits', { valueAsNumber: true })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Vol. CM (h)"
              type="number"
              min="0"
              error={errors.volume_horaire_cm?.message}
              {...register('volume_horaire_cm', { valueAsNumber: true })}
            />

            <Input
              label="Vol. TD (h)"
              type="number"
              min="0"
              error={errors.volume_horaire_td?.message}
              {...register('volume_horaire_td', { valueAsNumber: true })}
            />

            <Input
              label="Vol. TP (h)"
              type="number"
              min="0"
              error={errors.volume_horaire_tp?.message}
              {...register('volume_horaire_tp', { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Filières</label>
            <Controller
              name="filiere_ids"
              control={control}
              render={({ field }) => (
                <select
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name={field.name}
                  value={(field.value || []).map(String)}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => Number(option.value));
                    field.onChange(values);
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref as any}
                >
                  {filieresData?.results.map((filiere) => (
                    <option key={filiere.id} value={filiere.id}>
                      {filiere.nom}
                    </option>
                  ))}
                </select>
              )}
            />
            <p className="text-xs text-gray-500">Maintenir Ctrl/Cmd pour sélectionner plusieurs filières</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Description de la matière..."
              {...register('description')}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              {...register('is_optionnelle')}
            />
            <span className="text-sm text-gray-700">Matière optionnelle</span>
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
        title="Supprimer la matière"
        message={`Êtes-vous sûr de vouloir supprimer la matière "${deleteConfirm.item?.nom}" ?`}
        confirmText="Supprimer"
      />
    </div>
  );
}