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
  ChevronDown,
  Building2,
  Building,
  Network,
  FileText,
  DoorOpen,
  Clock,
  CalendarDays,
  AlertCircle,
  Receipt,
  CreditCard,
  Award,
  BookMarked,
  BookCopy,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/config/constants';

interface SubMenuItem {
  icon: any;
  label: string;
  path: string;
}

interface MenuItem {
  icon: any;
  label: string;
  path?: string;
  roles?: string[];
  children?: SubMenuItem[];
}

// Menu principal de navigation avec sous-menus
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
    roles: ['ADMIN'],
    children: [
      {
        icon: Network,
        label: 'Structure',
        path: '/admin/academic/structure',
      },
      {
        icon: Calendar,
        label: 'Années Académiques',
        path: '/admin/academic/annees-academiques',
      },
      {
        icon: Building2,
        label: 'Facultés',
        path: '/admin/academic/facultes',
      },
      {
        icon: Building,
        label: 'Départements',
        path: '/admin/academic/departements',
      },
      {
        icon: GraduationCap,
        label: 'Filières',
        path: '/admin/academic/filieres',
      },
      {
        icon: FileText,
        label: 'Matières',
        path: '/admin/academic/matieres',
      },
    ],
  },
  {
    icon: ClipboardList,
    label: 'Évaluations',
    path: '/admin/evaluations',
    roles: ['ADMIN', 'TEACHER'],
  },
  {
    icon: Calendar,
    label: 'Emploi du temps',
    roles: ['ADMIN'],
    children: [
      {
        icon: CalendarDays,
        label: 'Planning',
        path: '/admin/schedule/planning',
      },
      {
        icon: Building2,
        label: 'Bâtiments',
        path: '/admin/schedule/batiments',
      },
      {
        icon: DoorOpen,
        label: 'Salles',
        path: '/admin/schedule/salles',
      },
      {
        icon: Clock,
        label: 'Créneaux',
        path: '/admin/schedule/creneaux',
      },
      {
        icon: AlertCircle,
        label: 'Conflits',
        path: '/admin/schedule/conflits',
      },
    ],
  },
  {
    icon: Library,
    label: 'Bibliothèque',
    roles: ['ADMIN'],
    children: [
      {
        icon: TrendingUp,
        label: 'Statistiques',
        path: '/admin/library/stats',
      },
      {
        icon: BookMarked,
        label: 'Catalogue',
        path: '/admin/library/books',
      },
      {
        icon: BookCopy,
        label: 'Emprunts',
        path: '/admin/library/borrowings',
      },
    ],
  },
  {
    icon: DollarSign,
    label: 'Finance',
    roles: ['ADMIN'],
    children: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/admin/finance/dashboard',
      },
      {
        icon: Receipt,
        label: 'Frais de Scolarité',
        path: '/admin/finance/frais-scolarite',
      },
      {
        icon: CreditCard,
        label: 'Paiements',
        path: '/admin/finance/paiements',
      },
      {
        icon: Award,
        label: 'Bourses',
        path: '/admin/finance/bourses',
      },
    ],
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
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(['Académique']));
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const userRoles = user?.roles?.map((role: any) => role.name) || [];

  const filteredMainItems = mainMenuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => userRoles.includes(role));
  });

  const filteredBottomItems = bottomMenuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => userRoles.includes(role));
  });

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const isSubmenuActive = (children?: SubMenuItem[]) => {
    if (!children) return false;
    return children.some((child) => location.pathname === child.path || location.pathname.startsWith(child.path));
  };

  return (
    <aside
      className={`bg-[#1e3a5f] text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header - Logo & Toggle */}
      <div className="px-5 py-5 border-b border-white/10">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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

            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="Réduire"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
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

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {filteredMainItems.map((item) => {
          const Icon = item.icon;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedMenus.has(item.label);
          const isActive = item.path ? location.pathname === item.path : false;
          const isChildActive = isSubmenuActive(item.children);

          if (hasChildren && !isCollapsed) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    isChildActive
                      ? 'bg-blue-500/20 text-white'
                      : 'text-white/90 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-white/10 pl-2">
                    {item.children!.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = location.pathname === child.path || location.pathname.startsWith(child.path);

                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-xs font-medium ${
                            isChildActive
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'text-white/80 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <ChildIcon className="w-[16px] h-[16px] flex-shrink-0" strokeWidth={2} />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.path || item.label}
              to={item.path || '#'}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-white/90 hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="px-3 py-2 space-y-0.5 border-t border-white/10">
        {filteredBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative text-sm font-medium ${
                isActive
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-white/90 hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={2} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="px-3 py-3 border-t border-white/10">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 ring-2 ring-blue-400/20">
              <span className="text-xs font-bold text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.username}
              </p>
              <p className="text-[10px] text-white/60 truncate">
                {user?.email}
              </p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>
        ) : (
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