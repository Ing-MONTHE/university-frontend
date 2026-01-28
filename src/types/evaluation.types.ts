/**
 * Types TypeScript pour le module Évaluations
 * Mapped depuis les modèles Django Backend
 */

import { Matiere } from './academic.types';
import { Etudiant, Enseignant } from './student.types';

// ============== STATUTS ==============

export type StatutResultat = 'ADMIS' | 'AJOURNÉ' | 'RATTRAPAGE';
export type Mention = 'EXCELLENT' | 'TRES_BIEN' | 'BIEN' | 'ASSEZ_BIEN' | 'PASSABLE' | 'INSUFFISANT';

// ============== TYPE D'ÉVALUATION ==============

export interface TypeEvaluation {
  id: number;
  nom: string; // "Devoir", "Examen", "TP", "Projet"
  code: string; // "DEV", "EX", "TP", "PRJ"
  description?: string;
  pourcentage_note_finale?: number; // Si défini
  created_at: string;
  updated_at: string;
}

export interface TypeEvaluationCreate {
  nom: string;
  code: string;
  description?: string;
  pourcentage_note_finale?: number;
}

// ============== ÉVALUATION ==============

export interface Evaluation {
  id: number;
  matiere: number; // ID
  matiere_details?: Matiere;
  type_evaluation: number; // ID
  type_evaluation_details?: TypeEvaluation;
  titre: string;
  description?: string;
  date_evaluation: string; // ISO date
  heure_debut?: string; // HH:MM
  heure_fin?: string; // HH:MM
  duree_minutes?: number;
  lieu?: string;
  bareme: number; // Note maximale (ex: 20, 100)
  coefficient: number;
  is_rattrapage: boolean;
  created_at: string;
  updated_at: string;
  
  // Stats calculées
  nombre_notes_saisies?: number;
  nombre_etudiants_total?: number;
  moyenne_classe?: number;
}

export interface EvaluationCreate {
  matiere: number;
  type_evaluation: number;
  titre: string;
  description?: string;
  date_evaluation: string;
  heure_debut?: string;
  heure_fin?: string;
  duree_minutes?: number;
  lieu?: string;
  bareme: number;
  coefficient: number;
  is_rattrapage?: boolean;
}

export interface EvaluationUpdate {
  matiere?: number;
  type_evaluation?: number;
  titre?: string;
  description?: string;
  date_evaluation?: string;
  heure_debut?: string;
  heure_fin?: string;
  duree_minutes?: number;
  lieu?: string;
  bareme?: number;
  coefficient?: number;
  is_rattrapage?: boolean;
}

// ============== NOTE ==============

export interface Note {
  id: number;
  evaluation: number; // ID
  evaluation_details?: Evaluation;
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  note?: number; // null si absent
  absent: boolean;
  justifie: boolean;
  remarque?: string;
  saisi_par?: number; // ID Enseignant
  date_saisie: string;
  created_at: string;
  updated_at: string;
  
  // Calculé
  note_sur_20?: number; // Convertie si barème différent
}

export interface NoteCreate {
  evaluation: number;
  etudiant: number;
  note?: number;
  absent?: boolean;
  justifie?: boolean;
  remarque?: string;
}

export interface NoteUpdate {
  note?: number;
  absent?: boolean;
  justifie?: boolean;
  remarque?: string;
}

// Pour saisie en lot
export interface NoteBulk {
  etudiant: number;
  note?: number;
  absent?: boolean;
  justifie?: boolean;
  remarque?: string;
}

export interface NoteBulkCreate {
  evaluation: number;
  notes: NoteBulk[];
}

// ============== RÉSULTAT ==============

export interface Resultat {
  id: number;
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  matiere: number; // ID
  matiere_details?: Matiere;
  annee_academique: number; // ID
  semestre: number;
  
  // Moyennes
  moyenne_controle_continu?: number;
  moyenne_examen?: number;
  moyenne_generale: number;
  
  // Crédits
  credits_obtenus: number;
  credits_possibles: number;
  
  // Statut
  statut: StatutResultat;
  mention?: Mention;
  
  // Métadonnées
  date_deliberation?: string;
  valide_par?: number; // ID Enseignant/Admin
  remarque?: string;
  created_at: string;
  updated_at: string;
}

export interface ResultatCreate {
  etudiant: number;
  matiere: number;
  annee_academique: number;
  semestre: number;
  moyenne_controle_continu?: number;
  moyenne_examen?: number;
  moyenne_generale: number;
  credits_obtenus: number;
  credits_possibles: number;
  statut: StatutResultat;
  mention?: Mention;
  remarque?: string;
}

export interface ResultatUpdate {
  moyenne_controle_continu?: number;
  moyenne_examen?: number;
  moyenne_generale?: number;
  credits_obtenus?: number;
  statut?: StatutResultat;
  mention?: Mention;
  remarque?: string;
}

// ============== DÉLIBÉRATION ==============

export interface SessionDeliberation {
  id: number;
  titre: string;
  annee_academique: number; // ID
  semestre: number;
  filiere: number; // ID
  filiere_details?: any;
  date_deliberation: string;
  lieu: string;
  statut: 'PLANIFIÉE' | 'EN_COURS' | 'TERMINÉE';
  president_jury?: number; // ID Enseignant
  observations?: string;
  created_at: string;
  updated_at: string;
  
  // Stats
  nombre_etudiants?: number;
  nombre_admis?: number;
  nombre_ajournes?: number;
  nombre_rattrapage?: number;
}

export interface SessionDeliberationCreate {
  titre: string;
  annee_academique: number;
  semestre: number;
  filiere: number;
  date_deliberation: string;
  lieu: string;
  statut?: 'PLANIFIÉE' | 'EN_COURS' | 'TERMINÉE';
  president_jury?: number;
  observations?: string;
}

export interface MembreJury {
  id: number;
  session_deliberation: number; // ID
  enseignant: number; // ID
  enseignant_details?: Enseignant;
  role: 'PRÉSIDENT' | 'MEMBRE' | 'SECRÉTAIRE';
  created_at: string;
}

export interface MembreJuryCreate {
  session_deliberation: number;
  enseignant: number;
  role: 'PRÉSIDENT' | 'MEMBRE' | 'SECRÉTAIRE';
}

export interface DecisionJury {
  id: number;
  session_deliberation: number; // ID
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  statut_final: StatutResultat;
  mention?: Mention;
  moyenne_generale: number;
  credits_obtenus: number;
  credits_totaux: number;
  remarques?: string;
  created_at: string;
  updated_at: string;
}

export interface DecisionJuryCreate {
  session_deliberation: number;
  etudiant: number;
  statut_final: StatutResultat;
  mention?: Mention;
  moyenne_generale: number;
  credits_obtenus: number;
  credits_totaux: number;
  remarques?: string;
}

// ============== TYPES DE FILTRES ==============

export interface EvaluationFilters {
  search?: string;
  matiere?: number;
  type_evaluation?: number;
  date_debut?: string;
  date_fin?: string;
  is_rattrapage?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface NoteFilters {
  evaluation?: number;
  etudiant?: number;
  absent?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface ResultatFilters {
  etudiant?: number;
  matiere?: number;
  annee_academique?: number;
  semestre?: number;
  statut?: StatutResultat;
  mention?: Mention;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface SessionDeliberationFilters {
  annee_academique?: number;
  semestre?: number;
  filiere?: number;
  statut?: 'PLANIFIÉE' | 'EN_COURS' | 'TERMINÉE';
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ============== TYPES POUR UI ==============

// Bulletin de notes
export interface BulletinNote {
  matiere: Matiere;
  notes: Note[];
  moyenne_matiere: number;
  coefficient: number;
  credits: number;
  statut: StatutResultat;
}

export interface Bulletin {
  etudiant: Etudiant;
  annee_academique: any;
  semestre: number;
  notes_par_matiere: BulletinNote[];
  moyenne_generale: number;
  credits_obtenus: number;
  credits_totaux: number;
  statut_final: StatutResultat;
  mention?: Mention;
  rang?: number;
  effectif?: number;
}

// Relevé de notes (multi-semestres)
export interface ReleveNotes {
  etudiant: Etudiant;
  bulletins: Bulletin[];
  moyenne_cumulative: number;
  credits_cumules: number;
  credits_totaux_cursus: number;
}

// Stats évaluations
export interface EvaluationStats {
  total_evaluations: number;
  evaluations_a_venir: number;
  evaluations_passees: number;
  notes_en_attente: number;
  moyenne_generale_classe: number;
  taux_reussite: number;
}
