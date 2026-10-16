import type { Lang } from '../i18n/strings';
import { TRANSPORT_OPTIONS } from './transport';

// Promociones vigentes (precios en dólares). Las dos primeras las definió MRS Rent a Car;
// combo y reserva anticipada se agregaron como complemento. Si cambian, se editan aquí
// y se actualizan solas la sección, las preguntas frecuentes y los datos estructurados.
export const PROMO_5_DAYS_USD = 300;
export const COMBO_MIN_DAYS = 5;
export const COMBO_PICKUP_USD = 150;
export const EARLY_DAYS = 15;
export const EARLY_DISCOUNT = 10; // %

export type Promo = {
  id: 'five-days' | 'seven-for-six' | 'combo' | 'early';
  /** Lo que se lee primero, en grande */
  headline: string;
  title: string;
  text: string;
  terms: string;
  /** Precio fijo en USD, si lo tiene (para los datos estructurados) */
  usd?: number;
};

const regularPickup = TRANSPORT_OPTIONS.find((o) => o.id === 'pickup')!.usd;

export function promos(lang: Lang): Promo[] {
  if (lang === 'es') {
    return [
      {
        id: 'five-days',
        headline: `$${PROMO_5_DAYS_USD}`,
        title: '5 días de alquiler',
        text: `Alquila cualquiera de nuestros carros por 5 días y paga $${PROMO_5_DAYS_USD} en total.`,
        terms: 'Aplica a los tres vehículos. Precio total por 5 días seguidos.',
        usd: PROMO_5_DAYS_USD,
      },
      {
        id: 'seven-for-six',
        headline: '7×6',
        title: 'Paga 6 días, maneja 7',
        text: 'Paga 6 días de alquiler y te regalamos el séptimo día.',
        terms: 'Aplica a los tres vehículos, en días seguidos.',
      },
      {
        id: 'combo',
        headline: `$${COMBO_PICKUP_USD}`,
        title: 'Carro + recogida en el aeropuerto',
        text: `Alquila ${COMBO_MIN_DAYS} días o más y te recogemos en el Aeropuerto Juan Santamaría por $${COMBO_PICKUP_USD} en vez de $${regularPickup}.`,
        terms: `Precio por viaje. Requiere un alquiler de ${COMBO_MIN_DAYS} días o más.`,
        usd: COMBO_PICKUP_USD,
      },
      {
        id: 'early',
        headline: `−${EARLY_DISCOUNT}%`,
        title: 'Reserva anticipada',
        text: `Reserva con ${EARLY_DAYS} días o más de anticipación y obtén ${EARLY_DISCOUNT}% de descuento en el alquiler.`,
        terms: 'Descuento sobre el precio por día del vehículo.',
      },
    ];
  }

  return [
    {
      id: 'five-days',
      headline: `$${PROMO_5_DAYS_USD}`,
      title: '5-day rental',
      text: `Rent any of our cars for 5 days and pay $${PROMO_5_DAYS_USD} in total.`,
      terms: 'Valid for all three vehicles. Total price for 5 consecutive days.',
      usd: PROMO_5_DAYS_USD,
    },
    {
      id: 'seven-for-six',
      headline: '7×6',
      title: 'Pay 6 days, drive 7',
      text: 'Pay for 6 rental days and the seventh day is on us.',
      terms: 'Valid for all three vehicles, on consecutive days.',
    },
    {
      id: 'combo',
      headline: `$${COMBO_PICKUP_USD}`,
      title: 'Car + airport pickup',
      text: `Rent for ${COMBO_MIN_DAYS} days or more and we pick you up at Juan Santamaría Airport for $${COMBO_PICKUP_USD} instead of $${regularPickup}.`,
      terms: `Price per trip. Requires a rental of ${COMBO_MIN_DAYS} days or more.`,
      usd: COMBO_PICKUP_USD,
    },
    {
      id: 'early',
      headline: `−${EARLY_DISCOUNT}%`,
      title: 'Early booking',
      text: `Book ${EARLY_DAYS} days or more in advance and get ${EARLY_DISCOUNT}% off your rental.`,
      terms: "Discount on the vehicle's daily price.",
    },
  ];
}
