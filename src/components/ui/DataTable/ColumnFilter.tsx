import React, { useState } from 'react';
import { Filter } from 'lucide-react';

/**
 * Props du composant ColumnFilter
 */
export interface ColumnFilterProps {
  /** Valeur du filtre */
  value: string;
  /** Callback changement */
  onChange: (value: string) => void;
  /** Placeholder */
  placeholder?: string;
}

/**
 * Composant ColumnFilter
 * Filtre pour une colonne
 */
export const ColumnFilter: React.FC<ColumnFilterProps> = ({
  value,
  onChange,
  placeholder = 'Filtrer...',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-ghost btn-xs ${value ? 'text-primary' : ''}`}
        aria-label="Filtrer"
      >
        <Filter className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 z-20 bg-base-100 border border-base-300 rounded-lg shadow-lg p-2 min-w-[200px]">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="input input-sm input-bordered w-full"
              autoFocus
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ColumnFilter;