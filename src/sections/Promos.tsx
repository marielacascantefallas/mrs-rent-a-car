import { BrandIcon } from '../components/BrandIcon';
import { whatsappMessageUrl } from '../config';
import { promos } from '../data/promos';
import { useLanguage } from '../i18n/LanguageContext';
import './promos.css';

export function Promos() {
  const { lang, t } = useLanguage();

  return (
    <section
      id="promos"
      className="section section--dark promos"
      data-bg="dark"
      aria-labelledby="promos-title"
    >
      <div className="promos__inner">
        <header className="promos__head">
          <p className="eyebrow promos__eyebrow">{t.promosEyebrow}</p>
          <h2 id="promos-title" className="promos__title">
            {t.promosTitle}
          </h2>
          <p className="promos__intro">{t.promosIntro}</p>
        </header>

        {/* Cuatro promociones abiertas, separadas por líneas (sin cards) */}
        <ul className="promos__list">
          {promos(lang).map((p) => (
            <li key={p.id} className="promo">
              <p className="promo__headline" aria-hidden="true">
                {p.headline}
              </p>
              <h3 className="promo__title">{p.title}</h3>
              <p className="promo__text">{p.text}</p>
              <p className="promo__terms">{p.terms}</p>
              <a
                className="btn btn--accent promo__cta"
                href={whatsappMessageUrl(t.promosMessage.replace('{promo}', p.title))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BrandIcon brand="whatsapp" size={20} />
                <span>{t.promosCta}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="promos__note">{t.promosNote}</p>
      </div>
    </section>
  );
}
