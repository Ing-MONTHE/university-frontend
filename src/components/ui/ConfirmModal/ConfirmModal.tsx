import { AlertCircle } from 'lucide-react';
import Modal from '../Modal';
import Button from '../Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  type = 'danger',
}: ConfirmModalProps) {
  
  const colors = {
    danger: {
      icon: 'bg-red-100 text-red-600',
      button: 'danger' as const,
    },
    warning: {
      icon: 'bg-orange-100 text-orange-600',
      button: 'warning' as const,
    },
    info: {
      icon: 'bg-blue-100 text-blue-600',
      button: 'primary' as const,
    },
  };

  const colorScheme = colors[type];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
      showCloseButton={false}
    >
      {/* Icône + Titre */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`${colorScheme.icon} p-3 rounded-full flex-shrink-0`}>
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-base leading-relaxed">{message}</p>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3 mt-6">
        <Button
          variant="secondary"
          size="md"
          onClick={onClose}
          fullWidth
        >
          {cancelText}
        </Button>
        <Button
          variant={colorScheme.button}
          size="md"
          onClick={handleConfirm}
          fullWidth
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}