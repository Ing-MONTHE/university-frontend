import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAnnonces,
  getAnnonceById,
  createAnnonce,
  updateAnnonce,
  deleteAnnonce,
  publierAnnonce,
  archiverAnnonce,
  getNotifications,
  marquerNotificationLue,
  marquerToutesNotificationsLues,
  deleteNotification,
  deleteNotifications,
  getConversations,
  getMessagesConversation,
  sendMessage,
  marquerMessageLu,
  archiverMessage,
  searchUsers,
  getPreferencesNotification,
  updatePreferencesNotification,
  getCommunicationsStats,
  getMessagesNonLusCount,
  getNotificationsNonLuesCount,
} from '@/api/communications.api';
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

interface UseCommunicationsReturn {
  // États
  annonces: Annonce[];
  annonce: Annonce | null;
  notifications: Notification[];
  conversations: Conversation[];
  messages: Message[];
  preferences: PreferenceNotification | null;
  stats: CommunicationsStats | null;
  messagesNonLusCount: number;
  notificationsNonLuesCount: number;
  loading: boolean;
  error: string | null;

  // Méthodes Annonces
  fetchAnnonces: (filters?: AnnonceFilters) => Promise<void>;
  fetchAnnonceById: (id: number) => Promise<void>;
  handleCreateAnnonce: (data: AnnonceFormData) => Promise<void>;
  handleUpdateAnnonce: (id: number, data: Partial<AnnonceFormData>) => Promise<void>;
  handleDeleteAnnonce: (id: number) => Promise<void>;
  handlePublierAnnonce: (id: number) => Promise<void>;
  handleArchiverAnnonce: (id: number) => Promise<void>;

  // Méthodes Notifications
  fetchNotifications: (filters?: NotificationFilters) => Promise<void>;
  handleMarquerNotificationLue: (id: number) => Promise<void>;
  handleMarquerToutesNotificationsLues: () => Promise<void>;
  handleDeleteNotification: (id: number) => Promise<void>;
  handleDeleteNotifications: (ids: number[]) => Promise<void>;

  // Méthodes Messages
  fetchConversations: () => Promise<void>;
  fetchMessagesConversation: (interlocuteurId: number) => Promise<void>;
  handleSendMessage: (data: MessageFormData) => Promise<void>;
  handleMarquerMessageLu: (id: number) => Promise<void>;
  handleArchiverMessage: (id: number) => Promise<void>;
  handleSearchUsers: (query: string) => Promise<Array<{ id: number; username: string; email: string }>>;

  // Méthodes Préférences
  fetchPreferences: () => Promise<void>;
  handleUpdatePreferences: (data: PreferenceNotificationFormData) => Promise<void>;

  // Méthodes Statistiques
  fetchStats: () => Promise<void>;
  fetchMessagesNonLusCount: () => Promise<void>;
  fetchNotificationsNonLuesCount: () => Promise<void>;

  // Méthodes Utilitaires
  clearError: () => void;
}

export const useCommunications = (): UseCommunicationsReturn => {
  const navigate = useNavigate();

  // États
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [preferences, setPreferences] = useState<PreferenceNotification | null>(null);
  const [stats, setStats] = useState<CommunicationsStats | null>(null);
  const [messagesNonLusCount, setMessagesNonLusCount] = useState<number>(0);
  const [notificationsNonLuesCount, setNotificationsNonLuesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ==================== MÉTHODES ANNONCES ====================

  const fetchAnnonces = useCallback(async (filters?: AnnonceFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnnonces(filters);
      setAnnonces(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des annonces');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnnonceById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnnonceById(id);
      setAnnonce(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération de l\'annonce');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateAnnonce = useCallback(async (data: AnnonceFormData) => {
    setLoading(true);
    setError(null);
    try {
      await createAnnonce(data);
      await fetchAnnonces();
      navigate('/admin/communications/announcements');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'annonce');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAnnonces, navigate]);

  const handleUpdateAnnonce = useCallback(async (id: number, data: Partial<AnnonceFormData>) => {
    setLoading(true);
    setError(null);
    try {
      await updateAnnonce(id, data);
      await fetchAnnonces();
      navigate('/admin/communications/announcements');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour de l\'annonce');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAnnonces, navigate]);

  const handleDeleteAnnonce = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAnnonce(id);
      await fetchAnnonces();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'annonce');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAnnonces]);

  const handlePublierAnnonce = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await publierAnnonce(id);
      await fetchAnnonces();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la publication de l\'annonce');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAnnonces]);

  const handleArchiverAnnonce = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await archiverAnnonce(id);
      await fetchAnnonces();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'archivage de l\'annonce');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAnnonces]);

  // ==================== MÉTHODES NOTIFICATIONS ====================

  const fetchNotifications = useCallback(async (filters?: NotificationFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications(filters);
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMarquerNotificationLue = useCallback(async (id: number) => {
    setError(null);
    try {
      await marquerNotificationLue(id);
      await fetchNotifications();
      await fetchNotificationsNonLuesCount();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du marquage de la notification');
    }
  }, [fetchNotifications]);

  const handleMarquerToutesNotificationsLues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await marquerToutesNotificationsLues();
      await fetchNotifications();
      await fetchNotificationsNonLuesCount();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du marquage des notifications');
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications]);

  const handleDeleteNotification = useCallback(async (id: number) => {
    setError(null);
    try {
      await deleteNotification(id);
      await fetchNotifications();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la notification');
    }
  }, [fetchNotifications]);

  const handleDeleteNotifications = useCallback(async (ids: number[]) => {
    setLoading(true);
    setError(null);
    try {
      await deleteNotifications(ids);
      await fetchNotifications();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression des notifications');
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications]);

  // ==================== MÉTHODES MESSAGES ====================

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessagesConversation = useCallback(async (interlocuteurId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMessagesConversation(interlocuteurId);
      setMessages(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des messages');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (data: MessageFormData) => {
    setError(null);
    try {
      await sendMessage(data);
      await fetchMessagesConversation(data.destinataire_id);
      await fetchConversations();
      await fetchMessagesNonLusCount();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du message');
      throw err;
    }
  }, [fetchMessagesConversation, fetchConversations]);

  const handleMarquerMessageLu = useCallback(async (id: number) => {
    setError(null);
    try {
      await marquerMessageLu(id);
      // Mise à jour locale
      setMessages(prevMessages =>
        prevMessages.map(msg => (msg.id === id ? { ...msg, est_lu: true } : msg))
      );
      await fetchMessagesNonLusCount();
    } catch (err: any) {
      setError(err.message || 'Erreur lors du marquage du message');
    }
  }, []);

  const handleArchiverMessage = useCallback(async (id: number) => {
    setError(null);
    try {
      await archiverMessage(id);
      await fetchConversations();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'archivage du message');
    }
  }, [fetchConversations]);

  const handleSearchUsers = useCallback(async (query: string) => {
    try {
      return await searchUsers(query);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche d\'utilisateurs');
      return [];
    }
  }, []);

  // ==================== MÉTHODES PRÉFÉRENCES ====================

  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPreferencesNotification();
      setPreferences(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des préférences');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdatePreferences = useCallback(async (data: PreferenceNotificationFormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPreferences = await updatePreferencesNotification(data);
      setPreferences(updatedPreferences);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour des préférences');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== MÉTHODES STATISTIQUES ====================

  const fetchStats = useCallback(async () => {
    setError(null);
    try {
      const data = await getCommunicationsStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la récupération des statistiques');
    }
  }, []);

  const fetchMessagesNonLusCount = useCallback(async () => {
    try {
      const count = await getMessagesNonLusCount();
      setMessagesNonLusCount(count);
    } catch (err: any) {
      console.error('Erreur compteur messages:', err);
    }
  }, []);

  const fetchNotificationsNonLuesCount = useCallback(async () => {
    try {
      const count = await getNotificationsNonLuesCount();
      setNotificationsNonLuesCount(count);
    } catch (err: any) {
      console.error('Erreur compteur notifications:', err);
    }
  }, []);

  // ==================== MÉTHODES UTILITAIRES ====================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // États
    annonces,
    annonce,
    notifications,
    conversations,
    messages,
    preferences,
    stats,
    messagesNonLusCount,
    notificationsNonLuesCount,
    loading,
    error,

    // Méthodes Annonces
    fetchAnnonces,
    fetchAnnonceById,
    handleCreateAnnonce,
    handleUpdateAnnonce,
    handleDeleteAnnonce,
    handlePublierAnnonce,
    handleArchiverAnnonce,

    // Méthodes Notifications
    fetchNotifications,
    handleMarquerNotificationLue,
    handleMarquerToutesNotificationsLues,
    handleDeleteNotification,
    handleDeleteNotifications,

    // Méthodes Messages
    fetchConversations,
    fetchMessagesConversation,
    handleSendMessage,
    handleMarquerMessageLu,
    handleArchiverMessage,
    handleSearchUsers,

    // Méthodes Préférences
    fetchPreferences,
    handleUpdatePreferences,

    // Méthodes Statistiques
    fetchStats,
    fetchMessagesNonLusCount,
    fetchNotificationsNonLuesCount,

    // Méthodes Utilitaires
    clearError,
  };
};