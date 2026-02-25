'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations, defaultLocale } from '../i18n/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(defaultLocale);
  const [t, setT] = useState(translations[defaultLocale]);

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
      setT(translations[savedLocale]);
    }
  }, []);

  const changeLanguage = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      setT(translations[newLocale]);
      localStorage.setItem('locale', newLocale);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
