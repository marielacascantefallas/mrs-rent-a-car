// Genera las imágenes estáticas para buscadores y redes (una sola vez; quedan en public/).
// node scripts/make-share-images.mjs
import sharp from 'sharp';

const GREEN = { r: 31, g: 63, b: 31, alpha: 1 };

const logo = await sharp('src/assets/logos/plano-amarillo-crema.webp').resize({ width: 470 }).toBuffer();
const car = await sharp('src/assets/cars/vitara.webp').resize({ width: 640 }).toBuffer();

// Imagen para compartir (Open Graph): 1200 x 630
await sharp({ create: { width: 1200, height: 630, channels: 4, background: GREEN } })
  .composite([
    { input: logo, left: 70, top: Math.round((630 - (470 * 1444) / 2000) / 2) },
    { input: car, left: 540, top: 100 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/og-image.jpg');

// Logo cuadrado para Google (datos estructurados) y el manifiesto
const square = await sharp('src/assets/logos/plano-amarillo-crema.webp').resize({ width: 420 }).toBuffer();
for (const [file, size] of [['public/logo.png', 512], ['public/icon-192.png', 192]]) {
  const inner = await sharp(square).resize({ width: Math.round(size * 0.82) }).toBuffer();
  const meta = await sharp(inner).metadata();
  await sharp({ create: { width: size, height: size, channels: 4, background: GREEN } })
    .composite([{ input: inner, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
    .png()
    .toFile(file);
}
console.log('ok');
