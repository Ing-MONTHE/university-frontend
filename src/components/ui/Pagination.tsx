import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
  showFirstLast?: boolean;
  className?: string;
  pageSize?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showPageNumbers = true,
  maxPageButtons = 5,
  showFirstLast = true,
  className = '',
}: PaginationProps) {
  
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxPageButtons) {
      // Afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Afficher avec ellipsis
      const leftSiblingIndex = Math.max(currentPage - 1, 1);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
      
      const showLeftEllipsis = leftSiblingIndex > 2;
      const showRightEllipsis = rightSiblingIndex < totalPages - 1;
      
      // Toujours montrer la première page
      pages.push(1);
      
      // Ellipsis gauche
      if (showLeftEllipsis) {
        pages.push('...');
      } else if (leftSiblingIndex === 2) {
        pages.push(2);
      }
      
      // Pages du milieu
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      // Ellipsis droite
      if (showRightEllipsis) {
        pages.push('...');
      } else if (rightSiblingIndex === totalPages - 1) {
        pages.push(totalPages - 1);
      }
      
      // Toujours montrer la dernière page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculer les infos d'affichage
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Info texte */}
      <div className="text-sm text-gray-700">
        {totalItems && itemsPerPage && (
          <span>
            Affichage de <span className="font-semibold">{startItem}</span> à{' '}
            <span className="font-semibold">{endItem}</span> sur{' '}
            <span className="font-semibold">{totalItems}</span> résultats
          </span>
        )}
      </div>

      {/* Boutons de pagination */}
      <div className="flex items-center gap-1">
        {/* Première page */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`
              p-2 rounded-lg border border-gray-300
              transition-all duration-200
              ${currentPage === 1
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 hover:bg-gray-100 hover:border-gray-400'
              }
            `}
            title="Première page"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
        )}

        {/* Page précédente */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg border border-gray-300
            transition-all duration-200
            ${currentPage === 1
              ? 'text-gray-400 cursor-not-allowed bg-gray-50'
              : 'text-gray-700 hover:bg-gray-100 hover:border-gray-400'
            }
          `}
          title="Page précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Numéros de page */}
        {showPageNumbers && pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`
              min-w-[40px] px-3 py-2 rounded-lg border text-sm font-medium
              transition-all duration-200
              ${page === currentPage
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : page === '...'
                ? 'border-transparent text-gray-400 cursor-default'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
              }
            `}
          >
            {page}
          </button>
        ))}

        {/* Page suivante */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg border border-gray-300
            transition-all duration-200
            ${currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed bg-gray-50'
              : 'text-gray-700 hover:bg-gray-100 hover:border-gray-400'
            }
          `}
          title="Page suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dernière page */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`
              p-2 rounded-lg border border-gray-300
              transition-all duration-200
              ${currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                : 'text-gray-700 hover:bg-gray-100 hover:border-gray-400'
              }
            `}
            title="Dernière page"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
