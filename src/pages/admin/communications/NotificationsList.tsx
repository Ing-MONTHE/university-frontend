import { useEffect, useState } from 'react';
import { Check, CheckCheck, Search, Filter, Trash2,} from 'lucide-react';
import { useCommunications } from '@/hooks/useCommunications';
import type { NotificationFilters, TypeNotification } from '@/types/communications.types';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotificationsList() {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    handleMarquerNotificationLue,
    handleMarquerToutesNotificationsLues,
    handleDeleteNotification,
    handleDeleteNotifications,
    clearError,
  } = useCommunications();

  const [filters, setFilters] = useState<NotificationFilters>({
    search: '',
    type_notification: '',
    est_lue: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; multiple: boolean }>({
    show: false,
    multiple: false,
  });

  useEffect(() => {
    fetchNotifications(filters);
  }, []);

  const handleFilterChange = (key: keyof NotificationFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchNotifications(filters);
  };

  const handleReset = () => {
    setFilters({ search: '', type_notification: '', est_lue: '' });
    fetchNotifications();
  };

  const handleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await handleDeleteNotifications(selectedIds);
      setSelectedIds([]);
      setDeleteModal({ show: false, multiple: false });
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const handleMarquerLue = async (id: number) => {
    try {
      await handleMarquerNotificationLue(id);
    } catch (err) {
      console.error('Erreur marquage:', err);
    }
  };

  const handleMarquerToutesLues = async () => {
    try {
      await handleMarquerToutesNotificationsLues();
    } catch (err) {
      console.error('Erreur marquage:', err);
    }
  };

  const getTypeBadge = (type: TypeNotification) => {
    const styles: Record<TypeNotification, { color: string; icon: string }> = {
      INFO: { color: 'bg-blue-100 text-blue-700', icon: 'ℹ️' },
      SUCCES: { color: 'bg-green-100 text-green-700', icon: '✓' },
      ALERTE: { color: 'bg-yellow-100 text-yellow-700', icon: '⚠️' },
      ERREUR: { color: 'bg-red-100 text-red-700', icon: '✕' },
    };
    return (
      <Badge className={styles[type].color}>
        <span className="mr-1">{styles[type].icon}</span>
        {type}
      </Badge>
    );
  };

  const notificationsNonLues = notifications.filter(n => !n.est_lue).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {notificationsNonLues} notification{notificationsNonLues !== 1 ? 's' : ''} non lue{notificationsNonLues !== 1 ? 's' : ''}
          </p>
        </div>
        {notificationsNonLues > 0 && (
          <Button onClick={handleMarquerToutesLues} className="flex items-center gap-2">
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher une notification..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
            <Button onClick={handleSearch}>Rechercher</Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <Select
                  value={filters.type_notification || ''}
                  onChange={(e) => handleFilterChange('type_notification', e.target.value)}
                >
                  <option value="">Tous les types</option>
                  <option value="INFO">Information</option>
                  <option value="SUCCES">Succès</option>
                  <option value="ALERTE">Alerte</option>
                  <option value="ERREUR">Erreur</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <Select
                  value={String(filters.est_lue)}
                  onChange={(e) => handleFilterChange('est_lue', e.target.value === 'true' ? true : e.target.value === 'false' ? false : '')}
                >
                  <option value="">Toutes</option>
                  <option value="false">Non lues</option>
                  <option value="true">Lues</option>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={handleReset} className="w-full">
                  Réinitialiser
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Actions en masse */}
      {selectedIds.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length} notification{selectedIds.length !== 1 ? 's' : ''} sélectionnée{selectedIds.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeleteModal({ show: true, multiple: true })}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer la sélection
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedIds([])}>
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">
            ×
          </button>
        </div>
      )}

      {/* Liste des notifications */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Aucune notification trouvée</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* En-tête du tableau */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={selectedIds.length === notifications.length && notifications.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-600">Sélectionner tout</span>
          </div>

          {/* Liste */}
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all ${
                notification.est_lue ? 'bg-white' : 'bg-blue-50 border-blue-200'
              } ${selectedIds.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(notification.id)}
                  onChange={() => handleSelectOne(notification.id)}
                  className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(notification.type_notification)}
                    {!notification.est_lue && (
                      <Badge className="bg-blue-600 text-white">Nouveau</Badge>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {notification.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {format(new Date(notification.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </span>
                    {notification.est_lue && notification.date_lecture && (
                      <span>
                        Lu le {format(new Date(notification.date_lecture), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!notification.est_lue && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarquerLue(notification.id)}
                      className="flex items-center gap-1"
                      title="Marquer comme lu"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedIds([notification.id]);
                      setDeleteModal({ show: true, multiple: false });
                    }}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, multiple: false })}
        onConfirm={deleteModal.multiple ? handleDeleteSelected : () => handleDeleteNotification(selectedIds[0])}
        title={deleteModal.multiple ? 'Supprimer les notifications' : 'Supprimer la notification'}
        message={
          deleteModal.multiple
            ? `Êtes-vous sûr de vouloir supprimer ${selectedIds.length} notification${selectedIds.length !== 1 ? 's' : ''} ?`
            : 'Êtes-vous sûr de vouloir supprimer cette notification ?'
        }
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}