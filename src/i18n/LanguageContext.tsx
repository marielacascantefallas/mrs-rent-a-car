import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { strings, type Lang, type Strings } from './strings';
import { pathFor, routeFromPath } from '../routes';
import { seoFor } from '../seo';
import { usePage } from '../page';

/** El idioma lo define la URL: cada página existe en español y en inglés (/en/…). */
function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'es';
  return routeFromPath(window.location.pathname).lang;
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
  const page = usePage();
  const [lang, setLangState] = useState<Lang>(() => initialLang ?? readInitialLang());

  // Mantiene idioma, título y descripción del documento al cambiar sin recargar.
  useEffect(() => {
    const seo = seoFor(page, lang);
    document.documentElement.setAttribute('lang', lang);
    document.title = seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
  }, [lang, page]);

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      const path = pathFor(page, next);
      if (window.location.pathname !== path) {
        history.replaceState(null, '', path + window.location.hash);
      }
    },
    [page],
  );

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
