import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations, Language, TranslationKeys } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: translations.tr,
});

export const useLanguage = () => useContext(LanguageContext);

// Simple translation hook that returns a translation function
export const useTranslation = () => {
  const { t, language, setLanguage } = useLanguage();
  return { t, language, setLanguage };
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    if (stored && (stored === 'tr' || stored === 'en')) {
      return stored as Language;
    }
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'tr' ? 'tr' : 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
