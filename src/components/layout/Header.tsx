import { useState } from 'react';
import { Search, User, LogOut, Settings, Moon, Sun, Globe } from 'lucide-react';
import { useAuth } from '@/hooks';
import { useUIStore } from '@/store';

export default function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { theme, toggleTheme, language, setLanguage } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recherche:', searchQuery);
    // TODO: Implémenter la recherche
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-8 py-4">
        
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-5 pr-32 py-3 text-base border-2 border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       hover:border-gray-400 dark:hover:border-gray-500 transition-all
                       placeholder:text-gray-500 dark:placeholder:text-gray-400
                       bg-white dark:bg-gray-800 dark:text-white"
            />
            
            {/* Bouton Rechercher */}
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-6 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Rechercher</span>
            </button>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 ml-8">
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              title="Changer la langue"
            >
              <Globe className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
                {language === 'fr' ? 'FR' : 'EN'}
              </span>
            </button>

            {/* Language Dropdown */}
            {showLanguageMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowLanguageMenu(false)}
                ></div>

                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20">
                  <button
                    onClick={() => {
                      setLanguage('fr');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-base transition-colors ${
                      language === 'fr' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-base transition-colors ${
                      language === 'en' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 pr-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-base font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  {user?.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.roles?.[0]?.name || 'User'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                {/* Overlay */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                ></div>

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20">
                  
                  {/* User Info */}
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-base text-gray-900 dark:text-white">
                      {user?.full_name || user?.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <button className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base">
                    <User className="w-5 h-5" />
                    <span>Mon profil</span>
                  </button>

                  <button className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base">
                    <Settings className="w-5 h-5" />
                    <span>Paramètres</span>
                  </button>

                  <hr className="my-2 border-gray-200 dark:border-gray-700" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-base font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}