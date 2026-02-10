/**
 * Page Liste des Enseignants - Style Module Académique
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  GraduationCap, 
  Pencil, 
  Trash2, 
  Eye, 
  Download,
  User,
  Mail,
  Phone,
  Briefcase,
  Award
} from 'lucide-react';
import {
  useTeachers,
  useDeleteTeacher,
} from '@/hooks/useTeachers';
import type { Enseignant, EnseignantFilters } from '@/types/teacher.types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Pagination from '@/components/ui/Pagination';
import Spinner from '@/components/ui/Spinner';
import { ConfirmModal } from '@/components/ui';
import { DEFAULT_PAGE_SIZE } from '@/config/constants';

export default function TeachersListPage() {
  const navigate = useNavigate();

  // États locaux
  const [filters, setFilters] = useState<EnseignantFilters>({
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: Enseignant | null }>({
    isOpen: false,
    item: null,
  });

  // React Query
  const { data, isLoading } = useTeachers(filters);
  const deleteMutation = useDeleteTeacher();

  // Handlers
  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleDelete = async () => {
    if (deleteConfirm.item) {
      await deleteMutation.mutateAsync(deleteConfirm.item.id);
      setDeleteConfirm({ isOpen: false, item: null });
    }
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      ASSISTANT: 'bg-blue-100 text-blue-700',
      MC: 'bg-purple-100 text-purple-700',
      PROFESSEUR: 'bg-green-100 text-green-700',
    };
    return colors[grade] || 'bg-gray-100 text-gray-700';
  };

  const getStatutColor = (statut: string) => {
    const colors: Record<string, string> = {
      ACTIF: 'bg-green-100 text-green-700',
      INACTIF: 'bg-red-100 text-red-700',
      EN_CONGE: 'bg-yellow-100 text-yellow-700',
      RETIRE: 'bg-gray-100 text-gray-700',
    };
    return colors[statut] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              Gestion des Enseignants
            </h1>
            <p className="text-gray-600 mt-1">
              {data?.count || 0} enseignant(s) • {data?.results.filter(t => t.statut === 'ACTIF').length || 0} actif(s)
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {/* TODO: Export */}}
              variant="secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button onClick={() => navigate('/admin/teachers/new')} variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Enseignant
            </Button>
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
              placeholder="Rechercher un enseignant (nom, matricule, spécialité)..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

      {/* Liste des enseignants en cartes */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.results && data.results.length > 0 ? (
            data.results.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Header avec photo */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={teacher.photo_url || '/default-avatar.png'}
                      alt={teacher.prenom}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {teacher.nom} {teacher.prenom}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">{teacher.matricule}</p>
                      <div className="mt-1 flex gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(teacher.grade)}`}>
                          {teacher.grade_display || teacher.grade}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatutColor(teacher.statut)}`}>
                          {teacher.statut_display || teacher.statut}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{teacher.specialite}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span>{teacher.departement_nom || 'Non assigné'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{teacher.email_personnel || teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{teacher.telephone}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{teacher.nb_matieres || 0} matières</span>
                    </div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {teacher.charge_horaire || 0}h/sem
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/admin/teachers/${teacher.id}`)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/admin/teachers/${teacher.id}/edit`)}
                      className="flex-1"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteConfirm({ isOpen: true, item: teacher })}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun enseignant trouvé</p>
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

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message={`Êtes-vous sûr de vouloir supprimer l'enseignant ${deleteConfirm.item?.nom} ${deleteConfirm.item?.prenom} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}