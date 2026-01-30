/**
 * Page Liste des Étudiants
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Search,
  GraduationCap,
  Pencil,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Download,
  Upload,
  Filter,
  X,
} from 'lucide-react';
import {
  useEtudiants,
  useCreateEtudiant,
  useUpdateEtudiant,
  useDeleteEtudiant,
  useGenerateEtudiantMatricule,
} from '@/hooks/useEtudiants';
import { useFilieres } from '@/hooks/useFilieres';
import type { Etudiant, EtudiantCreate, EtudiantFilters } from '@/types/students.types';
import {
  STATUT_ETUDIANT_CHOICES,
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
import { format } from 'date-fns';

const etudiantSchema = z.object({
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
  
  filiere_id: z.number({ message: 'La filière est requise' }),
  annee_admission: z.number().min(2000).max(2050),
  niveau_actuel: z.number().min(1).max(8),
  statut: z.enum(['ACTIF', 'INACTIF', 'DIPLOME', 'ABANDONNE', 'SUSPENDU']).default('ACTIF'),
  
  contact_urgence_nom: z.string().optional(),
  contact_urgence_telephone: z.string().optional(),
  contact_urgence_relation: z.string().optional(),
  
  nationalite: z.string().default('Camerounaise'),
  num_cni: z.string().optional(),
});

type FormData = z.infer<typeof etudiantSchema>;

export default function EtudiantsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EtudiantFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Etudiant | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Etudiant | null }>({
    isOpen: false,
    item: null,
  });

  const { data, isLoading } = useEtudiants(filters);
  const { data: filieresData } = useFilieres({ page_size: 100 });
  const createMutation = useCreateEtudiant();
  const updateMutation = useUpdateEtudiant();
  const deleteMutation = useDeleteEtudiant();
  const generateMatriculeMutation = useGenerateEtudiantMatricule();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(etudiantSchema),
    defaultValues: {
      statut: 'ACTIF',
      pays: 'Cameroun',
      nationalite: 'Camerounaise',
      annee_admission: new Date().getFullYear(),
      niveau_actuel: 1,
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

  const handleOpenModal = (item?: Etudiant) => {
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
      setValue('filiere_id', item.filiere);
      setValue('annee_admission', item.annee_admission);
      setValue('niveau_actuel', item.niveau_actuel);
      setValue('statut', item.statut);
      setValue('contact_urgence_nom', item.contact_urgence_nom || '');
      setValue('contact_urgence_telephone', item.contact_urgence_telephone || '');
      setValue('contact_urgence_relation', item.contact_urgence_relation || '');
      setValue('nationalite', item.nationalite || 'Camerounaise');
      setValue('num_cni', item.num_cni || '');
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
            filiere_id: data.filiere_id,
            niveau_actuel: data.niveau_actuel,
            statut: data.statut,
            contact_urgence_nom: data.contact_urgence_nom,
            contact_urgence_telephone: data.contact_urgence_telephone,
            contact_urgence_relation: data.contact_urgence_relation,
            nationalite: data.nationalite,
            num_cni: data.num_cni,
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
      DIPLOME: { variant: 'info' as const, label: 'Diplômé' },
      ABANDONNE: { variant: 'error' as const, label: 'Abandonné' },
      SUSPENDU: { variant: 'warning' as const, label: 'Suspendu' },
    };
    const { variant, label } = config[statut as keyof typeof config] || config.INACTIF;
    return <Badge variant={variant}>{label}</Badge>;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-blue-600" />
            Étudiants
          </h1>
          <p className="text-gray-600 mt-1">Gestion complète des étudiants</p>
        </div>
        <Button onClick={() => handleOpenModal()} icon={Plus}>
          Nouvel Étudiant
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <Select
              label="Filière"
              value={filters.filiere?.toString() || ''}
              onChange={(e) =>
                setFilters({ ...filters, filiere: e.target.value ? Number(e.target.value) : undefined, page: 1 })
              }
            >
              <option value="">Toutes les filières</option>
              {filieresData?.results.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nom}
                </option>
              ))}
            </Select>

            <Select
              label="Niveau"
              value={filters.niveau_actuel?.toString() || ''}
              onChange={(e) =>
                setFilters({ ...filters, niveau_actuel: e.target.value ? Number(e.target.value) : undefined, page: 1 })
              }
            >
              <option value="">Tous les niveaux</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  Niveau {n}
                </option>
              ))}
            </Select>

            <Select
              label="Statut"
              value={filters.statut || ''}
              onChange={(e) => setFilters({ ...filters, statut: e.target.value as any, page: 1 })}
            >
              <option value="">Tous les statuts</option>
              {STATUT_ETUDIANT_CHOICES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>

            <Select
              label="Année d'admission"
              value={filters.annee_admission?.toString() || ''}
              onChange={(e) =>
                setFilters({ ...filters, annee_admission: e.target.value ? Number(e.target.value) : undefined, page: 1 })
              }
            >
              <option value="">Toutes les années</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
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
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun étudiant trouvé</p>
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
                      Filière
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Niveau
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
                  {data.results.map((etudiant) => (
                    <tr key={etudiant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm text-gray-900">{etudiant.matricule}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {etudiant.nom} {etudiant.prenom}
                            </div>
                            <div className="text-sm text-gray-500">{etudiant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{etudiant.filiere_details?.nom || '-'}</div>
                        <div className="text-sm text-gray-500">{etudiant.filiere_details?.code || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">Niveau {etudiant.niveau_actuel}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{etudiant.telephone}</div>
                        <div className="text-sm text-gray-500">{etudiant.ville || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatutBadge(etudiant.statut)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Eye}
                          onClick={() => navigate(`/admin/students/etudiants/${etudiant.id}`)}
                        >
                          Voir
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Pencil}
                          onClick={() => handleOpenModal(etudiant)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={Trash2}
                          onClick={() => setDeleteConfirm({ isOpen: true, item: etudiant })}
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

      {/* Modal Formulaire */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Modifier Étudiant' : 'Nouvel Étudiant'}
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
                label="Nationalité"
                {...register('nationalite')}
                error={errors.nationalite?.message}
              />

              <Input
                label="N° CNI"
                {...register('num_cni')}
                error={errors.num_cni?.message}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Informations Académiques */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-900">Informations Académiques</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                name="filiere_id"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Filière"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={errors.filiere_id?.message}
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {filieresData?.results.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nom}
                      </option>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="annee_admission"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Année d'Admission"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={errors.annee_admission?.message}
                    required
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="niveau_actuel"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Niveau Actuel"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={errors.niveau_actuel?.message}
                    required
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        Niveau {n}
                      </option>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="statut"
                control={control}
                render={({ field }) => (
                  <Select label="Statut" {...field} error={errors.statut?.message} required>
                    {STATUT_ETUDIANT_CHOICES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Contact d'Urgence */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-900">Contact d'Urgence</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Nom du Contact"
                {...register('contact_urgence_nom')}
                error={errors.contact_urgence_nom?.message}
              />

              <Input
                label="Téléphone du Contact"
                {...register('contact_urgence_telephone')}
                error={errors.contact_urgence_telephone?.message}
              />

              <Input
                label="Relation"
                {...register('contact_urgence_relation')}
                error={errors.contact_urgence_relation?.message}
                placeholder="Ex: Père, Mère, Tuteur..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="primary" onClick={handleCloseModal}>
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
        title="Supprimer l'étudiant"
        message={`Êtes-vous sûr de vouloir supprimer l'étudiant ${deleteConfirm.item?.nom} ${deleteConfirm.item?.prenom} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
