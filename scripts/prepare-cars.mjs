// Normaliza las fotos sin fondo de los autos: recorta el espacio vacío y
// coloca cada auto en un lienzo igual (1500 × 1000), centrado y apoyado abajo,
// para que en el sitio se vean del mismo tamaño y proporción.
// Uso: node scripts/prepare-cars.mjs <carpeta-origen>
import sharp from 'sharp';
import path from 'node:path';

const src = process.argv[2];
const out = path.resolve('src/assets/cars');
const W = 1500;
const H = 1000;

const cars = [
  ['vitara.png', 'vitara'],
  ['accent.png', 'accent'],
  ['pathfinder.webp', 'pathfinder'],
];

for (const [file, name] of cars) {
  const trimmed = await sharp(path.join(src, file)).trim({ threshold: 10 }).toBuffer();
  const resized = await sharp(trimmed)
    .resize(W, H, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true });
  const { width, height } = resized.info;
  await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: resized.data, left: Math.round((W - width) / 2), top: H - height }])
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(path.join(out, `${name}.webp`));
  console.log(name, width, height);
}
