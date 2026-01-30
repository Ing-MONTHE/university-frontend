/**
 * Utilitaire pour fusionner les classes CSS avec Tailwind
 * Combine clsx et tailwind-merge pour une gestion optimale des classes
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusionne les classes CSS en résolvant les conflits Tailwind
 * 
 * @example
 * cn('px-4 py-2', 'px-6') // → 'py-2 px-6'
 * cn('text-red-500', condition && 'text-blue-500') // → 'text-blue-500' si condition
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
