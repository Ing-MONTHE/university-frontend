import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * Props du composant EmptyState
 */
export interface EmptyStateProps {
  /** Icône personnalisée */
  icon?: React.ReactNode;
  /** URL image personnalisée */
  image?: string;
  /** Titre */
  title: string;
  /** Description */
  description?: string;
  /** Action CTA */
  action?: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant EmptyState
 * Affichage état vide avec illustration et action
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  image,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-center
        py-12 px-4
        ${className}
      `}
    >
      {/* Illustration */}
      {image ? (
        <img
          src={image}
          alt="Empty state"
          className="w-64 h-64 object-contain mb-6"
        />
      ) : (
        <div className="mb-6 text-base-content/20">
          {icon || <Inbox className="w-16 h-16" />}
        </div>
      )}

      {/* Titre */}
      <h3 className="text-lg font-semibold text-base-content mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-base-content/60 max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action */}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;