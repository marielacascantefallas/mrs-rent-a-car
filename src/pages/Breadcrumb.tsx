import { pageStrings } from '../i18n/pages';
import { useLanguage } from '../i18n/LanguageContext';
import { pathFor } from '../routes';

/** Inicio / página actual. Ayuda a ubicarse y a que Google entienda la estructura. */
export function Breadcrumb({ current }: { current: string }) {
  const { lang } = useLanguage();
  const p = pageStrings[lang];
  return (
    <nav className="breadcrumb" aria-label={p.breadcrumb}>
      <ol>
        <li>
          <a href={pathFor('home', lang)}>{p.home}</a>
        </li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
