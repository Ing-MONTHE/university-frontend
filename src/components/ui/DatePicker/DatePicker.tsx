import React from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale/fr';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker.css';

// Enregistrer la locale française
registerLocale('fr', fr);

/**
 * Props du composant DatePicker
 */
export interface DatePickerProps {
  /** Label du champ */
  label?: string;
  /** Valeur de la date */
  value: Date | null;
  /** Callback onChange */
  onChange: (date: Date | null) => void;
  /** Date minimum */
  minDate?: Date;
  /** Date maximum */
  maxDate?: Date;
  /** Format de la date */
  dateFormat?: string;
  /** Placeholder */
  placeholder?: string;
  /** Message d'erreur */
  error?: string;
  /** Champ requis */
  required?: boolean;
  /** Champ désactivé */
  disabled?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
  /** ID du champ */
  id?: string;
  /** Nom du champ */
  name?: string;
}

/**
 * Composant DatePicker
 * Sélecteur de date moderne avec react-datepicker
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  dateFormat = 'dd/MM/yyyy',
  placeholder = 'Sélectionner une date',
  error,
  required = false,
  disabled = false,
  className = '',
  id,
  name,
}) => {
  const inputId = id || name || 'datepicker';

  return (
    <div className={`form-control w-full ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="label">
          <span className="label-text font-medium">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}

      {/* DatePicker avec icône */}
      <div className="relative">
        <ReactDatePicker
          id={inputId}
          name={name}
          selected={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat={dateFormat}
          placeholderText={placeholder}
          disabled={disabled}
          locale="fr"
          showPopperArrow={false}
          className={`
            input input-bordered w-full pr-10
            ${error ? 'input-error' : ''}
            ${disabled ? 'input-disabled' : ''}
          `}
          calendarClassName="custom-datepicker"
          wrapperClassName="w-full"
        />

        {/* Icône calendrier */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default DatePicker;