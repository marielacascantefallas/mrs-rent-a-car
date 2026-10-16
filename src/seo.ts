import {
  EMAIL,
  FACEBOOK_URL,
  GOOGLE_PROFILE_URL,
  GOOGLE_SITE_VERIFICATION,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from './config';
import { faqs, transportFaqs } from './data/faq';
import { carFor, PAGES, pathFor, routeFromPath, type PageId } from './routes';
import { promos } from './data/promos';
import { CARS } from './data/cars';
import { TRANSPORT_OPTIONS } from './data/transport';
import { strings, type Lang } from './i18n/strings';

// Dominio oficial: todas las URLs canónicas, el sitemap y los datos estructurados usan este.
export const SITE_URL = 'https://mrsrentacar.com';

export { pathFor, routeFromPath, PAGES };

const SEO = {
  es: {
    title: 'MRS Rent a Car | Alquiler de carros en Pérez Zeledón, zona sur',
    description:
      'Rent a car en Pérez Zeledón y la zona sur de Costa Rica: 4x4 y sedán desde $70 por día, sin tarjeta de crédito. Transporte privado al Aeropuerto Juan Santamaría desde $190 por viaje.',
    ogLocale: 'es_CR',
    ogImageAlt: 'MRS Rent a Car, alquiler de carros en Pérez Zeledón',
  },
  en: {
    title: 'MRS Rent a Car | Car Rental in Pérez Zeledón, Costa Rica',
    description:
      "Car rental in Pérez Zeledón and Costa Rica's southern zone: 4x4 SUVs and a sedan from $70 per day, no credit card needed. Private transfers to Juan Santamaría Airport from $190 per trip.",
    ogLocale: 'en_US',
    ogImageAlt: 'MRS Rent a Car, car rental in Pérez Zeledón',
  },
} as const;

/** Título, descripción y textos para compartir de cada página en cada idioma. */
export type PageSeo = {
  title: string;
  description: string;
  ogLocale: string;
  ogImageAlt: string;
  image?: string;
};

export function seoFor(page: PageId, lang: Lang): PageSeo {
  const base = SEO[lang];
  const car = carFor(page);
  if (car) {
    return {
      ...base,
      title:
        lang === 'es'
          ? `Alquiler de ${car.name} en Pérez Zeledón | MRS Rent a Car`
          : `${car.name} Rental in Pérez Zeledón | MRS Rent a Car`,
      description:
        lang === 'es'
          ? `Alquila un ${car.name} en Pérez Zeledón por $${car.usd} por día (${car.specs.es}). Sin tarjeta de crédito. Reserva por WhatsApp con MRS Rent a Car.`
          : `Rent a ${car.name} in Pérez Zeledón for $${car.usd} per day (${car.specs.en}). No credit card needed. Book on WhatsApp with MRS Rent a Car.`,
      ogImageAlt: car.name,
      image: abs(car.image),
    };
  }
  if (page === 'transport') {
    return {
      ...base,
      title:
        lang === 'es'
          ? 'Transporte al Aeropuerto Juan Santamaría desde Pérez Zeledón | MRS'
          : 'Juan Santamaría Airport Transfer from Pérez Zeledón | MRS',
      description:
        lang === 'es'
          ? 'Transporte privado entre Pérez Zeledón y el Aeropuerto Juan Santamaría (SJO): recogida $190, traslado $190, ida y vuelta $380, precio por viaje. Reserva por WhatsApp.'
          : 'Private transfers between Pérez Zeledón and Juan Santamaría Airport (SJO): pickup $190, drop-off $190, round trip $380, price per trip. Book on WhatsApp.',
    };
  }
  return { ...base };
}

const abs = (path: string) => (path.startsWith('http') ? path : SITE_URL + path);

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Datos estructurados (schema.org) del negocio, sus carros y sus traslados. */
export function structuredData(page: PageId, lang: Lang) {
  const t = strings[lang];
  const url = SITE_URL + pathFor(page, lang);
  const homeUrl = SITE_URL + pathFor('home', lang);
  const seo = seoFor(page, lang);
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
    url: homeUrl,
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
    hasMap: GOOGLE_PROFILE_URL,
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL, GOOGLE_PROFILE_URL],
    paymentAccepted: lang === 'es' ? 'Efectivo, transferencia bancaria' : 'Cash, bank transfer',
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
      ...promos(lang).map((p) => ({
        '@type': 'Offer',
        name: p.title,
        description: `${p.text} ${p.terms}`,
        ...(p.usd ? { price: p.usd, priceCurrency: 'USD' } : {}),
        offeredBy: { '@id': `${SITE_URL}/#business` },
      })),
      ...TRANSPORT_OPTIONS.map((option) => ({
        '@type': 'Offer',
        name: `${transportNames[option.id]} · ${t.transportAirport}`,
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
          name: `${transportNames[option.id]} · ${t.transportAirport}`,
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

  const webPage = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: seo.title,
    description: seo.description,
    inLanguage: lang,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#business` },
    primaryImageOfPage: seo.image ?? `${SITE_URL}/og-image.jpg`,
  };

  const faqPage = (list: { q: string; a: string }[]) => ({
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    inLanguage: lang,
    mainEntity: list.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });

  const home = lang === 'es' ? 'Inicio' : 'Home';
  const breadcrumb = (name: string) => ({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: home, item: homeUrl },
      { '@type': 'ListItem', position: 2, name, item: url },
    ],
  });

  const car = carFor(page);
  if (car) {
    const carNode = {
      '@type': 'Car',
      '@id': `${url}#car`,
      name: car.name,
      brand: { '@type': 'Brand', name: car.name.split(' ')[0] },
      model: car.name.replace(/^\S+\s/, '').replace(/\s\d{4}$/, ''),
      vehicleModelDate: car.name.match(/\d{4}$/)?.[0],
      color: car.color[lang],
      vehicleTransmission: car.specs.es.startsWith('Automático')
        ? lang === 'es' ? 'Automática' : 'Automatic'
        : lang === 'es' ? 'Manual' : 'Manual',
      fuelType: lang === 'es' ? 'Gasolina' : 'Gasoline',
      ...(car.specs.es.includes('4WD') ? { driveWheelConfiguration: 'https://schema.org/FourWheelDriveConfiguration' } : {}),
      image: abs(car.image),
      description: car.intro[lang],
      offers: {
        '@type': 'Offer',
        price: car.usd,
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: car.usd,
          priceCurrency: 'USD',
          unitCode: 'DAY',
          unitText: perDay,
        },
        availability: 'https://schema.org/InStock',
        seller: { '@id': `${SITE_URL}/#business` },
      },
    };
    return {
      '@context': 'https://schema.org',
      '@graph': [business, website, webPage, carNode, breadcrumb(car.name)],
    };
  }

  if (page === 'transport') {
    const service = {
      '@type': 'Service',
      '@id': `${url}#service`,
      serviceType: lang === 'es' ? 'Transporte privado al aeropuerto' : 'Private airport transfer',
      name: seo.title,
      description: seo.description,
      provider: { '@id': `${SITE_URL}/#business` },
      areaServed: ['Pérez Zeledón', 'San Isidro de El General', t.transportAirport],
      offers: TRANSPORT_OPTIONS.map((option) => ({
        '@type': 'Offer',
        name: transportNames[option.id],
        price: option.usd,
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: option.usd,
          priceCurrency: 'USD',
          unitText: t.transportUnit,
        },
      })),
    };
    return {
      '@context': 'https://schema.org',
      '@graph': [
        business,
        website,
        webPage,
        service,
        breadcrumb(lang === 'es' ? 'Transporte al aeropuerto' : 'Airport transfer'),
        faqPage(transportFaqs(lang)),
      ],
    };
  }

  return { '@context': 'https://schema.org', '@graph': [business, website, webPage, faqPage(faqs(lang))] };
}

/** Etiquetas del <head> para cada idioma (se escriben en el HTML pregenerado). */
export function headTags(page: PageId, lang: Lang) {
  const seo = seoFor(page, lang);
  const url = SITE_URL + pathFor(page, lang);
  const other: Lang = lang === 'es' ? 'en' : 'es';
  const image = seo.image ?? `${SITE_URL}/og-image.jpg`;
  const json = JSON.stringify(structuredData(page, lang)).replace(/</g, '\\u003c');
  return [
    `<title>${escapeAttr(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="es" href="${SITE_URL}${pathFor(page, 'es')}" />`,
    `<link rel="alternate" hreflang="en" href="${SITE_URL}${pathFor(page, 'en')}" />`,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${pathFor(page, 'es')}" />`,
    `<meta name="geo.region" content="CR-SJ" />`,
    `<meta name="geo.placename" content="Pérez Zeledón, San José, Costa Rica" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="MRS Rent a Car" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:locale" content="${seo.ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${SEO[other].ogLocale}" />`,
    `<meta property="og:image" content="${image}" />`,
    ...(seo.image
      ? []
      : [`<meta property="og:image:width" content="1200" />`, `<meta property="og:image:height" content="630" />`]),
    `<meta property="og:image:alt" content="${escapeAttr(seo.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${json}</script>`,
    ...(GOOGLE_SITE_VERIFICATION
      ? [`<meta name="google-site-verification" content="${escapeAttr(GOOGLE_SITE_VERIFICATION)}" />`]
      : []),
  ].join('\n    ');
}

/** sitemap.xml con todas las páginas, cada una enlazada con su versión en el otro idioma. */
export function sitemap(lastmod: string) {
  const entries = PAGES.flatMap((page) => {
    const links = (['es', 'en'] as Lang[])
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${pathFor(page, l)}" />`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${pathFor(page, 'es')}" />`)
      .join('\n');
    return (['es', 'en'] as Lang[]).map(
      (l) => `  <url>
    <loc>${SITE_URL}${pathFor(page, l)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === 'home' ? (l === 'es' ? '1.0' : '0.9') : '0.8'}</priority>
${links}
  </url>`,
    );
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
}
