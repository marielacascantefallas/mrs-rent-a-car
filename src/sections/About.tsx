import carImage from '../assets/cars/vitara.webp';
import { ArrowRightIcon } from '../components/icons';
import { useReveal } from '../components/useReveal';
import { useLanguage } from '../i18n/LanguageContext';
import './about.css';

export function About() {
  const { t } = useLanguage();
  const [ref, shown] = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="section section--light about" data-bg="light">
      <div ref={ref} className="about__inner" data-shown={shown}>
        <figure className="about__media">
          <img
            src={carImage}
            alt={t.aboutImageAlt}
            width={1500}
            height={1000}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="about__text">
          <p className="eyebrow about__eyebrow">ABOUT</p>
          <h2 className="about__title">{t.aboutTitle}</h2>
          <p>{t.aboutP1}</p>
          <p>{t.aboutP2}</p>
          <p>{t.aboutP3}</p>
          <a href="#cars" className="btn btn--accent">
            <span>{t.aboutCta}</span>
            <ArrowRightIcon size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
