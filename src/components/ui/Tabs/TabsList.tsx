import React, { useRef, useEffect } from 'react';
import { useTabsContext } from './Tabs';

/**
 * Props du composant TabsList
 */
export interface TabsListProps {
  /** Classes CSS additionnelles */
  className?: string;
  /** Contenu */
  children: React.ReactNode;
}

/**
 * Composant TabsList
 * Liste des onglets avec navigation clavier
 */
export const TabsList: React.FC<TabsListProps> = ({ className = '', children }) => {
  const { variant } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!listRef.current) return;

      const triggers = Array.from(
        listRef.current.querySelectorAll('[role="tab"]:not([disabled])')
      ) as HTMLElement[];

      const currentIndex = triggers.findIndex((el) => el === document.activeElement);

      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = triggers.length - 1;
          break;
        default:
          return;
      }

      triggers[nextIndex]?.focus();
      triggers[nextIndex]?.click();
    };

    const list = listRef.current;
    list?.addEventListener('keydown', handleKeyDown);

    return () => {
      list?.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Classes selon variant
  const variantClasses = {
    default: 'border-b border-base-300',
    pills: 'bg-base-200 p-1 rounded-lg inline-flex',
    bordered: 'border border-base-300 rounded-lg p-1 inline-flex',
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      className={`flex gap-1 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export default TabsList;