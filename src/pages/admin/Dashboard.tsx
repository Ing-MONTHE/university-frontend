import MainLayout from '@/components/layout/MainLayout';
import { Button, Badge, Card } from '@/components/ui';
import { useAuth } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Network,
  Building2,
  Building,
  FileText,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Stats avec couleurs variées et modernes
  const stats = [
    {
      icon: Users,
      label: 'Étudiants actifs',
      value: '2,547',
      change: '+12%',
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      lightBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: GraduationCap,
      label: 'Enseignants',
      value: '147',
      change: '+5 ce mois',
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      lightBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: DollarSign,
      label: 'Revenus mensuels',
      value: '12.5M',
      change: '+8%',
      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
      lightBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: TrendingUp,
      label: 'Taux de réussite',
      value: '87.3%',
      change: '+2.1%',
      gradient: 'from-orange-500 via-orange-600 to-orange-700',
      lightBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
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
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
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
      variant: 'danger' as const,
    },
    { 
      icon: AlertTriangle, 
      text: '3 conflits d\'emploi du temps à résoudre', 
      variant: 'warning' as const,
    },
    { 
      icon: Clock, 
      text: '8 justificatifs d\'absence en attente', 
      variant: 'warning' as const,
    },
    { 
      icon: CheckCircle2, 
      text: 'Session de délibération L3 Économie à planifier', 
      variant: 'info' as const,
    },
  ];

  const quickActions = [
    { 
      icon: Users, 
      label: 'Nouvel Étudiant', 
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      onClick: () => navigate('/admin/students'),
    },
    { 
      icon: ClipboardCheck, 
      label: 'Saisir Notes', 
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
      onClick: () => navigate('/admin/evaluations'),
    },
    { 
      icon: DollarSign, 
      label: 'Enreg. Paiement', 
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-emerald-700',
      onClick: () => navigate('/admin/finance'),
    },
    { 
      icon: TrendingUp, 
      label: 'Générer Rapport', 
      gradient: 'from-orange-500 to-orange-600',
      hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
      onClick: () => navigate('/admin/analytics'),
    },
  ];

  // NOUVEAU : Raccourcis module académique
  const academicShortcuts = [
    {
      icon: Network,
      label: 'Structure Académique',
      description: 'Vue hiérarchique complète',
      gradient: 'from-teal-500 to-teal-600',
      path: '/admin/academic/structure',
    },
    {
      icon: Calendar,
      label: 'Années Académiques',
      description: 'Gérer les années scolaires',
      gradient: 'from-indigo-500 to-indigo-600',
      path: '/admin/academic/annees-academiques',
    },
    {
      icon: Building2,
      label: 'Facultés',
      description: 'Gérer les facultés',
      gradient: 'from-blue-500 to-blue-600',
      path: '/admin/academic/facultes',
    },
    {
      icon: Building,
      label: 'Départements',
      description: 'Gérer les départements',
      gradient: 'from-violet-500 to-violet-600',
      path: '/admin/academic/departements',
    },
    {
      icon: GraduationCap,
      label: 'Filières',
      description: 'Programmes d\'études',
      gradient: 'from-purple-500 to-purple-600',
      path: '/admin/academic/filieres',
    },
    {
      icon: FileText,
      label: 'Matières',
      description: 'Unités d\'enseignement',
      gradient: 'from-pink-500 to-pink-600',
      path: '/admin/academic/matieres',
    },
  ];

  return (
    <MainLayout>
      {/* Welcome Section */}
      <div className="mb-6 bg-gradient-to-r from-white via-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent mb-1">
                Bienvenue, {user?.full_name || user?.username} ! 👋
              </h1>
              <p className="text-gray-600 text-base">
                Voici un aperçu de votre système de gestion universitaire
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="text-right bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 font-medium">Aujourd'hui</p>
              <p className="text-base font-bold text-gray-900">
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          
          return (
            <Card
              key={index}
              padding="md"
              variant="default"
              hoverable
              className="group relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`${stat.lightBg} p-2.5 rounded-lg group-hover:bg-white/20 transition-colors duration-300`}>
                    <Icon className={`w-7 h-7 ${stat.iconColor} group-hover:text-white transition-colors duration-300`} strokeWidth={2.5} />
                  </div>
                  <Badge variant="success" size="sm" className="group-hover:bg-white/20 group-hover:text-white group-hover:border-white/30">
                    {stat.change}
                  </Badge>
                </div>
                
                <p className="text-base font-medium text-gray-600 group-hover:text-white/90 mb-2 transition-colors duration-300">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-gray-900 group-hover:text-white tracking-tight transition-colors duration-300">
                  {stat.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* NOUVEAU : Section Module Académique */}
      <Card padding="md" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Module Académique
          </h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/academic/structure')}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Vue complète
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {academicShortcuts.map((shortcut, index) => {
            const Icon = shortcut.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(shortcut.path)}
                className="group text-left bg-white border-2 border-gray-100 hover:border-blue-200 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 bg-gradient-to-br ${shortcut.gradient} rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors">
                      {shortcut.label}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {shortcut.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        
        {/* Recent Activities */}
        <Card
          padding="none"
          variant="default"
          className="hover:shadow-md transition-shadow duration-300"
        >
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Activités récentes
            </h2>
          </div>
          
          <div className="p-5">
            <div className="space-y-2.5">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
                  >
                    <div className={`${activity.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                      <Icon className={`w-4 h-4 ${activity.color}`} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium leading-snug">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Il y a {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button variant="ghost" fullWidth className="mt-3 border-2 border-transparent hover:border-blue-200">
              Voir toutes les activités →
            </Button>
          </div>
        </Card>

        {/* Alerts */}
        <Card
          padding="none"
          variant="default"
          className="hover:shadow-md transition-shadow duration-300"
        >
          <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Alertes & Actions requises
            </h2>
          </div>
          
          <div className="p-5">
            <div className="space-y-2.5">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                
                return (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                    </div>
                    <p className="flex-1 text-sm text-gray-900 font-medium leading-snug">{alert.text}</p>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      Traiter
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card padding="md">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Actions rapides
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button 
                key={index}
                onClick={action.onClick}
                className={`group relative bg-gradient-to-br ${action.gradient} ${action.hoverGradient} text-white rounded-xl p-5 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative flex flex-col items-center text-center gap-2.5">
                  <div className="bg-white/20 p-2.5 rounded-lg group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                    <Icon className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold text-sm leading-tight">{action.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    </MainLayout>
  );
}