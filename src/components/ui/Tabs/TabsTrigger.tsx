import React from 'react';
import { useTabsContext } from './Tabs';

/**
 * Props du composant TabsTrigger
 */
export interface TabsTriggerProps {
  /** Valeur unique du tab */
  value: string;
  /** Icône optionnelle */
  icon?: React.ReactNode;
  /** Désactivé */
  disabled?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
  /** Contenu */
  children: React.ReactNode;
}

/**
 * Composant TabsTrigger
 * Bouton pour activer un onglet
 */
export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  icon,
  disabled = false,
  className = '',
  children,
}) => {
  const { activeTab, setActiveTab, variant } = useTabsContext();
  const isActive = activeTab === value;

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  // Classes de base
  const baseClasses = `
    inline-flex items-center gap-2
    px-4 py-2
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  // Classes selon variant
  const variantClasses = {
    default: isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-base-content/60 hover:text-base-content border-b-2 border-transparent',

    pills: isActive
      ? 'bg-primary text-primary-content rounded-md shadow-sm'
      : 'text-base-content/70 hover:bg-base-300 rounded-md',

    bordered: isActive
      ? 'bg-primary text-primary-content rounded'
      : 'text-base-content/70 hover:bg-base-200 rounded',
  };

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default TabsTrigger;