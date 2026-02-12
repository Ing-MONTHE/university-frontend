// ===========================
// TYPES POUR LE MODULE RESSOURCES
// ===========================

// ===== ÉQUIPEMENT =====
export interface Equipment {
  id: number;
  nom: string;
  description: string;
  reference: string;
  categorie: EquipmentCategory;
  etat: EquipmentStatus;
  salle: number | null;
  salle_info?: {
    id: number;
    nom: string;
    numero: string;
    batiment_info?: {
      nom: string;
    };
  };
  quantite_disponible: number;
  quantite_totale: number;
  date_acquisition: string | null;
  valeur_acquisition: string | null;
  dernier_entretien: string | null;
  prochain_entretien: string | null;
  reservable: boolean;
  observations: string;
  created_at: string;
  updated_at: string;
}

export type EquipmentCategory = 
  | 'INFORMATIQUE' 
  | 'AUDIOVISUEL' 
  | 'MOBILIER' 
  | 'SPORTIF' 
  | 'SCIENTIFIQUE' 
  | 'AUTRE';

export type EquipmentStatus = 
  | 'DISPONIBLE' 
  | 'RESERVE' 
  | 'EN_MAINTENANCE' 
  | 'HORS_SERVICE';

export interface EquipmentFormData {
  nom: string;
  description?: string;
  reference: string;
  categorie: EquipmentCategory;
  etat?: EquipmentStatus;
  salle?: number | null;
  quantite_disponible?: number;
  quantite_totale: number;
  date_acquisition?: string | null;
  valeur_acquisition?: string | null;
  dernier_entretien?: string | null;
  prochain_entretien?: string | null;
  reservable?: boolean;
  observations?: string;
}

// ===== RÉSERVATION =====
export interface Reservation {
  id: number;
  type_reservation: ReservationType;
  statut: ReservationStatus;
  demandeur: number;
  demandeur_info?: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  valideur: number | null;
  valideur_info?: {
    username: string;
  };
  salle: number | null;
  salle_info?: {
    id: number;
    nom: string;
    numero: string;
  };
  date_debut: string;
  heure_debut: string;
  date_fin: string;
  heure_fin: string;
  motif: string;
  commentaires: string;
  equipements_reserves?: ReservationEquipment[];
  date_validation: string | null;
  motif_rejet: string;
  created_at: string;
  updated_at: string;
}

export type ReservationType = 
  | 'SALLE' 
  | 'EQUIPEMENT' 
  | 'SALLE_EQUIPEMENT';

export type ReservationStatus = 
  | 'EN_ATTENTE' 
  | 'VALIDEE' 
  | 'REJETEE' 
  | 'ANNULEE' 
  | 'TERMINEE';

export interface ReservationFormData {
  type_reservation: ReservationType;
  salle?: number | null;
  date_debut: string;
  heure_debut: string;
  date_fin: string;
  heure_fin: string;
  motif: string;
  commentaires?: string;
  equipements?: Array<{
    equipement: number;
    quantite: number;
  }>;
}

export interface ReservationEquipment {
  id: number;
  reservation: number;
  equipement: number;
  equipement_info?: {
    id: number;
    nom: string;
    reference: string;
    categorie: string;
  };
  quantite: number;
  retourne: boolean;
  date_retour: string | null;
  etat_retour: string;
}

// ===== MAINTENANCE =====
export interface Maintenance {
  id: number;
  equipement: number;
  equipement_info?: {
    id: number;
    nom: string;
    reference: string;
    categorie: string;
  };
  type_maintenance: MaintenanceType;
  statut: MaintenanceStatus;
  date_planifiee: string;
  date_debut: string | null;
  date_fin: string | null;
  technicien: number | null;
  technicien_info?: {
    username: string;
    first_name: string;
    last_name: string;
  };
  description: string;
  travaux_effectues: string;
  pieces_remplacees: string;
  cout_main_oeuvre: string | null;
  cout_pieces: string | null;
  observations: string;
  created_at: string;
  updated_at: string;
}

export type MaintenanceType = 
  | 'PREVENTIVE' 
  | 'CORRECTIVE' 
  | 'URGENTE';

export type MaintenanceStatus = 
  | 'PLANIFIEE' 
  | 'EN_COURS' 
  | 'TERMINEE' 
  | 'ANNULEE';

export interface MaintenanceFormData {
  equipement: number;
  type_maintenance: MaintenanceType;
  statut?: MaintenanceStatus;
  date_planifiee: string;
  technicien?: number | null;
  description: string;
  observations?: string;
}

export interface MaintenanceSchedule {
  equipement: number;
  type_maintenance: MaintenanceType;
  frequence: MaintenanceFrequency;
  date_debut: string;
  description: string;
}

export type MaintenanceFrequency = 
  | 'MENSUELLE' 
  | 'TRIMESTRIELLE' 
  | 'SEMESTRIELLE' 
  | 'ANNUELLE';

// ===== CALENDRIER =====
export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource?: Reservation;
  type: 'reservation' | 'maintenance';
  status?: ReservationStatus | MaintenanceStatus;
}

export interface AvailabilitySlot {
  equipement_id: number;
  salle_id?: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  disponible: boolean;
  reservations_conflictuelles?: number[];
}

// ===== FILTRES =====
export interface EquipmentFilters {
  search?: string;
  categorie?: EquipmentCategory | '';
  etat?: EquipmentStatus | '';
  salle?: number | '';
  reservable?: boolean | '';
}

export interface ReservationFilters {
  search?: string;
  statut?: ReservationStatus | '';
  type_reservation?: ReservationType | '';
  date_debut?: string;
  date_fin?: string;
  demandeur?: number | '';
  equipement?: number | '';
  salle?: number | '';
}

export interface MaintenanceFilters {
  search?: string;
  type_maintenance?: MaintenanceType | '';
  statut?: MaintenanceStatus | '';
  equipement?: number | '';
  date_debut?: string;
  date_fin?: string;
}

// ===== STATISTIQUES =====
export interface ResourcesStats {
  total_equipements: number;
  equipements_disponibles: number;
  equipements_reserves: number;
  equipements_maintenance: number;
  reservations_today: number;
  reservations_pending: number;
  maintenances_planifiees: number;
  maintenances_en_cours: number;
}

// ===== OPTIONS POUR LES SELECT =====
export const EQUIPMENT_CATEGORIES: Array<{ value: EquipmentCategory; label: string }> = [
  { value: 'INFORMATIQUE', label: 'Informatique' },
  { value: 'AUDIOVISUEL', label: 'Audiovisuel' },
  { value: 'MOBILIER', label: 'Mobilier' },
  { value: 'SPORTIF', label: 'Sportif' },
  { value: 'SCIENTIFIQUE', label: 'Scientifique' },
  { value: 'AUTRE', label: 'Autre' },
];

export const EQUIPMENT_STATUSES: Array<{ value: EquipmentStatus; label: string }> = [
  { value: 'DISPONIBLE', label: 'Disponible' },
  { value: 'RESERVE', label: 'Réservé' },
  { value: 'EN_MAINTENANCE', label: 'En maintenance' },
  { value: 'HORS_SERVICE', label: 'Hors service' },
];

export const RESERVATION_TYPES: Array<{ value: ReservationType; label: string }> = [
  { value: 'SALLE', label: 'Salle' },
  { value: 'EQUIPEMENT', label: 'Équipement' },
  { value: 'SALLE_EQUIPEMENT', label: 'Salle + Équipement' },
];

export const RESERVATION_STATUSES: Array<{ value: ReservationStatus; label: string }> = [
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'VALIDEE', label: 'Validée' },
  { value: 'REJETEE', label: 'Rejetée' },
  { value: 'ANNULEE', label: 'Annulée' },
  { value: 'TERMINEE', label: 'Terminée' },
];

export const MAINTENANCE_TYPES: Array<{ value: MaintenanceType; label: string }> = [
  { value: 'PREVENTIVE', label: 'Préventive' },
  { value: 'CORRECTIVE', label: 'Corrective' },
  { value: 'URGENTE', label: 'Urgente' },
];

export const MAINTENANCE_STATUSES: Array<{ value: MaintenanceStatus; label: string }> = [
  { value: 'PLANIFIEE', label: 'Planifiée' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'TERMINEE', label: 'Terminée' },
  { value: 'ANNULEE', label: 'Annulée' },
];

export const MAINTENANCE_FREQUENCIES: Array<{ value: MaintenanceFrequency; label: string }> = [
  { value: 'MENSUELLE', label: 'Mensuelle' },
  { value: 'TRIMESTRIELLE', label: 'Trimestrielle' },
  { value: 'SEMESTRIELLE', label: 'Semestrielle' },
  { value: 'ANNUELLE', label: 'Annuelle' },
];