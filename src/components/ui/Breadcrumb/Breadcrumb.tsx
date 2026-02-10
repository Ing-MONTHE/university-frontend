import React from 'react';

/**
 * Props du composant Breadcrumb
 */
export interface BreadcrumbProps {
  /** Séparateur personnalisé */
  separator?: React.ReactNode;
  /** Nombre max d'items avant ellipsis */
  maxItems?: number;
  /** Contenu */
  children: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant Breadcrumb
 * Fil d'Ariane pour navigation
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  separator,
  maxItems = 4,
  children,
  className = '',
}) => {
  const childrenArray = React.Children.toArray(children);
  const shouldCollapse = childrenArray.length > maxItems;

  let displayedChildren = childrenArray;

  if (shouldCollapse) {
    // Garder premier, dernier, et ellipsis au milieu
    const first = childrenArray[0];
    const last = childrenArray[childrenArray.length - 1];
    const middle = childrenArray.slice(1, -1);

    displayedChildren = [
      first,
      <BreadcrumbEllipsis key="ellipsis" items={middle} />,
      last,
    ];
  }

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center ${className}`}>
      <ol className="flex items-center flex-wrap gap-2">
        {displayedChildren.map((child, index) => (
          <li key={index} className="flex items-center gap-2">
            {child}
            {index < displayedChildren.length - 1 && (
              <span className="text-base-content/40">{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

/**
 * Composant BreadcrumbEllipsis
 * Affiche les items collapsés
 */
interface BreadcrumbEllipsisProps {
  items: React.ReactNode[];
}

const BreadcrumbEllipsis: React.FC<BreadcrumbEllipsisProps> = ({ items }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-base-content/60 hover:text-base-content transition-colors"
        aria-label="Afficher les éléments masqués"
      >
        ...
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 z-20 bg-base-100 border border-base-300 rounded-lg shadow-lg py-1 min-w-[200px]">
            {items.map((item, index) => (
              <div key={index} className="px-3 py-2 hover:bg-base-200">
                {item}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Breadcrumb;