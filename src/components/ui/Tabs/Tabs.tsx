import React, { createContext, useContext, useState } from 'react';

/**
 * Variant du composant Tabs
 */
export type TabsVariant = 'default' | 'pills' | 'bordered';

/**
 * Context pour partager l'état entre composants
 */
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

/**
 * Hook pour accéder au context Tabs
 */
export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within Tabs');
  }
  return context;
};

/**
 * Props du composant Tabs
 */
export interface TabsProps {
  /** Tab actif par défaut (uncontrolled) */
  defaultTab?: string;
  /** Tab actif (controlled) */
  activeTab?: string;
  /** Callback changement de tab */
  onChange?: (tab: string) => void;
  /** Variant visuel */
  variant?: TabsVariant;
  /** Classes CSS additionnelles */
  className?: string;
  /** Contenu */
  children: React.ReactNode;
}

/**
 * Composant Tabs
 * Container principal pour système d'onglets
 */
export const Tabs: React.FC<TabsProps> = ({
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  className = '',
  children,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || '');

  // Mode controlled ou uncontrolled
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const setActiveTab = (value: string) => {
    if (!isControlled) {
      setInternalActiveTab(value);
    }
    onChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export default Tabs;