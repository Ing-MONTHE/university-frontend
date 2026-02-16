// Types TypeScript pour le module Enseignants

export type GradeEnseignant = 'ASSISTANT' | 'MC' | 'PROFESSEUR';

export type StatutEnseignant = 'ACTIF' | 'INACTIF' | 'EN_CONGE' | 'RETIRE';

export interface Departement {
  id: number;
  code: string;
  nom: string;
}

export interface Matiere {
  id: number;
  code: string;
  nom: string;
  credits: number;
  filiere?: {
    id: number;
    nom: string;
  };
}

export interface Attribution {
  id: number;
  matiere: number;
  matiere_details: Matiere;
  annee_academique: number;
  annee_academique_details: {
    id: number;
    annee: string;
    libelle: string;
  };
  type_enseignement: 'CM' | 'TD' | 'TP';
  type_enseignement_display: string;
  volume_horaire_assigne: number;
  created_at: string;
  updated_at: string;
}

export interface Enseignant {
  id: number;
  matricule: string; // Auto-généré (ex: ENS-2024-001)
  
  // Informations de base
  nom: string;
  prenom: string;
  email: string; // Alias pour email_personnel
  
  // Informations personnelles
  sexe: 'M' | 'F';
  sexe_display?: string;
  date_naissance: string; // ISO date
  nationalite: string;
  
  // Contact
  telephone: string;
  email_personnel: string;
  adresse?: string;
  
  // Photo
  photo?: string; // URL
  photo_url?: string; // URL complète
  
  // Académique
  grade: GradeEnseignant;
  grade_display?: string;
  specialite: string;
  departement: number;
  departement_nom?: string;
  departement_details?: Departement;
  date_embauche: string; // ISO date
  statut: StatutEnseignant;
  statut_display?: string;
  
  // Documents
  cv?: string; // URL
  cv_url?: string; // URL complète
  
  // Calculés
  nb_matieres?: number;
  charge_horaire?: number; // heures/semaine
  nb_etudiants?: number;
  
  // Métadonnées
  created_at: string;
  updated_at: string;
}

export interface EnseignantCreate {
  // Informations personnelles
  nom: string;
  prenom: string;
  sexe: 'M' | 'F';
  date_naissance: string;
  nationalite: string;
  
  // Contact
  telephone: string;
  email: string;
  adresse?: string;
  
  // Photo (fichier)
  photo?: File;
  
  // Académique
  grade: GradeEnseignant;
  specialite: string;
  departement_id: number;
  date_embauche: string;
  statut?: StatutEnseignant;
  
  // Documents
  cv?: File;
}

export interface EnseignantUpdate {
  // Données modifiables
  date_naissance?: string;
  sexe?: 'M' | 'F';
  nationalite?: string;
  telephone?: string;
  email_personnel?: string;
  adresse?: string;
  
  // Académique
  grade?: GradeEnseignant;
  specialite?: string;
  departement_id?: number;
  date_embauche?: string;
  statut?: StatutEnseignant;
}

export interface EnseignantFilters {
  search?: string;
  sexe?: 'M' | 'F';
  grade?: GradeEnseignant;
  departement?: number;
  statut?: StatutEnseignant;
  page?: number;
  page_size?: number;
}

export interface EnseignantStats {
  total: number;
  par_statut: {
    actifs: number;
    en_conge: number;
    retires: number;
  };
  par_sexe: {
    masculin: number;
    feminin: number;
  };
  par_grade: Array<{
    grade: GradeEnseignant;
    count: number;
  }>;
  top_departements: Array<{
    departement__nom: string;
    departement__code: string;
    count: number;
  }>;
}

export interface ChargeHoraire {
  enseignant: string;
  annee_academique: string;
  charge_horaire: {
    cm: number;
    td: number;
    tp: number;
    total: number;
  };
  nombre_matieres: number;
}

// ============= ATTRIBUTION =============
export interface Attribution {
  id: number;
  enseignant: number;
  enseignant_details?: Enseignant;
  matiere: number;
  matiere_details?: {
    id: number;
    code: string;
    nom: string;
    credits?: number;
    coefficient?: number;
  };
  annee_academique: number;
  annee_academique_details?: {
    id: number;
    annee: string;
    statut: string;
  };
  type_enseignement: 'CM' | 'TD' | 'TP';
  type_enseignement_display?: string;
  volume_horaire_assigne: number;
  created_at: string;
  updated_at: string;
}

export interface AttributionCreate {
  enseignant_id: number;
  matiere_id: number;
  annee_academique_id: number;
  type_enseignement: 'CM' | 'TD' | 'TP';
  volume_horaire_assigne: number;
}

export interface AttributionUpdate {
  type_enseignement?: 'CM' | 'TD' | 'TP';
  volume_horaire_assigne?: number;
}

export interface AttributionFilters {
  page?: number;
  page_size?: number;
  enseignant?: number;
  matiere?: number;
  annee_academique?: number;
  type_enseignement?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}