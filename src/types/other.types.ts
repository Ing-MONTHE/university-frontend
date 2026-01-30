/**
 * Types TypeScript pour Finance, Bibliothèque et Présences
 * Mapped depuis les modèles Django Backend
 */

import { Etudiant } from './students.types';
import { Cours } from './schedule.types';

// ============== FINANCE ==============

export type ModePaiement = 'ESPECES' | 'VIREMENT' | 'CHEQUE' | 'MOBILE_MONEY' | 'CARTE';
export type TypeBourse = 'MERITE' | 'SOCIALE' | 'SPORTIVE' | 'EXCELLENCE';
export type StatutBourse = 'ACTIVE' | 'SUSPENDUE' | 'TERMINÉE';

export interface FraisScolarite {
  id: number;
  filiere: number; // ID
  niveau: string; // L1, L2, etc.
  annee_academique: number; // ID
  montant: number;
  montant_inscription: number;
  montant_bibliotheque?: number;
  montant_sport?: number;
  autres_frais?: number;
  created_at: string;
  updated_at: string;
}

export interface FraisScolariteCreate {
  filiere: number;
  niveau: string;
  annee_academique: number;
  montant: number;
  montant_inscription: number;
  montant_bibliotheque?: number;
  montant_sport?: number;
  autres_frais?: number;
}

export interface Paiement {
  id: number;
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  annee_academique: number; // ID
  montant: number;
  mode_paiement: ModePaiement;
  reference_transaction: string;
  date_paiement: string;
  description?: string;
  recu_genere: boolean;
  recu_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PaiementCreate {
  etudiant: number;
  annee_academique: number;
  montant: number;
  mode_paiement: ModePaiement;
  reference_transaction?: string;
  date_paiement?: string;
  description?: string;
}

export interface Bourse {
  id: number;
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  type_bourse: TypeBourse;
  montant_annuel: number;
  annee_academique: number; // ID
  date_debut: string;
  date_fin: string;
  organisme?: string;
  statut: StatutBourse;
  remarques?: string;
  created_at: string;
  updated_at: string;
}

export interface BourseCreate {
  etudiant: number;
  type_bourse: TypeBourse;
  montant_annuel: number;
  annee_academique: number;
  date_debut: string;
  date_fin: string;
  organisme?: string;
  statut?: StatutBourse;
  remarques?: string;
}

export interface Facture {
  id: number;
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  numero_facture: string; // Auto-généré
  date_emission: string;
  montant_total: number;
  montant_paye: number;
  montant_restant: number;
  description: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceStats {
  total_paiements_mois: number;
  total_paiements_annee: number;
  nombre_bourses_actives: number;
  total_impayés: number;
  taux_paiement: number;
}

// ============== BIBLIOTHÈQUE ==============

export type StatutEmprunt = 'EN_COURS' | 'RETOURNÉ' | 'RETARD' | 'PERDU';

export interface CategorieLivre {
  id: number;
  nom: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CategorieLivreCreate {
  nom: string;
  code: string;
  description?: string;
}

export interface Livre {
  id: number;
  titre: string;
  auteur: string;
  isbn?: string;
  editeur?: string;
  annee_publication?: number;
  categorie: number; // ID
  categorie_details?: CategorieLivre;
  nombre_exemplaires: number;
  exemplaires_disponibles: number;
  emplacement?: string;
  description?: string;
  cover_image?: string;
  created_at: string;
  updated_at: string;
}

export interface LivreCreate {
  titre: string;
  auteur: string;
  isbn?: string;
  editeur?: string;
  annee_publication?: number;
  categorie: number;
  nombre_exemplaires: number;
  emplacement?: string;
  description?: string;
  cover_image?: File | string;
}

export interface Emprunt {
  id: number;
  livre: number; // ID
  livre_details?: Livre;
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  date_emprunt: string;
  date_retour_prevue: string;
  date_retour_effective?: string;
  statut: StatutEmprunt;
  penalite?: number; // FCFA
  remarques?: string;
  created_at: string;
  updated_at: string;
  
  // Calculé
  jours_retard?: number;
  en_retard?: boolean;
}

export interface EmpruntCreate {
  livre: number;
  etudiant: number;
  date_emprunt?: string;
  date_retour_prevue: string;
  remarques?: string;
}

export interface EmpruntUpdate {
  date_retour_effective?: string;
  statut?: StatutEmprunt;
  penalite?: number;
  remarques?: string;
}

export interface LibraryStats {
  total_livres: number;
  exemplaires_disponibles: number;
  emprunts_en_cours: number;
  emprunts_en_retard: number;
  total_penalites: number;
}

// ============== PRÉSENCES ==============

export type StatutPresence = 'PRESENT' | 'ABSENT' | 'RETARD' | 'EXCUSÉ';
export type StatutJustificatif = 'EN_ATTENTE' | 'APPROUVÉ' | 'REJETÉ';

export interface FeuillePresence {
  id: number;
  cours: number; // ID
  cours_details?: Cours;
  date_seance: string;
  heure_debut: string;
  heure_fin: string;
  effectif_present: number;
  effectif_total: number;
  remarques?: string;
  validee: boolean;
  created_at: string;
  updated_at: string;
  
  // Calculé
  taux_presence?: number;
}

export interface FeuillePresenceCreate {
  cours: number;
  date_seance: string;
  heure_debut: string;
  heure_fin: string;
  remarques?: string;
}

export interface FeuillePresenceUpdate {
  date_seance?: string;
  heure_debut?: string;
  heure_fin?: string;
  remarques?: string;
  validee?: boolean;
}

export interface Presence {
  id: number;
  feuille_presence: number; // ID
  feuille_presence_details?: FeuillePresence;
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  statut: StatutPresence;
  heure_arrivee?: string;
  remarque?: string;
  created_at: string;
  updated_at: string;
}

export interface PresenceCreate {
  feuille_presence: number;
  etudiant: number;
  statut: StatutPresence;
  heure_arrivee?: string;
  remarque?: string;
}

export interface PresenceUpdate {
  statut?: StatutPresence;
  heure_arrivee?: string;
  remarque?: string;
}

// Pour marquage en masse
export interface PresenceBulk {
  etudiant: number;
  statut: StatutPresence;
  heure_arrivee?: string;
  remarque?: string;
}

export interface PresenceBulkCreate {
  feuille_presence: number;
  presences: PresenceBulk[];
}

export interface JustificatifAbsence {
  id: number;
  etudiant: number; // ID
  etudiant_details?: Etudiant;
  date_debut: string;
  date_fin: string;
  motif: string;
  justificatif_url?: string;
  statut: StatutJustificatif;
  approuve_par?: number; // ID
  date_approbation?: string;
  remarque_admin?: string;
  created_at: string;
  updated_at: string;
}

export interface JustificatifAbsenceCreate {
  etudiant: number;
  date_debut: string;
  date_fin: string;
  motif: string;
  justificatif_url?: File | string;
}

export interface JustificatifAbsenceUpdate {
  statut?: StatutJustificatif;
  approuve_par?: number;
  date_approbation?: string;
  remarque_admin?: string;
}

export interface AttendanceStats {
  total_seances: number;
  taux_presence_moyen: number;
  absences_justifiees: number;
  absences_non_justifiees: number;
  retards: number;
  etudiants_risque: number; // < 75% présence
}

// ============== TYPES DE FILTRES ==============

export interface PaiementFilters {
  etudiant?: number;
  annee_academique?: number;
  mode_paiement?: ModePaiement;
  date_debut?: string;
  date_fin?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface BourseFilters {
  etudiant?: number;
  type_bourse?: TypeBourse;
  annee_academique?: number;
  statut?: StatutBourse;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface LivreFilters {
  search?: string;
  categorie?: number;
  auteur?: string;
  disponible?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface EmpruntFilters {
  livre?: number;
  etudiant?: number;
  statut?: StatutEmprunt;
  en_retard?: boolean;
  date_emprunt_debut?: string;
  date_emprunt_fin?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface FeuillePresenceFilters {
  cours?: number;
  date_seance?: string;
  validee?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface PresenceFilters {
  feuille_presence?: number;
  etudiant?: number;
  statut?: StatutPresence;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface JustificatifFilters {
  etudiant?: number;
  statut?: StatutJustificatif;
  date_debut?: string;
  date_fin?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
