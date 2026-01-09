import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { musicTranslations, MusicLanguage } from '../lib/music-translations';

interface LanguageContextType {
  language: MusicLanguage;
  setLanguage: (lang: MusicLanguage) => void;
  t: typeof musicTranslations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<MusicLanguage>(() => {
    const saved = localStorage.getItem('musicLanguage');
    return (saved as MusicLanguage) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('musicLanguage', language);
  }, [language]);

  const setLanguage = (lang: MusicLanguage) => {
    setLanguageState(lang);
  };

  const value = {
    language,
    setLanguage,
    t: musicTranslations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
