import { BrandIcon } from '../components/BrandIcon';
import { whatsappMessageUrl } from '../config';
import { TRANSPORT_OPTIONS } from '../data/transport';
import { useLanguage } from '../i18n/LanguageContext';
import './transport.css';

export function Transport() {
  const { t } = useLanguage();

  const copy = {
    pickup: { title: t.transportPickupTitle, text: t.transportPickupText },
    dropoff: { title: t.transportDropoffTitle, text: t.transportDropoffText },
    round: { title: t.transportRoundTitle, text: t.transportRoundText },
  };

  return (
    <section
      id="transport"
      className="section transport"
      data-bg="accent"
      aria-labelledby="transport-title"
    >
      <div className="transport__inner">
        <header className="transport__head">
          <p className="eyebrow">{t.transportEyebrow}</p>
          <h2 id="transport-title" className="transport__title">
            {t.transportTitle}
          </h2>
          <p className="transport__intro">{t.transportIntro}</p>
        </header>

        <ol className="transport__list">
          {TRANSPORT_OPTIONS.map((option, i) => {
            const { title, text } = copy[option.id];
            const price = `$${option.usd}`;
            const message = t.transportMessage
              .replace('{service}', title)
              .replace('{price}', price);
            return (
              <li key={option.id} className="transport__item">
                <span className="transport__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="transport__name">{title}</h3>
                <p className="transport__text">{text}</p>
                <p className="transport__price">
                  {price}
                  <span className="transport__currency">USD</span>
                </p>
                <a
                  className="btn transport__cta"
                  href={whatsappMessageUrl(message)}
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
  );
}
