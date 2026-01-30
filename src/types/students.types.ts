/**
 * Types TypeScript pour le module Students
 * Mapped depuis les modèles Django Backend
 */

// ============== ÉTUDIANT ==============

export type StatutEtudiant = 'ACTIF' | 'INACTIF' | 'DIPLOME' | 'ABANDONNE' | 'SUSPENDU';

export const STATUT_ETUDIANT_CHOICES: { value: StatutEtudiant; label: string }[] = [
  { value: 'ACTIF', label: 'Actif' },
  { value: 'INACTIF', label: 'Inactif' },
  { value: 'DIPLOME', label: 'Diplômé' },
  { value: 'ABANDONNE', label: 'Abandonné' },
  { value: 'SUSPENDU', label: 'Suspendu' },
];

export type Genre = 'M' | 'F';

export const GENRE_CHOICES: { value: Genre; label: string }[] = [
  { value: 'M', label: 'Masculin' },
  { value: 'F', label: 'Féminin' },
];

export interface Etudiant {
  id: number;
  matricule: string; // Ex: "ETU2024001"
  nom: string;
  prenom: string;
  date_naissance: string; // ISO date
  lieu_naissance: string;
  genre: Genre;
  email: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  photo?: string; // URL
  
  // Relations
  filiere: number; // ID
  filiere_details?: {
    id: number;
    code: string;
    nom: string;
    cycle: string;
  };
  
  annee_admission: number; // Ex: 2024
  niveau_actuel: number; // Ex: 1, 2, 3 (L1, L2, L3)
  statut: StatutEtudiant;
  
  // Contact d'urgence
  contact_urgence_nom?: string;
  contact_urgence_telephone?: string;
  contact_urgence_relation?: string;
  
  // Informations complémentaires
  nationalite?: string;
  num_cni?: string; // Numéro CNI
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Champs calculés
  age?: number;
  nom_complet?: string;
  is_en_regle?: boolean; // Paiements à jour
}

export interface EtudiantCreate {
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  genre: Genre;
  email: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  
  filiere_id: number;
  annee_admission: number;
  niveau_actuel: number;
  statut?: StatutEtudiant;
  
  contact_urgence_nom?: string;
  contact_urgence_telephone?: string;
  contact_urgence_relation?: string;
  
  nationalite?: string;
  num_cni?: string;
}

export interface EtudiantUpdate {
  nom?: string;
  prenom?: string;
  date_naissance?: string;
  lieu_naissance?: string;
  genre?: Genre;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  
  filiere_id?: number;
  niveau_actuel?: number;
  statut?: StatutEtudiant;
  
  contact_urgence_nom?: string;
  contact_urgence_telephone?: string;
  contact_urgence_relation?: string;
  
  nationalite?: string;
  num_cni?: string;
}

// ============== ENSEIGNANT ==============

export type StatutEnseignant = 'ACTIF' | 'INACTIF' | 'CONGE' | 'RETRAITE';

export const STATUT_ENSEIGNANT_CHOICES: { value: StatutEnseignant; label: string }[] = [
  { value: 'ACTIF', label: 'Actif' },
  { value: 'INACTIF', label: 'Inactif' },
  { value: 'CONGE', label: 'En congé' },
  { value: 'RETRAITE', label: 'Retraité' },
];

export type GradeEnseignant = 'PROFESSEUR' | 'MAITRE_CONFERENCE' | 'ASSISTANT' | 'CHARGE_COURS' | 'VACATAIRE';

export const GRADE_ENSEIGNANT_CHOICES: { value: GradeEnseignant; label: string }[] = [
  { value: 'PROFESSEUR', label: 'Professeur' },
  { value: 'MAITRE_CONFERENCE', label: 'Maître de Conférences' },
  { value: 'ASSISTANT', label: 'Assistant' },
  { value: 'CHARGE_COURS', label: 'Chargé de Cours' },
  { value: 'VACATAIRE', label: 'Vacataire' },
];

export interface Enseignant {
  id: number;
  matricule: string; // Ex: "ENS2024001"
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  genre: Genre;
  email: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  photo?: string;
  
  // Informations professionnelles
  grade: GradeEnseignant;
  specialite: string;
  departement: number; // ID
  departement_details?: {
    id: number;
    code: string;
    nom: string;
  };
  
  date_embauche: string; // ISO date
  statut: StatutEnseignant;
  
  // Diplômes et qualifications
  diplomes?: string; // JSON ou texte
  experiences?: string; // JSON ou texte
  
  // Disponibilité
  heures_par_semaine?: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Champs calculés
  anciennete?: number; // En années
  nom_complet?: string;
  nb_matieres?: number;
}

export interface EnseignantCreate {
  matricule: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  genre: Genre;
  email: string;
  telephone: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  
  grade: GradeEnseignant;
  specialite: string;
  departement_id: number;
  
  date_embauche: string;
  statut?: StatutEnseignant;
  
  diplomes?: string;
  experiences?: string;
  heures_par_semaine?: number;
}

export interface EnseignantUpdate {
  nom?: string;
  prenom?: string;
  date_naissance?: string;
  lieu_naissance?: string;
  genre?: Genre;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  
  grade?: GradeEnseignant;
  specialite?: string;
  departement_id?: number;
  
  date_embauche?: string;
  statut?: StatutEnseignant;
  
  diplomes?: string;
  experiences?: string;
  heures_par_semaine?: number;
}

// ============== TYPES DE FILTRES ==============

export interface EtudiantFilters {
  search?: string;
  filiere?: number;
  niveau_actuel?: number;
  statut?: StatutEtudiant;
  annee_admission?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface EnseignantFilters {
  search?: string;
  departement?: number;
  grade?: GradeEnseignant;
  statut?: StatutEnseignant;
  specialite?: string;
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

// ============== STATISTIQUES ==============

export interface EtudiantStatistiques {
  total: number;
  actifs: number;
  diplomes: number;
  par_filiere: { filiere: string; count: number }[];
  par_niveau: { niveau: number; count: number }[];
  par_statut: { statut: StatutEtudiant; count: number }[];
}

export interface EnseignantStatistiques {
  total: number;
  actifs: number;
  par_grade: { grade: GradeEnseignant; count: number }[];
  par_departement: { departement: string; count: number }[];
  charge_horaire_moyenne: number;
}