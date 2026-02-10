import { useState } from 'react';
import { User, LogOut, Settings, Globe } from 'lucide-react';
import { useAuth } from '@/hooks';
import { useUIStore } from '@/store';
import { Button, SearchBar, ConfirmModal } from '@/components/ui';

export default function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { language, setLanguage } = useUIStore();

  const handleLogout = () => {
    logout();
  };

  const handleSearch = (query: string) => {
    console.log('Recherche:', query);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-8 py-4">
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <SearchBar
              placeholder="Rechercher..."
              onSearch={handleSearch}
              size="md"
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 ml-8">
            
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="md"
                icon={<Globe className="w-6 h-6" />}
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="gap-2"
              >
                <span className="hidden lg:inline">{language === 'fr' ? 'FR' : 'EN'}</span>
              </Button>

              {/* Language Dropdown */}
              {showLanguageMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowLanguageMenu(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => {
                        setLanguage('fr');
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-base transition-colors ${
                        language === 'fr' 
                          ? 'bg-blue-50 text-blue-600 font-semibold' 
                          : 'text-gray-700 hover:bg-gray-50'
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
                          ? 'bg-blue-50 text-blue-600 font-semibold' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 pr-4 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-base font-bold">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-base font-semibold text-gray-700">
                    {user?.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.roles?.[0]?.name || 'User'}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                    
                    {/* User Info */}
                    <div className="px-5 py-4 border-b border-gray-100">
                      <p className="font-semibold text-base text-gray-900">
                        {user?.full_name || user?.username}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                    </div>

                    {/* Menu Items */}
                    <button className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-base">
                      <User className="w-5 h-5" />
                      <span>Mon profil</span>
                    </button>

                    <button className="w-full flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-base">
                      <Settings className="w-5 h-5" />
                      <span>Paramètres</span>
                    </button>

                    <hr className="my-2 border-gray-200" />

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 transition-colors text-base font-medium"
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

      {/* Modal de confirmation de déconnexion */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirmation de déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder au système."
        confirmText="Se déconnecter"
        cancelText="Annuler"
        type="warning"
      />
    </>
  );
}