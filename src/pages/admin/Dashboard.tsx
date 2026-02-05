/**
 * Dashboard Admin - Style Module Académique Moderne
 */

import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  Building2,
  FileText,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboard';
import Spinner from '@/components/ui/Spinner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Cartes statistiques principales
  const mainStats = [
    {
      title: 'Étudiants actifs',
      value: stats?.students.actifs?.toLocaleString() || '0',
      change: `+${stats?.students.nouveaux || 0} ce mois`,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      path: '/admin/students',
    },
    {
      title: 'Total étudiants',
      value: stats?.students.total?.toLocaleString() || '0',
      change: 'Tous statuts',
      icon: GraduationCap,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      path: '/admin/students',
    },
    {
      title: 'Montant impayé',
      value: stats?.finance.montant_impaye 
        ? `${(stats.finance.montant_impaye / 1000000).toFixed(1)}M`
        : '0',
      change: `${stats?.finance.etudiants_impaye || 0} étudiants`,
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      path: '/admin/finance',
    },
    {
      title: 'Taux de réussite',
      value: `${stats?.students.taux_reussite || 0}%`,
      change: `${stats?.students.par_statut?.diplomes || 0} diplômés`,
      icon: Award,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      path: '/admin/evaluations',
    },
  ];

  // Statistiques détaillées
  const detailedStats = [
    {
      label: 'Masculin',
      value: stats?.students.par_sexe?.masculin || 0,
      total: stats?.students.total || 0,
      color: 'blue',
    },
    {
      label: 'Féminin',
      value: stats?.students.par_sexe?.feminin || 0,
      total: stats?.students.total || 0,
      color: 'pink',
    },
    {
      label: 'Suspendus',
      value: stats?.students.par_statut?.suspendus || 0,
      total: stats?.students.total || 0,
      color: 'yellow',
    },
    {
      label: 'Abandons',
      value: stats?.students.par_statut?.abandonnes || 0,
      total: stats?.students.total || 0,
      color: 'red',
    },
  ];

  // Actions rapides
  const quickActions = [
    {
      title: 'Nouvel étudiant',
      description: 'Inscrire un nouvel étudiant',
      icon: Users,
      color: 'blue',
      path: '/admin/students/new',
    },
    {
      title: 'Nouvel enseignant',
      description: 'Ajouter un enseignant',
      icon: GraduationCap,
      color: 'purple',
      path: '/admin/teachers/new',
    },
    {
      title: 'Nouvelle faculté',
      description: 'Créer une faculté',
      icon: Building2,
      color: 'green',
      path: '/admin/academic/facultes',
    },
    {
      title: 'Import CSV',
      description: 'Importer des étudiants',
      icon: FileText,
      color: 'orange',
      path: '/admin/students/import',
    },
  ];

  // Alertes
  const alerts = [
    {
      type: 'danger',
      icon: XCircle,
      message: `${stats?.finance.etudiants_impaye || 0} étudiants avec retard de paiement`,
    },
    {
      type: 'warning',
      icon: AlertCircle,
      message: `${stats?.students.par_statut?.suspendus || 0} étudiants suspendus`,
    },
    {
      type: 'info',
      icon: CheckCircle,
      message: `${stats?.students.nouveaux || 0} nouveaux étudiants ce mois`,
    },
  ];

  const getAlertColor = (type: string) => {
    const colors = {
      danger: 'bg-red-50 border-red-200 text-red-700',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      info: 'bg-blue-50 border-blue-200 text-blue-700',
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenue sur le Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Vue d'ensemble de votre système de gestion universitaire
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(stat.path)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {stat.change.startsWith('+') ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-gray-400" />
                    )}
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Répartition et Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Répartition */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Répartition des étudiants
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {detailedStats.map((item, index) => {
              const percentage = item.total > 0 
                ? Math.round((item.value / item.total) * 100) 
                : 0;
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${item.color}-500 h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{percentage}% du total</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Actions rapides
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 text-${action.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{action.title}</p>
                    <p className="text-xs text-gray-500 truncate">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alertes et Activités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Alertes & Notifications
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{alert.message}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistiques financières */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Aperçu financier
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total payé</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats?.finance.total_paye 
                    ? `${(stats.finance.total_paye / 1000000).toFixed(1)}M`
                    : '0'} FCFA
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Montant impayé</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats?.finance.montant_impaye 
                    ? `${(stats.finance.montant_impaye / 1000000).toFixed(1)}M`
                    : '0'} FCFA
                </p>
              </div>
              <XCircle className="w-10 h-10 text-red-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total à percevoir</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats?.finance.total_a_payer 
                    ? `${(stats.finance.total_a_payer / 1000000).toFixed(1)}M`
                    : '0'} FCFA
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}