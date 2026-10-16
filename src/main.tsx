import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import { PageProvider } from './page';
import { routeFromPath } from './routes';
import { ThemeProvider } from './theme/ThemeContext';
import './styles/global.css';
import './styles/layers.css';

const { page, lang } = routeFromPath(window.location.pathname);

createRoot(document.getElementById('root')!).render(
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
