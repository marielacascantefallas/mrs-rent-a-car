import { BrandIcon } from '../components/BrandIcon';
import { ArrowRightIcon } from '../components/icons';
import { whatsappMessageUrl } from '../config';
import { CARS, formatCrc, type Car } from '../data/cars';
import { requirements } from '../data/faq';
import { PROMO_5_DAYS_USD } from '../data/promos';
import { fill, pageStrings } from '../i18n/pages';
import { useLanguage } from '../i18n/LanguageContext';
import { pathFor, sectionHref } from '../routes';
import { useTheme } from '../theme/ThemeContext';
import { Breadcrumb } from './Breadcrumb';
import './subpages.css';

export function CarPage({ car }: { car: Car }) {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const p = pageStrings[lang];
  const bg = theme === 'dark' ? car.bg.dark : car.bg.light;
  const ink = theme === 'dark' ? car.ink.dark : car.ink.light;

  const [transmission, ...rest] = car.specs[lang].split(' · ');
  const fuel = rest[rest.length - 1];
  const drive = rest.length > 1 ? '4WD' : lang === 'es' ? 'Delantera (2WD)' : 'Front-wheel (2WD)';
  const year = car.name.match(/\d{4}$/)?.[0] ?? '';

  const five = car.usd * 5;
  const seven = car.usd * 6;
  const others = CARS.filter((c) => c.id !== car.id);
  const title = fill(p.carTitle, { car: car.name });

  return (
    <>
      <section
        id="home"
        className="section sub sub--car"
        data-bg="light"
        style={{ '--cars-bg': bg, '--car-ink': ink } as React.CSSProperties}
        aria-labelledby="page-title"
      >
        <div className="sub__inner">
          <Breadcrumb current={car.name} />
          <p className="eyebrow sub__eyebrow">{p.carEyebrow}</p>
          <h1 id="page-title" className="sub__title">
            {title}
          </h1>
          <p className="sub__intro">{car.intro[lang]}</p>

          <div className="carpage__grid">
            <img
              className="carpage__img"
              src={car.image}
              alt={fill(p.carImageAlt, { car: car.name })}
              width={1500}
              height={1000}
              decoding="async"
            />

            <div className="carpage__panel">
              <p className="carpage__price">
                <span className="carpage__usd">${car.usd}</span>
                <span className="carpage__rest">
                  <span className="carpage__crc">{formatCrc(car, lang)}</span>
                  <span className="carpage__unit">{p.perDay}</span>
                </span>
              </p>

              <h2 className="carpage__specs-title">{p.specsTitle}</h2>
              <dl className="carpage__specs">
                <div>
                  <dt>{p.specYear}</dt>
                  <dd>{year}</dd>
                </div>
                <div>
                  <dt>{p.specTransmission}</dt>
                  <dd>{transmission}</dd>
                </div>
                <div>
                  <dt>{p.specDrive}</dt>
                  <dd>{drive}</dd>
                </div>
                <div>
                  <dt>{p.specFuel}</dt>
                  <dd>{fuel}</dd>
                </div>
                <div>
                  <dt>{p.specColor}</dt>
                  <dd>{car.color[lang]}</dd>
                </div>
              </dl>

              <a
                className="btn carpage__cta"
                href={whatsappMessageUrl(fill(p.carMessage, { car: car.name }))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrandIcon brand="whatsapp" size={20} />
                <span>{p.carCta}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark sub sub--promos" data-bg="dark">
        <div className="sub__inner">
          <h2 className="sub__h2">{p.carPromosTitle}</h2>
          <ul className="sub__cols sub__cols--2">
            <li>
              <h3 className="sub__big">{fill(p.carPromoFive, { price: PROMO_5_DAYS_USD })}</h3>
              <p>
                {fill(p.carPromoFiveText, { regular: five, saved: five - PROMO_5_DAYS_USD })}
              </p>
            </li>
            <li>
              <h3 className="sub__big">{fill(p.carPromoSeven, { price: seven })}</h3>
              <p>{fill(p.carPromoSevenText, { saved: car.usd })}</p>
            </li>
          </ul>
          <a className="sub__link" href={sectionHref(`car:${car.id}`, lang, 'promos')}>
            {p.allPromos}
            <ArrowRightIcon size={18} />
          </a>
        </div>
      </section>

      <section className="section section--light sub" data-bg="light">
        <div className="sub__inner">
          <h2 className="sub__h2">{p.requirementsTitle}</h2>
          <ul className="sub__cols sub__cols--5">
            {requirements(lang).map((r) => (
              <li key={r.title}>
                <h3 className="sub__item-title">{r.title}</h3>
                <p className="sub__muted">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--light sub sub--others" data-bg="light">
        <div className="sub__inner">
          <h2 className="sub__h2">{p.otherCarsTitle}</h2>
          <ul className="sub__cols sub__cols--2">
            {others.map((c) => (
              <li key={c.id}>
                <a className="other-car" href={pathFor(`car:${c.id}`, lang)}>
                  <img src={c.image} alt="" width={1500} height={1000} loading="lazy" decoding="async" />
                  <span className="other-car__name">{c.name}</span>
                  <span className="other-car__meta">
                    {c.specs[lang]} · ${c.usd} {p.perDay}
                  </span>
                  <span className="sub__link">
                    {p.seeCar}
                    <ArrowRightIcon size={18} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
