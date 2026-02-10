import React from 'react';
import { Upload } from 'lucide-react';
import { FilePreview } from './FilePreview';

/**
 * Props du composant FileUpload
 */
export interface FileUploadProps {
  /** Types de fichiers acceptés */
  accept?: string;
  /** Taille max en MB */
  maxSize?: number;
  /** Upload multiple */
  multiple?: boolean;
  /** Afficher preview */
  preview?: boolean;
  /** Label du champ */
  label?: string;
  /** Message d'erreur */
  error?: string;
  /** Callback upload */
  onUpload: (files: File[]) => void | Promise<void>;
  /** Callback suppression */
  onRemove?: (index: number) => void;
  /** Désactivé */
  disabled?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant FileUpload
 * Zone de drag & drop avec preview
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSize = 5,
  multiple = false,
  preview = true,
  label,
  error,
  onUpload,
  onRemove,
  disabled = false,
  className = '',
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string>('');
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Validation fichier
  const validateFile = (file: File): string | null => {
    // Vérifier taille
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `${file.name} dépasse la taille maximale de ${maxSize}MB`;
    }

    // Vérifier type
    if (accept) {
      const acceptedTypes = accept.split(',').map((t) => t.trim());
      const fileType = file.type;
      const fileExt = '.' + file.name.split('.').pop();

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExt === type;
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.replace('/*', ''));
        }
        return fileType === type;
      });

      if (!isAccepted) {
        return `${file.name} n'est pas un type de fichier autorisé`;
      }
    }

    return null;
  };

  // Gérer fichiers sélectionnés
  const handleFiles = async (newFiles: FileList | null) => {
    if (!newFiles || disabled) return;

    setValidationError('');
    const fileArray = Array.from(newFiles);

    // Valider chaque fichier
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        return;
      }
    }

    // Limiter à 1 fichier si pas multiple
    const filesToAdd = multiple ? fileArray : [fileArray[0]];

    setFiles((prev) => (multiple ? [...prev, ...filesToAdd] : filesToAdd));

    // Appeler callback
    setIsUploading(true);
    try {
      await onUpload(filesToAdd);
    } catch (err) {
      setValidationError('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // Click handler
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Remove handler
  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    onRemove?.(index);
  };

  const displayError = error || validationError;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="label">
          <span className="label-text font-medium">{label}</span>
        </label>
      )}

      {/* Zone de drop */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative
          border-2 border-dashed rounded-lg
          p-8
          text-center
          cursor-pointer
          transition-all
          ${isDragging ? 'border-primary bg-primary/5 scale-105' : 'border-base-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-base-200'}
          ${displayError ? 'border-error' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <Upload className="w-12 h-12 mx-auto mb-4 text-base-content/40" />

        <p className="text-base font-medium mb-2">
          {isDragging
            ? 'Déposez les fichiers ici'
            : 'Glissez-déposez ou cliquez pour sélectionner'}
        </p>

        <p className="text-sm text-base-content/60">
          {accept && `Formats acceptés: ${accept}`}
          {accept && maxSize && ' • '}
          {maxSize && `Max ${maxSize}MB`}
        </p>

        {isUploading && (
          <div className="absolute inset-0 bg-base-100/80 flex items-center justify-center rounded-lg">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}
      </div>

      {/* Erreur */}
      {displayError && (
        <label className="label">
          <span className="label-text-alt text-error">{displayError}</span>
        </label>
      )}

      {/* Preview fichiers */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <FilePreview
              key={`${file.name}-${index}`}
              file={file}
              index={index}
              onRemove={handleRemove}
              showPreview={preview}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;