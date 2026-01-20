import React from 'react';
import { type IconType } from 'react-icons';

// TYPES

 // Variantes de boutons disponibles
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

 // Tailles de boutons disponibles
type ButtonSize = 'sm' | 'md' | 'lg';

 // Props du composant Button
interface ButtonProps {
    children: React.ReactNode;           // Contenu du bouton
    onClick?: () => void;                 // Fonction au clic
    type?: 'button' | 'submit' | 'reset'; // Type HTML du bouton
    variant?: ButtonVariant;              // Style du bouton
    size?: ButtonSize;                    // Taille du bouton
    icon?: IconType;                      // Icône (optionnelle)
    iconPosition?: 'left' | 'right';      // Position de l'icône
    disabled?: boolean;                   // Bouton désactivé
    loading?: boolean;                    // État de chargement
    fullWidth?: boolean;                  // Prend toute la largeur
    className?: string;                   // Classes CSS supplémentaires
}

// COMPOSANT BUTTON
const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
}) => 
{
    // CLASSES CSS PAR VARIANTE
    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
        info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500',
    };

    // CLASSES CSS PAR TAILLE
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    // CLASSES CSS COMBINÉES
    const baseClasses = `
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const widthClass = fullWidth ? 'w-full' : '';
  
    const classes = `
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    // ICÔNE DE CHARGEMENT (SPINNER)
    const LoadingSpinner = () => (
        <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
        </svg>
    );

    // RENDU
    return (
        <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={classes}
        >
            {/* Icône à gauche ou spinner */}
            {loading ? (
                <LoadingSpinner />
            ) : Icon && iconPosition === 'left' ? (
                <Icon className="mr-2" />
            ) : null}

            {/* Texte du bouton */}
            <span>{children}</span>

            {/* Icône à droite */}
            {!loading && Icon && iconPosition === 'right' && (
                <Icon className="ml-2" />
            )}
        </button>
    );
};

export default Button;