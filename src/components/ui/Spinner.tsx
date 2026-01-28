import { Loader2 } from 'lucide-react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'white' | 'gray' | 'success' | 'danger' | 'warning';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  overlay?: boolean;
  message?: string;
  className?: string;
}

export default function Spinner({
  size = 'md',
  color = 'primary',
  overlay = false,
  message,
  className = '',
}: SpinnerProps) {
  
  // Sizes
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Colors
  const colors = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-green-600',
    danger: 'text-red-600',
    warning: 'text-orange-600',
  };

  // Message text colors
  const messageColors = {
    primary: 'text-gray-700',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-green-700',
    danger: 'text-red-700',
    warning: 'text-orange-700',
  };

  const spinnerElement = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizes[size]} ${colors[color]} animate-spin`} strokeWidth={2.5} />
      {message && (
        <p className={`text-sm font-medium ${messageColors[color]}`}>
          {message}
        </p>
      )}
    </div>
  );

  // Avec overlay full-screen
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          {spinnerElement}
        </div>
      </div>
    );
  }

  // Sans overlay
  return spinnerElement;
}

// Composant LoadingOverlay pour usage inline
export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
      <Spinner size="lg" message={message} />
    </div>
  );
}
