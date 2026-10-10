import { EMAIL, FACEBOOK_URL, INSTAGRAM_URL, WHATSAPP_DISPLAY, WHATSAPP_URL } from './config';
import { CARS } from './data/cars';
import { TRANSPORT_OPTIONS } from './data/transport';
import { strings, type Lang } from './i18n/strings';

// Dominio oficial: todas las URLs canónicas, el sitemap y los datos estructurados usan este.
export const SITE_URL = 'https://mrsrentacar.com';

/** Cada idioma vive en su propia URL para que Google indexe ambas versiones. */
export const LANG_PATH: Record<Lang, string> = { es: '/', en: '/en/' };

export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';
}

const SEO = {
  es: {
    title: 'MRS Rent a Car | Alquiler de carros en Pérez Zeledón, zona sur',
    description:
      'Rent a car en Pérez Zeledón y la zona sur de Costa Rica: 4x4 y sedán desde $70 por día, y transporte privado al aeropuerto desde $190 por viaje. Reserva por WhatsApp.',
    ogLocale: 'es_CR',
    ogImageAlt: 'MRS Rent a Car, alquiler de carros en Pérez Zeledón',
  },
  en: {
    title: 'MRS Rent a Car | Car Rental in Pérez Zeledón, Costa Rica',
    description:
      "Car rental in Pérez Zeledón and Costa Rica's southern zone: 4x4 SUVs and a sedan from $70 per day, plus private airport transfers from $190 per trip. Book on WhatsApp.",
    ogLocale: 'en_US',
    ogImageAlt: 'MRS Rent a Car, car rental in Pérez Zeledón',
  },
} as const;

export function seoFor(lang: Lang) {
  return SEO[lang];
}

const abs = (path: string) => (path.startsWith('http') ? path : SITE_URL + path);

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Datos estructurados (schema.org) del negocio, sus carros y sus traslados. */
export function structuredData(lang: Lang) {
  const t = strings[lang];
  const url = SITE_URL + LANG_PATH[lang];
  const perDay = lang === 'es' ? 'por día' : 'per day';
  const transportNames = {
    pickup: t.transportPickupTitle,
    dropoff: t.transportDropoffTitle,
    round: t.transportRoundTitle,
  };
  const transportTexts = {
    pickup: t.transportPickupText,
    dropoff: t.transportDropoffText,
    round: t.transportRoundText,
  };

  const business = {
    '@type': 'AutoRental',
    '@id': `${SITE_URL}/#business`,
    name: 'MRS Rent a Car',
    alternateName: lang === 'es' ? 'MRS Alquiler de Carros' : 'MRS Car Rental',
    description: SEO[lang].description,
    url,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: WHATSAPP_DISPLAY,
    email: EMAIL,
    priceRange: '$70 - $380',
    currenciesAccepted: 'USD, CRC',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pérez Zeledón',
      addressRegion: 'San José',
      addressCountry: 'CR',
    },
    areaServed: [
      { '@type': 'City', name: 'Pérez Zeledón' },
      { '@type': 'City', name: 'San Isidro de El General' },
      { '@type': 'AdministrativeArea', name: lang === 'es' ? 'Zona Sur de Costa Rica' : "Costa Rica's Southern Zone" },
    ],
    knowsLanguage: ['es', 'en'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: WHATSAPP_DISPLAY,
      contactType: lang === 'es' ? 'reservas' : 'reservations',
      url: WHATSAPP_URL,
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL],
    makesOffer: [
      ...CARS.map((car) => ({
        '@type': 'Offer',
        name: lang === 'es' ? `Alquiler de ${car.name}` : `${car.name} rental`,
        priceCurrency: 'USD',
        price: car.usd,
        priceSpecification: [
          {
            '@type': 'UnitPriceSpecification',
            price: car.usd,
            priceCurrency: 'USD',
            unitCode: 'DAY',
            unitText: perDay,
          },
          {
            '@type': 'UnitPriceSpecification',
            price: car.crc,
            priceCurrency: 'CRC',
            unitCode: 'DAY',
            unitText: perDay,
          },
        ],
        availability: 'https://schema.org/InStock',
        itemOffered: {
          '@type': 'Car',
          name: car.name,
          image: abs(car.image),
          description: car.specs[lang],
        },
      })),
      ...TRANSPORT_OPTIONS.map((option) => ({
        '@type': 'Offer',
        name: transportNames[option.id],
        priceCurrency: 'USD',
        price: option.usd,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: option.usd,
          priceCurrency: 'USD',
          unitText: t.transportUnit,
        },
        itemOffered: {
          '@type': 'Service',
          serviceType: lang === 'es' ? 'Transporte privado al aeropuerto' : 'Private airport transfer',
          name: transportNames[option.id],
          description: transportTexts[option.id],
          areaServed: 'Pérez Zeledón',
          provider: { '@id': `${SITE_URL}/#business` },
        },
      })),
    ],
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL + '/',
    name: 'MRS Rent a Car',
    inLanguage: ['es', 'en'],
    publisher: { '@id': `${SITE_URL}/#business` },
  };

  const page = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: SEO[lang].title,
    description: SEO[lang].description,
    inLanguage: lang,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#business` },
    primaryImageOfPage: `${SITE_URL}/og-image.jpg`,
  };

  return { '@context': 'https://schema.org', '@graph': [business, website, page] };
}

/** Etiquetas del <head> para cada idioma (se escriben en el HTML pregenerado). */
export function headTags(lang: Lang) {
  const seo = SEO[lang];
  const url = SITE_URL + LANG_PATH[lang];
  const other: Lang = lang === 'es' ? 'en' : 'es';
  const json = JSON.stringify(structuredData(lang)).replace(/</g, '\\u003c');
  return [
    `<title>${escapeAttr(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="es" href="${SITE_URL}${LANG_PATH.es}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE_URL}${LANG_PATH.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${LANG_PATH.es}" />`,
    `<meta name="geo.region" content="CR-SJ" />`,
    `<meta name="geo.placename" content="Pérez Zeledón, San José, Costa Rica" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="MRS Rent a Car" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:locale" content="${seo.ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${SEO[other].ogLocale}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttr(seo.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${SITE_URL}/og-image.jpg" />`,
    `<script type="application/ld+json">${json}</script>`,
  ].join('\n    ');
}

/** sitemap.xml con ambas versiones del sitio enlazadas entre sí. */
export function sitemap(lastmod: string) {
  const links = (['es', 'en'] as Lang[])
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${LANG_PATH[l]}" />`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${LANG_PATH.es}" />`)
    .join('\n');
  const entries = (['es', 'en'] as Lang[])
    .map(
      (l) => `  <url>
    <loc>${SITE_URL}${LANG_PATH[l]}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${l === 'es' ? '1.0' : '0.9'}</priority>
${links}
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}
