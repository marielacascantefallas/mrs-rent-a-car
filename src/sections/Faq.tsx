import { requirements, faqs } from '../data/faq';
import { useLanguage } from '../i18n/LanguageContext';
import './faq.css';

export function Faq() {
  const { lang, t } = useLanguage();

  return (
    <section
      id="faq"
      className="section section--light faq"
      data-bg="light"
      aria-labelledby="faq-title"
    >
      <div className="faq__inner">
        <header className="faq__head">
          <p className="eyebrow">{t.faqEyebrow}</p>
          <h2 id="faq-title" className="faq__title">
            {t.faqTitle}
          </h2>
        </header>

        {/* Requisitos: lista abierta, separada por líneas (sin cards) */}
        <ul className="faq__reqs">
          {requirements(lang).map((r) => (
            <li key={r.title} className="faq__req">
              <h3 className="faq__req-title">{r.title}</h3>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>

        <h3 className="faq__subtitle">{t.faqQuestionsTitle}</h3>
        {/* <details> deja las respuestas en el HTML, legibles para buscadores */}
        <div className="faq__list">
          {faqs(lang).map((f) => (
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
  );
}
