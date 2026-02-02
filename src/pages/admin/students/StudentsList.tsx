// Liste principale des étudiants avec filtres et stats

import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Bell,
} from 'lucide-react';
import { useStudents, useStudentStatistics, useDeleteStudent } from '../../../hooks/useStudents';
import type { Etudiant, EtudiantFilters } from '../../../types/student.types';

const StudentsList: React.FC = () => {
  const navigate = useNavigate();
  
  // États
  const [filters, setFilters] = useState<EtudiantFilters>({
    page: 1,
    page_size: 20,
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Queries
  const { data: studentsData, isLoading, error } = useStudents(filters);
  const { data: stats } = useStudentStatistics();
  const deleteStudent = useDeleteStudent();

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleFilterChange = (key: keyof EtudiantFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      await deleteStudent.mutateAsync(id);
    }
  };

  const toggleStudentSelection = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAllStudents = () => {
    if (selectedStudents.length === studentsData?.results.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(studentsData?.results.map((s) => s.id) || []);
    }
  };

  const getStatutBadge = (statut: string) => {
    const badges = {
      ACTIF: 'bg-green-100 text-green-800',
      SUSPENDU: 'bg-orange-100 text-orange-800',
      DIPLOME: 'bg-purple-100 text-purple-800',
      EXCLU: 'bg-red-100 text-red-800',
      ABANDONNE: 'bg-gray-100 text-gray-800',
    };
    return badges[statut as keyof typeof badges] || badges.ACTIF;
  };

  const getSexeBadge = (sexe: string) => {
    return sexe === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          Gestion des Étudiants
        </h1>
        <p className="text-gray-600 mt-2">
          Gérez les étudiants de l'université
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Étudiants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
              </div>
              <UserCheck className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouveaux</p>
                <p className="text-2xl font-bold text-blue-600">{stats.nouveaux}</p>
              </div>
              <Plus className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
                <p className="text-2xl font-bold text-purple-600">{stats.taux_reussite}%</p>
              </div>
              <Users className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Actions et Recherche */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Barre de recherche */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom, matricule..."
                  value={filters.search || ''}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </button>

              <button
                onClick={() => navigate('/admin/students/import')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Upload className="w-4 h-4" />
                Importer CSV
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Exporter
              </button>

              <button
                onClick={() => navigate('/admin/students/new')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Nouvel Étudiant
              </button>
            </div>

            {/* Toggle vue */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-white shadow' : ''
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-white shadow' : ''
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexe
                  </label>
                  <select
                    value={filters.sexe || ''}
                    onChange={(e) => handleFilterChange('sexe', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tous</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Statut
                  </label>
                  <select
                    value={filters.statut || ''}
                    onChange={(e) => handleFilterChange('statut', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tous</option>
                    <option value="ACTIF">Actif</option>
                    <option value="SUSPENDU">Suspendu</option>
                    <option value="DIPLOME">Diplômé</option>
                    <option value="EXCLU">Exclu</option>
                    <option value="ABANDONNE">Abandonné</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année d'inscription
                  </label>
                  <select
                    value={filters.annee_inscription || ''}
                    onChange={(e) =>
                      handleFilterChange('annee_inscription', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Toutes</option>
                    {[2024, 2023, 2022, 2021, 2020].map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Solde impayé
                  </label>
                  <select
                    value={filters.solde_impaye !== undefined ? String(filters.solde_impaye) : ''}
                    onChange={(e) =>
                      handleFilterChange('solde_impaye', e.target.value ? e.target.value === 'true' : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Tous</option>
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ page: 1, page_size: 20 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions groupées */}
        {selectedStudents.length > 0 && (
          <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">
                {selectedStudents.length} étudiant(s) sélectionné(s)
              </span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  <UserCheck className="w-4 h-4" />
                  Activer
                </button>
                <button className="flex items-center gap-2 px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">
                  <UserX className="w-4 h-4" />
                  Désactiver
                </button>
                <button className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  <Bell className="w-4 h-4" />
                  Notifier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-600">Erreur lors du chargement des données</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === studentsData?.results.length}
                      onChange={toggleAllStudents}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom Complet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sexe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentsData?.results.map((student: Etudiant) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <img
                        src={student.photo || '/default-avatar.png'}
                        alt={student.prenom}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.matricule}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.nom} {student.prenom}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getSexeBadge(
                          student.sexe
                        )}`}
                      >
                        {student.sexe === 'M' ? 'Masculin' : 'Féminin'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.email_personnel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.telephone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatutBadge(
                          student.statut
                        )}`}
                      >
                        {student.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/students/${student.id}`)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Voir le profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {studentsData && studentsData.count > (filters.page_size || 20) && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Affichage de {((filters.page || 1) - 1) * (filters.page_size || 20) + 1} à{' '}
                  {Math.min((filters.page || 1) * (filters.page_size || 20), studentsData.count)} sur{' '}
                  {studentsData.count} résultats
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                    disabled={!studentsData.previous}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                    disabled={!studentsData.next}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Vue grille
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studentsData?.results.map((student: Etudiant) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex flex-col items-center">
                <img
                  src={student.photo || '/default-avatar.png'}
                  alt={student.prenom}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 text-center">
                  {student.nom} {student.prenom}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{student.matricule}</p>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full mb-4 ${getStatutBadge(
                    student.statut
                  )}`}
                >
                  {student.statut}
                </span>
                <div className="w-full space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Email:</span>
                    <span className="font-medium truncate ml-2">{student.email_personnel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tél:</span>
                    <span className="font-medium">{student.telephone}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 w-full">
                  <button
                    onClick={() => navigate(`/admin/students/${student.id}`)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button
                    onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentsList;