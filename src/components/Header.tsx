import { useCallback, useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { usePage } from '../page';
import { pathFor, sectionHref } from '../routes';
import { useTheme } from '../theme/ThemeContext';
import { Logo } from './Logo';
import { Menu } from './Menu';
import { MenuIcon, MoonIcon, SunIcon } from './icons';
import { useHeaderTone } from './useHeaderTone';
import './header.css';

export function Header() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const page = usePage();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const sectionTone = useHeaderTone(headerRef);
  // Sobre amarillo siempre va verde. En modo oscuro las demás secciones son oscuras.
  const tone = sectionTone === 'accent' ? 'light' : theme === 'dark' ? 'dark' : sectionTone;

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <header ref={headerRef} className="header glass" data-tone={tone}>
        <a href={sectionHref(page, lang, 'home')} className="header__logo">
          <Logo tone={tone === 'dark' ? 'dark' : 'light'} height={38} />
        </a>
        <div className="header__controls">
          <div className="lang" role="group" aria-label={t.langSwitch}>
            <a
              href={pathFor(page, 'es')}
              hrefLang="es"
              lang="es"
              className="lang__opt"
              aria-current={lang === 'es' ? 'true' : undefined}
              aria-label="Español"
              onClick={(e) => {
                e.preventDefault();
                setLang('es');
              }}
            >
              ES
            </a>
            <span aria-hidden="true" className="lang__sep">
              /
            </span>
            <a
              href={pathFor(page, 'en')}
              hrefLang="en"
              lang="en"
              className="lang__opt"
              aria-current={lang === 'en' ? 'true' : undefined}
              aria-label="English"
              onClick={(e) => {
                e.preventDefault();
                setLang('en');
              }}
            >
              EN
            </a>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            className="icon-btn"
            onClick={() => setMenuOpen(true)}
            aria-label={t.openMenu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            <MenuIcon size={26} />
          </button>
        </div>
      </header>
      <Menu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
