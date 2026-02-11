import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  BookOpen,
  Edit2,
  Trash2,
  Eye,
  X,
} from 'lucide-react';
import {
  useLivres,
  useDeleteLivre,
  useCategories,
} from '@/hooks/useLibrary';
import { Badge, Spinner } from '@/components/ui';
import type { Livre, LivreFilters } from '@/types/library.types';

export default function BooksList() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<LivreFilters>({});

  const { data: categories = [] } = useCategories();
  const { data: livres = [], isLoading, error } = useLivres(filters);
  const deleteLivre = useDeleteLivre();

  // Filtrer les livres localement pour la recherche en temps réel
  const filteredLivres = useMemo(() => {
    if (!searchTerm) return livres;
    const term = searchTerm.toLowerCase();
    return livres.filter(
      (livre) =>
        livre.titre.toLowerCase().includes(term) ||
        livre.auteur.toLowerCase().includes(term) ||
        livre.isbn.toLowerCase().includes(term)
    );
  }, [livres, searchTerm]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        await deleteLivre.mutateAsync(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleFilterChange = (key: keyof LivreFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const getDisponibiliteStatus = (livre: Livre) => {
    if (livre.nombre_exemplaires_disponibles === 0) {
      return { label: 'Indisponible', variant: 'destructive' as const };
    }
    if (livre.nombre_exemplaires_disponibles < livre.nombre_exemplaires_total / 2) {
      return { label: 'Stock faible', variant: 'warning' as const };
    }
    return { label: 'Disponible', variant: 'success' as const };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Erreur lors du chargement des livres</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalogue des Livres</h1>
          <p className="text-gray-600 mt-1">
            {filteredLivres.length} livre{filteredLivres.length !== 1 ? 's' : ''} disponible
            {filteredLivres.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/admin/library/books/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Ajouter un livre
        </Link>
      </div>

      {/* Barre de recherche et actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, auteur ou ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              showFilters
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filtres
            {Object.keys(filters).filter((k) => filters[k as keyof LivreFilters]).length > 0 && (
              <Badge variant="primary" size="sm">
                {Object.keys(filters).filter((k) => filters[k as keyof LivreFilters]).length}
              </Badge>
            )}
          </button>

          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue grille"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue liste"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Panel de filtres */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={filters.categorie || ''}
                  onChange={(e) =>
                    handleFilterChange('categorie', e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disponibilité
                </label>
                <select
                  value={filters.disponible?.toString() || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'disponible',
                      e.target.value === '' ? undefined : e.target.value === 'true'
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="true">Disponible uniquement</option>
                  <option value="false">Indisponible uniquement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auteur
                </label>
                <input
                  type="text"
                  value={filters.auteur || ''}
                  onChange={(e) => handleFilterChange('auteur', e.target.value)}
                  placeholder="Filtrer par auteur..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des livres */}
      {filteredLivres.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun livre trouvé</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || Object.keys(filters).length > 0
              ? 'Aucun livre ne correspond à vos critères de recherche'
              : 'Commencez par ajouter des livres à votre bibliothèque'}
          </p>
          {!searchTerm && Object.keys(filters).length === 0 && (
            <Link
              to="/admin/library/books/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Ajouter le premier livre
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLivres.map((livre) => {
            const status = getDisponibiliteStatus(livre);
            const categorieObj = typeof livre.categorie === 'object' ? livre.categorie : null;

            return (
              <div
                key={livre.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {livre.photo_couverture ? (
                    <img
                      src={livre.photo_couverture}
                      alt={livre.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={status.variant} size="sm">
                      {status.label}
                    </Badge>
                  </div>
                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link
                      to={`/admin/library/books/${livre.id}`}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </Link>
                    <Link
                      to={`/admin/library/books/${livre.id}/edit`}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-5 h-5 text-blue-600" />
                    </Link>
                    <button
                      onClick={() => handleDelete(livre.id)}
                      className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
                    {livre.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{livre.auteur}</p>
                  {categorieObj && (
                    <Badge variant="secondary" size="sm" className="mb-2">
                      {categorieObj.nom}
                    </Badge>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                    <span>Stock: {livre.nombre_exemplaires_disponibles}/{livre.nombre_exemplaires_total}</span>
                    <span className="text-xs text-gray-500">{livre.annee_publication}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Livre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ISBN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLivres.map((livre) => {
                const status = getDisponibiliteStatus(livre);
                const categorieObj = typeof livre.categorie === 'object' ? livre.categorie : null;

                return (
                  <tr key={livre.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {livre.photo_couverture ? (
                            <img
                              src={livre.photo_couverture}
                              alt={livre.titre}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{livre.titre}</p>
                          <p className="text-sm text-gray-600">{livre.auteur}</p>
                          <p className="text-xs text-gray-500">{livre.editeur}, {livre.annee_publication}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{livre.isbn}</td>
                    <td className="px-6 py-4">
                      {categorieObj && (
                        <Badge variant="secondary" size="sm">
                          {categorieObj.nom}
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {livre.nombre_exemplaires_disponibles} / {livre.nombre_exemplaires_total}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={status.variant} size="sm">
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/library/books/${livre.id}`}
                          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/library/books/${livre.id}/edit`}
                          className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(livre.id)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}