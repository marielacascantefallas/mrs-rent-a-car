import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import type { Lang } from './i18n/strings';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './theme/ThemeContext';

export { headTags, sitemap, LANG_PATH } from './seo';

/** HTML del sitio en un idioma: lo leen Google y los demás buscadores sin ejecutar JavaScript. */
export function render(lang: Lang) {
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <LanguageProvider initialLang={lang}>
          <App />
        </LanguageProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
