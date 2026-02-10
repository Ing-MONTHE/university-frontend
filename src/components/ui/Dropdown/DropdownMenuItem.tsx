import React from 'react';
import { useDropdownContext } from './DropdownMenu';

/**
 * Props du composant DropdownMenuItem
 */
export interface DropdownMenuItemProps {
  /** Icône */
  icon?: React.ReactNode;
  /** Item destructif (rouge) */
  destructive?: boolean;
  /** Désactivé */
  disabled?: boolean;
  /** Callback clic */
  onClick?: () => void;
  /** Contenu */
  children: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant DropdownMenuItem
 * Item individuel du menu
 */
export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  icon,
  destructive = false,
  disabled = false,
  onClick,
  children,
  className = '',
}) => {
  const { closeMenu } = useDropdownContext();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    closeMenu();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`
        w-full
        flex items-center gap-2
        px-3 py-2
        text-sm text-left
        transition-colors
        ${
          destructive
            ? 'text-error hover:bg-error/10'
            : 'text-base-content hover:bg-base-200'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  );
};

export default DropdownMenuItem;