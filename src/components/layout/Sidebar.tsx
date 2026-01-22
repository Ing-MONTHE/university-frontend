import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaUniversity,
  FaSitemap,
  FaStream,
  FaBook,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardList,
  FaCalendarAlt,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/facultes', icon: FaUniversity, label: 'Facultés' },
    { path: '/departements', icon: FaSitemap, label: 'Départements' },
    { path: '/filieres', icon: FaStream, label: 'Filières' },
    { path: '/matieres', icon: FaBook, label: 'Matières' },
    { path: '/etudiants', icon: FaUserGraduate, label: 'Étudiants' },
    { path: '/enseignants', icon: FaChalkboardTeacher, label: 'Enseignants' },
    { path: '/evaluations', icon: FaClipboardList, label: 'Évaluations' },
    { path: '/emploi-du-temps', icon: FaCalendarAlt, label: 'Emploi du temps' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      {/* Logo - Plus d'espace */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
            <FaUniversity className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">UniManage</h2>
            <p className="text-sm text-gray-500">Gestion Universitaire</p>
          </div>
        </div>
      </div>

      {/* Menu - Espacé */}
      <nav className="flex-1 py-8 px-6 overflow-y-auto">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    group flex items-center gap-4 px-5 py-4 rounded-xl
                    transition-all duration-300 ease-in-out
                    ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                    }
                  `}
                >
                  <Icon
                    className={`text-xl transition-transform duration-300 ${
                      active ? '' : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profil - Plus d'espace */}
      <div className="p-6 border-t border-gray-200 space-y-4">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-md">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;