import React from 'react';
import { Avatar, AvatarProps, AvatarSize } from './Avatar';

/**
 * Props du composant AvatarGroup
 */
export interface AvatarGroupProps {
  /** Liste des avatars à afficher */
  avatars: AvatarProps[];
  /** Taille des avatars */
  size?: AvatarSize;
  /** Nombre maximum d'avatars à afficher */
  max?: number;
  /** Classes CSS additionnelles */
  className?: string;
}

// Mapping des espacements négatifs selon la taille
const OVERLAP_MAP: Record<AvatarSize, string> = {
  xs: '-space-x-2',
  sm: '-space-x-2',
  md: '-space-x-3',
  lg: '-space-x-3',
  xl: '-space-x-4',
  '2xl': '-space-x-5',
};

/**
 * Composant AvatarGroup
 * Affiche plusieurs avatars empilés avec un compteur de surplus
 */
export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  max = 5,
  className = '',
}) => {
  // Limiter le nombre d'avatars affichés
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex items-center ${OVERLAP_MAP[size]} ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          className="ring-2 ring-white rounded-full"
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <Avatar {...avatar} size={size} />
        </div>
      ))}

      {/* Compteur de surplus */}
      {remainingCount > 0 && (
        <div
          className={`
            flex items-center justify-center
            ${size === 'xs' ? 'w-6 h-6 text-xs' : ''}
            ${size === 'sm' ? 'w-8 h-8 text-sm' : ''}
            ${size === 'md' ? 'w-10 h-10 text-base' : ''}
            ${size === 'lg' ? 'w-12 h-12 text-lg' : ''}
            ${size === 'xl' ? 'w-16 h-16 text-xl' : ''}
            ${size === '2xl' ? 'w-20 h-20 text-2xl' : ''}
            rounded-full
            bg-gray-300
            text-gray-700
            font-semibold
            ring-2 ring-white
          `}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;