/**
 * Types TypeScript pour le module Académique
 * Mapped depuis les modèles Django Backend
 */

// ============== ANNÉE ACADÉMIQUE ==============

export interface AnneeAcademique {
  id: number;
  code: string;
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

// ============== FACULTÉ ==============

export interface Faculte {
  id: number;
  nom: string;
  code: string;
  description?: string;
  logo?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations comptées
  nombre_departements?: number;
  nombre_filieres?: number;
  nombre_etudiants?: number;
}

export interface FaculteCreate {
  nom: string;
  code: string;
  description?: string;
  logo?: File | string;
  is_active?: boolean;
}

export interface FaculteUpdate {
  nom?: string;
  code?: string;
  description?: string;
  logo?: File | string;
  is_active?: boolean;
}

export interface FaculteStats {
  id: number;
  nom: string;
  nombre_departements: number;
  nombre_filieres: number;
  nombre_etudiants: number;
  nombre_enseignants: number;
}

// ============== DÉPARTEMENT ==============

export interface Departement {
  id: number;
  nom: string;
  code: string;
  description?: string;
  faculte: number; // ID
  faculte_details?: Faculte;
  chef_departement?: number; // ID enseignant
  chef_details?: any; // À typer avec Enseignant
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations comptées
  nombre_filieres?: number;
  nombre_etudiants?: number;
}

export interface DepartementCreate {
  nom: string;
  code: string;
  description?: string;
  faculte: number;
  chef_departement?: number;
  is_active?: boolean;
}

export interface DepartementUpdate {
  nom?: string;
  code?: string;
  description?: string;
  faculte?: number;
  chef_departement?: number;
  is_active?: boolean;
}

// ============== FILIÈRE (Programme) ==============

export type NiveauFiliere = 'L1' | 'L2' | 'L3' | 'M1' | 'M2' | 'DOCTORAT';

export interface Filiere {
  id: number;
  nom: string;
  code: string;
  description?: string;
  faculte: number; // ID
  faculte_details?: Faculte;
  departement: number; // ID
  departement_details?: Departement;
  niveau: NiveauFiliere;
  duree_annees: number;
  capacite_max?: number;
  frais_inscription?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations comptées
  nombre_etudiants?: number;
  nombre_matieres?: number;
  effectif_actuel?: number;
}

export interface FiliereCreate {
  nom: string;
  code: string;
  description?: string;
  faculte: number;
  departement: number;
  niveau: NiveauFiliere;
  duree_annees: number;
  capacite_max?: number;
  frais_inscription?: number;
  is_active?: boolean;
}

export interface FiliereUpdate {
  nom?: string;
  code?: string;
  description?: string;
  faculte?: number;
  departement?: number;
  niveau?: NiveauFiliere;
  duree_annees?: number;
  capacite_max?: number;
  frais_inscription?: number;
  is_active?: boolean;
}

// ============== MATIÈRE ==============

export type TypeCours = 'CM' | 'TD' | 'TP';

export interface Matiere {
  id: number;
  nom: string;
  code: string;
  description?: string;
  filiere: number; // ID
  filiere_details?: Filiere;
  semestre: number; // 1-6 pour Licence, 1-4 pour Master
  coefficient: number;
  credits_ects: number;
  volume_horaire: number;
  type_cours: TypeCours;
  enseignant_responsable?: number; // ID
  enseignant_details?: any; // À typer avec Enseignant
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MatiereCreate {
  nom: string;
  code: string;
  description?: string;
  filiere: number;
  semestre: number;
  coefficient: number;
  credits_ects: number;
  volume_horaire: number;
  type_cours: TypeCours;
  enseignant_responsable?: number;
  is_active?: boolean;
}

export interface MatiereUpdate {
  nom?: string;
  code?: string;
  description?: string;
  filiere?: number;
  semestre?: number;
  coefficient?: number;
  credits_ects?: number;
  volume_horaire?: number;
  type_cours?: TypeCours;
  enseignant_responsable?: number;
  is_active?: boolean;
}

// ============== TYPES DE FILTRES ==============

export interface FaculteFilters {
  search?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface DepartementFilters {
  search?: string;
  faculte?: number;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface FiliereFilters {
  search?: string;
  faculte?: number;
  departement?: number;
  niveau?: NiveauFiliere;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface MatiereFilters {
  search?: string;
  filiere?: number;
  semestre?: number;
  type_cours?: TypeCours;
  enseignant_responsable?: number;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ============== TYPES POUR UI ==============

// Pour la vue hiérarchique (tree view)
export interface AcademicTreeNode {
  id: string;
  type: 'faculte' | 'departement' | 'filiere' | 'matiere';
  label: string;
  children?: AcademicTreeNode[];
  data?: Faculte | Departement | Filiere | Matiere;
  expanded?: boolean;
}

// Stats globales
export interface AcademicStats {
  total_facultes: number;
  total_departements: number;
  total_filieres: number;
  total_matieres: number;
  total_etudiants: number;
  total_enseignants: number;
}