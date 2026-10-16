import { BrandIcon } from '../components/BrandIcon';
import { ArrowRightIcon } from '../components/icons';
import { whatsappMessageUrl } from '../config';
import { transportFaqs } from '../data/faq';
import { COMBO_MIN_DAYS, COMBO_PICKUP_USD } from '../data/promos';
import { TRANSPORT_OPTIONS } from '../data/transport';
import { fill, pageStrings } from '../i18n/pages';
import { useLanguage } from '../i18n/LanguageContext';
import { sectionHref } from '../routes';
import { Breadcrumb } from './Breadcrumb';
import '../sections/transport.css';
import '../sections/faq.css';
import './subpages.css';

export function TransportPage() {
  const { lang, t } = useLanguage();
  const p = pageStrings[lang];
  const copy = {
    pickup: { title: t.transportPickupTitle, text: t.transportPickupText },
    dropoff: { title: t.transportDropoffTitle, text: t.transportDropoffText },
    round: { title: t.transportRoundTitle, text: t.transportRoundText },
  };
  const regularPickup = TRANSPORT_OPTIONS.find((o) => o.id === 'pickup')!.usd;

  return (
    <>
      <section
        id="home"
        className="section transport sub"
        data-bg="accent"
        aria-labelledby="page-title"
      >
        <div className="transport__inner">
          <Breadcrumb current={lang === 'es' ? 'Transporte al aeropuerto' : 'Airport transfer'} />
          <header className="transport__head">
            <p className="eyebrow">{p.transportEyebrow}</p>
            <h1 id="page-title" className="transport__title">
              {p.transportTitle}
            </h1>
            <p className="transport__intro">{p.transportIntro}</p>
          </header>

          <ol className="transport__list">
            {TRANSPORT_OPTIONS.map((option, i) => {
              const { title, text } = copy[option.id];
              const price = `$${option.usd}`;
              return (
                <li key={option.id} className="transport__item">
                  <span className="transport__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="transport__name">{title}</h2>
                  <p className="transport__text">{text}</p>
                  <p className="transport__price">
                    {price}
                    <span className="transport__currency">
                      USD <span className="transport__unit">{t.transportUnit}</span>
                    </span>
                  </p>
                  <a
                    className="btn transport__cta"
                    href={whatsappMessageUrl(
                      t.transportMessage.replace('{service}', title).replace('{price}', price),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BrandIcon brand="whatsapp" size={20} />
                    <span>{t.transportCta}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="section section--light sub" data-bg="light">
        <div className="sub__inner">
          <h2 className="sub__h2">{p.stepsTitle}</h2>
          <ol className="sub__cols sub__cols--3 sub__steps">
            {[p.step1, p.step2, p.step3].map((s, i) => (
              <li key={s}>
                <span className="sub__step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="sub__item-title">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--dark sub sub--promos" data-bg="dark">
        <div className="sub__inner">
          <h2 className="sub__h2">{p.comboTitle}</h2>
          <p className="sub__lead">
            {fill(p.comboText, {
              days: COMBO_MIN_DAYS,
              combo: COMBO_PICKUP_USD,
              regular: regularPickup,
            })}
          </p>
          <a className="btn btn--accent" href={sectionHref('transport', lang, 'cars')}>
            <span>{p.seeCars}</span>
            <ArrowRightIcon size={20} />
          </a>
        </div>
      </section>

      <section className="section section--light faq" data-bg="light" aria-labelledby="faq-title">
        <div className="faq__inner">
          <h2 id="faq-title" className="sub__h2">
            {p.faqTitle}
          </h2>
          <div className="faq__list">
            {transportFaqs(lang).map((f) => (
              <details key={f.q} className="faq__item">
                <summary className="faq__q">
                  <span>{f.q}</span>
                  <span className="faq__icon" aria-hidden="true" />
                </summary>
                <p className="faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
