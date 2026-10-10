// Después del build: escribe el HTML de cada idioma con su contenido y su <head> SEO,
// más sitemap.xml. Español en /, inglés en /en/.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const ssrDir = resolve(root, 'dist-ssr');

const { render, headTags, sitemap, LANG_PATH } = await import(
  pathToFileURL(resolve(ssrDir, 'entry-server.js')).href
);

const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error('index.html no tiene los marcadores esperados para el prerender');
}

for (const lang of ['es', 'en']) {
  const html = template
    .replace('<html lang="es">', `<html lang="${lang}">`)
    .replace(SEO_BLOCK, headTags(lang))
    .replace('<div id="root"></div>', `<div id="root">${render(lang)}</div>`);
  const out = resolve(dist, `.${LANG_PATH[lang]}index.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`prerender: ${LANG_PATH[lang]} (${Math.round(html.length / 1024)} kB)`);
}

writeFileSync(resolve(dist, 'sitemap.xml'), sitemap(new Date().toISOString().slice(0, 10)));
rmSync(ssrDir, { recursive: true, force: true });
console.log('prerender: sitemap.xml');
