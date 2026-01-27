import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import StudentForm, { StudentFormData } from './StudentForm';
import ConfirmModal from '@/components/layout/ConfirmModal';
import { useStudents } from '@/hooks';
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  UserX,
  Loader2,
} from 'lucide-react';

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<any>(null);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

  // Hook API
  const {
    students,
    pagination,
    filters,
    isLoading,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDelete,
    exportCSV,
    updateFilters,
  } = useStudents({
    autoFetch: true,
    initialFilters: { page: 1, page_size: 10 },
  });

  // Stats
  const stats = [
    { 
      label: 'Total étudiants', 
      value: pagination.count, 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Actifs', 
      value: students.filter(s => s.status === 'ACTIVE').length, 
      icon: UserCheck, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      label: 'Suspendus', 
      value: students.filter(s => s.status === 'SUSPENDED').length, 
      icon: UserX, 
      color: 'text-red-600', 
      bg: 'bg-red-50' 
    },
  ];

  // Badges
  const getStatusVariant = (status: string) => {
    const variants = {
      ACTIVE: 'success' as const,
      SUSPENDED: 'danger' as const,
      GRADUATED: 'info' as const,
      EXPELLED: 'danger' as const,
    };
    return variants[status as keyof typeof variants] || 'neutral' as const;
  };

  const getStatusLabel = (status: string) => {
    const labels = { 
      ACTIVE: 'Actif', 
      SUSPENDED: 'Suspendu', 
      GRADUATED: 'Diplômé',
      EXPELLED: 'Expulsé',
    };
    return labels[status as keyof typeof labels] || status;
  };

  // Actions
  const handleAddStudent = async (data: StudentFormData) => {
    const success = await createStudent({
      username: data.email.split('@')[0],
      email: data.email,
      password: 'DefaultPassword123!',
      first_name: data.first_name,
      last_name: data.last_name,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
      city: data.city,
      guardian_name: data.guardian_name || undefined,
      guardian_phone: data.guardian_phone || undefined,
      emergency_contact: data.emergency_contact || undefined,
      class_id: data.class_id && data.class_id !== '' ? parseInt(data.class_id) : undefined,
    });

    if (success) {
      setShowForm(false);
      setStudentToEdit(null);
    }
  };

  const handleEditStudent = (student: any) => {
    setStudentToEdit({
      id: student.id,
      first_name: student.user.first_name,
      last_name: student.user.last_name,
      email: student.user.email,
      phone: student.phone,
      date_of_birth: student.date_of_birth,
      gender: student.gender,
      address: student.address,
      city: student.city,
      class_id: student.current_class?.id.toString() || '',
      guardian_name: student.guardian_name || '',
      guardian_phone: student.guardian_phone || '',
      emergency_contact: student.emergency_contact || '',
    });
    setShowForm(true);
  };

  const handleUpdateStudent = async (data: StudentFormData) => {
    if (data.id) {
      const success = await updateStudent(data.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        address: data.address,
        city: data.city,
        guardian_name: data.guardian_name || undefined,
        guardian_phone: data.guardian_phone || undefined,
        emergency_contact: data.emergency_contact || undefined,
        class_id: data.class_id && data.class_id !== '' ? parseInt(data.class_id) : undefined,
      });

      if (success) {
        setShowForm(false);
        setStudentToEdit(null);
      }
    }
  };

  const handleDeleteStudent = async () => {
    if (studentToDelete) {
      const success = await deleteStudent(studentToDelete);
      if (success) {
        setShowDeleteModal(false);
        setStudentToDelete(null);
      }
    }
  };

  const handleBulkDelete = async () => {
    const success = await bulkDelete(selectedStudents);
    if (success) {
      setSelectedStudents([]);
    }
  };

  const openDeleteModal = (id: number) => {
    setStudentToDelete(id);
    setShowDeleteModal(true);
  };

  // Recherche et filtres
  const handleSearch = () => {
    updateFilters({ 
      search: searchQuery,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      page: 1,
    });
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    updateFilters({ 
      search: searchQuery,
      status: status !== 'all' ? status : undefined,
      page: 1,
    });
  };

  // Sélection
  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(sid => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Étudiants</h1>
            <p className="text-gray-600 mt-1">Gérez tous les étudiants de l'établissement</p>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            icon={<Plus />} 
            onClick={() => setShowForm(true)}
            disabled={isLoading}
          >
            Nouvel Étudiant
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Rechercher par nom, email..."
                icon={<Search className="w-5 h-5" />}
                iconPosition="left"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="ACTIVE">Actifs</option>
              <option value="SUSPENDED">Suspendus</option>
              <option value="GRADUATED">Diplômés</option>
            </select>

            <div className="flex gap-2">
              <Button variant="secondary" size="md" icon={<Filter />} onClick={handleSearch}>
                Rechercher
              </Button>
              <Button variant="secondary" size="md" icon={<Download />} onClick={exportCSV} disabled={isLoading}>
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {selectedStudents.length > 0 && (
          <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-blue-900">
                {selectedStudents.length} étudiant(s) sélectionné(s)
              </p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={handleBulkDelete} disabled={isLoading}>
                  Supprimer
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setSelectedStudents([])}>
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === students.length && students.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Matricule</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Étudiant</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Classe</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleSelect(student.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-mono font-semibold text-gray-900">{student.matricule}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {student.user.first_name.charAt(0)}{student.user.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{student.user.full_name}</p>
                          <p className="text-sm text-gray-500">{student.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">
                        {student.current_class?.name || 'Non assigné'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{student.phone}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={getStatusVariant(student.status)}>
                        {getStatusLabel(student.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />} className="p-2" />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Edit className="w-4 h-4" />} 
                          className="p-2"
                          onClick={() => handleEditStudent(student)}
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          icon={<Trash2 className="w-4 h-4 text-red-600" />} 
                          className="p-2"
                          onClick={() => openDeleteModal(student.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total: {pagination.count} étudiant(s)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => updateFilters({ page: (filters.page || 1) - 1 })}
                  disabled={!pagination.previous || isLoading}
                >
                  Précédent
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => updateFilters({ page: (filters.page || 1) + 1 })}
                  disabled={!pagination.next || isLoading}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <StudentForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setStudentToEdit(null);
        }}
        onSubmit={studentToEdit ? handleUpdateStudent : handleAddStudent}
        student={studentToEdit}
        isLoading={isLoading}
      />

      {/* Modal suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteStudent}
        title="Supprimer l'étudiant"
        message="Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </MainLayout>
  );
}