/**
 * Composant Select Natif HTML
 */

import React, { forwardRef } from 'react';

interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ label, error, className = '', children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-2.5 text-base
            border-2 rounded-lg
            transition-all
            ${error
              ? 'border-red-500 focus:ring-2 focus:ring-red-500'
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }
            bg-white
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

NativeSelect.displayName = 'NativeSelect';

export default NativeSelect;