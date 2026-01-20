import { FaExclamationTriangle } from 'react-icons/fa';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    type = 'danger'
}) => 
{
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: 'bg-red-100',
            icon: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700'
        },
        warning: {
            bg: 'bg-yellow-100',
            icon: 'text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700'
        },
        info: {
            bg: 'bg-blue-100',
            icon: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700'
        }
    };

    const currentColors = colors[type];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-fade-in">
                {/* Icône */}
                <div className={`w-12 h-12 ${currentColors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <FaExclamationTriangle className={`text-2xl ${currentColors.icon}`} />
                </div>

                {/* Titre */}
                <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-gray-600 text-center mb-6">
                    {message}
                </p>

                {/* Boutons */}
                <div className="flex space-x-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${currentColors.button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;