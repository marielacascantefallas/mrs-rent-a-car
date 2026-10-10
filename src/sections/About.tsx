import { useEffect, useState } from 'react';
import { ArrowRightIcon } from '../components/icons';
import { useReveal } from '../components/useReveal';
import { CARS } from '../data/cars';
import { useLanguage } from '../i18n/LanguageContext';
import './about.css';

const ROTATE_MS = 3200; // tiempo que se muestra cada vehículo

export function About() {
  const { t } = useLanguage();
  const [ref, shown] = useReveal<HTMLDivElement>();
  const [current, setCurrent] = useState(0);

  // Los vehículos se alternan con fade mientras la sección está a la vista.
  useEffect(() => {
    if (!shown) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setCurrent((i) => (i + 1) % CARS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [shown]);

  return (
    <section id="about" className="section section--light about" data-bg="light">
      <div ref={ref} className="about__inner" data-shown={shown}>
        <figure className="about__media" role="img" aria-label={t.aboutImagesLabel}>
          {CARS.map((car, i) => (
            <img
              key={car.id}
              src={car.image}
              alt=""
              className="about__car"
              data-active={i === current}
              loading="lazy"
              decoding="async"
            />
          ))}
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
