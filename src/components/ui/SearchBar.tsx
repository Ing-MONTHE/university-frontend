import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  showClearButton?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SearchBar({
  placeholder = 'Rechercher...',
  defaultValue = '',
  onSearch,
  debounceMs = 300,
  showClearButton = true,
  className = '',
  size = 'md',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  // Sizes
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      {/* Icon de recherche */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className={`${iconSizes[size]} text-gray-400`} />
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={`
          w-full pl-10 pr-10
          ${sizes[size]}
          border-2 border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          hover:border-gray-400
          transition-all
          placeholder:text-gray-500
        `}
      />

      {/* Bouton clear */}
      {showClearButton && query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className={iconSizes[size]} />
        </button>
      )}
    </form>
  );
}