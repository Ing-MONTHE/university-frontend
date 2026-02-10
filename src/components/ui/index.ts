/**
 * Export centralisé des composants UI
 */

export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Badge } from './Badge';
export { default as Modal } from './Modal';
export { default as Card } from './Card';
export { default as Spinner, LoadingOverlay } from './Spinner';
export { default as SearchBar } from './SearchBar';
export { default as Pagination } from './Pagination';
export { default as Select } from './Select';

export {
  ToastContainer,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
  toastPromise,
  toast,
} from './Toast';

// Avatar
export { Avatar, AvatarGroup } from './Avatar';
export type { AvatarProps, AvatarSize, AvatarStatus, AvatarVariant, AvatarGroupProps } from './Avatar';

// DatePicker
export { DatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';

// FileUpload
export { FileUpload, FilePreview } from './FileUpload';
export type { FileUploadProps, FilePreviewProps } from './FileUpload';

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps, TabsVariant } from './Tabs';

// Dropdown
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './Dropdown';
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
} from './Dropdown';

// Breadcrumb
export { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItemProps } from './Breadcrumb';

// Alert
export { Alert, AlertTitle, AlertDescription } from './Alert';
export type { AlertProps, AlertVariant, AlertTitleProps, AlertDescriptionProps } from './Alert';

// EmptyState
export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

// DataTable
export {
  DataTable,
  ExportButton,
  ColumnFilter,
  SelectionToolbar,
  exportToCSV,
  exportToExcel,
} from './DataTable';
export type {
  DataTableProps,
  ColumnDef,
  PaginationConfig,
  TableDensity,
  ExportButtonProps,
  ColumnFilterProps,
  SelectionToolbarProps,
} from './DataTable';

// ConfirmModal
export { default as ConfirmModal } from './ConfirmModal';

// Export types
export type { SelectOption } from './Select';