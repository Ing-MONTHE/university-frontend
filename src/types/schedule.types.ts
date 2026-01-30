/**
 * Types TypeScript pour le module Emploi du Temps (Schedule)
 * Mapped depuis les modèles Django Backend
 */

import { Matiere } from './academic.types';
import { Enseignant } from './students.types';

// ============== STATUTS ==============

export type TypeSalle = 'COURS' | 'TD' | 'TP' | 'AMPHI' | 'LABORATOIRE' | 'AUTRE';
export type JourSemaine = 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI';
export type TypeConflitSalle = 'DOUBLE_BOOKING' | 'CONFLIT_ENSEIGNANT' | 'CAPACITE_DEPASSEE';

// ============== BÂTIMENT ==============

export interface Batiment {
  id: number;
  nom: string;
  code: string;
  adresse?: string;
  nombre_etages: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Stats
  nombre_salles?: number;
}

export interface BatimentCreate {
  nom: string;
  code: string;
  adresse?: string;
  nombre_etages?: number;
  is_active?: boolean;
}

export interface BatimentUpdate {
  nom?: string;
  code?: string;
  adresse?: string;
  nombre_etages?: number;
  is_active?: boolean;
}

// ============== SALLE ==============

export interface Salle {
  id: number;
  nom: string;
  code: string;
  batiment: number; // ID
  batiment_details?: Batiment;
  etage: number;
  type_salle: TypeSalle;
  capacite: number;
  equipements?: string; // JSON ou texte
  is_accessible_pmr: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Stats
  taux_occupation?: number; // Calculé
}

export interface SalleCreate {
  nom: string;
  code: string;
  batiment: number;
  etage?: number;
  type_salle: TypeSalle;
  capacite: number;
  equipements?: string;
  is_accessible_pmr?: boolean;
  is_active?: boolean;
}

export interface SalleUpdate {
  nom?: string;
  code?: string;
  batiment?: number;
  etage?: number;
  type_salle?: TypeSalle;
  capacite?: number;
  equipements?: string;
  is_accessible_pmr?: boolean;
  is_active?: boolean;
}

// ============== CRÉNEAU HORAIRE ==============

export interface Creneau {
  id: number;
  jour: JourSemaine;
  heure_debut: string; // HH:MM
  heure_fin: string; // HH:MM
  duree_minutes: number; // Calculé automatiquement
  created_at: string;
  updated_at: string;
}

export interface CreneauCreate {
  jour: JourSemaine;
  heure_debut: string;
  heure_fin: string;
}

export interface CreneauUpdate {
  jour?: JourSemaine;
  heure_debut?: string;
  heure_fin?: string;
}

// ============== COURS ==============

export interface Cours {
  id: number;
  matiere: number; // ID
  matiere_details?: Matiere;
  enseignant: number; // ID
  enseignant_details?: Enseignant;
  salle: number; // ID
  salle_details?: Salle;
  creneau: number; // ID
  creneau_details?: Creneau;
  annee_academique: number; // ID
  semestre: number;
  date_debut: string; // ISO date
  date_fin: string; // ISO date
  recurrence: 'HEBDOMADAIRE' | 'BIHEBDOMADAIRE' | 'PONCTUEL';
  effectif_prevu: number;
  remarques?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoursCreate {
  matiere: number;
  enseignant: number;
  salle: number;
  creneau: number;
  annee_academique: number;
  semestre: number;
  date_debut: string;
  date_fin: string;
  recurrence?: 'HEBDOMADAIRE' | 'BIHEBDOMADAIRE' | 'PONCTUEL';
  effectif_prevu: number;
  remarques?: string;
  is_active?: boolean;
}

export interface CoursUpdate {
  matiere?: number;
  enseignant?: number;
  salle?: number;
  creneau?: number;
  date_debut?: string;
  date_fin?: string;
  recurrence?: 'HEBDOMADAIRE' | 'BIHEBDOMADAIRE' | 'PONCTUEL';
  effectif_prevu?: number;
  remarques?: string;
  is_active?: boolean;
}

// ============== CONFLIT ==============

export interface ConflitSalle {
  id: number;
  cours_1: number; // ID
  cours_1_details?: Cours;
  cours_2?: number; // ID (optionnel)
  cours_2_details?: Cours;
  type_conflit: TypeConflitSalle;
  description: string;
  date_detection: string;
  resolu: boolean;
  date_resolution?: string;
  resolution_note?: string;
  created_at: string;
  updated_at: string;
}

export interface ConflitSalleCreate {
  cours_1: number;
  cours_2?: number;
  type_conflit: TypeConflitSalle;
  description: string;
}

export interface ConflitSalleUpdate {
  resolu?: boolean;
  date_resolution?: string;
  resolution_note?: string;
}

// ============== TYPES DE FILTRES ==============

export interface BatimentFilters {
  search?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface SalleFilters {
  search?: string;
  batiment?: number;
  type_salle?: TypeSalle;
  capacite_min?: number;
  capacite_max?: number;
  is_accessible_pmr?: boolean;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CreneauFilters {
  jour?: JourSemaine;
  heure_debut?: string;
  heure_fin?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CoursFilters {
  search?: string;
  matiere?: number;
  enseignant?: number;
  salle?: number;
  jour?: JourSemaine;
  annee_academique?: number;
  semestre?: number;
  date_debut?: string;
  date_fin?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface ConflitFilters {
  type_conflit?: TypeConflitSalle;
  resolu?: boolean;
  date_detection_debut?: string;
  date_detection_fin?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ============== TYPES POUR UI ==============

// Emploi du temps par filière
export interface EmploiDuTempsFiliere {
  filiere: any; // Filiere
  semestre: number;
  cours: Cours[];
}

// Emploi du temps par enseignant
export interface EmploiDuTempsEnseignant {
  enseignant: Enseignant;
  cours: Cours[];
  charge_horaire_totale: number;
}

// Vue calendrier
export interface CalendarEvent {
  id: number;
  title: string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    cours: Cours;
    matiere?: Matiere;
    enseignant?: Enseignant;
    salle?: Salle;
  };
}

// Stats emploi du temps
export interface ScheduleStats {
  total_cours: number;
  cours_cette_semaine: number;
  total_conflits: number;
  conflits_non_resolus: number;
  taux_occupation_salles: number;
  taux_occupation_enseignants: number;
}

// Disponibilité salle
export interface DisponibiliteSalle {
  salle: Salle;
  creneaux_occupes: {
    jour: JourSemaine;
    heure_debut: string;
    heure_fin: string;
    cours: Cours;
  }[];
  taux_occupation: number;
}
