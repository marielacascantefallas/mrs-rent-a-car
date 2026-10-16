import { CARS, type Car } from './data/cars';
import type { Lang } from './i18n/strings';

// Páginas del sitio. Cada una existe en español y en inglés, con su propia URL indexable.
export type PageId = 'home' | 'transport' | `car:${string}`;

const BASE: Record<string, Record<Lang, string>> = {
  home: { es: '/', en: '/en/' },
  transport: {
    es: '/transporte-aeropuerto-juan-santamaria/',
    en: '/en/juan-santamaria-airport-transfer/',
  },
};

const carPaths = (car: Car): Record<Lang, string> => ({
  es: `/alquiler-${car.slug}/`,
  en: `/en/${car.slug}-rental/`,
});

export const PAGES: PageId[] = ['home', 'transport', ...CARS.map((c) => `car:${c.id}` as PageId)];

export function pathFor(page: PageId, lang: Lang): string {
  if (page.startsWith('car:')) {
    const car = CARS.find((c) => `car:${c.id}` === page);
    if (car) return carPaths(car)[lang];
  }
  return (BASE[page] ?? BASE.home)[lang];
}

export function carFor(page: PageId) {
  return CARS.find((c) => `car:${c.id}` === page);
}

/** Página e idioma a partir de la URL (con o sin barra final). */
export function routeFromPath(pathname: string): { page: PageId; lang: Lang } {
  const path = pathname.endsWith('/') ? pathname : pathname + '/';
  for (const page of PAGES) {
    for (const lang of ['es', 'en'] as Lang[]) {
      if (pathFor(page, lang) === path) return { page, lang };
    }
  }
  return { page: 'home', lang: path.startsWith('/en/') ? 'en' : 'es' };
}

/** Enlace a una sección de la página principal (#cars…) desde cualquier página. */
export function sectionHref(page: PageId, lang: Lang, id: string) {
  return page === 'home' ? `#${id}` : `${pathFor('home', lang)}#${id}`;
}
