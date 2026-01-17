import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => useContext(ToastContext);

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="text-green-500" size={20} />,
  error: <XCircle className="text-red-500" size={20} />,
  warning: <AlertCircle className="text-yellow-500" size={20} />,
  info: <Info className="text-blue-500" size={20} />,
};

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-lg border shadow-lg animate-slide-in ${toastStyles[toast.type]}`}
            role="alert"
            aria-live="polite"
          >
            {toastIcons[toast.type]}
            <p className="flex-1 text-gray-800 dark:text-gray-200 text-sm">{toast.message}</p>
            <button
              onClick={() => hideToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Bildirimi kapat"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
