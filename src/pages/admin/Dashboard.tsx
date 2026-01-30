/**
 * Dashboard Admin - Vue d'ensemble complète du système
 * Inclut: Stats principales, Modules (Students, Académique), Activités récentes, Actions rapides
 */

import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Building2,
  Building,
  FileText,
  ArrowRight,
  UserPlus,
  UserCheck,
  CreditCard,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Button, Badge, Card } from '@/components/ui';
import { useAuth } from '@/hooks';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Stats principales avec couleurs variées et modernes
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

  // Activités récentes
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
      color: 'text-green-600',
      bgColor: 'bg-green-50',
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
      text: "Cours d'Algorithmique ajouté - Salle A205",
      time: '2h',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: BookOpen,
      text: '3 nouveaux livres ajoutés à la bibliothèque',
      time: '3h',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  // Alertes et actions requises
  const alerts = [
    {
      icon: UserCheck,
      text: '15 étudiants avec retard de paiement',
      action: 'Traiter',
    },
    {
      icon: ClipboardCheck,
      text: "3 conflits d'emploi du temps à résoudre",
      action: 'Traiter',
    },
    {
      icon: FileText,
      text: "8 certificats d'absence en attente",
      action: 'Traiter',
    },
    {
      icon: Calendar,
      text: 'Session de délibération L3 Économie à planifier',
      action: 'Traiter',
    },
  ];

  // Actions rapides
  const quickActions = [
    {
      label: 'Nouvel Étudiant',
      icon: UserPlus,
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
      onClick: () => navigate('/admin/students/etudiants'),
    },
    {
      label: 'Saisir Notes',
      icon: ClipboardCheck,
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
      onClick: () => navigate('/admin/evaluations'),
    },
    {
      label: 'Enreg. Paiement',
      icon: CreditCard,
      gradient: 'from-green-500 to-green-600',
      hoverGradient: 'hover:from-green-600 hover:to-green-700',
      onClick: () => navigate('/admin/finance'),
    },
    {
      label: 'Générer Rapport',
      icon: BarChart3,
      gradient: 'from-orange-500 to-orange-600',
      hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
      onClick: () => navigate('/admin/statistics'),
    },
  ];

  // ==================== MODULE STUDENTS ====================
  const studentsModule = {
    title: 'Module Students',
    description: 'Gestion des étudiants et enseignants',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-purple-600',
    sections: [
      {
        icon: GraduationCap,
        title: 'Étudiants',
        description: 'Gérer les étudiants',
        count: 2547,
        route: '/admin/students/etudiants',
        color: 'blue',
      },
      {
        icon: Users,
        title: 'Enseignants',
        description: 'Gérer les enseignants',
        count: 147,
        route: '/admin/students/enseignants',
        color: 'purple',
      },
    ],
  };

  // ==================== MODULE ACADÉMIQUE ====================
  const academicModule = {
    title: 'Module Académique',
    description: 'Vue hiérarchique complète',
    icon: Building2,
    gradient: 'from-emerald-500 to-teal-600',
    sections: [
      {
        icon: Building2,
        title: 'Structure Académique',
        description: 'Vue hiérarchique complète',
        route: '/admin/academic/structure',
        color: 'emerald',
      },
      {
        icon: BookOpen,
        title: 'Années Académiques',
        description: 'Gérer les années scolaires',
        route: '/admin/academic/annees-academiques',
        color: 'teal',
      },
      {
        icon: Building2,
        title: 'Facultés',
        description: 'Gérer les facultés',
        route: '/admin/academic/facultes',
        color: 'cyan',
      },
      {
        icon: Building,
        title: 'Départements',
        description: 'Gérer les départements',
        route: '/admin/academic/departements',
        color: 'sky',
      },
      {
        icon: GraduationCap,
        title: 'Filières',
        description: 'Programmes et études',
        route: '/admin/academic/filieres',
        color: 'blue',
      },
      {
        icon: BookOpen,
        title: 'Matières',
        description: 'Unités d\'enseignement',
        route: '/admin/academic/matieres',
        color: 'indigo',
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue, {user?.first_name || 'Franklin Junior MONTHE DJOMBOU'} ! 🎉
            </h1>
            <p className="text-blue-100 text-lg">
              Voici un aperçu de votre système de gestion universitaire
            </p>
          </div>
          <div className="hidden md:block text-6xl opacity-20">🎓</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 ${stat.lightBg} rounded-xl`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={2.5} />
                </div>
                <Badge variant="success" className="text-xs font-semibold">
                  {stat.change}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              
              {/* Gradient bottom border */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
            </Card>
          );
        })}
      </div>

      {/* ==================== MODULE STUDENTS ==================== */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-gradient-to-br ${studentsModule.gradient} rounded-xl`}>
              <studentsModule.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{studentsModule.title}</h2>
              <p className="text-gray-600 text-sm">{studentsModule.description}</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/students/etudiants')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Voir tout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentsModule.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(section.route)}
                className={`group relative bg-gradient-to-br from-${section.color}-50 to-white p-6 rounded-xl border-2 border-${section.color}-100 hover:border-${section.color}-300 transition-all duration-300 hover:shadow-lg text-left`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 bg-${section.color}-100 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${section.color}-600`} />
                  </div>
                  {section.count && (
                    <Badge variant="info" className="text-sm font-bold">
                      {section.count}
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600">{section.description}</p>
                <ArrowRight className="absolute bottom-4 right-4 w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </Card>

      {/* ==================== MODULE ACADÉMIQUE ==================== */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 bg-gradient-to-br ${academicModule.gradient} rounded-xl`}>
              <academicModule.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{academicModule.title}</h2>
              <p className="text-gray-600 text-sm">{academicModule.description}</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/academic/structure')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Vue complète
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {academicModule.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(section.route)}
                className="group relative bg-white p-5 rounded-xl border-2 border-gray-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 bg-${section.color}-100 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <Icon className={`w-5 h-5 text-${section.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors truncate">
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{section.description}</p>
                  </div>
                </div>
                <ArrowRight className="absolute bottom-3 right-3 w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })}
        </div>
      </Card>

      {/* Activités Récentes & Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <Card padding="md">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Activités récentes
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
                >
                  <div className={`flex-shrink-0 p-2 ${activity.bgColor} rounded-lg`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium leading-snug">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">Il y a {activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 py-2">
            Voir toutes les activités
            <ArrowRight className="w-4 h-4" />
          </button>
        </Card>

        {/* Alertes */}
        <Card padding="md" className="bg-orange-50 border-orange-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-600" />
            Alertes & Actions requises
          </h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <Icon className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
                  </div>
                  <p className="flex-1 text-sm text-gray-900 font-medium leading-snug">{alert.text}</p>
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    {alert.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
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
    </div>
  );
}