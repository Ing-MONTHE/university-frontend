/**
 * Types pour le module de gestion des présences
 */

// Statuts des feuilles de présence
export type StatutFeuille = 'OUVERTE' | 'FERMEE' | 'ANNULEE';

// Statuts de présence
export type StatutPresence = 'PRESENT' | 'ABSENT' | 'RETARD';

// Types de justificatifs
export type TypeJustificatif = 'MEDICAL' | 'ADMINISTRATIF' | 'FAMILIAL' | 'AUTRE';

// Statuts de validation des justificatifs
export type StatutValidation = 'EN_ATTENTE' | 'VALIDE' | 'REJETE';

/**
 * Interface pour une feuille de présence
 */
export interface FeuillePresence {
  id: number;
  cours: number;
  cours_nom: string;
  enseignant_nom: string;
  filiere_nom: string;
  date_cours: string;
  heure_debut: string;
  heure_fin: string;
  statut: StatutFeuille;
  nombre_presents: number;
  nombre_absents: number;
  nombre_retards: number;
  taux_presence: number;
  observations?: string;
  created_at: string;
  updated_at?: string;
}

/**
 * Interface pour une présence individuelle
 */
export interface Presence {
  id: number;
  feuille_presence: number;
  etudiant: number;
  etudiant_nom: string;
  etudiant_matricule: string;
  statut: StatutPresence;
  heure_arrivee?: string;
  absence_justifiee: boolean;
  remarque?: string;
  minutes_retard: number;
  created_at: string;
  updated_at?: string;
}

/**
 * Interface pour un justificatif d'absence
 */
export interface JustificatifAbsence {
  id: number;
  etudiant: number;
  etudiant_nom: string;
  etudiant_matricule: string;
  date_debut: string;
  date_fin: string;
  duree_jours: number;
  type_justificatif: TypeJustificatif;
  statut: StatutValidation;
  document: string;
  document_url?: string;
  motif: string;
  commentaire_validation?: string;
  date_soumission: string;
  date_traitement?: string;
  created_at: string;
  updated_at?: string;
}

/**
 * DTO pour créer une feuille de présence
 */
export interface CreateFeuillePresenceDTO {
  cours: number;
  date_cours: string;
  heure_debut: string;
  heure_fin: string;
  observations?: string;
}

/**
 * DTO pour marquer les présences en masse
 */
export interface MarquerPresencesDTO {
  presences: {
    etudiant_id: number;
    statut: StatutPresence;
    heure_arrivee?: string;
    remarque?: string;
  }[];
}

/**
 * DTO pour créer un justificatif
 */
export interface CreateJustificatifDTO {
  etudiant: number;
  date_debut: string;
  date_fin: string;
  type_justificatif: TypeJustificatif;
  document: File;
  motif: string;
}

/**
 * Interface pour les statistiques de présence d'un étudiant
 */
export interface TauxPresenceEtudiant {
  etudiant_id: number;
  etudiant_nom: string;
  etudiant_matricule: string;
  total_seances: number;
  presences: number;
  absences: number;
  retards: number;
  absences_justifiees: number;
  taux_presence: number;
  taux_assiduite: number;
  presences_par_matiere: {
    matiere: string;
    matiere_id: number;
    total: number;
    presents: number;
    absents: number;
    retards: number;
    taux: number;
  }[];
}

/**
 * Interface pour les statistiques globales
 */
export interface StatistiquesPresences {
  total_feuilles: number;
  feuilles_ouvertes: number;
  feuilles_fermees: number;
  taux_presence_moyen: number;
  top_etudiants_assidus: {
    etudiant_id: number;
    etudiant_nom: string;
    taux_presence: number;
  }[];
  bottom_etudiants_assidus: {
    etudiant_id: number;
    etudiant_nom: string;
    taux_presence: number;
  }[];
  alertes_absences: {
    etudiant_id: number;
    etudiant_nom: string;
    nombre_absences_consecutives: number;
  }[];
  repartition_par_filiere: {
    filiere: string;
    taux_moyen: number;
  }[];
}

/**
 * Filtres pour la liste des feuilles de présence
 */
export interface FeuillePresenceFilters {
  cours?: number;
  date_cours?: string;
  statut?: StatutFeuille;
  date_debut?: string;
  date_fin?: string;
  filiere?: number;
  enseignant?: number;
  search?: string;
}

/**
 * Filtres pour la liste des justificatifs
 */
export interface JustificatifFilters {
  etudiant?: number;
  statut?: StatutValidation;
  type?: TypeJustificatif;
  search?: string;
}

/**
 * Options pour le composant de sélection de statut
 */
export const STATUT_PRESENCE_OPTIONS = [
  { value: 'PRESENT', label: 'Présent', color: 'green' },
  { value: 'ABSENT', label: 'Absent', color: 'red' },
  { value: 'RETARD', label: 'En retard', color: 'orange' },
] as const;

export const STATUT_FEUILLE_OPTIONS = [
  { value: 'OUVERTE', label: 'Ouverte', color: 'blue' },
  { value: 'FERMEE', label: 'Fermée', color: 'gray' },
  { value: 'ANNULEE', label: 'Annulée', color: 'red' },
] as const;

export const STATUT_VALIDATION_OPTIONS = [
  { value: 'EN_ATTENTE', label: 'En attente', color: 'yellow' },
  { value: 'VALIDE', label: 'Validé', color: 'green' },
  { value: 'REJETE', label: 'Rejeté', color: 'red' },
] as const;

export const TYPE_JUSTIFICATIF_OPTIONS = [
  { value: 'MEDICAL', label: 'Certificat médical' },
  { value: 'ADMINISTRATIF', label: 'Document administratif' },
  { value: 'FAMILIAL', label: 'Événement familial' },
  { value: 'AUTRE', label: 'Autre' },
] as const;