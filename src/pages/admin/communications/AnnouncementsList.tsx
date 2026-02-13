import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, Archive, Send } from 'lucide-react';
import { useCommunications } from '@/hooks/useCommunications';
import type { AnnonceFilters, StatutAnnonce, TypeAnnonce } from '@/types/communications.types';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Select } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Card } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AnnouncementsList() {
  const {
    annonces,
    loading,
    error,
    fetchAnnonces,
    handleDeleteAnnonce,
    handlePublierAnnonce,
    handleArchiverAnnonce,
    clearError,
  } = useCommunications();

  const [filters, setFilters] = useState<AnnonceFilters>({
    search: '',
    type_annonce: '',
    statut: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; annonceId: number | null }>({
    show: false,
    annonceId: null,
  });

  useEffect(() => {
    fetchAnnonces(filters);
  }, []);

  const handleFilterChange = (key: keyof AnnonceFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchAnnonces(filters);
  };

  const handleReset = () => {
    setFilters({ search: '', type_annonce: '', statut: '' });
    fetchAnnonces();
  };

  const handleDelete = async () => {
    if (deleteModal.annonceId) {
      try {
        await handleDeleteAnnonce(deleteModal.annonceId);
        setDeleteModal({ show: false, annonceId: null });
      } catch (err) {
        console.error('Erreur suppression:', err);
      }
    }
  };

  const handlePublier = async (id: number) => {
    try {
      await handlePublierAnnonce(id);
    } catch (err) {
      console.error('Erreur publication:', err);
    }
  };

  const handleArchiver = async (id: number) => {
    try {
      await handleArchiverAnnonce(id);
    } catch (err) {
      console.error('Erreur archivage:', err);
    }
  };

  const getStatutBadge = (statut: StatutAnnonce) => {
    const styles: Record<StatutAnnonce, { color: string; label: string }> = {
      BROUILLON: { color: 'bg-gray-100 text-gray-700', label: 'Brouillon' },
      PUBLIEE: { color: 'bg-green-100 text-green-700', label: 'Publiée' },
      ARCHIVEE: { color: 'bg-orange-100 text-orange-700', label: 'Archivée' },
    };
    return <Badge className={styles[statut].color}>{styles[statut].label}</Badge>;
  };

  const getTypeBadge = (type: TypeAnnonce) => {
    const styles: Record<TypeAnnonce, { color: string; label: string }> = {
      GENERALE: { color: 'bg-blue-100 text-blue-700', label: 'Générale' },
      ETUDIANTS: { color: 'bg-purple-100 text-purple-700', label: 'Étudiants' },
      ENSEIGNANTS: { color: 'bg-indigo-100 text-indigo-700', label: 'Enseignants' },
      ADMINISTRATION: { color: 'bg-pink-100 text-pink-700', label: 'Administration' },
      URGENTE: { color: 'bg-red-100 text-red-700', label: 'Urgente' },
    };
    return <Badge className={styles[type].color}>{styles[type].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Annonces</h1>
          <p className="text-gray-600 mt-1">Gérer les annonces et actualités de l'université</p>
        </div>
        <Link to="/admin/communications/announcements/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle annonce
          </Button>
        </Link>
      </div>

      {/* Barre de recherche et filtres */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher une annonce..."
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
                  value={filters.type_annonce || ''}
                  onChange={(e) => handleFilterChange('type_annonce', e.target.value)}
                >
                  <option value="">Tous les types</option>
                  <option value="GENERALE">Générale</option>
                  <option value="ETUDIANTS">Étudiants</option>
                  <option value="ENSEIGNANTS">Enseignants</option>
                  <option value="ADMINISTRATION">Administration</option>
                  <option value="URGENTE">Urgente</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <Select
                  value={filters.statut || ''}
                  onChange={(e) => handleFilterChange('statut', e.target.value)}
                >
                  <option value="">Tous les statuts</option>
                  <option value="BROUILLON">Brouillon</option>
                  <option value="PUBLIEE">Publiée</option>
                  <option value="ARCHIVEE">Archivée</option>
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

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">
            ×
          </button>
        </div>
      )}

      {/* Liste des annonces */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : annonces.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Aucune annonce trouvée</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {annonces.map((annonce) => (
            <Card key={annonce.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{annonce.titre}</h3>
                    {annonce.est_prioritaire && (
                      <Badge className="bg-yellow-100 text-yellow-700">Prioritaire</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    {getTypeBadge(annonce.type_annonce)}
                    {getStatutBadge(annonce.statut)}
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">{annonce.contenu}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Par {annonce.auteur?.username || 'Système'}
                    </span>
                    {annonce.date_publication && (
                      <span>
                        Publié le {format(new Date(annonce.date_publication), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    )}
                    {annonce.date_expiration && (
                      <span>
                        Expire le {format(new Date(annonce.date_expiration), 'dd MMMM yyyy', { locale: fr })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {annonce.statut === 'BROUILLON' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handlePublier(annonce.id)}
                      className="flex items-center gap-1"
                    >
                      <Send className="w-4 h-4" />
                      Publier
                    </Button>
                  )}

                  {annonce.statut === 'PUBLIEE' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleArchiver(annonce.id)}
                      className="flex items-center gap-1"
                    >
                      <Archive className="w-4 h-4" />
                      Archiver
                    </Button>
                  )}

                  <Link to={`/admin/communications/announcements/${annonce.id}`}>
                    <Button size="sm" variant="primary" className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link to={`/admin/communications/announcements/${annonce.id}/edit`}>
                    <Button size="sm" variant="primary" className="flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setDeleteModal({ show: true, annonceId: annonce.id })}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
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
        onClose={() => setDeleteModal({ show: false, annonceId: null })}
        onConfirm={handleDelete}
        title="Supprimer l'annonce"
        message="Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
}