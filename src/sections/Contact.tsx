import { useMemo, useState, type FormEvent } from 'react';
import { BrandIcon, type Brand } from '../components/BrandIcon';
import { ArrowRightIcon } from '../components/icons';
import { FACEBOOK_URL, FORMSPREE_URL, INSTAGRAM_URL, WHATSAPP_URL } from '../config';
import { CARS } from '../data/cars';
import { COUNTRIES, OTHER_COUNTRY } from '../data/countries';
import { useLanguage } from '../i18n/LanguageContext';
import './contact.css';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Errors = Partial<Record<'nombre' | 'nacionalidad' | 'hasta', string>>;

const SOCIALS: { brand: Brand; href: string; label: string }[] = [
  { brand: 'whatsapp', href: WHATSAPP_URL, label: 'WhatsApp' },
  { brand: 'instagram', href: INSTAGRAM_URL, label: 'Instagram' },
  { brand: 'facebook', href: FACEBOOK_URL, label: 'Facebook' },
];

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function Contact() {
  const { lang, t } = useLanguage();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [from, setFrom] = useState('');

  // Países en orden alfabético del idioma activo; "Otro" siempre al final.
  const countries = useMemo(() => {
    const col = lang === 'es' ? 0 : 1;
    const sorted = [...COUNTRIES].sort((a, b) => a[col].localeCompare(b[col], lang));
    return [...sorted, OTHER_COUNTRY].map(([es, en]) => ({ value: es, label: col ? en : es }));
  }, [lang]);

  const validate = (data: FormData): Errors => {
    const e: Errors = {};
    if (!String(data.get('nombre') ?? '').trim()) e.nombre = t.errorName;
    if (!data.get('nacionalidad')) e.nacionalidad = t.errorNationality;
    const desde = String(data.get('desde') ?? '');
    const hasta = String(data.get('hasta') ?? '');
    if (desde && hasta && hasta < desde) e.hasta = t.errorDates;
    return e;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setStatus('sending');
    data.append('_subject', `Nueva consulta de ${data.get('nombre')} · MRS Rent a Car`);
    data.append('idioma', lang === 'es' ? 'Español' : 'Inglés');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      form.reset();
      setFrom('');
    } catch {
      setStatus('error');
    }
  };

  const fieldError = (name: keyof Errors) =>
    errors[name] ? (
      <span id={`${name}-error`} className="field__error">
        {errors[name]}
      </span>
    ) : null;

  const errorProps = (name: keyof Errors) =>
    errors[name]
      ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-error` }
      : {};

  return (
    <section id="contact" className="section section--dark contact" data-bg="dark">
      <div className="contact__inner">
        <h2 className="contact__word" aria-label="Contact">
          CONTACT
        </h2>

        {/* Para el header, el panel amarillo pide contenido verde. */}
        <div className="contact__panel" data-bg="accent">
          <p className="eyebrow contact__eyebrow">{t.contactEyebrow}</p>

          <form className="contact__form" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="nombre">
                {t.fieldName} <span aria-hidden="true">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="name"
                required
                {...errorProps('nombre')}
              />
              {fieldError('nombre')}
            </div>

            <div className="field">
              <label htmlFor="nacionalidad">
                {t.fieldNationality} <span aria-hidden="true">*</span>
              </label>
              <select
                id="nacionalidad"
                name="nacionalidad"
                required
                defaultValue=""
                {...errorProps('nacionalidad')}
              >
                <option value="" disabled>
                  {t.selectPlaceholder}
                </option>
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {fieldError('nacionalidad')}
            </div>

            <div className="field">
              <label htmlFor="vehiculo">{t.fieldVehicle}</label>
              <select id="vehiculo" name="vehiculo" defaultValue="">
                <option value="">{t.vehicleAny}</option>
                {CARS.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-pair">
              <div className="field">
                <label htmlFor="desde">{t.fieldFrom}</label>
                <input
                  id="desde"
                  name="desde"
                  type="date"
                  min={todayISO()}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="hasta">{t.fieldTo}</label>
                <input
                  id="hasta"
                  name="hasta"
                  type="date"
                  min={from || todayISO()}
                  {...errorProps('hasta')}
                />
                {fieldError('hasta')}
              </div>
            </div>

            <div className="field field--full">
              <label htmlFor="mensaje">{t.fieldMessage}</label>
              <textarea id="mensaje" name="mensaje" rows={3} />
            </div>

            <div className="contact__footer">
              <p className="contact__status" role="status" aria-live="polite">
                {status === 'success' && t.sent}
                {status === 'error' && t.sendError}
              </p>
              <button type="submit" className="btn btn--outline" disabled={status === 'sending'}>
                <span>{status === 'sending' ? t.sending : t.send}</span>
                <ArrowRightIcon size={20} />
              </button>
            </div>
          </form>
        </div>

        <ul className="contact__social">
          {SOCIALS.map((s) => (
            <li key={s.brand}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                <BrandIcon brand={s.brand} size={22} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
