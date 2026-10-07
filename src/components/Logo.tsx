import logoYellowCream from '../assets/logos/plano-amarillo-crema.webp';
import logoGreen from '../assets/logos/plano-verde.webp';
import logoCream from '../assets/logos/plano-crema.webp';
import './logo.css';

// Versión plana del logo según el fondo:
// - dark: MRS amarillo y "Rent a Car" crema, sobre verde.
// - light: todo verde, sobre blanco o crema.
// - cream: todo crema, sobre verde muy oscuro (modo oscuro).
const SOURCES = {
  dark: logoYellowCream,
  light: logoGreen,
  cream: logoCream,
} as const;

export type LogoTone = keyof typeof SOURCES;

type LogoProps = {
  tone: LogoTone;
  className?: string;
  /** Alto en px; sin alto, el tamaño lo define el CSS de className. */
  height?: number;
  decorative?: boolean;
};

export function Logo({ tone, className, height, decorative }: LogoProps) {
  // Las tres versiones se apilan y cruzan con opacidad para cambiar sin saltos.
  return (
    <span
      className={`logo ${className ?? ''}`}
      style={height ? { height, width: Math.round((height * 2000) / 1444) } : undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'MRS Rent a Car'}
      aria-hidden={decorative ? true : undefined}
    >
      {(Object.keys(SOURCES) as LogoTone[]).map((key) => (
        <img
          key={key}
          src={SOURCES[key]}
          alt=""
          className="logo__img"
          data-active={key === tone}
          draggable={false}
        />
      ))}
    </span>
  );
}
