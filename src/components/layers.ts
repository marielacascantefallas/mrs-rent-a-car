/*
 * Scroll con capas: en escritorio cada sección de <main> queda fija (sticky)
 * y la siguiente sube y la cubre. En móvil y con movimiento reducido, scroll normal.
 */

// Escritorio: por encima de 768 px (768 px aún usa scroll normal).
export const LAYERS_QUERY = '(min-width: 769px) and (prefers-reduced-motion: no-preference)';

function sections(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('main > section'));
}

/**
 * Posición de scroll en la que la sección empieza arriba de la pantalla.
 * Con sticky, el rectángulo de una sección fija no dice dónde está en el flujo,
 * así que se calcula sumando las alturas de las secciones anteriores.
 */
function naturalTop(target: HTMLElement): number | null {
  const main = target.parentElement;
  if (!main || main.tagName !== 'MAIN') return null;
  let top = main.getBoundingClientRect().top + window.scrollY;
  for (const s of sections()) {
    if (s === target) return top;
    top += s.offsetHeight;
  }
  return null;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top = naturalTop(el);
  if (top === null) {
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  } else {
    window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
  }
  history.replaceState(null, '', `#${id}`);
  return true;
}

/** Enlaces internos (#home, #cars…) usan la posición real de cada sección. */
export function setupAnchorLinks() {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as Element).closest?.('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href')!.slice(1);
    if (id && scrollToSection(id)) e.preventDefault();
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

/** Activa o desactiva el efecto según el ancho y la preferencia de movimiento. */
export function setupLayers() {
  const root = document.documentElement;
  const media = window.matchMedia(LAYERS_QUERY);
  let cleanup: (() => void) | null = null;

  const enable = () => {
    const list = sections();
    const vh = () => window.innerHeight;

    // Las secciones más altas que la pantalla se fijan por su borde inferior,
    // para recorrerlas completas antes de que la siguiente las cubra.
    const setStick = () => {
      for (const s of list) {
        s.style.setProperty('--stick-top', `${Math.min(0, vh() - s.offsetHeight)}px`);
      }
    };
    list.forEach((s, i) => {
      s.classList.add('layer');
      s.style.setProperty('--layer', String(i + 1));
    });
    setStick();

    // Entrada sutil: las que ya están en pantalla aparecen sin esperar.
    list.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.top < vh() && r.bottom > 0) s.classList.add('is-in');
    });
    root.classList.add('layers-on');

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    list.forEach((s) => !s.classList.contains('is-in') && io.observe(s));

    const ro = new ResizeObserver(setStick);
    list.forEach((s) => ro.observe(s));
    window.addEventListener('resize', setStick);

    cleanup = () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('resize', setStick);
      root.classList.remove('layers-on');
      list.forEach((s) => {
        s.classList.remove('layer', 'is-in');
        s.style.removeProperty('--stick-top');
        s.style.removeProperty('--layer');
      });
    };
  };

  const sync = () => {
    cleanup?.();
    cleanup = null;
    if (media.matches) enable();
  };

  sync();
  media.addEventListener('change', sync);
  return () => {
    media.removeEventListener('change', sync);
    cleanup?.();
  };
}
