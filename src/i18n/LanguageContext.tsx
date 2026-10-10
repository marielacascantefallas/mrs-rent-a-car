import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { strings, type Lang, type Strings } from './strings';
import { LANG_PATH, langFromPath, seoFor } from '../seo';

/** El idioma lo define la URL: / es español y /en/ es inglés (cada uno indexable). */
function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'es';
  return langFromPath(window.location.pathname);
}

type LanguageContextValue = {
  lang: Lang;
  t: Strings;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(() => initialLang ?? readInitialLang());

  // Mantiene idioma, título y descripción del documento al cambiar sin recargar.
  useEffect(() => {
    const seo = seoFor(lang);
    document.documentElement.setAttribute('lang', lang);
    document.title = seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    const path = LANG_PATH[next];
    if (window.location.pathname !== path) {
      history.replaceState(null, '', path + window.location.hash);
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
