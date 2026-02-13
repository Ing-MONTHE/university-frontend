/**
 * Types TypeScript pour le module Évaluations & Délibérations
 * Mapped depuis les modèles Django Backend
 */

import type { PaginatedResponse } from './academic.types';

// ============== TYPE D'ÉVALUATION ==============

export interface TypeEvaluation {
  id: number;
  nom: string; // Ex: "Devoir", "Examen", "TP", "Projet"
  code: string; // Ex: "DEV", "EXAM", "TP", "PROJ"
  coefficient_min: number; // Ex: 1
  coefficient_max: number; // Ex: 4
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TypeEvaluationCreate {
  nom: string;
  code: string;
  coefficient_min: number;
  coefficient_max: number;
  description?: string;
}

export interface TypeEvaluationUpdate {
  nom?: string;
  code?: string;
  coefficient_min?: number;
  coefficient_max?: number;
  description?: string;
}

// ============== ÉVALUATION ==============

export type StatutEvaluation = 'EN_COURS' | 'TERMINEE' | 'PUBLIEE';

export const STATUT_EVALUATION_CHOICES: { value: StatutEvaluation; label: string; color: string }[] = [
  { value: 'EN_COURS', label: 'En cours', color: 'warning' },
  { value: 'TERMINEE', label: 'Terminée', color: 'info' },
  { value: 'PUBLIEE', label: 'Publiée', color: 'success' },
];

export interface Evaluation {
  id: number;
  matiere: number; // ID de la matière
  matiere_details?: {
    id: number;
    code: string;
    nom: string;
    coefficient: number;
    credits: number;
  };
  type_evaluation: number; // ID du type
  type_evaluation_details?: TypeEvaluation;
  titre: string;
  date_evaluation: string; // ISO date
  bareme: number; // Ex: 20, 10, 100
  coefficient: number;
  enseignant?: number; // ID enseignant
  enseignant_details?: {
    id: number;
    nom: string;
    prenom: string;
    matricule: string;
  };
  statut: StatutEvaluation;
  statut_display?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  
  // Champs calculés
  notes_saisies?: number; // Nombre de notes saisies
  total_etudiants?: number; // Nombre total d'étudiants
  progression?: number; // Pourcentage (0-100)
}

export interface EvaluationCreate {
  matiere_id: number;
  type_evaluation_id: number;
  titre: string;
  date_evaluation: string;
  bareme: number;
  coefficient: number;
  enseignant_id?: number;
  statut?: StatutEvaluation;
  description?: string;
}

export interface EvaluationUpdate {
  matiere_id?: number;
  type_evaluation_id?: number;
  titre?: string;
  date_evaluation?: string;
  bareme?: number;
  coefficient?: number;
  enseignant_id?: number;
  statut?: StatutEvaluation;
  description?: string;
}

// ============== NOTE ==============

export interface Note {
  id: number;
  evaluation: number; // ID évaluation
  evaluation_details?: Evaluation;
  etudiant: number; // ID étudiant
  etudiant_details?: {
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
    photo?: string;
  };
  note?: number; // null si absent
  est_absent: boolean;
  note_sur_20?: number; // Calculé automatiquement
  remarque?: string;
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  evaluation_id: number;
  etudiant_id: number;
  note?: number;
  est_absent?: boolean;
  remarque?: string;
}

export interface NoteUpdate {
  note?: number;
  est_absent?: boolean;
  remarque?: string;
}

export interface NoteSaisieLot {
  evaluation_id: number;
  notes: {
    etudiant_id: number;
    note?: number;
    est_absent?: boolean;
    remarque?: string;
  }[];
}

// ============== BULLETIN ==============

export interface BulletinMatiere {
  matiere_id: number;
  matiere_code: string;
  matiere_nom: string;
  coefficient: number;
  credits: number;
  evaluations: {
    evaluation_id: number;
    titre: string;
    note?: number;
    note_sur_20?: number;
    est_absent: boolean;
  }[];
  moyenne?: number; // Moyenne pondérée de la matière
  credits_obtenus?: number;
}

export interface Bulletin {
  etudiant_id: number;
  etudiant_matricule: string;
  etudiant_nom: string;
  etudiant_prenom: string;
  filiere_nom: string;
  niveau: string;
  semestre: number;
  annee_academique: string;
  matieres: BulletinMatiere[];
  moyenne_generale?: number;
  total_credits_obtenus?: number;
  total_credits_possibles?: number;
  mention?: string;
  decision?: string;
  date_edition: string;
}

// ============== RÉSULTATS ==============

export interface ResultatEtudiant {
  etudiant_id: number;
  matricule: string;
  nom: string;
  prenom: string;
  photo?: string;
  moyenne_generale: number;
  credits_obtenus: number;
  credits_total: number;
  rang: number;
  mention: string;
  decision: string;
}

export interface ResultatsFiliere {
  filiere_id: number;
  filiere_nom: string;
  niveau: string;
  semestre: number;
  annee_academique: string;
  etudiants: ResultatEtudiant[];
  statistiques: {
    moyenne_classe: number;
    taux_reussite: number;
    total_etudiants: number;
    admis: number;
    ajournes: number;
    repartition_mentions: {
      excellent: number;
      tres_bien: number;
      bien: number;
      assez_bien: number;
      passable: number;
    };
  };
}

// ============== SESSION DÉLIBÉRATION ==============

export type StatutSession = 'BROUILLON' | 'VALIDEE' | 'CLOTUREE';
export type DecisionJury = 'ADMIS' | 'AJOURNE' | 'RATTRAPAGE' | 'REDOUBLEMENT';

export const STATUT_SESSION_CHOICES: { value: StatutSession; label: string; color: string }[] = [
  { value: 'BROUILLON', label: 'Brouillon', color: 'gray' },
  { value: 'VALIDEE', label: 'Validée', color: 'info' },
  { value: 'CLOTUREE', label: 'Clôturée', color: 'success' },
];

export const DECISION_JURY_CHOICES: { value: DecisionJury; label: string; color: string }[] = [
  { value: 'ADMIS', label: 'Admis', color: 'success' },
  { value: 'AJOURNE', label: 'Ajourné', color: 'error' },
  { value: 'RATTRAPAGE', label: 'Rattrapage', color: 'warning' },
  { value: 'REDOUBLEMENT', label: 'Redoublement', color: 'error' },
];

export const MENTION_CHOICES: { value: string; label: string; min: number; color: string }[] = [
  { value: 'EXCELLENT', label: 'Excellent', min: 16, color: 'purple' },
  { value: 'TRES_BIEN', label: 'Très Bien', min: 14, color: 'success' },
  { value: 'BIEN', label: 'Bien', min: 12, color: 'info' },
  { value: 'ASSEZ_BIEN', label: 'Assez Bien', min: 10, color: 'warning' },
  { value: 'PASSABLE', label: 'Passable', min: 0, color: 'error' },
];

export interface MembreJury {
  id: number;
  session: number;
  enseignant: number;
  enseignant_details?: {
    id: number;
    nom: string;
    prenom: string;
    grade?: string;
  };
  role: 'PRESIDENT' | 'RAPPORTEUR' | 'MEMBRE';
  role_display?: string;
}

export interface DecisionJuryItem {
  id: number;
  session: number;
  etudiant: number;
  etudiant_details?: {
    matricule: string;
    nom: string;
    prenom: string;
  };
  moyenne_generale: number;
  credits_obtenus: number;
  decision: DecisionJury;
  decision_display?: string;
  mention?: string;
  mention_display?: string;
  commentaire?: string;
  date_decision: string;
}

export interface SessionDeliberation {
  id: number;
  filiere: number;
  filiere_details?: {
    id: number;
    nom: string;
    code: string;
  };
  niveau: string;
  semestre: number;
  annee_academique: number;
  annee_academique_details?: {
    id: number;
    code: string;
  };
  date_session: string;
  statut: StatutSession;
  statut_display?: string;
  membres_jury?: MembreJury[];
  decisions?: DecisionJuryItem[];
  pv_deliberation?: string; // URL du PV PDF
  created_at: string;
  updated_at: string;
  
  // Champs calculés
  total_etudiants?: number;
  etudiants_traites?: number;
}

export interface SessionDeliberationCreate {
  filiere_id: number;
  niveau: string;
  semestre: number;
  annee_academique_id: number;
  date_session: string;
  statut?: StatutSession;
  membres_jury?: {
    enseignant_id: number;
    role: 'PRESIDENT' | 'RAPPORTEUR' | 'MEMBRE';
  }[];
}

export interface SessionDeliberationUpdate {
  filiere_id?: number;
  niveau?: string;
  semestre?: number;
  annee_academique_id?: number;
  date_session?: string;
  statut?: StatutSession;
}

export interface DecisionJuryUpdate {
  decision?: DecisionJury;
  mention?: string;
  commentaire?: string;
}

// ============== STATS ÉVALUATION ==============

export interface StatsEvaluation {
  evaluation_id: number;
  total_etudiants: number;
  notes_saisies: number;
  absents: number;
  moyenne_classe?: number;
  note_min?: number;
  note_max?: number;
  taux_saisie: number; // Pourcentage
}

// ============== ÉVOLUTION NOTES ÉTUDIANT ==============

export interface EvolutionNotes {
  etudiant_id: number;
  matiere_id: number;
  matiere_nom: string;
  evaluations: {
    date: string;
    titre: string;
    note: number;
    note_sur_20: number;
  }[];
}

// ============== TYPES DE FILTRES ==============

export interface TypeEvaluationFilters {
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface EvaluationFilters {
  search?: string;
  matiere?: number;
  type_evaluation?: number;
  enseignant?: number;
  statut?: StatutEvaluation;
  date_debut?: string;
  date_fin?: string;
  filiere?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface NoteFilters {
  evaluation?: number;
  etudiant?: number;
  est_absent?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface SessionDeliberationFilters {
  search?: string;
  filiere?: number;
  annee_academique?: number;
  semestre?: number;
  statut?: StatutSession;
  date_debut?: string;
  date_fin?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ============== TYPES POUR RÉPONSES API ==============

export type PaginatedTypesEvaluation = PaginatedResponse<TypeEvaluation>;
export type PaginatedEvaluations = PaginatedResponse<Evaluation>;
export type PaginatedNotes = PaginatedResponse<Note>;
export type PaginatedSessionsDeliberation = PaginatedResponse<SessionDeliberation>;