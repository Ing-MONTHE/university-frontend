/**
 * Types communs réutilisables dans toute l'application
 */

// Option pour les selects
export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
}

// Métadonnées de base pour tous les modèles
export interface BaseModel {
  id: number;
  created_at: string;
  updated_at: string;
}

// Statut générique
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

// Sexe
export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
}

export const GenderLabels: Record<Gender, string> = {
  [Gender.MALE]: 'Masculin',
  [Gender.FEMALE]: 'Féminin',
};

// Langue
export enum Language {
  FR = 'fr',
  EN = 'en',
}

// Configuration de colonne de table
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Action de table (boutons d'action)
export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

// Toast notification
export interface ToastNotification {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// Breadcrumb
export interface Breadcrumb {
  label: string;
  href?: string;
}