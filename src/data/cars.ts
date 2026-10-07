import vitara from '../assets/cars/vitara.webp';
import accent from '../assets/cars/accent.webp';
import pathfinder from '../assets/cars/pathfinder.webp';
import type { Lang } from '../i18n/strings';

export type Car = {
  id: string;
  /** Texto gigante detrás del auto */
  short: string;
  /** Nombre completo con año */
  name: string;
  image: string;
  specs: Record<Lang, string>;
  usd: number;
  crc: number;
  /** Fondo de la sección: tono claro del color del auto (propuesta) */
  bg: { light: string; dark: string };
  /** Color de los botones: tono profundo del auto, contraste ≥ 4.5:1 con el fondo */
  ink: { light: string; dark: string };
};

export const CARS: Car[] = [
  {
    id: 'vitara',
    short: 'VITARA',
    name: 'Suzuki Grand Vitara 2019',
    image: vitara,
    specs: {
      es: 'Automático · 4WD · Gasolina',
      en: 'Automatic · 4WD · Gasoline',
    },
    usd: 95,
    crc: 45000,
    bg: { light: '#f6f5f1', dark: '#141f14' },
    ink: { light: '#3a4448', dark: '#e9e6dc' }, // 9.2:1 · 13.6:1
  },
  {
    id: 'accent',
    short: 'ACCENT',
    name: 'Hyundai Accent 2019',
    image: accent,
    specs: {
      es: 'Automático · Gasolina',
      en: 'Automatic · Gasoline',
    },
    // Pendiente de confirmar: se asume precio por día.
    usd: 80,
    crc: 37000,
    // Champagne: más claro y frío que el café del Pathfinder para distinguirlos.
    bg: { light: '#efe7d8', dark: '#1c1a15' },
    ink: { light: '#564a36', dark: '#e3d7bf' }, // 7.0:1 · 12.2:1
  },
  {
    id: 'pathfinder',
    short: 'PATHFINDER',
    name: 'Nissan Pathfinder 2004',
    image: pathfinder,
    specs: {
      es: 'Manual · 4WD · Gasolina',
      en: 'Manual · 4WD · Gasoline',
    },
    // Pendiente de confirmar: se asume precio por día.
    usd: 70,
    crc: 35000,
    bg: { light: '#e6d6c1', dark: '#1e1d14' },
    ink: { light: '#6a4b24', dark: '#e2c69c' }, // 5.6:1 · 10.3:1
  },
];

export function formatPrice(car: Car, lang: Lang) {
  // Miles con punto en español (₡45.000) y con coma en inglés (₡45,000).
  const crc = String(car.crc).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'es' ? '.' : ',');
  return lang === 'es'
    ? `$${car.usd} · ₡${crc} por día`
    : `$${car.usd} · ₡${crc} per day`;
}

export function whatsappMessage(car: Car, lang: Lang) {
  return lang === 'es'
    ? `Hola, me interesa el ${car.name}. ¿Está disponible?`
    : `Hi, I'm interested in the ${car.name}. Is it available?`;
}
