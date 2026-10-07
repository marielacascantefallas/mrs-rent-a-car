import { siFacebook, siInstagram, siWhatsapp } from 'simple-icons';

// Íconos oficiales de cada marca (Simple Icons), en el color del texto.
const ICONS = {
  whatsapp: siWhatsapp,
  instagram: siInstagram,
  facebook: siFacebook,
} as const;

export type Brand = keyof typeof ICONS;

export function BrandIcon({ brand, size = 20 }: { brand: Brand; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ICONS[brand].path} />
    </svg>
  );
}
