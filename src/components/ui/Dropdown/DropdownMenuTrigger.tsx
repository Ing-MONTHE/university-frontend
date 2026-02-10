import React from 'react';
import { useDropdownContext } from './DropdownMenu';

/**
 * Props du composant DropdownMenuTrigger
 */
export interface DropdownMenuTriggerProps {
  /** Contenu (bouton) */
  children: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
  /** Props HTML button */
  asChild?: boolean;
}

/**
 * Composant DropdownMenuTrigger
 * Bouton déclencheur du menu
 */
export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  className = '',
}) => {
  const { isOpen, setIsOpen } = useDropdownContext();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

export default DropdownMenuTrigger;