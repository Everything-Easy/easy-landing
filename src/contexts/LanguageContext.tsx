import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language, TranslationStrings } from '../types';
import { translations } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'es';

    const saved = localStorage.getItem('easy-landing-lang') as Language;
    if (saved && ['es', 'en'].includes(saved)) return saved;

    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'es';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('easy-landing-lang', lang);
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

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
