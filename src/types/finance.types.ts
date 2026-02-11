// src/types/finance.types.ts

export interface FraisScolarite {
  id: string;
  filiere: string;
  niveau: string;
  annee_academique: string;
  montant_total: number;
  montant_inscription: number;
  nombre_tranches: number;
  montants_tranches: number[];
  date_limite_paiement: string;
  created_at: string;
  updated_at: string;
}

export interface FraisScolariteFormData {
  filiere: string;
  niveau: string;
  annee_academique: string;
  montant_total: number;
  montant_inscription: number;
  nombre_tranches: number;
  montants_tranches: number[];
  date_limite_paiement: string;
}

export interface Paiement {
  id: string;
  etudiant_id: string;
  etudiant_nom: string;
  etudiant_prenom: string;
  etudiant_matricule: string;
  montant: number;
  mode_paiement: 'ESPECES' | 'CARTE' | 'VIREMENT' | 'MOBILE_MONEY' | 'CHEQUE';
  reference_paiement: string;
  statut: 'VALIDE' | 'EN_ATTENTE' | 'REJETE' | 'ANNULE';
  type_frais: 'SCOLARITE' | 'INSCRIPTION' | 'EXAMEN' | 'AUTRE';
  date_paiement: string;
  remarques?: string;
  facture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PaiementFormData {
  etudiant_id: string;
  montant: number;
  mode_paiement: 'ESPECES' | 'CARTE' | 'VIREMENT' | 'MOBILE_MONEY' | 'CHEQUE';
  reference_paiement?: string;
  type_frais: 'SCOLARITE' | 'INSCRIPTION' | 'EXAMEN' | 'AUTRE';
  date_paiement: string;
  remarques?: string;
}

export interface Bourse {
  id: string;
  etudiant_id: string;
  etudiant_nom: string;
  etudiant_prenom: string;
  etudiant_matricule: string;
  type_bourse: 'ETAT' | 'EXCELLENCE' | 'SOCIALE' | 'MERITE' | 'AUTRE';
  pourcentage_exoneration: number;
  montant_bourse: number;
  date_debut: string;
  date_fin: string;
  statut: 'ACTIVE' | 'EXPIREE' | 'SUSPENDUE' | 'ANNULEE';
  organisme_financeur?: string;
  remarques?: string;
  created_at: string;
  updated_at: string;
}

export interface BourseFormData {
  etudiant_id: string;
  type_bourse: 'ETAT' | 'EXCELLENCE' | 'SOCIALE' | 'MERITE' | 'AUTRE';
  pourcentage_exoneration: number;
  montant_bourse: number;
  date_debut: string;
  date_fin: string;
  statut: 'ACTIVE' | 'EXPIREE' | 'SUSPENDUE' | 'ANNULEE';
  organisme_financeur?: string;
  remarques?: string;
}

export interface FinanceStatistiques {
  total_paye: number;
  total_impaye: number;
  total_a_percevoir: number;
  nombre_paiements: number;
  nombre_etudiants_a_jour: number;
  nombre_etudiants_en_retard: number;
  evolution_paiements: {
    mois: string;
    montant: number;
  }[];
  repartition_modes_paiement: {
    mode: string;
    montant: number;
    count: number;
  }[];
  top_impayes: {
    etudiant_id: string;
    etudiant_nom: string;
    etudiant_prenom: string;
    matricule: string;
    montant_du: number;
  }[];
}

export interface StudentPaymentInfo {
  etudiant_id: string;
  nom: string;
  prenom: string;
  matricule: string;
  filiere: string;
  niveau: string;
  frais_total: number;
  montant_paye: number;
  montant_restant: number;
  pourcentage_paye: number;
  paiements: Paiement[];
  bourses: Bourse[];
}

export interface Etudiant {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  filiere: string;
  niveau: string;
}