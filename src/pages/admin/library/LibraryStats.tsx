import { BookOpen, TrendingUp, Clock, AlertCircle, DollarSign, Award } from 'lucide-react';
import { useLibraryStats } from '@/hooks/useLibrary';
import { Spinner, Badge } from '@/components/ui';

export default function LibraryStats() {
  const { data: stats, isLoading, error } = useLibraryStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Erreur lors du chargement des statistiques</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total livres',
      value: stats.total_livres,
      icon: BookOpen,
      color: 'blue',
      description: 'Livres au catalogue',
    },
    {
      title: 'Exemplaires totaux',
      value: stats.total_exemplaires,
      icon: TrendingUp,
      color: 'purple',
      description: 'Tous exemplaires confondus',
    },
    {
      title: 'Exemplaires disponibles',
      value: stats.exemplaires_disponibles,
      icon: BookOpen,
      color: 'green',
      description: 'Prêts à être empruntés',
    },
    {
      title: 'Exemplaires empruntés',
      value: stats.exemplaires_empruntes,
      icon: Clock,
      color: 'orange',
      description: 'Actuellement en circulation',
    },
    {
      title: 'Emprunts en cours',
      value: stats.emprunts_en_cours,
      icon: Clock,
      color: 'indigo',
      description: 'Emprunts actifs',
    },
    {
      title: 'Emprunts en retard',
      value: stats.emprunts_en_retard,
      icon: AlertCircle,
      color: 'red',
      description: 'À relancer',
    },
    {
      title: 'Pénalités totales',
      value: `${stats.penalites_totales.toLocaleString()} FCFA`,
      icon: DollarSign,
      color: 'yellow',
      description: 'Montant accumulé',
    },
  ];

  const getColorClasses = (color: string): { bg: string; text: string; icon: string } => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600' },
      green: { bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-900', icon: 'text-indigo-600' },
      red: { bg: 'bg-red-50', text: 'text-red-900', icon: 'text-red-600' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600' },
    };
    return (colors[color] ?? colors.blue) as { bg: string; text: string; icon: string };
  };

  const tauxDisponibilite = stats.total_exemplaires > 0
    ? ((stats.exemplaires_disponibles / stats.total_exemplaires) * 100).toFixed(1)
    : 0;

  const tauxOccupation = stats.total_exemplaires > 0
    ? ((stats.exemplaires_empruntes / stats.total_exemplaires) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistiques de la Bibliothèque</h1>
        <p className="text-gray-600 mt-1">
          Vue d'ensemble de l'activité et des performances
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const classes = getColorClasses(card.color);
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`${classes.bg} rounded-lg p-6 border`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-3xl font-bold ${classes.text}`}>{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${classes.bg}`}>
                  <Icon className={`w-6 h-6 ${classes.icon}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Taux et indicateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de disponibilité</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Exemplaires disponibles</span>
                <span className="text-sm font-semibold text-gray-900">{tauxDisponibilite}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${tauxDisponibilite}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Disponibles</p>
                <p className="text-xl font-bold text-green-600">
                  {stats.exemplaires_disponibles}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total_exemplaires}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux d'occupation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Exemplaires empruntés</span>
                <span className="text-sm font-semibold text-gray-900">{tauxOccupation}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all"
                  style={{ width: `${tauxOccupation}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Empruntés</p>
                <p className="text-xl font-bold text-orange-600">
                  {stats.exemplaires_empruntes}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total_exemplaires}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Livre le plus emprunté */}
      {stats.livre_plus_emprunte && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Livre le plus emprunté
              </h3>
              <p className="text-2xl font-bold text-purple-900 mb-1">
                {stats.livre_plus_emprunte.titre}
              </p>
              <p className="text-purple-700 mb-2">Par {stats.livre_plus_emprunte.auteur}</p>
              <Badge variant="primary" size="lg">
                {stats.livre_plus_emprunte.nombre_emprunts} emprunt
                {stats.livre_plus_emprunte.nombre_emprunts > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Répartition par catégorie */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Répartition des livres par catégorie
        </h3>
        {stats.livres_par_categorie.length > 0 ? (
          <div className="space-y-3">
            {stats.livres_par_categorie
              .sort((a, b) => b.count - a.count)
              .map((item, index) => {
                const percentage = stats.total_livres > 0
                  ? ((item.count / stats.total_livres) * 100).toFixed(1)
                  : 0;

                const colors = [
                  'bg-blue-500',
                  'bg-purple-500',
                  'bg-green-500',
                  'bg-orange-500',
                  'bg-pink-500',
                  'bg-indigo-500',
                  'bg-red-500',
                  'bg-yellow-500',
                ];

                return (
                  <div key={item.nom}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.nom}</span>
                      <span className="text-sm text-gray-600">
                        {item.count} livre{item.count > 1 ? 's' : ''} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${colors[index % colors.length]} h-2 rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Aucune donnée de catégorie disponible
          </p>
        )}
      </div>

      {/* Alertes et actions recommandées */}
      {(stats.emprunts_en_retard > 0 || stats.penalites_totales > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Actions recommandées
              </h3>
              <ul className="space-y-2">
                {stats.emprunts_en_retard > 0 && (
                  <li className="text-sm text-red-700">
                    • Relancer les {stats.emprunts_en_retard} étudiant
                    {stats.emprunts_en_retard > 1 ? 's' : ''} en retard
                  </li>
                )}
                {stats.penalites_totales > 0 && (
                  <li className="text-sm text-red-700">
                    • Collecter {stats.penalites_totales.toLocaleString()} FCFA de pénalités
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}