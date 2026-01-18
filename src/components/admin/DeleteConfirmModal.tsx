import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  productName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  productName,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label={t.close || 'Close'}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
          </div>
        </div>

        {/* Content */}
        <h3
          id="delete-modal-title"
          className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2"
        >
          {t.admin?.confirmDelete || 'Delete Product?'}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {t.admin?.deleteWarning || 'Are you sure you want to delete'}
          {' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            "{productName}"
          </span>
          ?
          {' '}
          {t.admin?.cannotUndo || 'This action cannot be undone.'}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {t.cancel || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting
              ? t.admin?.deleting || 'Deleting...'
              : t.admin?.delete || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
