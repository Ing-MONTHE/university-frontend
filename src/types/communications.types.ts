// ==================== TYPES ANNONCES ====================

export type TypeAnnonce = 'GENERALE' | 'ETUDIANTS' | 'ENSEIGNANTS' | 'ADMINISTRATION' | 'URGENTE';
export type StatutAnnonce = 'BROUILLON' | 'PUBLIEE' | 'ARCHIVEE';

export interface Annonce {
  id: number;
  auteur: {
    id: number;
    username: string;
    email: string;
  } | null;
  titre: string;
  contenu: string;
  type_annonce: TypeAnnonce;
  est_prioritaire: boolean;
  statut: StatutAnnonce;
  date_publication: string | null;
  date_expiration: string | null;
  piece_jointe: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnnonceFormData {
  titre: string;
  contenu: string;
  type_annonce: TypeAnnonce;
  est_prioritaire: boolean;
  statut: StatutAnnonce;
  date_publication?: string;
  date_expiration?: string;
  piece_jointe?: File | null;
}

export interface AnnonceFilters {
  search?: string;
  type_annonce?: TypeAnnonce | '';
  statut?: StatutAnnonce | '';
  date_debut?: string;
  date_fin?: string;
  est_prioritaire?: boolean;
}

// ==================== TYPES NOTIFICATIONS ====================

export type TypeNotification = 'INFO' | 'SUCCES' | 'ALERTE' | 'ERREUR';
export type CanalNotification = 'APP' | 'EMAIL' | 'SMS';

export interface Notification {
  id: number;
  destinataire: {
    id: number;
    username: string;
    email: string;
  };
  titre: string;
  message: string;
  type_notification: TypeNotification;
  canal: CanalNotification;
  est_lue: boolean;
  date_lecture: string | null;
  lien: string;
  envoyee: boolean;
  date_envoi: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationFilters {
  search?: string;
  type_notification?: TypeNotification | '';
  est_lue?: boolean | '';
  date_debut?: string;
  date_fin?: string;
}

// ==================== TYPES MESSAGES ====================

export interface Message {
  id: number;
  expediteur: {
    id: number;
    username: string;
    email: string;
  } | null;
  destinataire: {
    id: number;
    username: string;
    email: string;
  };
  sujet: string;
  corps: string;
  piece_jointe: string | null;
  message_parent: number | null;
  est_lu: boolean;
  date_lecture: string | null;
  est_archive: boolean;
  created_at: string;
  updated_at: string;
  reponses?: Message[];
}

export interface MessageFormData {
  destinataire_id: number;
  sujet: string;
  corps: string;
  piece_jointe?: File | null;
  message_parent_id?: number;
}

export interface Conversation {
  interlocuteur: {
    id: number;
    username: string;
    email: string;
  };
  dernier_message: Message;
  messages_non_lus: number;
}

// ==================== TYPES PRÉFÉRENCES NOTIFICATIONS ====================

export type FrequenceDigest = 'IMMEDIAT' | 'QUOTIDIEN' | 'HEBDOMADAIRE';

export interface PreferenceNotification {
  id: number;
  utilisateur: {
    id: number;
    username: string;
    email: string;
  };
  notif_notes: boolean;
  notif_absences: boolean;
  notif_paiements: boolean;
  notif_bibliotheque: boolean;
  notif_emploi_temps: boolean;
  notif_annonces: boolean;
  notif_messages: boolean;
  activer_email: boolean;
  activer_sms: boolean;
  activer_push: boolean;
  frequence_digest: FrequenceDigest;
  created_at: string;
  updated_at: string;
}

export interface PreferenceNotificationFormData {
  notif_notes: boolean;
  notif_absences: boolean;
  notif_paiements: boolean;
  notif_bibliotheque: boolean;
  notif_emploi_temps: boolean;
  notif_annonces: boolean;
  notif_messages: boolean;
  activer_email: boolean;
  activer_sms: boolean;
  activer_push: boolean;
  frequence_digest: FrequenceDigest;
}

// ==================== TYPES API RESPONSES ====================

export interface CommunicationsStats {
  total_annonces: number;
  annonces_publiees: number;
  annonces_brouillon: number;
  total_notifications: number;
  notifications_non_lues: number;
  total_messages: number;
  messages_non_lus: number;
  conversations_actives: number;
}