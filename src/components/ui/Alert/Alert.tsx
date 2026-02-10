import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

/**
 * Variant de l'alerte
 */
export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

/**
 * Props du composant Alert
 */
export interface AlertProps {
  /** Variant de l'alerte */
  variant: AlertVariant;
  /** Peut être fermé */
  dismissible?: boolean;
  /** Callback fermeture */
  onDismiss?: () => void;
  /** Icône personnalisée */
  icon?: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
  /** Contenu */
  children: React.ReactNode;
}

// Configuration par variant
const VARIANT_CONFIG = {
  success: {
    icon: CheckCircle,
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    iconColor: 'text-success',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    iconColor: 'text-warning',
  },
  error: {
    icon: XCircle,
    bg: 'bg-error/10',
    border: 'border-error/30',
    text: 'text-error',
    iconColor: 'text-error',
  },
  info: {
    icon: Info,
    bg: 'bg-info/10',
    border: 'border-info/30',
    text: 'text-info',
    iconColor: 'text-info',
  },
};

/**
 * Composant Alert
 * Message important avec variants et dismiss
 */
export const Alert: React.FC<AlertProps> = ({
  variant,
  dismissible = false,
  onDismiss,
  icon,
  className = '',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const config = VARIANT_CONFIG[variant];
  const IconComponent = config.icon;

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      className={`
        relative
        flex gap-3
        p-4
        rounded-lg
        border
        ${config.bg}
        ${config.border}
        ${isExiting ? 'animate-out fade-out-0 slide-out-to-right-2' : 'animate-in fade-in-0 slide-in-from-left-2'}
        duration-300
        ${className}
      `}
    >
      {/* Icône */}
      <div className="flex-shrink-0">
        {icon || <IconComponent className={`w-5 h-5 ${config.iconColor}`} />}
      </div>

      {/* Contenu */}
      <div className={`flex-1 ${config.text}`}>{children}</div>

      {/* Bouton dismiss */}
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={`flex-shrink-0 ${config.text} opacity-70 hover:opacity-100 transition-opacity`}
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;