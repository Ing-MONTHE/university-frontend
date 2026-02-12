/**
 * Types pour le module Documents
 */

// Types de documents disponibles
export enum DocumentType {
  ATTESTATION_SCOLARITE = 'ATTESTATION_SCOLARITE',
  RELEVE_NOTES = 'RELEVE_NOTES',
  CERTIFICAT_REUSSITE = 'CERTIFICAT_REUSSITE',
  ATTESTATION_STAGE = 'ATTESTATION_STAGE',
  CARTE_ETUDIANT = 'CARTE_ETUDIANT',
}

export const DocumentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.ATTESTATION_SCOLARITE]: 'Attestation de Scolarité',
  [DocumentType.RELEVE_NOTES]: 'Relevé de Notes',
  [DocumentType.CERTIFICAT_REUSSITE]: 'Certificat de Réussite',
  [DocumentType.ATTESTATION_STAGE]: 'Attestation de Stage',
  [DocumentType.CARTE_ETUDIANT]: 'Carte Étudiant',
};

// Interface pour un document généré
export interface Document {
  id: number;
  type_document: DocumentType;
  etudiant: {
    id: number;
    nom: string;
    prenom: string;
    matricule: string;
    email: string;
  };
  date_generation: string;
  fichier_pdf: string;
  genere_par: {
    id: number;
    username: string;
  };
  email_envoye: boolean;
  metadata?: Record<string, any>;
}

// Interface pour la génération d'un document
export interface DocumentGenerate {
  type_document: DocumentType;
  etudiant_id: number | number[]; // Simple ou multiple
  send_email?: boolean;
  metadata?: Record<string, any>;
}

// Interface pour un template de document
export interface DocumentTemplate {
  id: number;
  type_document: DocumentType;
  nom: string;
  description?: string;
  contenu_html: string;
  variables_disponibles: string[];
  est_actif: boolean;
  date_creation: string;
  date_modification: string;
  cree_par?: {
    id: number;
    username: string;
  };
}

// Interface pour créer/modifier un template
export interface DocumentTemplateCreate {
  type_document: DocumentType;
  nom: string;
  description?: string;
  contenu_html: string;
  est_actif?: boolean;
}

export interface DocumentTemplateUpdate {
  nom?: string;
  description?: string;
  contenu_html?: string;
  est_actif?: boolean;
}

// Filtres pour les documents
export interface DocumentFilters {
  search?: string;
  type_document?: DocumentType;
  etudiant_id?: number;
  date_debut?: string;
  date_fin?: string;
  email_envoye?: boolean;
  page?: number;
  page_size?: number;
}

// Filtres pour les templates
export interface TemplateFilters {
  search?: string;
  type_document?: DocumentType;
  est_actif?: boolean;
  page?: number;
  page_size?: number;
}

// Variables disponibles pour les templates
export interface TemplateVariables {
  etudiant: {
    nom: string;
    prenom: string;
    matricule: string;
    email: string;
    telephone: string;
    date_naissance: string;
    lieu_naissance: string;
    nationalite: string;
    photo_url?: string;
  };
  inscription?: {
    filiere: string;
    niveau: string;
    annee_academique: string;
  };
  universite: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
    logo_url?: string;
  };
  date_generation: string;
  numero_document?: string;
}

// Réponse paginée
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Statistiques des documents
export interface DocumentStats {
  total: number;
  par_type: Record<DocumentType, number>;
  derniers_7_jours: number;
  emails_envoyes: number;
}