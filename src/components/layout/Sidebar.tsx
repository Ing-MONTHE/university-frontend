/**
 * Sidebar - Menu de navigation principal
 * Inclut: Dashboard, Étudiants, Enseignants, Académique, et autres modules
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  Building,
  Calendar,
  ClipboardCheck,
  DollarSign,
  Library,
  Bell,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/utils/Cn';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // État pour les sous-menus dépliables
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    students: pathname.startsWith('/admin/students'),
    academic: pathname.startsWith('/admin/academic'),
  });

  const toggleMenu = (key: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Types pour la navigation
  type NavigationBadge = { count?: number; text?: string; color: string };
  type NavigationChild = {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    current: boolean;
    badge?: NavigationBadge;
    description?: string;
  };
  type NavigationItem = {
    name: string;
    href?: string;
    icon: React.ComponentType<any>;
    current: boolean;
    badge?: NavigationBadge;
    children?: NavigationChild[];
  };

  // Configuration de la navigation
  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: pathname === '/admin',
    },
    
    // ==================== MODULE STUDENTS ====================
    {
      name: 'Students',
      icon: GraduationCap,
      current: pathname.startsWith('/admin/students'),
      children: [
        {
          name: 'Étudiants',
          href: '/admin/students/etudiants',
          icon: GraduationCap,
          current: pathname === '/admin/students/etudiants',
          badge: { count: 2547, color: 'bg-blue-500' },
        },
        {
          name: 'Enseignants',
          href: '/admin/students/enseignants',
          icon: Users,
          current: pathname === '/admin/students/enseignants',
          badge: { count: 147, color: 'bg-purple-500' },
        },
      ],
    },

    // ==================== MODULE ACADÉMIQUE ====================
    {
      name: 'Académique',
      icon: BookOpen,
      current: pathname.startsWith('/admin/academic'),
      children: [
        {
          name: 'Structure',
          href: '/admin/academic/structure',
          icon: Building2,
          current: pathname === '/admin/academic/structure',
          description: 'Vue hiérarchique complète',
        },
        {
          name: 'Années Académiques',
          href: '/admin/academic/annees-academiques',
          icon: Calendar,
          current: pathname === '/admin/academic/annees-academiques',
        },
        {
          name: 'Facultés',
          href: '/admin/academic/facultes',
          icon: Building2,
          current: pathname === '/admin/academic/facultes',
        },
        {
          name: 'Départements',
          href: '/admin/academic/departements',
          icon: Building,
          current: pathname === '/admin/academic/departements',
        },
        {
          name: 'Filières',
          href: '/admin/academic/filieres',
          icon: GraduationCap,
          current: pathname === '/admin/academic/filieres',
        },
        {
          name: 'Matières',
          href: '/admin/academic/matieres',
          icon: BookOpen,
          current: pathname === '/admin/academic/matieres',
        },
      ],
    },

    // ==================== AUTRES MODULES ====================
    {
      name: 'Évaluations',
      href: '/admin/evaluations',
      icon: ClipboardCheck,
      current: pathname.startsWith('/admin/evaluations'),
      badge: { text: 'Bientôt', color: 'bg-orange-500' },
    },
    {
      name: 'Emploi du temps',
      href: '/admin/schedule',
      icon: Calendar,
      current: pathname.startsWith('/admin/schedule'),
    },
    {
      name: 'Bibliothèque',
      href: '/admin/library',
      icon: Library,
      current: pathname.startsWith('/admin/library'),
    },
    {
      name: 'Finance',
      href: '/admin/finance',
      icon: DollarSign,
      current: pathname.startsWith('/admin/finance'),
    },
    {
      name: 'Statistiques',
      href: '/admin/statistics',
      icon: BarChart3,
      current: pathname.startsWith('/admin/statistics'),
    },
  ];

  const bottomNavigation = [
    {
      name: 'Notifications',
      href: '/admin/notifications',
      icon: Bell,
      current: pathname === '/admin/notifications',
      badge: { count: 12, color: 'bg-red-500' },
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
      current: pathname === '/admin/settings',
    },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">UMS</h1>
                <p className="text-gray-400 text-xs">Admin Panel</p>
              </div>
            </Link>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Navigation principale */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus[item.name.toLowerCase().replace(' ', '_')];

              if (hasChildren) {
                return (
                  <div key={item.name}>
                    {/* Menu parent */}
                    <button
                      onClick={() => toggleMenu(item.name.toLowerCase().replace(' ', '_'))}
                      className={cn(
                        'w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        item.current
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Sous-menu */}
                    {isExpanded && (
                      <div className="mt-1 space-y-1 ml-4">
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={cn(
                              'group flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors',
                              child.current
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <child.icon className="w-4 h-4 flex-shrink-0" />
                              <div>
                                <span className="block">{child.name}</span>
                                {child.description && (
                                  <span className="text-xs text-gray-500">
                                    {child.description}
                                  </span>
                                )}
                              </div>
                            </div>
                            {child.badge && (
                              <span
                                className={cn(
                                  'px-2 py-0.5 text-xs font-medium text-white rounded-full',
                                  child.badge.color
                                )}
                              >
                                {child.badge.count || child.badge.text}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                item.href ? (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-medium text-white rounded-full',
                          item.badge.color
                        )}
                      >
                        {item.badge.count || item.badge.text}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div
                    key={item.name}
                    className={cn(
                      'group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-default',
                      item.current
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-medium text-white rounded-full',
                          item.badge.color
                        )}
                      >
                        {item.badge.count || item.badge.text}
                      </span>
                    )}
                  </div>
                )
              );
            })}
          </nav>

          {/* Navigation du bas */}
          <div className="border-t border-gray-800 px-2 py-4 space-y-1">
            {bottomNavigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  item.current
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'px-2 py-0.5 text-xs font-medium text-white rounded-full',
                      item.badge.color
                    )}
                  >
                    {item.badge.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}