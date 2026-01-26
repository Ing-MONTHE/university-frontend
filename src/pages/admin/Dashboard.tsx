import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks';
import { useUIStore } from '@/store';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  BookOpen,
  Calendar,
  ClipboardCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  useUIStore();

  // Stats avec couleurs qui changent selon le thème
  const stats = [
    {
      icon: Users,
      label: 'Étudiants actifs',
      value: '2,547',
      change: '+12%',
      changeType: 'increase',
    },
    {
      icon: GraduationCap,
      label: 'Enseignants',
      value: '147',
      change: '+5 ce mois',
      changeType: 'increase',
    },
    {
      icon: DollarSign,
      label: 'Revenus mensuels',
      value: '12.5M',
      change: '+8%',
      changeType: 'increase',
    },
    {
      icon: TrendingUp,
      label: 'Taux de réussite',
      value: '87.3%',
      change: '+2.1%',
      changeType: 'increase',
    },
  ];

  const recentActivities = [
    { 
      icon: Users, 
      text: 'Jean Dupont inscrit en L1 Informatique', 
      time: '5 min',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    { 
      icon: DollarSign, 
      text: 'Paiement de 150,000 FCFA - Marie Kouassi', 
      time: '12 min',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    { 
      icon: ClipboardCheck, 
      text: 'Notes saisies - Mathématiques L2 (Prof. Amani)', 
      time: '1h',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
    { 
      icon: Calendar, 
      text: 'Cours d\'Algorithmique ajouté - Salle A205', 
      time: '2h',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    { 
      icon: BookOpen, 
      text: '3 nouveaux livres ajoutés à la bibliothèque', 
      time: '3h',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const alerts = [
    { 
      icon: XCircle, 
      text: '15 étudiants avec retard de paiement', 
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-500',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    { 
      icon: AlertTriangle, 
      text: '3 conflits d\'emploi du temps à résoudre', 
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-500',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    { 
      icon: Clock, 
      text: '8 justificatifs d\'absence en attente', 
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-500',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    { 
      icon: CheckCircle2, 
      text: 'Session de délibération L3 Économie à planifier', 
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
  ];

  const quickActions = [
    { icon: Users, label: 'Nouvel Étudiant', color: 'from-blue-500 to-blue-600', hoverColor: 'hover:from-blue-600 hover:to-blue-700' },
    { icon: ClipboardCheck, label: 'Saisir Notes', color: 'from-violet-500 to-violet-600', hoverColor: 'hover:from-violet-600 hover:to-violet-700' },
    { icon: DollarSign, label: 'Enreg. Paiement', color: 'from-emerald-500 to-emerald-600', hoverColor: 'hover:from-emerald-600 hover:to-emerald-700' },
    { icon: TrendingUp, label: 'Générer Rapport', color: 'from-amber-500 to-amber-600', hoverColor: 'hover:from-amber-600 hover:to-amber-700' },
  ];

  return (
    <MainLayout>
      {/* Welcome Section - S'adapte au thème */}
      <div className="mb-8 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
              Bienvenue, {user?.full_name || user?.username} ! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Voici un aperçu de votre système de gestion universitaire
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Aujourd'hui</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Couleurs qui changent selon le thème */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <div
              key={index}
              className="group relative rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden
                         bg-gradient-to-br from-[#2c5f7c] to-[#1e3a5f] 
                         dark:from-[#2c5f7c] dark:to-[#1e3a5f]
                         text-white"
            >
              {/* Effet brillant au hover */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Icône + Badge changement */}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-lg">
                    <ArrowUpRight className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-semibold text-green-400">
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                {/* Label + Valeur */}
                <p className="text-sm opacity-80 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Activités récentes</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                  >
                    <div className={`${activity.bgColor} dark:bg-opacity-20 p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`w-5 h-5 ${activity.color} dark:text-opacity-90`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{activity.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Il y a {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="w-full mt-4 py-2.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
              Voir toutes les activités →
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Alertes & Actions requises</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                
                return (
                  <div 
                    key={index} 
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 ${alert.borderColor} ${alert.bgColor} hover:shadow-sm transition-all duration-200 group`}
                  >
                    <div className="flex-shrink-0">
                      <Icon className={`w-5 h-5 ${alert.iconColor}`} />
                    </div>
                    <p className="flex-1 text-sm text-gray-900 dark:text-gray-100 font-medium">{alert.text}</p>
                    <button className="flex-shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline">
                      Traiter
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Actions rapides</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button 
                key={index}
                className={`group relative bg-gradient-to-br ${action.color} ${action.hoverColor} text-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                <div className="relative flex flex-col items-center text-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition-colors duration-300">
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="font-semibold text-sm">{action.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}