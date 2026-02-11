/**
 * Types pour le module Bibliothèque
 */

// ==================== CATÉGORIES ====================
export interface CategoriesLivre {
  id: number;
  nom: string;
  description?: string;
  nb_livres?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoriesLivreFormData {
  nom: string;
  description?: string;
}

// ==================== LIVRES ====================
export interface Livre {
  id: number;
  isbn: string;
  titre: string;
  auteur: string;
  editeur: string;
  annee_publication: number;
  edition?: string;
  categorie: number | CategoriesLivre;
  resume?: string;
  nombre_exemplaires_total: number;
  nombre_exemplaires_disponibles: number;
  emplacement?: string;
  photo_couverture?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LivreFormData {
  isbn: string;
  titre: string;
  auteur: string;
  editeur: string;
  annee_publication: number;
  edition?: string;
  categorie: number;
  resume?: string;
  nombre_exemplaires_total: number;
  nombre_exemplaires_disponibles?: number;
  emplacement?: string;
  photo_couverture?: File | string | null;
}

export interface LivreFilters {
  categorie?: number;
  auteur?: string;
  disponible?: boolean;
  q?: string;
}

export enum LivreDisponibilite {
  DISPONIBLE = 'disponible',
  EMPRUNTE = 'emprunte',
  INDISPONIBLE = 'indisponible',
}

// ==================== EMPRUNTS ====================
export enum StatutEmprunt {
  EN_COURS = 'EN_COURS',
  RETOURNE = 'RETOURNE',
  EN_RETARD = 'EN_RETARD',
  ANNULE = 'ANNULE',
}

export interface Emprunt {
  id: number;
  livre: number | Livre;
  etudiant: number | {
    id: number;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
    matricule: string;
  };
  date_emprunt: string;
  date_retour_prevue: string;
  date_retour_effective?: string;
  statut: StatutEmprunt;
  penalite: number;
  notes?: string;
  jours_retard?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EmpruntFormData {
  livre: number;
  etudiant: number;
  date_retour_prevue: string;
  notes?: string;
}

export interface EmpruntRetourData {
  notes?: string;
}

export interface EmpruntFilters {
  etudiant?: number;
  livre?: number;
  statut?: StatutEmprunt;
}

// ==================== PÉNALITÉS ====================
export interface Penalite {
  id: number;
  emprunt: Emprunt;
  montant: number;
  jours_retard: number;
  date_calcul: string;
  statut: 'IMPAYEE' | 'PAYEE';
  date_paiement?: string;
}

export interface PenaliteFormData {
  statut: 'IMPAYEE' | 'PAYEE';
  date_paiement?: string;
}

// ==================== STATISTIQUES ====================
export interface BibliothequeStats {
  total_livres: number;
  total_exemplaires: number;
  exemplaires_disponibles: number;
  exemplaires_empruntes: number;
  emprunts_en_cours: number;
  emprunts_en_retard: number;
  penalites_totales: number;
  livre_plus_emprunte?: {
    id: number;
    titre: string;
    auteur: string;
    nombre_emprunts: number;
  };
  livres_par_categorie: Array<{
    nom: string;
    count: number;
  }>;
  emprunts_par_mois?: Array<{
    mois: string;
    count: number;
  }>;
}

// ==================== API RESPONSES ====================
export interface LibraryApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}