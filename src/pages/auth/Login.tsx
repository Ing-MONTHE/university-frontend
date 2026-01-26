import React, { useState } from 'react';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username, password, remember_me: rememberMe });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center px-6 py-10">

      {/* Cadre principal */}
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* MOBILE – Partie bleue en haut */}
        <div className="lg:hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-8 py-14 text-white">
          <div className="flex flex-col items-center text-center max-w-xl mx-auto">

            {/* LOGO MOBILE - Shield */}
            <div className="mb-6 relative">
              <div className="relative w-20 h-24">
                <svg viewBox="0 0 80 96" className="absolute inset-0 drop-shadow-xl">
                  <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.3)' }} />
                      <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)' }} />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M40 0 L5 15 L5 45 Q5 70 40 95 Q75 70 75 45 L75 15 Z" 
                    fill="url(#shieldGrad)" 
                    stroke="rgba(255,255,255,0.5)" 
                    strokeWidth="2"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                  <GraduationCap className="w-10 h-10 text-white mb-1" strokeWidth={2.5} />
                  <span className="text-white font-bold text-xs tracking-wider">UMS</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold mb-3">BIENVENUE</h1>
            <p className="text-lg text-blue-100 mb-2">sur votre</p>
            <h2 className="text-2xl font-semibold mb-6">Système de Gestion Universitaire</h2>
            <p className="text-base text-blue-100 leading-relaxed">
              Accédez à votre espace en toute simplicité et gérez votre univers académique
              dans un environnement clair, moderne et pensé pour vous.
            </p>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="flex flex-col lg:flex-row">

          {/* PARTIE GAUCHE BLEUE */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-20 py-24">
            <div className="flex flex-col justify-center items-center text-center text-white max-w-xl mx-auto">

              {/* LOGO DESKTOP - Shield */}
              <div className="mb-10 relative">
                <div className="relative w-28 h-32">
                  <svg viewBox="0 0 80 96" className="absolute inset-0 drop-shadow-2xl">
                    <defs>
                      <linearGradient id="shieldGradDesktop" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.35)' }} />
                        <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.2)' }} />
                        <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)' }} />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M40 0 L5 15 L5 45 Q5 70 40 95 Q75 70 75 45 L75 15 Z" 
                      fill="url(#shieldGradDesktop)" 
                      stroke="rgba(255,255,255,0.6)" 
                      strokeWidth="2.5"
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                    <GraduationCap className="w-14 h-14 text-white mb-2" strokeWidth={2.5} />
                    <span className="text-white font-extrabold text-lg tracking-widest">UMS</span>
                  </div>
                </div>
              </div>

              <h1 className="text-6xl font-extrabold mb-4">BIENVENUE</h1>
              <p className="text-2xl text-blue-200 mb-3">sur votre</p>
              <h2 className="text-4xl font-bold mb-8 leading-snug">
                Système de Gestion <br /> Universitaire
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Accédez à votre espace en toute simplicité et gérez votre univers académique
                dans un environnement clair, moderne et pensé pour vous.
              </p>
            </div>
          </div>

          {/* PARTIE DROITE – FORMULAIRE */}
          <div className="w-full lg:w-1/2 px-8 sm:px-12 lg:px-20 py-16 flex items-center justify-center">
            <div className="w-full max-w-md">

              {/* TITRE */}
              <div className="text-center mb-14">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Connexion</h2>
                <p className="text-gray-600 text-lg">Connectez-vous pour accéder à votre espace</p>
              </div>

              {/* FORMULAIRE */}
              <form onSubmit={handleSubmit} className="space-y-10 w-full">

                {/* USERNAME */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Username"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-6 py-5 pr-14 text-lg border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* OPTIONS */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">
                      Se souvenir de moi
                    </span>
                  </label>

                  <a href="#" className="text-blue-600 font-medium hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* BOUTON */}
                <button
                  type="submit"
                  className="w-full py-5 text-xl font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                >
                  Se connecter
                </button>
              </form>

              {/* FOOTER */}
              <div className="mt-14 text-center">
                <p className="text-sm text-gray-500">© 2026 University Management System</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
