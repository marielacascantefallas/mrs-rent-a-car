import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import type { Lang } from './i18n/strings';
import { LanguageProvider } from './i18n/LanguageContext';
import { PageProvider } from './page';
import type { PageId } from './routes';
import { ThemeProvider } from './theme/ThemeContext';

export { headTags, sitemap, pathFor, PAGES } from './seo';

/** HTML de una página en un idioma: lo leen Google y los demás buscadores sin ejecutar JavaScript. */
export function render(page: PageId, lang: Lang) {
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <PageProvider page={page}>
          <LanguageProvider initialLang={lang}>
            <App />
          </LanguageProvider>
        </PageProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
