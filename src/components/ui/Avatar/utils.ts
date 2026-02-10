/**
 * Utilitaires pour le composant Avatar
 */

// Palette de couleurs pour les avatars
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
] as const;

/**
 * Génère un hash simple à partir d'une chaîne
 * @param str - Chaîne à hasher
 * @returns Nombre hash
 */
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convertir en entier 32-bit
  }
  return Math.abs(hash);
};

/**
 * Sélectionne une couleur de fond basée sur le nom
 * @param name - Nom complet de l'utilisateur
 * @returns Classe Tailwind de couleur de fond
 */
export const getAvatarColor = (name: string): string => {
  const hash = hashString(name);
  const index = hash % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

/**
 * Extrait les initiales d'un nom complet
 * @param name - Nom complet de l'utilisateur
 * @returns Initiales (2 premières lettres)
 */
export const getInitials = (name: string): string => {
  if (!name) return '??';

  const trimmed = name.trim();
  if (!trimmed) return '??';

  const parts = trimmed.split(/\s+/);

  if (parts.length === 1) {
    // Si un seul mot, prendre les 2 premières lettres non vides
    return parts[0].substring(0, 2).toUpperCase();
  }

  const first = parts[0][0] ?? '';
  const second = parts[1][0] ?? '';
  const initials = (first + second).toUpperCase();

  return initials || '??';
};