import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  Library,
  DollarSign,
  Bell,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/config/constants';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  roles?: string[];
}

// Menu principal de navigation
const mainMenuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: ROUTES.ADMIN_DASHBOARD,
    roles: ['ADMIN'],
  },
  {
    icon: Users,
    label: 'Étudiants',
    path: '/admin/students',
    roles: ['ADMIN'],
  },
  {
    icon: GraduationCap,
    label: 'Enseignants',
    path: '/admin/teachers',
    roles: ['ADMIN'],
  },
  {
    icon: BookOpen,
    label: 'Académique',
    path: '/admin/academic',
    roles: ['ADMIN'],
  },
  {
    icon: ClipboardList,
    label: 'Notes',
    path: '/admin/evaluations',
    roles: ['ADMIN'],
  },
  {
    icon: Calendar,
    label: 'Emploi du temps',
    path: '/admin/schedule',
    roles: ['ADMIN'],
  },
  {
    icon: Library,
    label: 'Bibliothèque',
    path: '/admin/library',
    roles: ['ADMIN'],
  },
  {
    icon: DollarSign,
    label: 'Finance',
    path: '/admin/finance',
    roles: ['ADMIN'],
  },
  {
    icon: BarChart3,
    label: 'Statistiques',
    path: '/admin/analytics',
    roles: ['ADMIN'],
  },
];

// Menu du bas (séparé)
const bottomMenuItems: MenuItem[] = [
  {
    icon: Bell,
    label: 'Notifications',
    path: '/admin/notifications',
    roles: ['ADMIN'],
  },
  {
    icon: HelpCircle,
    label: 'Support',
    path: '/admin/support',
    roles: ['ADMIN'],
  },
  {
    icon: Settings,
    label: 'Paramètres',
    path: '/admin/settings',
    roles: ['ADMIN'],
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  // Extraire les noms de rôles de l'utilisateur
  const userRoles = user?.roles?.map((role: any) => role.name) || [];

  // Filtrer les items de menu selon le rôle de l'utilisateur
  const filteredMainItems = mainMenuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => userRoles.includes(role));
  });

  const filteredBottomItems = bottomMenuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => userRoles.includes(role));
  });

  return (
    <aside
      className={`bg-[#1e3a5f] text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header - Logo & Toggle */}
      <div className="px-5 py-5 border-b border-white/10">
        {!isCollapsed ? (
          // Mode étendu : Logo + nom + bouton à droite
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo Shield */}
              <div className="relative w-9 h-11">
                <svg viewBox="0 0 80 96" className="absolute inset-0 drop-shadow-lg">
                  <defs>
                    <linearGradient id="sidebarShieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.3)' }} />
                      <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)' }} />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M40 0 L5 15 L5 45 Q5 70 40 95 Q75 70 75 45 L75 15 Z" 
                    fill="url(#sidebarShieldGrad)" 
                    stroke="rgba(255,255,255,0.5)" 
                    strokeWidth="2"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                  <GraduationCap className="w-5 h-5 text-white mb-0.5" strokeWidth={2.5} />
                  <span className="text-white font-bold text-[8px] tracking-wider">UMS</span>
                </div>
              </div>

              <div>
                <h1 className="font-bold text-base">UMS</h1>
                <p className="text-xs text-white/60">Admin Panel</p>
              </div>
            </div>

            {/* Bouton collapse */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Réduire"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Mode réduit : Logo centré + bouton en dessous
          <div className="flex flex-col items-center gap-2">
            {/* Logo Shield centré */}
            <div className="relative w-9 h-11">
              <svg viewBox="0 0 80 96" className="absolute inset-0 drop-shadow-lg">
                <defs>
                  <linearGradient id="sidebarShieldGradCollapsed" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.3)' }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)' }} />
                  </linearGradient>
                </defs>
                <path 
                  d="M40 0 L5 15 L5 45 Q5 70 40 95 Q75 70 75 45 L75 15 Z" 
                  fill="url(#sidebarShieldGradCollapsed)" 
                  stroke="rgba(255,255,255,0.5)" 
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <GraduationCap className="w-5 h-5 text-white mb-0.5" strokeWidth={2.5} />
                <span className="text-white font-bold text-[8px] tracking-wider">UMS</span>
              </div>
            </div>

            {/* Bouton expand visible */}
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Étendre"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Navigation - Espacements comme image 3 */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {filteredMainItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md' // Sélectionneur bleu clair
                  : 'text-white/90 hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
              {!isCollapsed && (
                <span>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu - Séparation subtile */}
      <div className="px-3 py-2 space-y-0.5 border-t border-white/10">
        {filteredBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const hasNotification = item.label === 'Notifications';

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative text-sm font-medium ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-white/90 hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
              {!isCollapsed && (
                <span>{item.label}</span>
              )}
              {/* Badge notifications */}
              {hasNotification && (
                <span className={`${isCollapsed ? 'absolute -top-0.5 -right-0.5' : 'ml-auto'} bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center`}>
                  4
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Profile - Bottom */}
      <div className="px-3 py-3 border-t border-white/10">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            {/* Avatar avec dégradé */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 ring-2 ring-blue-400/20">
              <span className="text-xs font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Info utilisateur */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.username}
              </p>
              <p className="text-[10px] text-white/60 truncate">
                {user?.email}
              </p>
            </div>
            {/* Flèche au hover */}
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>
        ) : (
          // Avatar seul en mode collapsed
          <button className="w-full flex justify-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ring-2 ring-blue-400/20">
              <span className="text-xs font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </button>
        )}
      </div>
    </aside>
  );
}