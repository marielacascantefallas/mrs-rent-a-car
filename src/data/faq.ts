import { WHATSAPP_DISPLAY } from '../config';
import type { Lang } from '../i18n/strings';
import { CARS, formatCrc } from './cars';
import { COMBO_MIN_DAYS, COMBO_PICKUP_USD, EARLY_DAYS, EARLY_DISCOUNT, PROMO_5_DAYS_USD } from './promos';
import { TRANSPORT_OPTIONS } from './transport';

// Requisitos y condiciones confirmados por MRS Rent a Car. Si cambian, se actualizan aquí
// y se reflejan en la sección, en los datos estructurados (FAQPage) y en ambos idiomas.
export const DEPOSIT_CRC = 200000;

export type Requirement = { title: string; text: string };
export type Faq = { q: string; a: string };

const deposit = (lang: Lang) =>
  '₡' + String(DEPOSIT_CRC).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'es' ? '.' : ',');

export function requirements(lang: Lang): Requirement[] {
  return lang === 'es'
    ? [
        { title: '18 años o más', text: 'La persona que maneja debe ser mayor de edad.' },
        {
          title: 'Licencia de conducir',
          text: 'De Costa Rica o de tu país de origen, vigente.',
        },
        {
          title: 'Sin tarjeta de crédito',
          text: 'No necesitas tarjeta de crédito para alquilar.',
        },
        {
          title: `Depósito de ${deposit(lang)}`,
          text: 'En efectivo o por transferencia bancaria.',
        },
        {
          title: 'Tanque lleno',
          text: 'Entregamos el carro con el tanque lleno y se devuelve con el tanque lleno.',
        },
      ]
    : [
        { title: '18 years or older', text: 'The driver must be of legal age.' },
        {
          title: "Driver's license",
          text: 'From Costa Rica or your home country, valid.',
        },
        { title: 'No credit card', text: 'You do not need a credit card to rent.' },
        {
          title: `${deposit(lang)} deposit`,
          text: 'In cash or by bank transfer.',
        },
        {
          title: 'Full tank',
          text: 'We deliver the car with a full tank and it is returned with a full tank.',
        },
      ];
}

export function faqs(lang: Lang): Faq[] {
  const byPrice = [...CARS].sort((a, b) => a.usd - b.usd);
  const usd = (n: number) => `$${n}`;
  const [pickup, dropoff, round] = TRANSPORT_OPTIONS.map((o) => o.usd);

  if (lang === 'es') {
    return [
      {
        q: '¿Qué necesito para alquilar un carro en MRS Rent a Car?',
        a: `Tener 18 años o más, una licencia de conducir vigente de Costa Rica o de tu país y dejar un depósito de ${deposit(lang)} en efectivo o por transferencia bancaria.`,
      },
      {
        q: '¿Necesito tarjeta de crédito para alquilar?',
        a: `No. No pedimos tarjeta de crédito: el depósito de ${deposit(lang)} se paga en efectivo o por transferencia bancaria.`,
      },
      {
        q: '¿Puedo manejar con la licencia de mi país?',
        a: 'Sí. Aceptamos licencia de conducir de Costa Rica o de tu país de origen.',
      },
      {
        q: '¿Cómo funciona el combustible?',
        a: 'Te entregamos el carro con el tanque lleno y debes devolverlo con el tanque lleno.',
      },
      {
        q: '¿Cuánto cuesta alquilar un carro en Pérez Zeledón?',
        a:
          'Desde ' +
          `${usd(byPrice[0].usd)} por día. ` +
          byPrice
            .map((c) => `${c.name}: ${usd(c.usd)} (${formatCrc(c, lang)}) por día`)
            .join('; ') +
          '.',
      },
      {
        q: '¿Tienen promociones?',
        a: `Sí: 5 días de alquiler por $${PROMO_5_DAYS_USD} en cualquier vehículo; paga 6 días y te regalamos el séptimo; recogida en el Aeropuerto Juan Santamaría por $${COMBO_PICKUP_USD} al alquilar ${COMBO_MIN_DAYS} días o más; y ${EARLY_DISCOUNT}% de descuento reservando con ${EARLY_DAYS} días de anticipación. No son acumulables.`,
      },
      {
        q: '¿Tienen transporte al Aeropuerto Juan Santamaría?',
        a: `Sí. Ofrecemos transporte privado entre Pérez Zeledón y el Aeropuerto Internacional Juan Santamaría (SJO): recogida en el aeropuerto ${usd(pickup)}, traslado al aeropuerto ${usd(dropoff)} e ida y vuelta ${usd(round)}, precio por viaje.`,
      },
      {
        q: '¿Cómo reservo?',
        a: `Escríbenos por WhatsApp al ${WHATSAPP_DISPLAY} o llena el formulario de contacto de esta página.`,
      },
    ];
  }

  return [
    {
      q: 'What do I need to rent a car with MRS Rent a Car?',
      a: `Be 18 or older, have a valid driver's license from Costa Rica or your home country, and leave a ${deposit(lang)} deposit in cash or by bank transfer.`,
    },
    {
      q: 'Do I need a credit card to rent?',
      a: `No. We do not ask for a credit card: the ${deposit(lang)} deposit is paid in cash or by bank transfer.`,
    },
    {
      q: "Can I drive with my home country's license?",
      a: "Yes. We accept a driver's license from Costa Rica or from your home country.",
    },
    {
      q: 'How does fuel work?',
      a: 'We deliver the car with a full tank and you return it with a full tank.',
    },
    {
      q: 'How much does it cost to rent a car in Pérez Zeledón?',
      a:
        `From ${usd(byPrice[0].usd)} per day. ` +
        byPrice.map((c) => `${c.name}: ${usd(c.usd)} (${formatCrc(c, lang)}) per day`).join('; ') +
        '.',
    },
    {
      q: 'Do you have any deals?',
      a: `Yes: a 5-day rental for $${PROMO_5_DAYS_USD} on any vehicle; pay 6 days and the seventh is free; Juan Santamaría Airport pickup for $${COMBO_PICKUP_USD} with a rental of ${COMBO_MIN_DAYS} days or more; and ${EARLY_DISCOUNT}% off when you book ${EARLY_DAYS} days in advance. Deals cannot be combined.`,
    },
    {
      q: 'Do you offer transportation to Juan Santamaría Airport?',
      a: `Yes. We offer private transportation between Pérez Zeledón and Juan Santamaría International Airport (SJO): airport pickup ${usd(pickup)}, airport drop-off ${usd(dropoff)} and round trip ${usd(round)}, price per trip.`,
    },
    {
      q: 'How do I book?',
      a: `Message us on WhatsApp at ${WHATSAPP_DISPLAY} or fill in the contact form on this page.`,
    },
  ];
}
