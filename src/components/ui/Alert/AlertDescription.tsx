import React from 'react';

/**
 * Props du composant AlertDescription
 */
export interface AlertDescriptionProps {
  /** Contenu de la description */
  children: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant AlertDescription
 * Description de l'alerte
 */
export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
};

export default AlertDescription;