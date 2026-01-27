import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  
  // Variants
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
    success: 'bg-green-600 hover:bg-green-700 text-white border-transparent shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent shadow-sm hover:shadow-md',
    warning: 'bg-orange-600 hover:bg-orange-700 text-white border-transparent shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
  };

  // Sizes
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Icon sizes
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg border
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && <Loader2 className={`${iconSizes[size]} animate-spin`} />}
      
      {/* Icon left */}
      {!isLoading && icon && iconPosition === 'left' && (
        <span className={iconSizes[size]}>{icon}</span>
      )}
      
      {/* Text */}
      {children}
      
      {/* Icon right */}
      {!isLoading && icon && iconPosition === 'right' && (
        <span className={iconSizes[size]}>{icon}</span>
      )}
    </button>
  );
}
