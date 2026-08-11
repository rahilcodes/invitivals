import config from '../wedding.config';

/** "Saturday, September 26, 2026" — formatted in the venue's timezone. */
export function longDate(): string {
  return new Intl.DateTimeFormat(config.locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: config.timezone,
  }).format(new Date(config.datetime));
}

/** "September 26, 2026" */
export function mediumDate(): string {
  return new Intl.DateTimeFormat(config.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: config.timezone,
  }).format(new Date(config.datetime));
}

/** "09 · 26 · 2026" — the envelope date line. */
export function numericDate(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: config.timezone,
  }).formatToParts(new Date(config.datetime));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('month')} · ${get('day')} · ${get('year')}`;
}

/** UTC stamp for Google Calendar: 20260926T143000Z */
function gcalStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Pre-filled Google Calendar template URL. */
export function calendarUrl(): string {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${config.bride.first} & ${config.groom.first}'s Wedding`,
    dates: `${gcalStamp(config.datetime)}/${gcalStamp(config.datetimeEnd)}`,
    location: `${config.venue.name}, ${config.venue.address}`,
    details: `Ceremony at ${timeLabel()} — ${config.venue.name}.`,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/** "3:30 PM" in the venue timezone. */
export function timeLabel(): string {
  return new Intl.DateTimeFormat(config.locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: config.timezone,
  }).format(new Date(config.datetime));
}

/** Google Maps view + directions links from the config query. */
export function mapsViewUrl(): string {
  return `https://maps.google.com/?q=${encodeURIComponent(config.venue.mapsQuery)}`;
}
export function mapsDirectionsUrl(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(config.venue.mapsQuery)}`;
}

/** Keyless Google Maps embed URL (or the buyer's own embed override). */
export function mapsEmbedUrl(): string {
  if (config.venue.embedUrl) return config.venue.embedUrl;
  const { lat, lng } = config.venue.coords;
  return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}

/** wa.me link with the pre-filled message. */
export function whatsappUrl(): string {
  return `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(config.contact.whatsappMessage)}`;
}

/**
 * Normalise a video URL into something embeddable.
 * Supports YouTube (watch/short/embed), Vimeo, and direct media files.
 */
export function videoEmbed(url: string): { kind: 'iframe' | 'video' | 'none'; src: string } {
  if (!url) return { kind: 'none', src: '' };
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (yt) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };
  return { kind: 'video', src: url };
}

/** Page title / description with sensible auto-generation. */
export function siteTitle(): string {
  return config.site.title || `${config.bride.first} & ${config.groom.first} — ${mediumDate()}`;
}
export function siteDescription(): string {
  return (
    config.site.description ||
    `You're invited to the wedding of ${config.bride.first} & ${config.groom.first} — ${longDate()} at ${config.venue.name}. RSVP inside.`
  );
}
