import api from '@/api/client';
import type {
  Equipment,
  EquipmentFormData,
  Reservation,
  ReservationFormData,
  Maintenance,
  MaintenanceFormData,
  CalendarEvent,
  AvailabilitySlot,
  ResourcesStats,
} from '@/types/resources.types';

// ===========================
// API ÉQUIPEMENTS
// ===========================

/**
 * Récupère la liste des équipements
 */
export const getEquipments = async (params?: Record<string, any>): Promise<Equipment[]> => {
  const response = await api.get('/equipements/', { params });
  return response.data;
};

/**
 * Récupère un équipement par son ID
 */
export const getEquipment = async (id: number): Promise<Equipment> => {
  const response = await api.get(`/equipements/${id}/`);
  return response.data;
};

/**
 * Crée un nouvel équipement
 */
export const createEquipment = async (data: EquipmentFormData): Promise<Equipment> => {
  const response = await api.post('/equipements/', data);
  return response.data;
};

/**
 * Met à jour un équipement
 */
export const updateEquipment = async (id: number, data: Partial<EquipmentFormData>): Promise<Equipment> => {
  const response = await api.put(`/equipements/${id}/`, data);
  return response.data;
};

/**
 * Supprime un équipement
 */
export const deleteEquipment = async (id: number): Promise<void> => {
  await api.delete(`/equipements/${id}/`);
};

/**
 * Récupère le calendrier d'un équipement
 */
export const getEquipmentCalendar = async (id: number, params?: Record<string, any>): Promise<CalendarEvent[]> => {
  const response = await api.get(`/equipements/${id}/calendrier/`, { params });
  return response.data;
};

// ===========================
// API RÉSERVATIONS
// ===========================

/**
 * Récupère la liste des réservations
 */
export const getReservations = async (params?: Record<string, any>): Promise<Reservation[]> => {
  const response = await api.get('/reservations/', { params });
  return response.data;
};

/**
 * Récupère une réservation par son ID
 */
export const getReservation = async (id: number): Promise<Reservation> => {
  const response = await api.get(`/reservations/${id}/`);
  return response.data;
};

/**
 * Crée une nouvelle réservation
 */
export const createReservation = async (data: ReservationFormData): Promise<Reservation> => {
  const response = await api.post('/reservations/', data);
  return response.data;
};

/**
 * Met à jour une réservation
 */
export const updateReservation = async (id: number, data: Partial<ReservationFormData>): Promise<Reservation> => {
  const response = await api.put(`/reservations/${id}/`, data);
  return response.data;
};

/**
 * Supprime une réservation
 */
export const deleteReservation = async (id: number): Promise<void> => {
  await api.delete(`/reservations/${id}/`);
};

/**
 * Valide une réservation
 */
export const validateReservation = async (id: number): Promise<Reservation> => {
  const response = await api.post(`/reservations/${id}/valider/`);
  return response.data;
};

/**
 * Rejette une réservation
 */
export const rejectReservation = async (id: number, motif_rejet: string): Promise<Reservation> => {
  const response = await api.post(`/reservations/${id}/rejeter/`, { motif_rejet });
  return response.data;
};

/**
 * Annule une réservation
 */
export const cancelReservation = async (id: number): Promise<Reservation> => {
  const response = await api.post(`/reservations/${id}/annuler/`);
  return response.data;
};

/**
 * Vérifie la disponibilité pour une réservation
 */
export const checkAvailability = async (data: {
  type_reservation: string;
  salle?: number;
  equipements?: Array<{ equipement: number; quantite: number }>;
  date_debut: string;
  heure_debut: string;
  date_fin: string;
  heure_fin: string;
}): Promise<AvailabilitySlot[]> => {
  const response = await api.post('/reservations/verifier-disponibilite/', data);
  return response.data;
};

// ===========================
// API MAINTENANCES
// ===========================

/**
 * Récupère la liste des maintenances
 */
export const getMaintenances = async (params?: Record<string, any>): Promise<Maintenance[]> => {
  const response = await api.get('/maintenances/', { params });
  return response.data;
};

/**
 * Récupère une maintenance par son ID
 */
export const getMaintenance = async (id: number): Promise<Maintenance> => {
  const response = await api.get(`/maintenances/${id}/`);
  return response.data;
};

/**
 * Crée une nouvelle maintenance
 */
export const createMaintenance = async (data: MaintenanceFormData): Promise<Maintenance> => {
  const response = await api.post('/maintenances/', data);
  return response.data;
};

/**
 * Met à jour une maintenance
 */
export const updateMaintenance = async (id: number, data: Partial<MaintenanceFormData>): Promise<Maintenance> => {
  const response = await api.put(`/maintenances/${id}/`, data);
  return response.data;
};

/**
 * Supprime une maintenance
 */
export const deleteMaintenance = async (id: number): Promise<void> => {
  await api.delete(`/maintenances/${id}/`);
};

/**
 * Démarre une maintenance
 */
export const startMaintenance = async (id: number): Promise<Maintenance> => {
  const response = await api.post(`/maintenances/${id}/demarrer/`);
  return response.data;
};

/**
 * Termine une maintenance
 */
export const completeMaintenance = async (
  id: number,
  data: {
    travaux_effectues: string;
    pieces_remplacees?: string;
    cout_main_oeuvre?: number;
    cout_pieces?: number;
    observations?: string;
  }
): Promise<Maintenance> => {
  const response = await api.post(`/maintenances/${id}/terminer/`, data);
  return response.data;
};

/**
 * Annule une maintenance
 */
export const cancelMaintenance = async (id: number): Promise<Maintenance> => {
  const response = await api.post(`/maintenances/${id}/annuler/`);
  return response.data;
};

// ===========================
// API STATISTIQUES
// ===========================

/**
 * Récupère les statistiques des ressources
 */
export const getResourcesStats = async (): Promise<ResourcesStats> => {
  const response = await api.get('/ressources/statistiques/');
  return response.data;
};

// ===========================
// EXPORT
// ===========================

export const resourcesApi = {
  // Équipements
  getEquipments,
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getEquipmentCalendar,
  
  // Réservations
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
  validateReservation,
  rejectReservation,
  cancelReservation,
  checkAvailability,
  
  // Maintenances
  getMaintenances,
  getMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  startMaintenance,
  completeMaintenance,
  cancelMaintenance,
  
  // Statistiques
  getResourcesStats,
};