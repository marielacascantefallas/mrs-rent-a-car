import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FACEBOOK_URL, INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from '../config';
import { NAV } from '../i18n/strings';
import { useLanguage } from '../i18n/LanguageContext';
import { BrandIcon } from './BrandIcon';
import { scrollToSection } from './layers';
import { usePage } from '../page';
import { sectionHref } from '../routes';
import { Logo } from './Logo';
import { CloseIcon } from './icons';
import './menu.css';

type MenuProps = {
  open: boolean;
  onClose: () => void;
};

export function Menu({ open, onClose }: MenuProps) {
  const { lang, t } = useLanguage();
  const page = usePage();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // inert evita que el menú cerrado reciba foco o clics.
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open]);

  // Bloquea el scroll del fondo, cierra con Escape y mantiene el foco dentro.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('is-locked');
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
    };
  }, [open, onClose]);

  const goTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Desde otras páginas, el enlace lleva a la sección de la página principal.
    if (page !== 'home') return;
    e.preventDefault();
    onClose();
    // Libera el scroll ya (el efecto de cierre corre después) y luego se desplaza.
    document.body.classList.remove('is-locked');
    requestAnimationFrame(() => scrollToSection(id));
  };

  // En el HTML pregenerado no hay body: el menú se monta solo en el navegador.
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      id="site-menu"
      ref={panelRef}
      className="menu glass"
      data-tone="dark"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
    >
      <div className="menu__top">
        <Logo tone="dark" height={44} />
        <button
          ref={closeRef}
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label={t.closeMenu}
        >
          <CloseIcon size={30} />
        </button>
      </div>

      <nav className="menu__nav" aria-label="Menu">
        <ul>
          {NAV.map((item, i) => (
            <li key={item.id} style={{ '--i': i } as React.CSSProperties}>
              <a href={sectionHref(page, lang, item.id)} onClick={goTo(item.id)}>
                {item.label[lang]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="menu__bottom">
        <a className="menu__whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <BrandIcon brand="whatsapp" size={22} />
          <span>{WHATSAPP_DISPLAY}</span>
        </a>
        <div className="menu__social">
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <BrandIcon brand="instagram" size={22} />
          </a>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <BrandIcon brand="facebook" size={22} />
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
