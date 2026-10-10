// Datos de contacto compartidos por menú, Cars, Contact y footer.
export const WHATSAPP_NUMBER = '50671077969';
export const WHATSAPP_DISPLAY = '+506 7107 7969';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const INSTAGRAM_URL = 'https://www.instagram.com/mrsrentacar/';
export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61595193861694';
export const EMAIL = 'rentacarmrs@gmail.com';

export function whatsappMessageUrl(message: string) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}
