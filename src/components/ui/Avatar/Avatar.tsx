import React from 'react';
import { getAvatarColor, getInitials } from './utils';

/**
 * Taille de l'avatar
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Statut de l'utilisateur
 */
export type AvatarStatus = 'online' | 'offline' | 'busy';

/**
 * Variant de l'avatar
 */
export type AvatarVariant = 'rounded' | 'square';

/**
 * Props du composant Avatar
 */
export interface AvatarProps {
  /** URL de l'image de profil */
  src?: string;
  /** Nom complet (requis pour les initiales) */
  name: string;
  /** Taille de l'avatar */
  size?: AvatarSize;
  /** Statut de l'utilisateur */
  status?: AvatarStatus | null;
  /** Variant de l'avatar */
  variant?: AvatarVariant;
  /** Classes CSS additionnelles */
  className?: string;
}

// Mapping des tailles en pixels
const SIZE_MAP: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

// Taille du badge de statut selon la taille de l'avatar
const STATUS_BADGE_SIZE: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
};

// Couleurs du badge de statut
const STATUS_COLOR: Record<AvatarStatus, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  busy: 'bg-orange-500',
};

/**
 * Composant Avatar
 * Affiche un avatar avec image ou initiales de fallback
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status = null,
  variant = 'rounded',
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);
  const showInitials = !src || imageError;

  // Classes pour la taille
  const sizeClasses = SIZE_MAP[size];

  // Classes pour le variant
  const variantClasses = variant === 'rounded' ? 'rounded-full' : 'rounded-lg';

  // Couleur de fond pour les initiales
  const bgColor = getAvatarColor(name);

  // Initiales
  const initials = getInitials(name);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar */}
      <div
        className={`
          ${sizeClasses}
          ${variantClasses}
          flex items-center justify-center
          overflow-hidden
          ${showInitials ? `${bgColor} text-white font-semibold` : 'bg-gray-200'}
        `}
      >
        {showInitials ? (
          // Afficher les initiales
          <span>{initials}</span>
        ) : (
          // Afficher l'image
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Badge de statut */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${STATUS_BADGE_SIZE[size]}
            ${STATUS_COLOR[status]}
            rounded-full
            border-2 border-white
          `}
          aria-label={`Statut: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;