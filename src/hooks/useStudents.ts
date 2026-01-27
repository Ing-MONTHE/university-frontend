import { useState, useEffect, useCallback } from 'react';
import { 
  studentsApi, 
  Student, 
  StudentCreateData, 
  StudentUpdateData, 
  StudentFilters,
} from '@/api/students.api';
import { useUIStore } from '@/store';

interface UseStudentsOptions {
  autoFetch?: boolean;
  initialFilters?: StudentFilters;
}

export const useStudents = (options: UseStudentsOptions = {}) => {
  const { autoFetch = true, initialFilters = {} } = options;
  
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [filters, setFilters] = useState<StudentFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addNotification } = useUIStore();

  /**
   * Récupérer tous les étudiants
   */
  const fetchStudents = useCallback(async (newFilters?: StudentFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filtersToUse = newFilters || filters;
      const response = await studentsApi.getAll(filtersToUse);
      
      setStudents(response.results);
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du chargement des étudiants';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, addNotification]);

  /**
   * Créer un étudiant
   */
  const createStudent = async (data: StudentCreateData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newStudent = await studentsApi.create(data);
      setStudents([newStudent, ...students]);
      
      addNotification({
        type: 'success',
        message: 'Étudiant créé avec succès',
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la création de l\'étudiant';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mettre à jour un étudiant
   */
  const updateStudent = async (id: number, data: StudentUpdateData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedStudent = await studentsApi.update(id, data);
      setStudents(students.map(s => s.id === id ? updatedStudent : s));
      
      addNotification({
        type: 'success',
        message: 'Étudiant modifié avec succès',
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la modification de l\'étudiant';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Supprimer un étudiant
   */
  const deleteStudent = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await studentsApi.delete(id);
      setStudents(students.filter(s => s.id !== id));
      
      addNotification({
        type: 'success',
        message: 'Étudiant supprimé avec succès',
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression de l\'étudiant';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Supprimer plusieurs étudiants
   */
  const bulkDelete = async (ids: number[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await studentsApi.bulkDelete(ids);
      setStudents(students.filter(s => !ids.includes(s.id)));
      
      addNotification({
        type: 'success',
        message: `${ids.length} étudiant(s) supprimé(s) avec succès`,
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression des étudiants';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mettre à jour le statut
   */
  const updateStatus = async (
    id: number, 
    status: 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'EXPELLED'
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedStudent = await studentsApi.updateStatus(id, status);
      setStudents(students.map(s => s.id === id ? updatedStudent : s));
      
      addNotification({
        type: 'success',
        message: 'Statut modifié avec succès',
      });
      
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la modification du statut';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Exporter en CSV
   */
  const exportCSV = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const blob = await studentsApi.exportCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `etudiants_${new Date().toISOString()}.csv`;
      link.click();
      
      addNotification({
        type: 'success',
        message: 'Export CSV réussi',
      });
    } catch (err: any) {
      addNotification({
        type: 'error',
        message: 'Erreur lors de l\'export CSV',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Mettre à jour les filtres
   */
  const updateFilters = (newFilters: Partial<StudentFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    fetchStudents(updatedFilters);
  };

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    setFilters({});
    fetchStudents({});
  };

  /**
   * Charger la page suivante
   */
  const loadNextPage = () => {
    if (pagination.next && filters.page) {
      updateFilters({ page: filters.page + 1 });
    }
  };

  /**
   * Charger la page précédente
   */
  const loadPreviousPage = () => {
    if (pagination.previous && filters.page && filters.page > 1) {
      updateFilters({ page: filters.page - 1 });
    }
  };

  // Auto-fetch au montage
  useEffect(() => {
    if (autoFetch) {
      fetchStudents();
    }
  }, []);

  return {
    // Data
    students,
    pagination,
    filters,
    
    // States
    isLoading,
    error,
    
    // Actions
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDelete,
    updateStatus,
    exportCSV,
    
    // Filters
    updateFilters,
    resetFilters,
    
    // Pagination
    loadNextPage,
    loadPreviousPage,
  };
};
