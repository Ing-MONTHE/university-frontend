import { useState, useRef, useEffect, ReactNode } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  label,
  error,
  disabled = false,
  clearable = false,
  searchable = false,
  className = '',
  size = 'md',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fermer le dropdown si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus sur input de recherche quand dropdown s'ouvre
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filtrer les options selon la recherche
  const filteredOptions = searchQuery
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Trouver l'option sélectionnée
  const selectedOption = options.find(opt => opt.value === value);

  // Gérer la sélection
  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Gérer le clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  // Sizes
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-2
          ${sizes[size]}
          border-2 rounded-lg
          transition-all
          ${error
            ? 'border-red-500 focus:ring-2 focus:ring-red-500'
            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }
          ${disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-white hover:border-gray-400'
          }
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        {/* Selected option or placeholder */}
        <span className={`flex-1 text-left truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon && <span>{selectedOption.icon}</span>}
              {selectedOption.label}
            </span>
          ) : (
            placeholder
          )}
        </span>

        {/* Icons */}
        <div className="flex items-center gap-1">
          {clearable && selectedOption && !disabled && (
            <X
              className={`${iconSizes[size]} text-gray-400 hover:text-gray-600`}
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={`${iconSizes[size]} text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Options */}
          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Aucun résultat trouvé
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                  className={`
                    w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm
                    transition-colors
                    ${option.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-900 hover:bg-blue-50'
                    }
                    ${option.value === value ? 'bg-blue-100 text-blue-700 font-medium' : ''}
                  `}
                >
                  <span className="flex items-center gap-2 flex-1 truncate">
                    {option.icon && <span>{option.icon}</span>}
                    {option.label}
                  </span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
