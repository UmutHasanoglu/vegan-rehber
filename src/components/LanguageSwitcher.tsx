import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../i18n/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={`Dil değiştir / Change language: ${language.toUpperCase()}`}
    >
      <Globe size={18} />
      <span className="text-sm font-medium">{language.toUpperCase()}</span>
    </button>
  );
};

export default LanguageSwitcher;
