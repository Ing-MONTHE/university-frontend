import axios from 'axios';

// INTERFACE : Definit les structures de données
// 'Export' signifira qu'on peut l'utiliser dans d'autres fichiers
// Interface pour l'utilisateur
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

// Interface pour la reponse de login
export interface LoginResponse {
  access: string; // Token JWT pour s'authentifier
  refresh: string; // Token pour renouveler l'acces token
  user: User; // Information de l'utilisateur connecté
}

// Interface pour les parametres de requete
export interface QueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: any; // Ici on peut ajouter d'autres propriétés avec n'importe quel nom
}

// Interface generique pour les reponses paginees
export interface PaginatedResponse<T> {
  count: number;
  next: string | null; // peut etre URL ou null (si derniere page)
  previous: string | null; // peut etre une URL ou null (si derniere page)
  results: T[];
}

// CONFIGURATION : Creer l'interface Axios

const API_BASE_URL = 'http://127.0.0.1:5173'; // Adresse du backend Django; Toutes les requetes commenceront par cette URL

// Instance Axios personnalisée
const api = axios.create({
  baseURL: API_BASE_URL, // Prefixe automatique pour toutes les requetes
  headers: { // En-tetes HTTP envoyés avec chaque requete
    'Content-Type': 'application/json', // On envoie du JSON
  },
});

// INTERCEPTEUR DE REQUÊTE : Ajoute automatiquement les token JWT

api.interceptors.request.use( // Ici on dit a Axios, qu'avant chaque requete, execute cette fonction
  (config: any) => {
    // Recuperer le Token du localStorage (Stockage dans le navigateur)
    const token = localStorage.getItem('access_token'); // Recuperation du token JWT stocké lors du login
    
    //Si le token existe, l'ajouter a l'en-tete authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // On retourne la configuration (avec le token ajouté) puis Axios envoie ensuite la requete
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// INTERCEPTEUR DE RÉPONSE : Gere ici le rafraichissement automatique du token

api.interceptors.response.use(
  (response: any) => response, // Si la reponse es Ok, la retourner telle quelle
  async (error: any) => { //Si une erreur se produit, execute cette fonction
    const originalRequest = error.config; // La configuration de la requete a echoué, on la sauvegarde pour pouvoir reessayer apres

    // Si erreur 401 (non autorisé) et pas encore retenté
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // On a pas encore retenté

      try {
        // Essayer de rafraichir le token
        const refreshToken = localStorage.getItem('refresh_token'); // On recupere le refresh_token stocké lors du login
        
        if (refreshToken) {
          const response = await axios.post<{ access: string }>(
            `${API_BASE_URL}/auth/refresh/`,
            { refresh: refreshToken }
          ); // On envoie le refresh_token a django; Django verifie et renvoie un nouveau access_token.

          // On sauvegarde le nouveau token
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          //Reessayer la requete originale avec le nouveau token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh echoue, deconnecter l'utilisateur, supprimer tout du localstorage et le rediriger vers la page de login et il doit se reconnecter 
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

export default api;

// SERVICE D'AUTHENTIFICATION

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login/', { 
      username, 
      password 
    });
    return response.data; // Les données renvoyées par Django
  },
  
  logout: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }, // Ne retourne rien; Supprime les 3 elements du localStorage et l'utilisateur est deconnecté
  
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user'); // Recupere l'utilisateur stocké dans localStorage
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token'); // Double negation (!!)=Convertit en booleen
  },
};

// SERVICES POUR LES ENTITÉS

export const etudiantService = {
  getAll: (params?: QueryParams) => 
    api.get('/etudiants/', { params }),
  
  getById: (id: number) => 
    api.get(`/etudiants/${id}/`),
  
  create: (data: any) => 
    api.post('/etudiants/', data),
  
  update: (id: number, data: any) => 
    api.put(`/etudiants/${id}/`, data),
  
  delete: (id: number) => 
    api.delete(`/etudiants/${id}/`),
  
  getStatistiques: () => 
    api.get('/etudiants/statistiques/'),
};

export const enseignantService = {
  getAll: (params?: QueryParams) => 
    api.get('/enseignants/', { params }),
  
  getById: (id: number) => 
    api.get(`/enseignants/${id}/`),
  
  create: (data: any) => 
    api.post('/enseignants/', data),
  
  update: (id: number, data: any) => 
    api.put(`/enseignants/${id}/`, data),
  
  delete: (id: number) => 
    api.delete(`/enseignants/${id}/`),
};

export const coursService = {
  getAll: (params?: QueryParams) => 
    api.get('/cours/', { params }),
  
  getById: (id: number) => 
    api.get(`/cours/${id}/`),
  
  create: (data: any) => 
    api.post('/cours/', data),
  
  update: (id: number, data: any) => 
    api.put(`/cours/${id}/`, data),
  
  delete: (id: number) => 
    api.delete(`/cours/${id}/`),
  
  getEmploiDuTemps: (data: any) => 
    api.post('/cours/emploi-du-temps/', data),
  
  exportPDF: (data: any) => 
    api.post('/cours/emploi-du-temps-pdf/', data, { responseType: 'blob' }),
  
  exportExcel: (data: any) => 
    api.post('/cours/emploi-du-temps-excel/', data, { responseType: 'blob' }),
};

export const faculteService = {
  getAll: () => 
    api.get('/facultes/'),
  
  getById: (id: number) => 
    api.get(`/facultes/${id}/`),
  
  create: (data: any) => 
    api.post('/facultes/', data),
  
  update: (id: number, data: any) => 
    api.put(`/facultes/${id}/`, data),
  
  delete: (id: number) => 
    api.delete(`/facultes/${id}/`),
};

// Service pour les départements
export const departementService = {
  getAll: (params?: QueryParams) => 
    api.get('/departements/', { params }),
  
  getById: (id: number) => 
    api.get(`/departements/${id}/`),
  
  create: (data: any) => 
    api.post('/departements/', data),
  
  update: (id: number, data: any) => 
    api.put(`/departements/${id}/`, data),
  
  delete: (id: number) => 
    api.delete(`/departements/${id}/`),
};

export const filiereService = {
  getAll: () => 
    api.get('/filieres/'),
  
  getById: (id: number) => 
    api.get(`/filieres/${id}/`),
  
  create: (data: any) => 
    api.post('/filieres/', data),
  
  update: (id: number, data: any) => 
    api.put(`/filieres/${id}/`, data),
  
  delete: (id: number) => 
    api.delete(`/filieres/${id}/`),
};

export const salleService = {
  getAll: (params?: QueryParams) => 
    api.get('/salles/', { params }),
  
  getById: (id: number) => 
    api.get(`/salles/${id}/`),
  
  getDisponibles: (params?: QueryParams) => 
    api.get('/salles/disponibles/', { params }),
};

export const conflitService = {
  getAll: (params?: QueryParams) => 
    api.get('/conflits/', { params }),
  
  detecter: (data: any) => 
    api.post('/conflits/detecter/', data),
  
  resoudre: (id: number, data: any) => 
    api.post(`/conflits/${id}/resoudre/`, data),
};
