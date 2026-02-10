import React from 'react';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../Dropdown';
import { exportToCSV, exportToExcel } from './utils';

/**
 * Props du composant ExportButton
 */
export interface ExportButtonProps<T> {
  /** Données à exporter */
  data: T[];
  /** Nom du fichier */
  filename?: string;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant ExportButton
 * Bouton d'export avec options CSV/Excel
 */
export const ExportButton = <T extends Record<string, any>>({
  data,
  filename = 'export',
  className = '',
}: ExportButtonProps<T>) => {
  const handleExportCSV = () => {
    exportToCSV(data, `${filename}.csv`);
  };

  const handleExportExcel = () => {
    exportToExcel(data, `${filename}.xlsx`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className={`btn btn-outline btn-sm gap-2 ${className}`}>
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          Exporter en Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;