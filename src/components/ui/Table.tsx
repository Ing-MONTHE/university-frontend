import { ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selectedIds: Set<string | number>) => void;
  sortable?: boolean;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  className?: string;
}

export default function Table<T = any>({
  columns,
  data,
  keyExtractor = (_, index) => index,
  loading = false,
  emptyMessage = 'Aucune donnée disponible',
  onRowClick,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  sortable = false,
  defaultSortKey,
  defaultSortDirection = 'asc',
  onSort,
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
  className = '',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  // Gestion du tri
  const handleSort = (key: string) => {
    if (!sortable) return;

    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(key, newDirection);
    }
  };

  // Gestion de la sélection
  const handleSelectAll = () => {
    if (!selectable || !onSelectionChange) return;

    const allIds = data.map((row, index) => keyExtractor(row, index));
    
    if (selectedRows.size === data.length) {
      // Tout désélectionner
      onSelectionChange(new Set());
    } else {
      // Tout sélectionner
      onSelectionChange(new Set(allIds));
    }
  };

  const handleSelectRow = (id: string | number) => {
    if (!selectable || !onSelectionChange) return;

    const newSelection = new Set(selectedRows);
    
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    
    onSelectionChange(newSelection);
  };

  // Check si toutes les lignes sont sélectionnées
  const allSelected = selectable && data.length > 0 && selectedRows.size === data.length;
  const someSelected = selectable && selectedRows.size > 0 && selectedRows.size < data.length;

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`min-w-full divide-y divide-gray-200 ${bordered ? 'border border-gray-200' : ''}`}>
        {/* Header */}
        <thead className="bg-gray-50">
          <tr>
            {/* Checkbox colonne */}
            {selectable && (
              <th scope="col" className={`${compact ? 'px-3 py-2' : 'px-6 py-3'} text-left`}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
              </th>
            )}

            {/* Colonnes */}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`
                  ${compact ? 'px-3 py-2' : 'px-6 py-3'}
                  text-xs font-semibold text-gray-700 uppercase tracking-wider
                  ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                  ${column.sortable && sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}
                  ${column.className || ''}
                `}
                style={{ width: column.width }}
                onClick={() => column.sortable && sortable && handleSort(column.key)}
              >
                <div className={`flex items-center gap-1 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                  <span>{column.label}</span>
                  
                  {/* Icône de tri */}
                  {column.sortable && sortable && (
                    <span className="ml-1">
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? (
                          <ChevronUp className="w-4 h-4 text-blue-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-blue-600" />
                        )
                      ) : (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className={`bg-white divide-y divide-gray-200 ${striped ? '' : ''}`}>
          {/* Loading state */}
          {loading && (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-gray-600">Chargement...</span>
                </div>
              </td>
            </tr>
          )}

          {/* Empty state */}
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
              </td>
            </tr>
          )}

          {/* Data rows */}
          {!loading && data.map((row, index) => {
            const rowId = keyExtractor(row, index);
            const isSelected = selectedRows.has(rowId);

            return (
              <tr
                key={rowId}
                className={`
                  ${striped && index % 2 === 0 ? 'bg-white' : striped ? 'bg-gray-50' : 'bg-white'}
                  ${hoverable ? 'hover:bg-blue-50 transition-colors' : ''}
                  ${isSelected ? 'bg-blue-100' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={() => onRowClick?.(row, index)}
              >
                {/* Checkbox */}
                {selectable && (
                  <td className={`${compact ? 'px-3 py-2' : 'px-6 py-4'}`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(rowId);
                      }}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}

                {/* Data cells */}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      ${compact ? 'px-3 py-2' : 'px-6 py-4'}
                      text-sm text-gray-900
                      ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                      ${column.className || ''}
                    `}
                  >
                    {column.render
                      ? column.render((row as any)[column.key], row, index)
                      : (row as any)[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}