import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { strings, type Lang, type Strings } from './strings';

const STORAGE_KEY = 'mrs-lang';

function readInitialLang(): Lang {
  // Español por defecto; index.html ya aplicó la elección guardada.
  return document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'es';
}

type LanguageContextValue = {
  lang: Lang;
  t: Strings;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* sin almacenamiento */
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: strings[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage debe usarse dentro de LanguageProvider');
  return ctx;
}
