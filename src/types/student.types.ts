/**
 * Types TypeScript pour le module Étudiants et Enseignants
 * Mapped depuis les modèles Django Backend
 */

import { User } from './auth.types';
import { Filiere, Matiere } from './academic.types';

// ============== STATUTS ==============

export type StatutEtudiant = 'ACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'EXPELLED';
export type StatutInscription = 'PENDING' | 'VALIDATED' | 'REJECTED' | 'CANCELLED';
export type GradeEnseignant = 'ASSISTANT' | 'MAITRE_ASSISTANT' | 'MAITRE_CONFERENCES' | 'PROFESSEUR';

// ============== ÉTUDIANT ==============

export interface Etudiant {
  id: number;
  user: number; // ID User
  user_details?: User;
  matricule: string; // Auto-généré ETUYYYY###
  photo?: string;
  date_naissance: string; // ISO date
  lieu_naissance: string;
  sexe: 'M' | 'F';
  nationalite: string;
  telephone: string;
  adresse?: string;
  
  // Informations académiques
  filiere: number; // ID
  filiere_details?: Filiere;
  niveau_actuel: string; // L1, L2, L3, M1, M2
  annee_admission: number;
  
  // Contacts d'urgence
  contact_urgence_nom?: string;
  contact_urgence_telephone?: string;
  contact_urgence_relation?: string;
  
  // Statut
  status: StatutEtudiant;
  
  // Métadonnées
  created_at: string;
  updated_at: string;
  
  // Stats calculées (optionnel)
  moyenne_generale?: number;
  credits_obtenus?: number;
  total_paiements?: number;
  solde_restant?: number;
}

export interface EtudiantCreate {
  // User fields
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  
  // Etudiant fields
  photo?: File | string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: 'M' | 'F';
  nationalite: string;
  telephone: string;
  adresse?: string;
  filiere: number;
  niveau_actuel: string;
  annee_admission?: number;
  contact_urgence_nom?: string;
  contact_urgence_telephone?: string;
  contact_urgence_relation?: string;
  status?: StatutEtudiant;
}

export interface EtudiantUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  photo?: File | string;
  date_naissance?: string;
  lieu_naissance?: string;
  sexe?: 'M' | 'F';
  nationalite?: string;
  telephone?: string;
  adresse?: string;
  filiere?: number;
  niveau_actuel?: string;
  contact_urgence_nom?: string;
  contact_urgence_telephone?: string;
  contact_urgence_relation?: string;
  status?: StatutEtudiant;
}

export interface EtudiantStats {
  total: number;
  actifs: number;
  suspendus: number;
  diplomes: number;
  nouveaux_ce_mois: number;
  par_niveau: Record<string, number>;
  par_filiere: Record<string, number>;
  par_sexe: Record<string, number>;
}

// ============== ENSEIGNANT ==============

export interface Enseignant {
  id: number;
  user: number; // ID User
  user_details?: User;
  matricule: string; // Auto-généré ENSYYYY###
  photo?: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: 'M' | 'F';
  nationalite: string;
  telephone: string;
  adresse?: string;
  
  // Informations professionnelles
  grade: GradeEnseignant;
  specialite: string;
  diplome_superieur: string;
  annee_recrutement: number;
  departement?: number; // ID
  
  // CV et documents
  cv?: string;
  
  // Statut
  is_active: boolean;
  
  // Métadonnées
  created_at: string;
  updated_at: string;
  
  // Stats calculées (optionnel)
  charge_horaire?: number;
  nombre_matieres?: number;
  nombre_etudiants?: number;
}

export interface EnseignantCreate {
  // User fields
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  
  // Enseignant fields
  photo?: File | string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: 'M' | 'F';
  nationalite: string;
  telephone: string;
  adresse?: string;
  grade: GradeEnseignant;
  specialite: string;
  diplome_superieur: string;
  annee_recrutement?: number;
  departement?: number;
  cv?: File | string;
  is_active?: boolean;
}

export interface EnseignantUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  photo?: File | string;
  date_naissance?: string;
  lieu_naissance?: string;
  sexe?: 'M' | 'F';
  nationalite?: string;
  telephone?: string;
  adresse?: string;
  grade?: GradeEnseignant;
  specialite?: string;
  diplome_superieur?: string;
  annee_recrutement?: number;
  departement?: number;
  cv?: File | string;
  is_active?: boolean;
}

export interface EnseignantStats {
  total: number;
  actifs: number;
  par_grade: Record<GradeEnseignant, number>;
  par_departement: Record<string, number>;
  charge_horaire_moyenne: number;
}

// ============== INSCRIPTION ==============

export interface Inscription {
  id: number;
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  filiere: number; // ID
  filiere_details?: Filiere;
  annee_academique: number; // ID
  niveau: string; // L1, L2, etc.
  date_inscription: string;
  montant_frais: number;
  montant_paye: number;
  statut: StatutInscription;
  documents_fournis: boolean;
  remarques?: string;
  created_at: string;
  updated_at: string;
  
  // Calculé
  solde_restant?: number;
}

export interface InscriptionCreate {
  etudiant: number;
  filiere: number;
  annee_academique: number;
  niveau: string;
  date_inscription?: string;
  montant_frais: number;
  montant_paye?: number;
  statut?: StatutInscription;
  documents_fournis?: boolean;
  remarques?: string;
}

export interface InscriptionUpdate {
  filiere?: number;
  niveau?: string;
  montant_paye?: number;
  statut?: StatutInscription;
  documents_fournis?: boolean;
  remarques?: string;
}

// ============== ATTRIBUTION (Enseignant → Matière) ==============

export interface Attribution {
  id: number;
  enseignant: number; // ID
  enseignant_details?: Enseignant;
  matiere: number; // ID
  matiere_details?: Matiere;
  annee_academique: number; // ID
  volume_horaire_attribue: number;
  type_intervention: 'CM' | 'TD' | 'TP';
  is_responsable: boolean; // Est-ce le responsable de la matière ?
  created_at: string;
  updated_at: string;
}

export interface AttributionCreate {
  enseignant: number;
  matiere: number;
  annee_academique: number;
  volume_horaire_attribue: number;
  type_intervention: 'CM' | 'TD' | 'TP';
  is_responsable?: boolean;
}

export interface AttributionUpdate {
  volume_horaire_attribue?: number;
  type_intervention?: 'CM' | 'TD' | 'TP';
  is_responsable?: boolean;
}

// ============== TYPES DE FILTRES ==============

export interface EtudiantFilters {
  search?: string;
  filiere?: number;
  niveau_actuel?: string;
  status?: StatutEtudiant;
  sexe?: 'M' | 'F';
  annee_admission?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface EnseignantFilters {
  search?: string;
  grade?: GradeEnseignant;
  departement?: number;
  specialite?: string;
  is_active?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface InscriptionFilters {
  etudiant?: number;
  filiere?: number;
  annee_academique?: number;
  niveau?: string;
  statut?: StatutInscription;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface AttributionFilters {
  enseignant?: number;
  matiere?: number;
  annee_academique?: number;
  type_intervention?: 'CM' | 'TD' | 'TP';
  is_responsable?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ============== TYPES POUR UI ==============

export interface EtudiantProfile {
  etudiant: Etudiant;
  inscriptions: Inscription[];
  notes: any[]; // À typer avec evaluation.types
  paiements: any[]; // À typer avec finance.types
  documents: any[]; // À typer avec document.types
}

export interface EnseignantProfile {
  enseignant: Enseignant;
  attributions: Attribution[];
  emploi_du_temps: any[]; // À typer avec schedule.types
  charge_horaire_totale: number;
}
