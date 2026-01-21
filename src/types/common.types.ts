// =========================================
// TYPES COMMUNS RÉUTILISABLES
// =========================================

/**
 * Paramètres de requête pour la pagination et les filtres
 */
export interface QueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  [key: string]: any;
}

/**
 * Réponse paginée standard de Django REST Framework
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Réponse standard d'erreur de l'API
 */
export interface ApiError {
  detail?: string;
  [key: string]: any;
}

/**
 * État de chargement pour les composants
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}