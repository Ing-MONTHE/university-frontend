import axios from 'axios';

// =========================================
// CONFIGURATION DE BASE
// =========================================

/**
 * URL de base de l'API Django
 * Récupérée depuis les variables d'environnement
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Instance Axios personnalisée
 * Toutes les requêtes API passeront par cette instance
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// =========================================
// INTERCEPTEUR DE REQUÊTE
// Ajoute automatiquement le token JWT
// =========================================

apiClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('access_token');
    
    // Si le token existe, l'ajouter aux headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================================
// INTERCEPTEUR DE RÉPONSE
// Gère le rafraîchissement automatique du token
// =========================================

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 (token expiré) et pas déjà retenté
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Récupérer le refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          // Demander un nouveau access token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          });

          const { access } = response.data;
          
          // Sauvegarder le nouveau token
          localStorage.setItem('access_token', access);
          
          // Réessayer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;