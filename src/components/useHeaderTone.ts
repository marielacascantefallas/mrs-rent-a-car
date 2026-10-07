import { useEffect, useState, type RefObject } from 'react';

export type Tone = 'light' | 'dark' | 'accent';

/**
 * Devuelve el tono de la sección que está justo debajo del header.
 * Cada sección (o zona dentro de ella) declara su fondo con data-bg="light" | "dark" | "accent" (amarillo).
 */
export function useHeaderTone(headerRef: RefObject<HTMLElement>): Tone {
  const [tone, setTone] = useState<Tone>('dark');

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const header = headerRef.current;
      if (!header) return;
      const rect = header.getBoundingClientRect();
      const probeY = rect.top + rect.height / 2;
      // Gana el elemento más interno (p. ej. el panel amarillo dentro de Contact).
      const zones = document.querySelectorAll<HTMLElement>('[data-bg]');
      let match: HTMLElement | null = null;
      for (const zone of zones) {
        const r = zone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        if (r.top <= probeY && r.bottom > probeY && r.left <= centerX && r.right >= centerX) {
          match = zone;
        }
      }
      if (match) {
        const bg = match.dataset.bg;
        setTone(bg === 'light' || bg === 'accent' ? bg : 'dark');
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headerRef]);

  return tone;
}
