/**
 * Page Liste des Enseignants
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  Users,
  Pencil,
  Trash2,
  Eye,
  Filter,
  X,
  BookOpen,
  Calendar,
} from 'lucide-react';
import {
  useEnseignants,
  useCreateEnseignant,
  useUpdateEnseignant,
  useDeleteEnseignant,
  useGenerateEnseignantMatricule,
} from '@/hooks/useEnseignants';
import { useDepartements } from '@/hooks/useDepartements';
import type { Enseignant, EnseignantCreate, EnseignantFilters } from '@/types/students.types';
import {
  STATUT_ENSEIGNANT_CHOICES,
  GRADE_ENSEIGNANT_CHOICES,
  GENRE_CHOICES,
} from '@/types/students.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

const enseignantSchema = z.object({
  matricule: z.string().min(5, 'Le matricule doit contenir au moins 5 caractères'),
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  date_naissance: z.string().min(1, 'La date de naissance est requise'),
  lieu_naissance: z.string().min(2, 'Le lieu de naissance est requis'),
  genre: z.enum(['M', 'F']),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(9, 'Téléphone invalide'),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  pays: z.string().default('Cameroun'),
  
  grade: z.enum(['PROFESSEUR', 'MAITRE_CONFERENCE', 'ASSISTANT', 'CHARGE_COURS', 'VACATAIRE']),
  specialite: z.string().min(2, 'La spécialité est requise'),
  departement_id: z.number({ message: 'Le département est requis' }),
  
  date_embauche: z.string().min(1, 'La date d\'embauche est requise'),
  statut: z.enum(['ACTIF', 'INACTIF', 'CONGE', 'RETRAITE']).default('ACTIF'),
  
  diplomes: z.string().optional(),
  experiences: z.string().optional(),
  heures_par_semaine: z.number().min(0).max(40).optional(),
});

type FormData = z.infer<typeof enseignantSchema>;

export default function EnseignantsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EnseignantFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Enseignant | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Enseignant | null }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useEnseignants(filters);
  const { data: departementsData } = useDepartements({ page_size: 100 });
  const createMutation = useCreateEnseignant();
  const updateMutation = useUpdateEnseignant();
  const deleteMutation = useDeleteEnseignant();
  const generateMatriculeMutation = useGenerateEnseignantMatricule();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(enseignantSchema),
    defaultValues: {
      statut: 'ACTIF',
      pays: 'Cameroun',
      heures_par_semaine: 20,
    },
  });

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleGenerateMatricule = async () => {
    try {
      const result = await generateMatriculeMutation.mutateAsync();
      setValue('matricule', result.matricule);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleOpenModal = (item?: Enseignant) => {
    if (item) {
      setEditingItem(item);
      setValue('matricule', item.matricule);
      setValue('nom', item.nom);
      setValue('prenom', item.prenom);
      setValue('date_naissance', item.date_naissance);
      setValue('lieu_naissance', item.lieu_naissance);
      setValue('genre', item.genre);
      setValue('email', item.email);
      setValue('telephone', item.telephone);
      setValue('adresse', item.adresse || '');
      setValue('ville', item.ville || '');
      setValue('pays', item.pays || 'Cameroun');
      setValue('grade', item.grade);
      setValue('specialite', item.specialite);
      setValue('departement_id', item.departement);
      setValue('date_embauche', item.date_embauche);
      setValue('statut', item.statut);
      setValue('diplomes', item.diplomes || '');
      setValue('experiences', item.experiences || '');
      setValue('heures_par_semaine', item.heures_par_semaine || 20);
    } else {
      setEditingItem(null);
      reset();
      handleGenerateMatricule();
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
        await updateMutation.mutateAsync({
          id: editingItem.id,
          data: {
            nom: data.nom,
            prenom: data.prenom,
            date_naissance: data.date_naissance,
            lieu_naissance: data.lieu_naissance,
            genre: data.genre,
            email: data.email,
            telephone: data.telephone,
            adresse: data.adresse,
            ville: data.ville,
            pays: data.pays,
            grade: data.grade,
            specialite: data.specialite,
            departement_id: data.departement_id,
            date_embauche: data.date_embauche,
            statut: data.statut,
            diplomes: data.diplomes,
            experiences: data.experiences,
            heures_par_semaine: data.heures_par_semaine,
          },
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      handleCloseModal();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm.item) {
      try {
        await deleteMutation.mutateAsync(deleteConfirm.item.id);
        setDeleteConfirm({ isOpen: false, item: null });
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const getStatutBadge = (statut: string) => {
    const config = {
      ACTIF: { variant: 'success' as const, label: 'Actif' },
      INACTIF: { variant: 'secondary' as const, label: 'Inactif' },
      CONGE: { variant: 'warning' as const, label: 'En congé' },
      RETRAITE: { variant: 'info' as const, label: 'Retraité' },
    };
    const { variant, label } = config[statut as keyof typeof config] || config.INACTIF;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getGradeBadge = (grade: string) => {
    const config = {
      PROFESSEUR: { variant: 'primary' as const, label: 'Professeur' },
      MAITRE_CONFERENCE: { variant: 'info' as const, label: 'Maître de Conférences' },
      ASSISTANT: { variant: 'secondary' as const, label: 'Assistant' },
      CHARGE_COURS: { variant: 'warning' as const, label: 'Chargé de Cours' },
      VACATAIRE: { variant: 'error' as const, label: 'Vacataire' },
    };
    const { variant, label } = config[grade as keyof typeof config] || config.ASSISTANT;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-600" />
            Enseignants
          </h1>
          <p className="text-gray-600 mt-1">Gestion complète du corps enseignant</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Nouvel Enseignant
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <Input
              placeholder="Rechercher par nom, prénom, matricule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              icon={Search}
            />
            <Button onClick={handleSearch} variant="secondary">
              Rechercher
            </Button>
          </div>
          <Button
            variant="primary"
            icon={isFilterOpen ? X : Filter}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {isFilterOpen ? 'Masquer Filtres' : 'Filtres'}
          </Button>
        </div>

        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <Select
              label="Département"
              value={filters.departement?.toString() || ''}
              onChange={(e) =>
                setFilters({ ...filters, departement: e.target.value ? Number(e.target.value) : undefined, page: 1 })
              }
            >
              <option value="">Tous les départements</option>
              {departementsData?.results.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nom}
                </option>
              ))}
            </Select>

            <Select
              label="Grade"
              value={filters.grade || ''}
              onChange={(e) => setFilters({ ...filters, grade: e.target.value as any, page: 1 })}
            >
              <option value="">Tous les grades</option>
              {GRADE_ENSEIGNANT_CHOICES.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </Select>

            <Select
              label="Statut"
              value={filters.statut || ''}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value as any, page: 1 })}
            >
              <option value="">Tous les statuts</option>
              {STATUT_ENSEIGNANT_CHOICES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
          </div>
        )}
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : !data?.results.length ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun enseignant trouvé</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matricule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom Complet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spécialité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Département
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.results.map((enseignant) => (
                    <tr key={enseignant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-gray-900">{enseignant.matricule}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {enseignant.nom} {enseignant.prenom}
                            </div>
                            <div className="text-sm text-gray-500">{enseignant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getGradeBadge(enseignant.grade)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{enseignant.specialite}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enseignant.departement_details?.nom || '-'}</div>
                        <div className="text-sm text-gray-500">{enseignant.departement_details?.code || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enseignant.telephone}</div>
                        <div className="text-sm text-gray-500">{enseignant.ville || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatutBadge(enseignant.statut)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Eye}
                          onClick={() => navigate(`/admin/students/enseignants/${enseignant.id}`)}
                        >
                          Voir
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Pencil}
                          onClick={() => handleOpenModal(enseignant)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Trash2}
                          onClick={() => setDeleteConfirm({ isOpen: true, item: enseignant })}
                          className="text-red-600 hover:text-red-700"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && data.count > DEFAULT_PAGE_SIZE && (
              <div className="mt-4">
                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={Math.ceil(data.count / (filters.page_size || DEFAULT_PAGE_SIZE))}
                  onPageChange={(page) => setFilters({ ...filters, page })}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Modal Formulaire - Version simplifiée pour économiser l'espace */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Modifier Enseignant' : 'Nouvel Enseignant'}
        size="xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations Générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations Générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Matricule"
                  {...register('matricule')}
                  error={errors.matricule?.message}
                  disabled={!!editingItem}
                  rightElement={
                    !editingItem && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleGenerateMatricule}
                        loading={generateMatriculeMutation.isPending}
                      >
                        Générer
                      </Button>
                    )
                  }
                />
              </div>

              <Input label="Nom" {...register('nom')} error={errors.nom?.message} required />
              <Input label="Prénom" {...register('prenom')} error={errors.prenom?.message} required />

              <Controller
                name="genre"
                control={control}
                render={({ field }) => (
                  <Select label="Genre" {...field} error={errors.genre?.message} required>
                    <option value="">Sélectionner...</option>
                    {GENRE_CHOICES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </Select>
                )}
              />

              <Input
                label="Date de Naissance"
                type="date"
                {...register('date_naissance')}
                error={errors.date_naissance?.message}
                required
              />

              <Input
                label="Lieu de Naissance"
                {...register('lieu_naissance')}
                error={errors.lieu_naissance?.message}
                required
              />

              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                required
              />

              <Input
                label="Téléphone"
                {...register('telephone')}
                error={errors.telephone?.message}
                required
              />

              <Input label="Adresse" {...register('adresse')} error={errors.adresse?.message} />
              <Input label="Ville" {...register('ville')} error={errors.ville?.message} />
              <Input label="Pays" {...register('pays')} error={errors.pays?.message} />
            </div>
          </div>

          {/* Informations Professionnelles */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-900">Informations Professionnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="grade"
                control={control}
                render={({ field }) => (
                  <Select label="Grade" {...field} error={errors.grade?.message} required>
                    <option value="">Sélectionner...</option>
                    {GRADE_ENSEIGNANT_CHOICES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </Select>
                )}
              />

              <Input
                label="Spécialité"
                {...register('specialite')}
                error={errors.specialite?.message}
                required
              />

              <Controller
                name="departement_id"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Département"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={errors.departement_id?.message}
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {departementsData?.results.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nom}
                      </option>
                    ))}
                  </Select>
                )}
              />

              <Input
                label="Date d'Embauche"
                type="date"
                {...register('date_embauche')}
                error={errors.date_embauche?.message}
                required
              />

              <Controller
                name="statut"
                control={control}
                render={({ field }) => (
                  <Select label="Statut" {...field} error={errors.statut?.message} required>
                    {STATUT_ENSEIGNANT_CHOICES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="heures_par_semaine"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Heures par Semaine"
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={errors.heures_par_semaine?.message}
                    min="0"
                    max="40"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Diplômes"
                {...register('diplomes')}
                error={errors.diplomes?.message}
                placeholder="Ex: Doctorat en Informatique, Université de..."
              />

              <Input
                label="Expériences"
                {...register('experiences')}
                error={errors.experiences?.message}
                placeholder="Ex: 10 ans d'enseignement, Projets de recherche..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button
              type="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingItem ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmation Suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message={`Êtes-vous sûr de vouloir supprimer l'enseignant ${deleteConfirm.item?.nom} ${deleteConfirm.item?.prenom} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}