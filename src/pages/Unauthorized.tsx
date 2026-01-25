import { useNavigate } from 'react-router-dom';
import { ShieldX, Home } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-red-600">403</h1>
          <div className="flex justify-center mt-4">
            <ShieldX className="w-24 h-24 text-red-400" />
          </div>
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Accès refusé
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            ← Retour
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}