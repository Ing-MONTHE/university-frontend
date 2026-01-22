import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login = () => {
  // ÉTATS (useState)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //Hooks
  const { login } = useAuth();
  const navigate = useNavigate();

  // SOUMISSION DU FORMULAIRE
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await login({ username, password });
      navigate('/dashboard');
    } catch {
      setError('Identifiants incorrects');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* CONTENEUR PRINCIPAL */}
      <div className="w-full max-w-6xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* PARTIE BLEUE – MESSAGE */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center p-14">
          <div className="text-center max-w-md space-y-6">
            <h1 className="text-5xl font-extrabold tracking-wide">
              BIENVENUE
            </h1>

            <h2 className="text-xl font-semibold uppercase tracking-wider">
              Système de Gestion Universitaire
            </h2>

            <p className="text-blue-100 text-base leading-relaxed">
              Transformez la gestion académique de votre établissement 
                en une expérience fluide et performante.
            </p>
          </div>

          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-1/3 translate-y-1/3" />
        </div>

        {/* PARTIE BLANCHE – CONNEXION */}
        <div className="flex items-center justify-center px-12">
          <div className="w-full max-w-md">

            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Connexion
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg">
                  {error}
                </div>
              )}

              {/* Nom d’utilisateur */}
              <div>
                <label className="block text-base font-medium text-gray-600 mb-3">
                  Nom d’utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-4 text-lg rounded-lg border border-gray-300
                            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Entrez votre nom d’utilisateur"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-base font-medium text-gray-600 mb-3">
                  Mot de passe
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 pr-12 text-lg rounded-lg border border-gray-300
                              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Entrez votre mot de passe"
                    required
                  />

                  {/* Icône œil (show / hide password) */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                              text-gray-500 hover:text-blue-600"
                  >
                    {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Se souvenir
                </label>

                <a href="#" className="text-blue-600 hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700
                          text-white py-4 text-lg rounded-lg font-semibold
                          shadow-md hover:from-blue-700 hover:to-blue-800 transition"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-400 mt-8">
              © 2026 University Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
