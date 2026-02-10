import React from 'react';

/**
 * Props du composant DropdownMenuSeparator
 */
export interface DropdownMenuSeparatorProps {
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant DropdownMenuSeparator
 * Séparateur entre groupes d'items
 */
export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className = '',
}) => {
  return <div className={`my-1 h-px bg-base-300 ${className}`} />;
};

export default DropdownMenuSeparator;