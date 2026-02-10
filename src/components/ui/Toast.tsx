/**
 * Toast notification system using react-toastify
 * Wrapper personnalisé pour une utilisation facile dans toute l'app
 */

import React from 'react';
import { toast, ToastOptions, ToastContainer as ToastifyContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

// Configuration par défaut
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
};

// Toast Success
export const toastSuccess = (message: string, options?: ToastOptions) => {
  toast.success(
    <div className="flex items-center gap-2">
      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>,
    { ...defaultOptions, ...options }
  );
};

// Toast Error
export const toastError = (message: string, options?: ToastOptions) => {
  toast.error(
    <div className="flex items-center gap-2">
      <XCircle className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>,
    { ...defaultOptions, ...options }
  );
};

// Toast Warning
export const toastWarning = (message: string, options?: ToastOptions) => {
  toast.warning(
    <div className="flex items-center gap-2">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>,
    { ...defaultOptions, ...options }
  );
};

// Toast Info
export const toastInfo = (message: string, options?: ToastOptions) => {
  toast.info(
    <div className="flex items-center gap-2">
      <Info className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>,
    { ...defaultOptions, ...options }
  );
};

// Toast Promise (pour opérations async)
export const toastPromise = <T,>(
  promise: Promise<T>,
  messages: {
    pending: string;
    success: string;
    error: string;
  },
  options?: ToastOptions
) => {
  return toast.promise(
    promise,
    {
      pending: {
        render: () => (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>{messages.pending}</span>
          </div>
        ),
      },
      success: {
        render: () => (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{messages.success}</span>
          </div>
        ),
      },
      error: {
        render: () => (
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span>{messages.error}</span>
          </div>
        ),
      },
    },
    { ...defaultOptions, ...options }
  );
};

// Toast Container Component (à placer dans App.tsx ou main Layout)
export function ToastContainer() {
  return (
    <ToastifyContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="bg-white shadow-lg rounded-lg border border-gray-200"
      bodyClassName="text-sm text-gray-700 font-medium"
      progressClassName="bg-gradient-to-r from-blue-500 to-blue-600"
    />
  );
}

// Export toast original pour usages avancés
export { toast };
