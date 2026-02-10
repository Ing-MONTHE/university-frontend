import React from 'react';
import { Trash2, Download } from 'lucide-react';

/**
 * Props du composant SelectionToolbar
 */
export interface SelectionToolbarProps<T> {
  /** Nombre d'items sélectionnés */
  selectedCount: number;
  /** Items sélectionnés */
  selectedItems: T[];
  /** Callback suppression */
  onDelete?: () => void;
  /** Callback export */
  onExport?: () => void;
  /** Actions personnalisées */
  customActions?: React.ReactNode;
}

/**
 * Composant SelectionToolbar
 * Barre d'actions pour sélection multiple
 */
export const SelectionToolbar = <T,>({
  selectedCount,
  selectedItems,
  onDelete,
  onExport,
  customActions,
}: SelectionToolbarProps<T>) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-lg mb-4">
      <span className="text-sm font-medium">
        {selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
      </span>

      <div className="flex gap-2 ml-auto">
        {onExport && (
          <button
            onClick={onExport}
            className="btn btn-sm btn-ghost gap-2"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="btn btn-sm btn-error btn-outline gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        )}

        {customActions}
      </div>
    </div>
  );
};

export default SelectionToolbar;