import React from 'react';
import { X, FileText, File } from 'lucide-react';

/**
 * Props du composant FilePreview
 */
export interface FilePreviewProps {
  /** Fichier à prévisualiser */
  file: File;
  /** Index dans la liste */
  index: number;
  /** Callback suppression */
  onRemove?: (index: number) => void;
  /** Afficher preview image */
  showPreview?: boolean;
}

/**
 * Composant FilePreview
 * Affiche une preview de fichier avec bouton supprimer
 */
export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  index,
  onRemove,
  showPreview = true,
}) => {
  const [preview, setPreview] = React.useState<string>('');
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  // Générer preview pour images
  React.useEffect(() => {
    if (isImage && showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview('');
    }
  }, [file, isImage, showPreview]);

  // Formater taille fichier
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="relative flex items-center gap-3 p-3 bg-base-200 rounded-lg group">
      {/* Preview ou icône */}
      <div className="flex-shrink-0">
        {isImage && preview ? (
          <img
            src={preview}
            alt={file.name}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-base-300 rounded">
            {isPDF ? (
              <FileText className="w-8 h-8 text-error" />
            ) : (
              <File className="w-8 h-8 text-base-content" />
            )}
          </div>
        )}
      </div>

      {/* Info fichier */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-base-content/60">{formatSize(file.size)}</p>
      </div>

      {/* Bouton supprimer */}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="
            btn btn-ghost btn-sm btn-circle
            opacity-0 group-hover:opacity-100
            transition-opacity
          "
          aria-label="Supprimer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default FilePreview;