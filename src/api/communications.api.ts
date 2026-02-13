import api from './client';
import type {
  Annonce,
  AnnonceFormData,
  AnnonceFilters,
  Notification,
  NotificationFilters,
  Message,
  MessageFormData,
  Conversation,
  PreferenceNotification,
  PreferenceNotificationFormData,
  CommunicationsStats,
} from '@/types/communications.types';

// ==================== ANNONCES API ====================

/**
 * Récupérer toutes les annonces avec filtres optionnels
 */
export const getAnnonces = async (filters?: AnnonceFilters): Promise<Annonce[]> => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.type_annonce) params.append('type_annonce', filters.type_annonce);
  if (filters?.statut) params.append('statut', filters.statut);
  if (filters?.date_debut) params.append('date_debut', filters.date_debut);
  if (filters?.date_fin) params.append('date_fin', filters.date_fin);
  if (filters?.est_prioritaire !== undefined) params.append('est_prioritaire', String(filters.est_prioritaire));
  
  const queryString = params.toString();
  const url = queryString ? `/api/annonces/?${queryString}` : '/api/annonces/';
  
  const response = await api.get<Annonce[]>(url);
  return response.data;
};

/**
 * Récupérer une annonce par ID
 */
export const getAnnonceById = async (id: number): Promise<Annonce> => {
  const response = await api.get<Annonce>(`/api/annonces/${id}/`);
  return response.data;
};

/**
 * Créer une nouvelle annonce
 */
export const createAnnonce = async (data: AnnonceFormData): Promise<Annonce> => {
  const formData = new FormData();
  
  formData.append('titre', data.titre);
  formData.append('contenu', data.contenu);
  formData.append('type_annonce', data.type_annonce);
  formData.append('est_prioritaire', String(data.est_prioritaire));
  formData.append('statut', data.statut);
  
  if (data.date_publication) formData.append('date_publication', data.date_publication);
  if (data.date_expiration) formData.append('date_expiration', data.date_expiration);
  if (data.piece_jointe) formData.append('piece_jointe', data.piece_jointe);
  
  const response = await api.post<Annonce>('/api/annonces/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Mettre à jour une annonce existante
 */
export const updateAnnonce = async (id: number, data: Partial<AnnonceFormData>): Promise<Annonce> => {
  const formData = new FormData();
  
  if (data.titre) formData.append('titre', data.titre);
  if (data.contenu) formData.append('contenu', data.contenu);
  if (data.type_annonce) formData.append('type_annonce', data.type_annonce);
  if (data.est_prioritaire !== undefined) formData.append('est_prioritaire', String(data.est_prioritaire));
  if (data.statut) formData.append('statut', data.statut);
  if (data.date_publication) formData.append('date_publication', data.date_publication);
  if (data.date_expiration) formData.append('date_expiration', data.date_expiration);
  if (data.piece_jointe) formData.append('piece_jointe', data.piece_jointe);
  
  const response = await api.put<Annonce>(`/api/annonces/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Supprimer une annonce
 */
export const deleteAnnonce = async (id: number): Promise<void> => {
  await api.delete(`/api/annonces/${id}/`);
};

/**
 * Publier une annonce (change le statut en PUBLIEE)
 */
export const publierAnnonce = async (id: number): Promise<Annonce> => {
  const response = await api.post<Annonce>(`/api/annonces/${id}/publier/`);
  return response.data;
};

/**
 * Archiver une annonce
 */
export const archiverAnnonce = async (id: number): Promise<Annonce> => {
  const response = await api.post<Annonce>(`/api/annonces/${id}/archiver/`);
  return response.data;
};

// ==================== NOTIFICATIONS API ====================

/**
 * Récupérer toutes les notifications avec filtres optionnels
 */
export const getNotifications = async (filters?: NotificationFilters): Promise<Notification[]> => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.type_notification) params.append('type_notification', filters.type_notification);
  if (filters?.est_lue !== undefined && filters?.est_lue !== '') params.append('est_lue', String(filters.est_lue));
  if (filters?.date_debut) params.append('date_debut', filters.date_debut);
  if (filters?.date_fin) params.append('date_fin', filters.date_fin);
  
  const queryString = params.toString();
  const url = queryString ? `/api/notifications/?${queryString}` : '/api/notifications/';
  
  const response = await api.get<Notification[]>(url);
  return response.data;
};

/**
 * Marquer une notification comme lue
 */
export const marquerNotificationLue = async (id: number): Promise<Notification> => {
  const response = await api.post<Notification>(`/api/notifications/${id}/marquer_lue/`);
  return response.data;
};

/**
 * Marquer toutes les notifications comme lues
 */
export const marquerToutesNotificationsLues = async (): Promise<void> => {
  await api.post('/api/notifications/marquer_toutes_lues/');
};

/**
 * Supprimer une notification
 */
export const deleteNotification = async (id: number): Promise<void> => {
  await api.delete(`/api/notifications/${id}/`);
};

/**
 * Supprimer plusieurs notifications
 */
export const deleteNotifications = async (ids: number[]): Promise<void> => {
  await api.post('/api/notifications/supprimer_multiples/', { ids });
};

// ==================== MESSAGES API ====================

/**
 * Récupérer toutes les conversations
 */
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get<Conversation[]>('/api/messages/conversations/');
  return response.data;
};

/**
 * Récupérer tous les messages d'une conversation
 */
export const getMessagesConversation = async (interlocuteurId: number): Promise<Message[]> => {
  const response = await api.get<Message[]>(`/api/messages/conversation/${interlocuteurId}/`);
  return response.data;
};

/**
 * Récupérer un message par ID avec ses réponses
 */
export const getMessageById = async (id: number): Promise<Message> => {
  const response = await api.get<Message>(`/api/messages/${id}/`);
  return response.data;
};

/**
 * Envoyer un nouveau message
 */
export const sendMessage = async (data: MessageFormData): Promise<Message> => {
  const formData = new FormData();
  
  formData.append('destinataire_id', String(data.destinataire_id));
  formData.append('sujet', data.sujet);
  formData.append('corps', data.corps);
  
  if (data.message_parent_id) formData.append('message_parent_id', String(data.message_parent_id));
  if (data.piece_jointe) formData.append('piece_jointe', data.piece_jointe);
  
  const response = await api.post<Message>('/api/messages/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Marquer un message comme lu
 */
export const marquerMessageLu = async (id: number): Promise<Message> => {
  const response = await api.post<Message>(`/api/messages/${id}/marquer_lu/`);
  return response.data;
};

/**
 * Archiver un message
 */
export const archiverMessage = async (id: number): Promise<Message> => {
  const response = await api.post<Message>(`/api/messages/${id}/archiver/`);
  return response.data;
};

/**
 * Désarchiver un message
 */
export const desarchiverMessage = async (id: number): Promise<Message> => {
  const response = await api.post<Message>(`/api/messages/${id}/desarchi ver/`);
  return response.data;
};

/**
 * Supprimer un message
 */
export const deleteMessage = async (id: number): Promise<void> => {
  await api.delete(`/api/messages/${id}/`);
};

/**
 * Rechercher des utilisateurs pour la messagerie
 */
export const searchUsers = async (query: string): Promise<Array<{ id: number; username: string; email: string }>> => {
  const response = await api.get(`/api/users/search/?q=${query}`);
  return response.data;
};

// ==================== PRÉFÉRENCES NOTIFICATIONS API ====================

/**
 * Récupérer les préférences de notification de l'utilisateur connecté
 */
export const getPreferencesNotification = async (): Promise<PreferenceNotification> => {
  const response = await api.get<PreferenceNotification>('/api/preferences-notification/');
  return response.data;
};

/**
 * Mettre à jour les préférences de notification
 */
export const updatePreferencesNotification = async (
  data: PreferenceNotificationFormData
): Promise<PreferenceNotification> => {
  const response = await api.put<PreferenceNotification>('/api/preferences-notification/', data);
  return response.data;
};

// ==================== STATISTIQUES ====================

/**
 * Récupérer les statistiques des communications
 */
export const getCommunicationsStats = async (): Promise<CommunicationsStats> => {
  const response = await api.get<CommunicationsStats>('/api/communications/stats/');
  return response.data;
};

/**
 * Compter les messages non lus
 */
export const getMessagesNonLusCount = async (): Promise<number> => {
  const response = await api.get<{ count: number }>('/api/messages/non_lus/count/');
  return response.data.count;
};

/**
 * Compter les notifications non lues
 */
export const getNotificationsNonLuesCount = async (): Promise<number> => {
  const response = await api.get<{ count: number }>('/api/notifications/non_lues/count/');
  return response.data.count;
};