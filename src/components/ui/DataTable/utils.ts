import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Exporter des données en CSV
 */
export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string = 'export.csv'
) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

/**
 * Exporter des données en Excel
 */
export const exportToExcel = <T extends Record<string, any>>(
  data: T[],
  filename: string = 'export.xlsx'
) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, filename);
};

/**
 * Télécharger un blob
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Sauvegarder préférences dans localStorage
 */
export const saveTablePreferences = (
  tableId: string,
  preferences: Record<string, any>
) => {
  try {
    localStorage.setItem(`table_${tableId}`, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving table preferences:', error);
  }
};

/**
 * Charger préférences depuis localStorage
 */
export const loadTablePreferences = (tableId: string): Record<string, any> | null => {
  try {
    const stored = localStorage.getItem(`table_${tableId}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading table preferences:', error);
    return null;
  }
};

/**
 * Filtrer données selon valeur
 */
export const filterData = <T extends Record<string, any>>(
  data: T[],
  filters: Record<string, string>
): T[] => {
  return data.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const rowValue = String(row[key]).toLowerCase();
      return rowValue.includes(value.toLowerCase());
    });
  });
};

/**
 * Trier données
 */
export const sortData = <T extends Record<string, any>>(
  data: T[],
  sortBy: Array<{ key: string; direction: 'asc' | 'desc' }>
): T[] => {
  if (sortBy.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const { key, direction } of sortBy) {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal === bVal) continue;

      const comparison = aVal > bVal ? 1 : -1;
      return direction === 'asc' ? comparison : -comparison;
    }
    return 0;
  });
};