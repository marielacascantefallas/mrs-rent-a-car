// Recorta las fotos del hero a 4:3 (960 × 720) con un punto focal por foto.
// Uso: node scripts/crop-hero.mjs <carpeta-origen>
import sharp from 'sharp';
import path from 'node:path';

const src = process.argv[2];
const out = path.resolve('src/assets/hero');

// [archivo, nombre, foco x, foco y] — foco en proporción 0..1
const photos = [
  ['17.webp', 'catarata-nauyaca', 0.5, 0.55],
  ['18.webp', 'catarata-bosque', 0.55, 0.6],
  ['19.webp', 'catedral-san-isidro', 0.5, 0.6],
  ['20.webp', 'jardin-laguna', 0.5, 0.5],
  ['21.webp', 'cola-de-ballena', 0.5, 0.5],
  ['22.webp', 'quetzal', 0.5, 0.38],
  ['23.webp', 'costa-aerea', 0.5, 0.5],
  ['24.webp', 'playa-roca', 0.5, 0.5],
  ['25.webp', 'playa-aerea', 0.5, 0.5],
  ['26.webp', 'mariposa-heliconia', 0.5, 0.42],
  ['27.webp', 'monos-carablanca', 0.5, 0.5],
];

for (const [file, name, fx, fy] of photos) {
  const img = sharp(path.join(src, file));
  const { width, height } = await img.metadata();
  let w = width;
  let h = Math.round((width * 3) / 4);
  if (h > height) {
    h = height;
    w = Math.round((height * 4) / 3);
  }
  const left = Math.min(Math.max(Math.round(fx * width - w / 2), 0), width - w);
  const top = Math.min(Math.max(Math.round(fy * height - h / 2), 0), height - h);
  await img
    .extract({ left, top, width: w, height: h })
    .resize(960, 720)
    .webp({ quality: 72 })
    .toFile(path.join(out, `${name}.webp`));
  console.log(name, { left, top, w, h });
}
