import { useState } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const [searchQuery, setSearchQuery] = useState(''); // Stocke ce que l'utilisateur tape dans la bare de recherche
    const { user } = useAuth();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); // Empeche le rechargement de la page
        console.log('Recherche:', searchQuery);
        // TODO: Implémenter la recherche
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Message de bienvenue */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Bonjour, Mr/Mme {user?.first_name} !
                    </h2>
                    <p className="text-sm text-gray-500">
                        Bienvenue sur votre tableau de bord
                    </p>
                </div>

                {/* Barre de recherche et notifications */}
                <div className="flex items-center space-x-4">
                    {/* Recherche */}
                    <form onSubmit={handleSearch} className="relative">
                        <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </form>

                    {/* Notifications */}
                    <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <FaBell className="text-xl" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;