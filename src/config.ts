// Datos de contacto compartidos por menú, Cars, Contact y footer.
export const WHATSAPP_NUMBER = '50671077969';
export const WHATSAPP_DISPLAY = '+506 7107 7969';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const INSTAGRAM_URL = 'https://www.instagram.com/mrsrentacar/';
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61595193861694';
export const EMAIL = 'rentacarmrs@gmail.com';
// Ficha de Google Business Profile
export const GOOGLE_PROFILE_URL = 'https://share.google/fnAbP3dSMWdWMKQ7z';
// Código de verificación de Google Search Console (método "Etiqueta HTML"): solo el valor de content.
export const GOOGLE_SITE_VERIFICATION = '';

export function whatsappMessageUrl(message: string) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
