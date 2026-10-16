import { useCallback, useEffect, useRef, useState } from 'react';
import { BrandIcon } from '../components/BrandIcon';
import { ArrowLeftIcon, ArrowRightIcon } from '../components/icons';
import { whatsappMessageUrl } from '../config';
import { CARS, formatCrc, whatsappMessage } from '../data/cars';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { pageStrings } from '../i18n/pages';
import { pathFor } from '../routes';
import './cars.css';

const COUNT = CARS.length;
const DRAG_THRESHOLD = 60; // px para cambiar de vehículo al arrastrar

/** Posición relativa al vehículo activo: -1 anterior, 0 activo, 1 siguiente. */
function relative(index: number, active: number) {
  let p = (index - active + COUNT) % COUNT;
  if (p > COUNT / 2) p -= COUNT;
  return p;
}

export function Cars() {
  const { lang, t } = useLanguage();
  const { theme } = useTheme();
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const moved = useRef(false);
  const prevPos = useRef<number[]>(CARS.map((_, i) => relative(i, 0)));

  const go = useCallback((dir: number) => {
    setActive((a) => (a + dir + COUNT) % COUNT);
  }, []);

  // Posiciones de este render; la foto que da la vuelta de un borde al otro
  // no se desliza por encima de todo, solo reaparece.
  const positions = CARS.map((_, i) => relative(i, active));
  const wrapped = positions.map((p, i) => Math.abs(p - prevPos.current[i]) > 1);
  useEffect(() => {
    prevPos.current = positions;
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    startX.current = e.clientX;
    moved.current = false;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 6) moved.current = true;
    setDrag(dx);
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    if (drag <= -DRAG_THRESHOLD) go(1);
    else if (drag >= DRAG_THRESHOLD) go(-1);
    setDrag(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  const car = CARS[active];
  const bg = theme === 'dark' ? car.bg.dark : car.bg.light;
  const ink = theme === 'dark' ? car.ink.dark : car.ink.light;

  return (
    <section
      id="cars"
      className="section section--light cars"
      data-bg="light"
      style={{ '--cars-bg': bg, '--car-ink': ink } as React.CSSProperties}
      aria-labelledby="cars-title"
    >
      <h2 id="cars-title" className="visually-hidden">
        {t.carsTitle}
      </h2>

      <div className="cars__stage">
        <div
          ref={viewportRef}
          className="cars__viewport"
          data-dragging={dragging}
          role="group"
          aria-roledescription={lang === 'es' ? 'carrusel' : 'carousel'}
          aria-label={t.carsTitle}
          aria-describedby="cars-hint"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{ '--drag': `${drag}px` } as React.CSSProperties}
        >
          <p id="cars-hint" className="visually-hidden">
            {t.carsHint}
          </p>
          {CARS.map((c, i) => {
            const p = positions[i];
            const isActive = p === 0;
            return (
              <div
                key={c.id}
                className="car"
                data-pos={p}
                data-active={isActive}
                data-wrapped={wrapped[i]}
                style={
                  {
                    '--p': p,
                    '--chars': c.short.length,
                    '--name-ink': theme === 'dark' ? c.ink.dark : c.ink.light,
                  } as React.CSSProperties
                }
                aria-hidden={!isActive}
                onClick={() => {
                  if (!isActive && !moved.current) go(p);
                }}
              >
                <span className="car__name">{c.short}</span>
                <img
                  className="car__img"
                  src={c.image}
                  alt={isActive ? t.carImageAlt.replace('{car}', c.name) : ''}
                  width={1500}
                  height={1000}
                  draggable={false}
                  decoding="async"
                />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="cars__arrow cars__arrow--prev"
          onClick={() => go(-1)}
          aria-label={`${t.carsPrev}: ${CARS[(active - 1 + COUNT) % COUNT].name}`}
        >
          <ArrowLeftIcon size={22} />
        </button>
        <button
          type="button"
          className="cars__arrow cars__arrow--next"
          onClick={() => go(1)}
          aria-label={`${t.carsNext}: ${CARS[(active + 1) % COUNT].name}`}
        >
          <ArrowRightIcon size={22} />
        </button>
      </div>

      <div className="cars__info" aria-live="polite">
        <div key={car.id} className="cars__details">
          <h3 className="cars__model">{car.name}</h3>
          <p className="cars__specs">{car.specs[lang]}</p>
          <p className="cars__price">
            <span className="cars__price-usd">${car.usd}</span>
            <span className="cars__price-rest">
              <span className="cars__price-crc">{formatCrc(car, lang)}</span>
              <span className="cars__price-unit">{t.perDay}</span>
            </span>
          </p>
        </div>
        <a
          className="btn cars__cta"
          href={whatsappMessageUrl(whatsappMessage(car, lang))}
          target="_blank"
          rel="noopener noreferrer"
        >
          <BrandIcon brand="whatsapp" size={20} />
          <span>{t.carsCta}</span>
        </a>
        <a className="cars__details" href={pathFor(`car:${car.id}`, lang)}>
          {pageStrings[lang].seeDetails}
        </a>
      </div>
    </section>
  );
}
