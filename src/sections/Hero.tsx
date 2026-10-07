import { useEffect, useRef } from 'react';
import { Logo } from '../components/Logo';
import './hero.css';

// Fotos de destinos de la zona sur, todas recortadas a 4:3.
const photoModules = import.meta.glob<string>('../assets/hero/*.webp', {
  eager: true,
  import: 'default',
});
const PHOTOS = Object.values(photoModules);

const TRAIL_MAX = 9; // fotos visibles como máximo en el rastro

function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Ancho de cada foto del rastro según el tamaño del hero. */
function photoWidth(w: number, h: number) {
  return Math.round(Math.min(Math.max(w * 0.17, 140), 280, h * 0.32 * (4 / 3)));
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Precarga para que cada foto aparezca al instante.
    PHOTOS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    let gap = 0; // distancia que recorre el cursor entre una foto y la siguiente
    const measure = () => {
      const r = section.getBoundingClientRect();
      const width = photoWidth(r.width, r.height);
      gap = width * 0.42;
      stage.style.setProperty('--trail-w', `${width}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);

    let queue: string[] = [];
    const nextPhoto = () => {
      if (!queue.length) queue = shuffle(PHOTOS);
      return queue.pop()!;
    };

    let z = 1;
    let last: { x: number; y: number } | null = null;

    const drop = (x: number, y: number) => {
      const el = document.createElement('img');
      el.src = nextPhoto();
      el.alt = '';
      el.className = 'hero__trail';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.zIndex = String(z++);
      el.addEventListener('animationend', () => el.remove(), { once: true });
      stage.appendChild(el);
      // Si el rastro se alarga, la foto más vieja se va antes.
      const trail = stage.querySelectorAll('.hero__trail');
      for (let i = 0; i < trail.length - TRAIL_MAX; i++) trail[i].remove();
    };

    // Suelta fotos a lo largo del recorrido, separadas por `gap`.
    const moveTo = (x: number, y: number) => {
      if (!last) {
        last = { x, y };
        drop(x, y);
        return;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < gap) return;
      const steps = Math.min(Math.floor(dist / gap), 3);
      for (let i = 1; i <= steps; i++) {
        drop(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
      }
      last = { x, y };
    };

    const onPointerMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      moveTo(e.clientX - r.left, e.clientY - r.top);
    };
    const onPointerLeave = () => {
      last = null;
    };
    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerleave', onPointerLeave);

    // En pantallas táctiles no hay cursor: un recorrido automático suave
    // deja el rastro mientras el hero está a la vista.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let raf = 0;
    let visible = false;
    let t = Math.random() * 10;
    let prev = 0;

    const autoPath = (now: number) => {
      if (!visible) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(autoPath);
      t += Math.min(now - prev, 50) / 1000;
      prev = now;
      const r = section.getBoundingClientRect();
      const x = r.width / 2 + r.width * 0.36 * Math.sin(t * 0.7);
      const y = r.height / 2 + r.height * 0.34 * Math.sin(t * 1.1 + 1.3);
      moveTo(x, y);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!canHover && visible && !raf) {
        prev = performance.now();
        raf = requestAnimationFrame(autoPath);
      }
    });
    io.observe(section);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', onPointerLeave);
      stage.querySelectorAll('.hero__trail').forEach((el) => el.remove());
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" className="section section--dark hero" data-bg="dark">
      <div ref={stageRef} className="hero__stage" aria-hidden="true">
        {/* Composición fija para quienes prefieren menos movimiento */}
        <div className="hero__static">
          {PHOTOS.slice(0, 4).map((src) => (
            <img key={src} src={src} alt="" className="hero__static-photo" />
          ))}
        </div>
      </div>
      <div className="hero__logo">
        <h1 className="visually-hidden">MRS Rent a Car</h1>
        <Logo tone="dark" className="hero__logo-img" decorative />
      </div>
    </section>
  );
}
