import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { ColumnFilter } from './ColumnFilter';
import { ExportButton } from './ExportButton';
import { SelectionToolbar } from './SelectionToolbar';
import { filterData, sortData, saveTablePreferences, loadTablePreferences } from './utils';
import Spinner from '../Spinner';
import EmptyState from '../EmptyState';

/**
 * Définition d'une colonne
 */
export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: number;
  minWidth?: number;
}

/**
 * Configuration pagination
 */
export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * Densité d'affichage
 */
export type TableDensity = 'compact' | 'normal' | 'comfortable';

/**
 * Props du composant DataTable
 */
export interface DataTableProps<T> {
  /** Données */
  data: T[];
  /** Colonnes */
  columns: ColumnDef<T>[];
  /** Chargement */
  isLoading?: boolean;
  /** Pagination */
  pagination?: PaginationConfig;
  /** Callback clic ligne */
  onRowClick?: (row: T) => void;
  /** Sélection multiple */
  selectable?: boolean;
  /** Callback changement sélection */
  onSelectionChange?: (selected: T[]) => void;
  /** Exportable */
  exportable?: boolean;
  /** Nom fichier export */
  exportFilename?: string;
  /** Densité */
  density?: TableDensity;
  /** ID table pour préférences */
  tableId?: string;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant DataTable
 * Table avancée avec tri, filtres, export, sélection
 */
export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  pagination,
  onRowClick,
  selectable = false,
  onSelectionChange,
  exportable = false,
  exportFilename = 'export',
  density = 'normal',
  tableId,
  className = '',
}: DataTableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<Array<{ key: string; direction: 'asc' | 'desc' }>>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Charger préférences
  useEffect(() => {
    if (tableId) {
      const prefs = loadTablePreferences(tableId);
      if (prefs) {
        if (prefs.sortBy) setSortBy(prefs.sortBy);
        if (prefs.filters) setFilters(prefs.filters);
        if (prefs.columnWidths) setColumnWidths(prefs.columnWidths);
      }
    }
  }, [tableId]);

  // Sauvegarder préférences
  useEffect(() => {
    if (tableId) {
      saveTablePreferences(tableId, { sortBy, filters, columnWidths });
    }
  }, [tableId, sortBy, filters, columnWidths]);

  // Traiter données
  const processedData = React.useMemo(() => {
    let result = [...data];
    result = filterData(result, filters);
    result = sortData(result, sortBy);
    return result;
  }, [data, filters, sortBy]);

  // Gérer tri
  const handleSort = (key: string, isShiftKey: boolean) => {
    setSortBy((prev) => {
      const existing = prev.find((s) => s.key === key);

      if (!isShiftKey) {
        // Tri simple
        if (!existing) {
          return [{ key, direction: 'asc' }];
        }
        if (existing.direction === 'asc') {
          return [{ key, direction: 'desc' }];
        }
        return [];
      } else {
        // Tri multiple (Shift)
        if (!existing) {
          return [...prev, { key, direction: 'asc' }];
        }
        if (existing.direction === 'asc') {
          return prev.map((s) =>
            s.key === key ? { ...s, direction: 'desc' as const } : s
          );
        }
        return prev.filter((s) => s.key !== key);
      }
    });
  };

  // Gérer sélection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(processedData.map((_, i) => i)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  useEffect(() => {
    const selected = Array.from(selectedRows).map((i) => processedData[i]);
    onSelectionChange?.(selected);
  }, [selectedRows, processedData]);

  // Classes densité
  const densityClasses = {
    compact: 'text-xs',
    normal: 'text-sm',
    comfortable: 'text-base',
  };

  const paddingClasses = {
    compact: 'px-2 py-1',
    normal: 'px-4 py-2',
    comfortable: 'px-6 py-3',
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (processedData.length === 0) {
    return (
      <EmptyState
        title="Aucune donnée"
        description="Aucun résultat ne correspond à vos critères"
      />
    );
  }

  return (
    <div className={className}>
      {/* Toolbar sélection */}
      {selectable && (
        <SelectionToolbar
          selectedCount={selectedRows.size}
          selectedItems={Array.from(selectedRows).map((i) => processedData[i])}
          onExport={
            exportable
              ? () => ExportButton({ data: Array.from(selectedRows).map((i) => processedData[i]), filename: exportFilename })
              : undefined
          }
        />
      )}

      {/* Actions */}
      <div className="flex justify-end mb-4">
        {exportable && (
          <ExportButton data={processedData} filename={exportFilename} />
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-base-300 rounded-lg">
        <table className={`table ${densityClasses[density]}`}>
          <thead>
            <tr>
              {selectable && (
                <th className={paddingClasses[density]}>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedRows.size === processedData.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}
              {columns.map((column) => {
                const sort = sortBy.find((s) => s.key === column.key);
                return (
                  <th
                    key={String(column.key)}
                    className={paddingClasses[density]}
                    style={{ width: columnWidths[String(column.key)] || column.width }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={column.sortable ? 'cursor-pointer select-none' : ''}
                        onClick={(e) =>
                          column.sortable && handleSort(String(column.key), e.shiftKey)
                        }
                      >
                        {column.header}
                      </span>
                      {column.sortable && (
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={(e) => handleSort(String(column.key), e.shiftKey)}
                        >
                          {!sort && <ChevronsUpDown className="w-3 h-3" />}
                          {sort?.direction === 'asc' && <ChevronUp className="w-3 h-3" />}
                          {sort?.direction === 'desc' && <ChevronDown className="w-3 h-3" />}
                        </button>
                      )}
                      {column.filterable && (
                        <ColumnFilter
                          value={filters[String(column.key)] || ''}
                          onChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              [String(column.key)]: value,
                            }))
                          }
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-base-200' : ''}
                  ${selectedRows.has(rowIndex) ? 'bg-primary/10' : ''}
                `}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <td className={paddingClasses[density]}>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedRows.has(rowIndex)}
                      onChange={() => handleSelectRow(rowIndex)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={String(column.key)} className={paddingClasses[density]}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;