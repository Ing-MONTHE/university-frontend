import React from 'react';

/**
 * Props du composant AlertTitle
 */
export interface AlertTitleProps {
  /** Contenu du titre */
  children: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant AlertTitle
 * Titre de l'alerte
 */
export const AlertTitle: React.FC<AlertTitleProps> = ({
  children,
  className = '',
}) => {
  return (
    <h5 className={`font-semibold mb-1 ${className}`}>
      {children}
    </h5>
  );
};

export default AlertTitle;