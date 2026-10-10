import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { BrandIcon, type Brand } from '../components/BrandIcon';
import { Logo } from '../components/Logo';
import {
  EMAIL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from '../config';
import { NAV } from '../i18n/strings';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import './footer.css';

const FooterGradient = lazy(() => import('./FooterGradient'));

const SOCIALS: { brand: Brand; href: string; label: string }[] = [
  { brand: 'whatsapp', href: WHATSAPP_URL, label: 'WhatsApp' },
  { brand: 'instagram', href: INSTAGRAM_URL, label: 'Instagram' },
  { brand: 'facebook', href: FACEBOOK_URL, label: 'Facebook' },
];

/** Si WebGL falla, se queda el degradado de respaldo hecho con CSS. */
class GradientBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function useNear(ref: React.RefObject<HTMLElement>, margin = '600px') {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, near, margin]);
  return near;
}

export function Footer() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const ref = useRef<HTMLElement>(null);
  const near = useNear(ref);
  const [still] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  return (
    <footer ref={ref} className="footer" data-bg="light">
      <div className="footer__content">
        <div className="footer__brand">
          <a href="#home" className="footer__logo" aria-label="MRS Rent a Car">
            <Logo tone={theme === 'dark' ? 'dark' : 'light'} height={72} decorative />
          </a>
          <p className="footer__place">{t.footerPlace}</p>
          <ul className="footer__social">
            {SOCIALS.map((s) => (
              <li key={s.brand}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <BrandIcon brand={s.brand} size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer__col" aria-labelledby="footer-sections">
          <h2 id="footer-sections" className="footer__heading">
            {t.footerSections}
          </h2>
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">{t.footerContact}</h2>
          <ul>
            <li>
              <a
                className="footer__whatsapp"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrandIcon brand="whatsapp" size={18} />
                <span>{WHATSAPP_DISPLAY}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__legal">
          <p>© 2026 MRS Rent a Car</p>
        </div>
      </div>

      <div className="footer__hills" aria-hidden="true">
        {near && (
          <GradientBoundary>
            <Suspense fallback={null}>
              <FooterGradient dark={theme === 'dark'} still={still} />
            </Suspense>
          </GradientBoundary>
        )}
      </div>
    </footer>
  );
}
