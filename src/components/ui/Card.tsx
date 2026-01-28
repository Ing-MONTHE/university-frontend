import { ReactNode } from 'react';

type CardVariant = 'default' | 'bordered' | 'elevated' | 'flat';

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  header,
  footer,
  title,
  subtitle,
  headerAction,
  hoverable = false,
  onClick,
}: CardProps) {
  
  // Variants
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    bordered: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border border-gray-100',
    flat: 'bg-gray-50 border border-gray-200',
  };

  // Paddings
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  // Classes de base
  const baseClasses = `
    rounded-xl
    ${variants[variant]}
    ${hoverable ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div className={baseClasses} onClick={onClick}>
      {/* Header Section */}
      {(header || title || subtitle || headerAction) && (
        <div className={`border-b border-gray-200 ${paddings[padding]}`}>
          {header || (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-500 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              {headerAction && (
                <div className="ml-4 flex-shrink-0">
                  {headerAction}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className={paddings[padding]}>
        {children}
      </div>

      {/* Footer Section */}
      {footer && (
        <div className={`border-t border-gray-200 ${paddings[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
