import { useAuth } from '@/hooks';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Administrateur
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenue, {user?.username} !
              </p>
            </div>
            
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Content temporaire */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">🎉 Connexion réussie !</h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p className="text-blue-900 font-semibold">
              ✅ Vous êtes maintenant connecté au Dashboard Admin !
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-gray-700">
              <span className="font-semibold">Username:</span> {user?.username}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {user?.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Rôles:</span> {user?.roles.join(', ')}
            </p>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ⏳ <strong>Phase suivante :</strong> Création du vrai Dashboard avec KPIs, graphiques et statistiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}