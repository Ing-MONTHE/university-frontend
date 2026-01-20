import { Link, useLocation } from 'react-router-dom';
import { 
    FaHome, 
    FaUniversity, 
    FaSitemap,
    FaUserGraduate, 
    FaChalkboardTeacher,
    FaClipboardList,
    FaCalendarAlt,
    FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
        { path: '/facultes', icon: FaUniversity, label: 'Facultés' },
        { path: '/departements', icon: FaSitemap, label: 'Departements' },
        { path: '/etudiants', icon: FaUserGraduate, label: 'Étudiants' },
        { path: '/enseignants', icon: FaChalkboardTeacher, label: 'Enseignants' },
        { path: '/evaluations', icon: FaClipboardList, label: 'Évaluations' },
        { path: '/emploi-du-temps', icon: FaCalendarAlt, label: 'Emploi du temps' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (

        <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🎓</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">University</h1>
                        <p className="text-xs text-gray-500">Management</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon; // Stockage du composant d'icone dans une variable
                        const active = isActive(item.path); // Verifie si cet item est actif
                
                        return (
                            <li key={item.path}>
                                <Link
                                to={item.path}
                                className={`
                                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                                    ${active
                                        ? 'bg-blue-50 text-blue-600 font-medium' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`
                                }>
                                    <Icon className={`text-lg ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                            {user?.first_name?.[0]}{user?.last_name?.[0]}
                        </span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>
        
                <button
                onClick={logout} // Appelle la fonction logout du contexte
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                    <FaSignOutAlt />
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
