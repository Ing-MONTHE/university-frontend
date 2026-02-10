import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Props du composant BreadcrumbItem
 */
export interface BreadcrumbItemProps {
  /** Lien (si cliquable) */
  href?: string;
  /** Icône */
  icon?: React.ReactNode;
  /** Item actuel (non cliquable) */
  current?: boolean;
  /** Contenu */
  children: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant BreadcrumbItem
 * Item individuel du breadcrumb
 */
export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  href,
  icon,
  current = false,
  children,
  className = '',
}) => {
  const baseClasses = 'flex items-center gap-1.5 text-sm transition-colors';

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (current) {
    return (
      <span
        className={`${baseClasses} text-base-content font-medium ${className}`}
        aria-current="page"
      >
        {content}
      </span>
    );
  }

  if (href) {
    return (
      <Link
        to={href}
        className={`${baseClasses} text-base-content/60 hover:text-base-content ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={`${baseClasses} text-base-content/60 ${className}`}>
      {content}
    </span>
  );
};

/**
 * Séparateur par défaut
 */
export const BreadcrumbSeparator = () => (
  <ChevronRight className="w-4 h-4 text-base-content/40" />
);

export default BreadcrumbItem;