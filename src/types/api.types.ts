/**
 * Types génériques pour les réponses API
 */

// Réponse paginée standard
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Paramètres de pagination
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

// Paramètres de tri
export interface SortParams {
  ordering?: string;
}

// Paramètres de recherche
export interface SearchParams {
  search?: string;
}

// Paramètres de filtre génériques
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// Combinaison de tous les paramètres
export interface QueryParams extends PaginationParams, SortParams, SearchParams, FilterParams {}

// Réponse d'erreur API
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Réponse de succès générique
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// État de requête
export interface RequestState {
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
}