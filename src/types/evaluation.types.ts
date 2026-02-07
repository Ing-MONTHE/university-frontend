/**
 * Types TypeScript pour le module Évaluations
 * VERSION CORRIGÉE - Sans erreurs de types en double
 */

// ============ ENUMS & TYPES ============

export type TypeEvaluationCode = 'DEVOIR' | 'EXAMEN' | 'RATTRAPAGE' | 'TD' | 'TP' | 'PROJET';

export type DecisionType = 'ADMIS' | 'ADMIS_RESERVE' | 'AJOURNE' | 'REDOUBLEMENT' | 'EXCLUSION';

export type MentionType = 'EXCELLENT' | 'TRES_BIEN' | 'BIEN' | 'ASSEZ_BIEN' | 'PASSABLE' | '';

export type StatutResultat = 'ADMIS' | 'AJOURNE' | 'RATTRAPAGE';

// ============ INTERFACES PRINCIPALES ============

export interface TypeEvaluation {
  id: number;
  code: TypeEvaluationCode;
  nom: string;
  coefficient_min: number;
  coefficient_max: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: number;
  titre: string;
  type_evaluation: number;
  type_evaluation_details?: TypeEvaluation;
  matiere: number;
  matiere_details?: {
    id: number;
    code: string;
    nom: string;
    coefficient: number;
    credits: number;
    filiere?: {
      id: number;
      code: string;
      nom: string;
    };
  };
  annee_academique: number;
  annee_academique_details?: {
    id: number;
    annee: string;
    libelle: string;
  };
  date: string;
  coefficient: number;
  note_totale: number;
  duree?: number;
  description?: string;
  created_at: string;
  updated_at: string;
  nb_notes_saisies?: number;
  nb_etudiants_total?: number;
  moyenne_classe?: number;
}

export interface Note {
  id: number;
  evaluation: number;
  etudiant: number;
  etudiant_details?: {
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
    photo_url?: string;
  };
  note_obtenue?: number;
  note_sur: number;
  appreciations?: string;
  absence: boolean;
  date_saisie: string;
  created_at: string;
  updated_at: string;
}

export interface NoteInput {
  etudiant_id: number;
  note_obtenue?: number;
  absence: boolean;
}

export interface SaisieNotesLotPayload {
  notes: NoteInput[];
}

export interface SaisieNotesLotResponse {
  success: boolean;
  created: number;
  updated: number;
  total_processed: number;
  errors: Array<{
    etudiant_id?: number;
    error: string;
  }>;
}

export interface EvaluationStats {
  moyenne_classe: number;
  note_min: number;
  note_max: number;
  nb_notes: number;
  nb_absents: number;
  nb_total: number;
  nb_reussis: number;
  taux_reussite: number;
  distribution: {
    excellent: number;
    tres_bien: number;
    bien: number;
    assez_bien: number;
    passable: number;
    insuffisant: number;
  };
  bareme: number;
}

export interface Resultat {
  id: number;
  etudiant: number;
  matiere: number;
  annee_academique: number;
  moyenne_generale: number;
  rang?: number;
  statut: StatutResultat;
  mention?: MentionType;
  created_at: string;
  updated_at: string;
}

export interface CalculerMoyennePayload {
  etudiant_id: number;
  matiere_id: number;
  annee_academique_id: number;
}

export interface CalculerMoyenneResponse {
  success: boolean;
  moyenne: number;
  matiere_id: number;
  matiere_nom: string;
  etudiant_id: number;
  nb_evaluations: number;
  evaluations: Array<{
    evaluation: string;
    note: number;
    bareme: number;
    note_sur_20: number;
    coefficient: number;
  }>;
  created: boolean;
}

export interface BulletinEtudiant {
  etudiant: {
    id: number;
    matricule: string;
    nom_complet: string;
    photo_url?: string;
    filiere: string;
    code_filiere: string;
    niveau: number;
  };
  annee_academique: {
    id: number;
    libelle: string;
    annee: string;
  };
  matieres: Array<{
    matiere_code: string;
    matiere_nom: string;
    notes: Array<{
      evaluation: string;
      type: string;
      note: number;
      bareme: number;
      note_sur_20: number;
      coefficient: number;
      date: string;
    }>;
    moyenne: number | null;
    coefficient: number;
    credits_ects: number;
    acquis: boolean;
  }>;
  moyenne_generale: number;
  total_credits: number;
  credits_obtenus: number;
  decision: DecisionType;
  mention: MentionType | null;
  nb_matieres: number;
  nb_matieres_acquises: number;
}

export interface SessionDeliberation {
  id: number;
  annee_academique: number;
  annee_academique_details?: {
    id: number;
    annee: string;
    libelle: string;
  };
  filiere: number;
  filiere_details?: {
    id: number;
    code: string;
    nom: string;
  };
  niveau: number;
  semestre: 1 | 2;
  date_deliberation: string;
  lieu: string;
  president_jury: string;
  statut: 'PREVUE' | 'EN_COURS' | 'TERMINEE' | 'VALIDEE';
  proces_verbal?: string;
  created_at: string;
  updated_at: string;
}

export interface DecisionJuryItem {
  id: number;
  session: number;
  etudiant: number;
  etudiant_details?: {
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
    photo_url?: string;
  };
  moyenne_generale: number;
  total_credits_obtenus: number;
  total_credits_requis: number;
  decision: DecisionType;
  mention?: MentionType;
  rang_classe?: number;
  observations?: string;
  created_at: string;
  updated_at: string;
}

export interface GenererDecisionsResponse {
  success: boolean;
  message: string;
  session_id: number;
  decisions_creees: number;
  decisions_mises_a_jour: number;
  total: number;
  erreurs: Array<{
    etudiant_id: number;
    matricule: string;
    error: string;
  }>;
}

export interface StatistiquesSession {
  session: {
    id: number;
    filiere: string;
    niveau: number;
    annee_academique: string;
  };
  statistiques: {
    total_etudiants: number;
    admis: number;
    admis_reserve: number;
    ajourne: number;
    redoublement: number;
    exclusion: number;
    taux_reussite: number;
  };
  mentions: {
    excellent: number;
    tres_bien: number;
    bien: number;
    assez_bien: number;
    passable: number;
  };
  moyenne_promotion: number;
}

// ============ FILTERS ============

export interface EvaluationFilters {
  page?: number;
  page_size?: number;
  search?: string;
  matiere?: number;
  type_evaluation?: number;
  annee_academique?: number;
  date?: string;
  date_min?: string;
  date_max?: string;
}

export interface NoteFilters {
  page?: number;
  page_size?: number;
  evaluation?: number;
  etudiant?: number;
  absence?: boolean;
}

export interface ResultatFilters {
  page?: number;
  page_size?: number;
  etudiant?: number;
  matiere?: number;
  annee_academique?: number;
  statut?: StatutResultat;
}

export interface SessionFilters {
  page?: number;
  page_size?: number;
  annee_academique?: number;
  filiere?: number;
  niveau?: number;
  semestre?: number;
  statut?: string;
}

export interface SessionFormData {
  annee_academique: number;
  filiere: number;
  niveau: number;
  semestre: number;
  date_deliberation: string;
  lieu: string;
  president_jury: string;
  statut?: string;
}

export interface SessionUpdateData {
  date_deliberation?: string;
  lieu?: string;
  president_jury?: string;
  statut?: string;
  proces_verbal?: string;
}

export interface DecisionUpdateData {
  decision?: DecisionType;
  observations?: string;
  session?: number;
}

export interface SaisieMultipleNoteItem {
  etudiant_id: number;
  note_obtenue?: number;
  absence?: boolean;
  appreciations?: string;
}

// ============ FORM DATA ============

export interface EvaluationFormData {
  titre: string;
  type_evaluation: number;
  matiere: number;
  annee_academique: number;
  date: string;
  coefficient: number;
  note_totale: number;
  duree?: number;
  description?: string;
}

export interface NoteFormData {
  evaluation: number;
  etudiant: number;
  note_obtenue?: number;
  absence: boolean;
  appreciations?: string;
}