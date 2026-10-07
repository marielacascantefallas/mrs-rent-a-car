// Quita el fondo blanco de la foto del Vitara rellenando desde los bordes.
const sharp = require('sharp');
const [, , input, output, thrArg] = process.argv;
const THR = Number(thrArg || 238);
(async () => {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const isBg = (i) => {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    return Math.min(r, g, b) >= THR && Math.max(r, g, b) - Math.min(r, g, b) < 14;
  };
  const mask = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) { stack.push(x, (H - 1) * W + x); }
  for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1); }
  while (stack.length) {
    const i = stack.pop();
    if (mask[i] || !isBg(i)) continue;
    mask[i] = 1;
    const x = i % W, y = (i / W) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < W - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - W);
    if (y < H - 1) stack.push(i + W);
  }
  // Borde suave: alfa parcial para píxeles vecinos del fondo.
  for (let i = 0; i < W * H; i++) {
    if (mask[i]) { data[i * 4 + 3] = 0; continue; }
    const x = i % W, y = (i / W) | 0;
    let n = 0;
    for (const j of [i - 1, i + 1, i - W, i + W]) if (j >= 0 && j < W * H && mask[j]) n++;
    if (n && x > 0 && y > 0) data[i * 4 + 3] = 255 - n * 40;
  }
  await sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toFile(output);
})();
