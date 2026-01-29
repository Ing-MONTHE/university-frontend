/**
 * Types TypeScript pour le module Académique
 * Mapped depuis les modèles Django Backend
 */

// ============== ANNÉE ACADÉMIQUE ==============

export interface AnneeAcademique {
  id: number;
  code: string; // Ex: "2024-2025"
  date_debut: string; // ISO date
  date_fin: string; // ISO date
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnneeAcademiqueCreate {
  code: string;
  date_debut: string;
  date_fin: string;
  is_active?: boolean;
}

export interface AnneeAcademiqueUpdate {
  code?: string;
  date_debut?: string;
  date_fin?: string;
  is_active?: boolean;
}

// ============== FACULTÉ ==============

export interface Faculte {
  id: number;
  code: string; // Ex: "FST", "FDSP"
  nom: string;
  description?: string;
  doyen?: string;
  email?: string;
  telephone?: string;
  created_at: string;
  updated_at: string;
  
  // Champs calculés
  departements_count?: number;
  etudiants_count?: number;
}

export interface FaculteCreate {
  code: string;
  nom: string;
  description?: string;
  doyen?: string;
  email?: string;
  telephone?: string;
}

export interface FaculteUpdate {
  code?: string;
  nom?: string;
  description?: string;
  doyen?: string;
  email?: string;
  telephone?: string;
}

// ============== DÉPARTEMENT ==============

export interface Departement {
  id: number;
  code: string; // Ex: "INFO", "MATH"
  nom: string;
  description?: string;
  faculte: number; // ID de la faculté
  faculte_details?: Faculte;
  chef_departement?: string;
  created_at: string;
  updated_at: string;
  
  // Champs calculés
  filieres_count?: number;
}

export interface DepartementCreate {
  code: string;
  nom: string;
  description?: string;
  faculte_id: number; // Note: faculte_id pour correspondre au serializer
  chef_departement?: string;
}

export interface DepartementUpdate {
  code?: string;
  nom?: string;
  description?: string;
  faculte_id?: number;
  chef_departement?: string;
}

// ============== FILIÈRE ==============

export type CycleFiliere = 'LICENCE' | 'MASTER' | 'DOCTORAT' | 'DUT' | 'BTS';

export const CYCLE_CHOICES: { value: CycleFiliere; label: string }[] = [
  { value: 'LICENCE', label: 'Licence' },
  { value: 'MASTER', label: 'Master' },
  { value: 'DOCTORAT', label: 'Doctorat' },
  { value: 'DUT', label: 'DUT' },
  { value: 'BTS', label: 'BTS' },
];

export interface Filiere {
  id: number;
  code: string; // Ex: "L3-INFO", "M2-MATH"
  nom: string;
  cycle: CycleFiliere;
  cycle_display?: string;
  duree_annees: number;
  frais_inscription: string; // Decimal comme string
  description?: string;
  departement: number; // ID
  departement_details?: Departement;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Champs calculés
  matieres_count?: number;
}

export interface FiliereCreate {
  code: string;
  nom: string;
  cycle: CycleFiliere;
  duree_annees: number;
  frais_inscription?: number | string;
  description?: string;
  departement_id: number;
  is_active?: boolean;
}

export interface FiliereUpdate {
  code?: string;
  nom?: string;
  cycle?: CycleFiliere;
  duree_annees?: number;
  frais_inscription?: number | string;
  description?: string;
  departement_id?: number;
  is_active?: boolean;
}

// ============== MATIÈRE ==============

export type SemestreChoice = 1 | 2;

export const SEMESTRE_CHOICES: { value: SemestreChoice; label: string }[] = [
  { value: 1, label: 'Semestre 1' },
  { value: 2, label: 'Semestre 2' },
];

export interface Matiere {
  id: number;
  code: string; // Ex: "INFO301", "MATH205"
  nom: string;
  coefficient: number;
  credits: number; // ECTS
  volume_horaire_cm: number;
  volume_horaire_td: number;
  volume_horaire_tp: number;
  volume_horaire_total?: number; // Calculé
  semestre: SemestreChoice;
  semestre_display?: string;
  is_optionnelle: boolean;
  description?: string;
  filieres: number[]; // IDs des filières
  filieres_details?: Filiere[];
  created_at: string;
  updated_at: string;
}

export interface MatiereCreate {
  code: string;
  nom: string;
  coefficient: number;
  credits: number;
  volume_horaire_cm?: number;
  volume_horaire_td?: number;
  volume_horaire_tp?: number;
  semestre: SemestreChoice;
  is_optionnelle?: boolean;
  description?: string;
  filiere_ids?: number[];
}

export interface MatiereUpdate {
  code?: string;
  nom?: string;
  coefficient?: number;
  credits?: number;
  volume_horaire_cm?: number;
  volume_horaire_td?: number;
  volume_horaire_tp?: number;
  semestre?: SemestreChoice;
  is_optionnelle?: boolean;
  description?: string;
  filiere_ids?: number[];
}

// ============== TYPES DE FILTRES ==============

export interface AnneeAcademiqueFilters {
  search?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface FaculteFilters {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface DepartementFilters {
  search?: string;
  faculte?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface FiliereFilters {
  search?: string;
  departement?: number;
  cycle?: CycleFiliere;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface MatiereFilters {
  search?: string;
  filiere?: number;
  semestre?: SemestreChoice;
  is_optionnelle?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ============== TYPES POUR RÉPONSES API ==============

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}