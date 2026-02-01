// Types TypeScript pour le module Étudiants

export type SexeEtudiant = 'M' | 'F';

export type StatutEtudiant = 'ACTIF' | 'SUSPENDU' | 'DIPLOME' | 'EXCLU' | 'ABANDONNE';

export type RegimeEtudiant = 'REGULIER' | 'VACANCES' | 'COURS_SOIR';

export type NiveauFiliere = 'L1' | 'L2' | 'L3' | 'M1' | 'M2' | 'D1' | 'D2' | 'D3';

export interface Filiere {
  id: number;
  code: string;
  nom: string;
  departement?: {
    id: number;
    nom: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Etudiant {
  id: number;
  matricule: string; // Auto-généré (ex: ETU-2024-0001)
  user: User;
  
  // Informations personnelles
  date_naissance: string; // ISO date
  lieu_naissance: string;
  sexe: SexeEtudiant;
  nationalite: string;
  
  // Contact
  telephone: string;
  email_personnel: string;
  adresse: string;
  ville: string;
  pays: string;
  
  // Photo
  photo?: string; // URL
  
  // Tuteur/Parent
  tuteur_nom: string;
  tuteur_telephone: string;
  tuteur_email?: string;
  
  // Statut
  statut: StatutEtudiant;
  
  // Métadonnées
  created_at: string;
  updated_at: string;
}

export interface EtudiantCreate {
  // Informations personnelles
  nom: string;
  prenom: string;
  sexe: SexeEtudiant;
  date_naissance: string;
  lieu_naissance: string;
  nationalite: string;
  
  // Contact
  telephone: string;
  email: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  
  // Photo (fichier)
  photo?: File;
  
  // Tuteur
  tuteur_nom?: string;
  tuteur_telephone?: string;
  tuteur_email?: string;
  
  // Statut
  statut?: StatutEtudiant;
}

export interface EtudiantUpdate {
  // Informations personnelles
  date_naissance?: string;
  lieu_naissance?: string;
  sexe?: SexeEtudiant;
  nationalite?: string;
  
  // Contact
  telephone?: string;
  email_personnel?: string;
  adresse?: string;
  ville?: string;
  pays?: string;
  
  // Tuteur
  tuteur_nom?: string;
  tuteur_telephone?: string;
  tuteur_email?: string;
  
  // Statut
  statut?: StatutEtudiant;
}

export interface Inscription {
  id: number;
  etudiant: number;
  filiere: Filiere;
  annee_academique: {
    id: number;
    code: string;
    libelle: string;
  };
  niveau: number;
  date_inscription: string;
  montant_inscription: number;
  montant_paye: number;
  statut_paiement: 'COMPLET' | 'PARTIEL' | 'IMPAYE';
  statut: 'INSCRIT' | 'ABANDONNE' | 'TRANSFERE';
}

export interface EtudiantFilters {
  search?: string;
  filiere?: number;
  niveau?: NiveauFiliere;
  sexe?: SexeEtudiant;
  statut?: StatutEtudiant;
  annee_inscription?: number;
  solde_impaye?: boolean;
  page?: number;
  page_size?: number;
}

export interface ImportCSVResponse {
  crees: number;
  doublons: number;
  erreurs: Array<{ ligne: number; erreur: string }>;
  total_lignes: number;
}

export interface EtudiantStats {
  total: number;
  actifs: number;
  nouveaux: number;
  par_statut: {
    actifs: number;
    suspendus: number;
    diplomes: number;
    abandonnes: number;
  };
  par_sexe: {
    masculin: number;
    feminin: number;
  };
  par_filiere: Array<{ filiere__nom: string; count: number }>;
  taux_reussite: number;
}

export interface BulletinNote {
  matiere: string;
  evaluation: string;
  note: number;
  coefficient: number;
}

export interface BulletinData {
  etudiant: {
    matricule: string;
    nom_complet: string;
    filiere: string | null;
    photo?: string | null;
  };
  notes: BulletinNote[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}