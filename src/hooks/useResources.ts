import { useState, useEffect, useCallback } from 'react';
import { resourcesApi } from '@/api/resources.api';
import type {
  Equipment,
  EquipmentFormData,
  EquipmentFilters,
  Reservation,
  ReservationFormData,
  ReservationFilters,
  Maintenance,
  MaintenanceFormData,
  MaintenanceFilters,
} from '@/types/resources.types';

// ===========================
// HOOK: useEquipments
// ===========================

export const useEquipments = (initialFilters?: EquipmentFilters) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EquipmentFilters>(initialFilters || {});

  const fetchEquipments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourcesApi.getEquipments(filters);
      setEquipments(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des équipements');
      console.error('Erreur chargement équipements:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  const createEquipment = async (data: EquipmentFormData) => {
    try {
      const newEquipment = await resourcesApi.createEquipment(data);
      setEquipments((prev) => [newEquipment, ...prev]);
      return newEquipment;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la création de l\'équipement');
    }
  };

  const updateEquipment = async (id: number, data: Partial<EquipmentFormData>) => {
    try {
      const updated = await resourcesApi.updateEquipment(id, data);
      setEquipments((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la mise à jour de l\'équipement');
    }
  };

  const deleteEquipment = async (id: number) => {
    try {
      await resourcesApi.deleteEquipment(id);
      setEquipments((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la suppression de l\'équipement');
    }
  };

  return {
    equipments,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
  };
};

// ===========================
// HOOK: useEquipment
// ===========================

export const useEquipment = (id: number | null) => {
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await resourcesApi.getEquipment(id);
        setEquipment(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement de l\'équipement');
        console.error('Erreur chargement équipement:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  return { equipment, loading, error };
};

// ===========================
// HOOK: useReservations
// ===========================

export const useReservations = (initialFilters?: ReservationFilters) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReservationFilters>(initialFilters || {});

  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourcesApi.getReservations(filters);
      setReservations(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des réservations');
      console.error('Erreur chargement réservations:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const createReservation = async (data: ReservationFormData) => {
    try {
      const newReservation = await resourcesApi.createReservation(data);
      setReservations((prev) => [newReservation, ...prev]);
      return newReservation;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la création de la réservation');
    }
  };

  const updateReservation = async (id: number, data: Partial<ReservationFormData>) => {
    try {
      const updated = await resourcesApi.updateReservation(id, data);
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la mise à jour de la réservation');
    }
  };

  const deleteReservation = async (id: number) => {
    try {
      await resourcesApi.deleteReservation(id);
      setReservations((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la suppression de la réservation');
    }
  };

  const validateReservation = async (id: number) => {
    try {
      const updated = await resourcesApi.validateReservation(id);
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la validation de la réservation');
    }
  };

  const rejectReservation = async (id: number, motif: string) => {
    try {
      const updated = await resourcesApi.rejectReservation(id, motif);
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors du rejet de la réservation');
    }
  };

  const cancelReservation = async (id: number) => {
    try {
      const updated = await resourcesApi.cancelReservation(id);
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de l\'annulation de la réservation');
    }
  };

  return {
    reservations,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    validateReservation,
    rejectReservation,
    cancelReservation,
  };
};

// ===========================
// HOOK: useMaintenances
// ===========================

export const useMaintenances = (initialFilters?: MaintenanceFilters) => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MaintenanceFilters>(initialFilters || {});

  const fetchMaintenances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourcesApi.getMaintenances(filters);
      setMaintenances(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des maintenances');
      console.error('Erreur chargement maintenances:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMaintenances();
  }, [fetchMaintenances]);

  const createMaintenance = async (data: MaintenanceFormData) => {
    try {
      const newMaintenance = await resourcesApi.createMaintenance(data);
      setMaintenances((prev) => [newMaintenance, ...prev]);
      return newMaintenance;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la création de la maintenance');
    }
  };

  const updateMaintenance = async (id: number, data: Partial<MaintenanceFormData>) => {
    try {
      const updated = await resourcesApi.updateMaintenance(id, data);
      setMaintenances((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la mise à jour de la maintenance');
    }
  };

  const deleteMaintenance = async (id: number) => {
    try {
      await resourcesApi.deleteMaintenance(id);
      setMaintenances((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la suppression de la maintenance');
    }
  };

  const startMaintenance = async (id: number) => {
    try {
      const updated = await resourcesApi.startMaintenance(id);
      setMaintenances((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors du démarrage de la maintenance');
    }
  };

  const completeMaintenance = async (id: number, data: any) => {
    try {
      const updated = await resourcesApi.completeMaintenance(id, data);
      setMaintenances((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de la clôture de la maintenance');
    }
  };

  const cancelMaintenance = async (id: number) => {
    try {
      const updated = await resourcesApi.cancelMaintenance(id);
      setMaintenances((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors de l\'annulation de la maintenance');
    }
  };

  return {
    maintenances,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchMaintenances,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    startMaintenance,
    completeMaintenance,
    cancelMaintenance,
  };
};