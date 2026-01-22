import { useState } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

const Header = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-20 bg-white border-b border-gray-200 fixed top-0 right-0 left-72 z-10 shadow-sm">
      <div className="h-full px-10 flex items-center justify-between">
        {/* Titre de page */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vue d'ensemble de votre système
          </p>
        </div>

        {/* Actions droite */}
        <div className="flex items-center gap-6">
          {/* Recherche */}
          <div className="relative w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Badge ADMIN */}
          {user?.is_staff && <Badge variant="primary" size="lg">ADMIN</Badge>}

          {/* Notifications */}
          <button className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
            <FaBell className="text-xl" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profil */}
          <div className="flex items-center gap-4 pl-6 border-l-2 border-gray-200">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;