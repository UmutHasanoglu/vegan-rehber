import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useTranslation } from '../i18n/LanguageContext';
import { useToast } from '../components/Toast';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { Send, WifiOff } from 'lucide-react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mldebkwz';

interface FormValues {
  name: string;
  email: string;
  description: string;
  type: 'new' | 'report';
  productId: string | null;
}

const Report: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { isOnline, addToQueue, queueLength } = useOfflineQueue();
  const productId = new URLSearchParams(location.search).get('productId');
  const [formType, setFormType] = useState<'new' | 'report'>('new');

  const validateForm = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.name.trim()) {
      errors.name = 'İsim zorunludur';
    }

    if (!values.email.trim()) {
      errors.email = 'E-posta zorunludur';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!values.description.trim()) {
      errors.description = 'Açıklama zorunludur';
    } else if (values.description.trim().length < 10) {
      errors.description = 'Açıklama en az 10 karakter olmalıdır';
    }

    return errors;
  };

  const handleFormSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      type: formType,
      subject: formType === 'new' ? 'New Product Suggestion' : 'Product Report',
    };

    if (!isOnline) {
      // Queue for later submission
      addToQueue(FORMSPREE_ENDPOINT, 'POST', payload);
      showToast(t.report.queued, 'info');
      reset();
      return;
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast(t.report.success, 'success');
        navigate('/');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch {
      showToast(t.report.error, 'error');
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    initialValues: {
      name: '',
      email: '',
      description: '',
      type: 'new',
      productId,
    },
    validate: validateForm,
    onSubmit: handleFormSubmit,
  });

  const handleTypeChange = (newType: 'new' | 'report') => {
    setFormType(newType);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-6">
        {formType === 'new' ? t.report.suggestNew : t.report.reportIssue}
      </h1>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-3">
          <WifiOff size={20} className="text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Çevrimdışısınız. Gönderiminiz bağlandığınızda iletilecek.
            {queueLength > 0 && ` (${queueLength} bekleyen gönderim)`}
          </p>
        </div>
      )}

      {/* Type Toggle */}
      <div className="mb-6 flex gap-2" role="tablist">
        <button
          onClick={() => handleTypeChange('new')}
          className={`px-4 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
            formType === 'new'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          role="tab"
          aria-selected={formType === 'new'}
        >
          {t.report.suggestNew}
        </button>
        <button
          onClick={() => handleTypeChange('report')}
          className={`px-4 py-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
            formType === 'report'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          role="tab"
          aria-selected={formType === 'report'}
        >
          {t.report.reportIssue}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t.report.name}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={`mt-1 block w-full px-3 py-2 rounded-lg border ${
              errors.name && touched.name
                ? 'border-red-500 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors`}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            aria-invalid={errors.name && touched.name ? 'true' : 'false'}
            aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
          />
          {errors.name && touched.name && (
            <p id="name-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t.report.email}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={`mt-1 block w-full px-3 py-2 rounded-lg border ${
              errors.email && touched.email
                ? 'border-red-500 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors`}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            aria-invalid={errors.email && touched.email ? 'true' : 'false'}
            aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
          />
          {errors.email && touched.email && (
            <p id="email-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t.report.description}
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className={`mt-1 block w-full px-3 py-2 rounded-lg border ${
              errors.description && touched.description
                ? 'border-red-500 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none`}
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={
              formType === 'new'
                ? t.report.descriptionPlaceholder.new
                : t.report.descriptionPlaceholder.report
            }
            disabled={isSubmitting}
            aria-invalid={errors.description && touched.description ? 'true' : 'false'}
            aria-describedby={
              errors.description && touched.description ? 'description-error' : undefined
            }
          />
          {errors.description && touched.description && (
            <p id="description-error" className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.description}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
          {isSubmitting ? t.report.submitting : t.submit}
        </button>
      </form>
    </div>
  );
};

export default Report;
