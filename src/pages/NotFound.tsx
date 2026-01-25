import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
          <div className="flex justify-center mt-4">
            <Search className="w-24 h-24 text-blue-400" />
          </div>
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Page non trouvée
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}