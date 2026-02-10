import React, { useRef, useEffect, useState } from 'react';
import { useDropdownContext } from './DropdownMenu';

/**
 * Props du composant DropdownMenuContent
 */
export interface DropdownMenuContentProps {
  /** Contenu du menu */
  children: React.ReactNode;
  /** Alignement */
  align?: 'start' | 'end' | 'center';
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant DropdownMenuContent
 * Contenu du menu avec positionnement intelligent
 */
export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'end',
  className = '',
}) => {
  const { isOpen } = useDropdownContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');

  // Auto-flip si pas assez d'espace
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const rect = contentRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < 200 && spaceAbove > spaceBelow) {
      setPosition('top');
    } else {
      setPosition('bottom');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Classes d'alignement
  const alignClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  // Classes de position
  const positionClasses = position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2';

  return (
    <div
      ref={contentRef}
      className={`
        absolute ${positionClasses} ${alignClasses[align]}
        z-50
        min-w-[12rem]
        max-h-96
        overflow-y-auto
        bg-base-100
        border border-base-300
        rounded-lg
        shadow-lg
        py-1
        animate-in fade-in-50 slide-in-from-top-2
        duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default DropdownMenuContent;