import React from 'react';
import { useTabsContext } from './Tabs';

/**
 * Props du composant TabsContent
 */
export interface TabsContentProps {
  /** Valeur du tab associé */
  value: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Contenu */
  children: React.ReactNode;
}

/**
 * Composant TabsContent
 * Contenu d'un onglet avec animation
 */
export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className = '',
  children,
}) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      className={`
        animate-in fade-in-50 slide-in-from-bottom-2
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default TabsContent;