export const siteName = 'The Heights';

export const defaultDescription =
  'A curated guide to restaurants, cafes, bakeries, bars, shops, services, and landmarks in Washington Heights, from West 155th Street to the Dyckman edge of Inwood.';

/** Replace this before launch. It is not a working mailbox. */
export const correctionsEmail = 'corrections@example.com';

export const scopeLine =
  'Washington Heights, from West 155th Street to the Dyckman edge of Inwood.';

export function href(path: string): string {
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  if (withLeading === '/') return '/';
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname || '/';
}

export function absoluteUrl(site: URL, path: string): string {
  return new URL(href(path), site).href;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function mapsHref(parts: Array<string | undefined>): string {
  const query = [...parts.filter((part): part is string => Boolean(part)), 'New York, NY'].join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
