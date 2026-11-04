import { filmPermitDatasetUrl, formatPermitSpan, type FilmPermit, type PermitLists } from './film-permits';
import { cornerForLocation } from './cross-streets';
import { isSouthEdge, type Sighting, type SightingSourceType } from './sightings';
import type { MapPin } from './pins';

export type ShootBadge = 'City permit' | 'Resident-reported' | 'Confirmed';

export interface ShootItem {
  id: string;
  bucket: 'upcoming' | 'recent';
  sortKey: string;
  source: string;
  area: string;
  edge: boolean;
  badge: ShootBadge;
  badgeTone: 'permit' | 'resident' | 'confirmed';
  title: string;
  kicker: string;
  when: string;
  location: string;
  summary: string;
  sourceUrl: string;
  sourceLinkLabel: string;
  signageCode: string;
  permitHtml: string;
  extras: Array<{ url: string; label: string }>;
  notes: string;
  lat?: number;
  lng?: number;
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function sourceLabel(type: SightingSourceType | 'city'): string {
  switch (type) {
    case 'city':
      return 'City permit';
    case 'x':
      return 'X';
    case 'instagram':
      return 'Instagram';
    case 'reddit':
      return 'Reddit';
    case 'tiktok':
      return 'TikTok';
    case 'news':
      return 'News';
    case 'tracker':
      return 'Tracker';
    default:
      return 'Other';
  }
}

function sourceLinkLabel(type: SightingSourceType): string {
  switch (type) {
    case 'x':
      return 'Post on X';
    case 'instagram':
      return 'Instagram post';
    case 'reddit':
      return 'Reddit thread';
    case 'tiktok':
      return 'TikTok post';
    case 'news':
      return 'News story';
    case 'tracker':
      return 'Tracker entry';
    default:
      return 'Source';
  }
}

export function formatSightingDay(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return iso;
  return `${months[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}`;
}

export function formatSightingSpan(date: string, endDate?: string): string {
  if (!endDate || endDate === date) return formatSightingDay(date);
  return `${formatSightingDay(date)} – ${formatSightingDay(endDate)}`;
}

function nycDay(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function permitIds(text: string): string[] {
  if (/none found/i.test(text)) return [];
  return [...text.matchAll(/\b(\d{6})\b/g)].map((match) => match[1] ?? '').filter(Boolean);
}

export function permitHref(id: string): string {
  return `https://data.cityofnewyork.us/resource/tg4x-b46p.json?eventid=${id}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function permitHtml(text: string): string {
  const ids = [...new Set(permitIds(text))];
  if (ids.length === 0) return escapeHtml(text);
  let html = escapeHtml(text);
  for (const id of ids) {
    html = html.replaceAll(
      id,
      `<a href="${escapeHtml(permitHref(id))}" rel="noopener noreferrer" target="_blank">${id}<span class="sr-only"> (opens in a new tab)</span></a>`,
    );
  }
  return html;
}

function badgeFor(confidence: Sighting['confidence']): Pick<ShootItem, 'badge' | 'badgeTone'> {
  if (confidence === 'confirmed') return { badge: 'Confirmed', badgeTone: 'confirmed' };
  return { badge: 'Resident-reported', badgeTone: 'resident' };
}

function sightingItem(sighting: Sighting, index: number, today: string): ShootItem {
  const end = sighting.endDate ?? sighting.date;
  const upcoming = end >= today;
  const { badge, badgeTone } = badgeFor(sighting.confidence);
  const corner = sighting.latitude != null && sighting.longitude != null
    ? { latitude: sighting.latitude, longitude: sighting.longitude }
    : cornerForLocation(sighting.location);
  const kickerBits = [sighting.kind, sighting.poster].filter((bit): bit is string => Boolean(bit));
  if (sighting.confidence === 'multiple reports' || sighting.confidence === 'multiple-reports') {
    kickerBits.push('Multiple reports');
  }
  return {
    id: `sighting-${index}`,
    bucket: upcoming ? 'upcoming' : 'recent',
    sortKey: `${sighting.date}T12:00:00`,
    source: sighting.sourceType,
    area: sighting.area ?? '',
    edge: isSouthEdge(sighting.area),
    badge,
    badgeTone,
    title: sighting.title,
    kicker: kickerBits.join(' · '),
    when: formatSightingSpan(sighting.date, sighting.endDate),
    location: sighting.location,
    summary: sighting.summary,
    sourceUrl: sighting.sourceUrl,
    sourceLinkLabel: sourceLinkLabel(sighting.sourceType),
    signageCode: sighting.signageCode ?? '',
    permitHtml: sighting.permitMatch ? permitHtml(sighting.permitMatch) : '',
    extras: (sighting.additionalSources ?? []).map((link) => ({
      url: link.url,
      label: link.poster || sourceLinkLabel(link.sourceType),
    })),
    notes: sighting.notes ?? '',
    lat: corner?.latitude,
    lng: corner?.longitude,
  };
}

function permitItem(permit: FilmPermit, bucket: 'upcoming' | 'recent'): ShootItem {
  const kicker = [permit.subcategory, permit.eventType].filter(Boolean).join(' · ');
  return {
    id: `permit-${permit.id}`,
    bucket,
    sortKey: permit.start || permit.end,
    source: 'city',
    area: '',
    edge: false,
    badge: 'City permit',
    badgeTone: 'permit',
    title: permit.category,
    kicker,
    when: formatPermitSpan(permit.start, permit.end),
    location: permit.parkingHeld,
    summary: '',
    sourceUrl: filmPermitDatasetUrl,
    sourceLinkLabel: 'NYC Open Data',
    signageCode: '',
    permitHtml: '',
    extras: [],
    notes: '',
  };
}

export function mergeShoots(permits: PermitLists, reports: Sighting[], now = new Date()): {
  upcoming: ShootItem[];
  recent: ShootItem[];
} {
  const today = nycDay(now);
  const sightingItems = reports.map((report, index) => sightingItem(report, index, today));
  const upcoming = [
    ...permits.upcoming.map((permit) => permitItem(permit, 'upcoming')),
    ...sightingItems.filter((item) => item.bucket === 'upcoming'),
  ].sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.id.localeCompare(b.id));
  const recent = [
    ...permits.recent.map((permit) => permitItem(permit, 'recent')),
    ...sightingItems.filter((item) => item.bucket === 'recent'),
  ].sort((a, b) => b.sortKey.localeCompare(a.sortKey) || a.id.localeCompare(b.id));
  return { upcoming, recent };
}

export function areaChoices(reports: Sighting[]): Array<{ value: string; label: string }> {
  const choices: Array<{ value: string; label: string }> = [{ value: 'all', label: 'All areas' }];
  if (reports.some((report) => isSouthEdge(report.area))) {
    choices.push({ value: 'south-edge', label: 'South edge' });
  }
  const areas = [...new Set(reports.map((report) => report.area).filter((area): area is string => Boolean(area)))].sort(
    (a, b) => a.localeCompare(b, 'en'),
  );
  for (const area of areas) choices.push({ value: area, label: area });
  if (reports.some((report) => !report.area)) {
    choices.push({ value: 'unspecified', label: 'No area given' });
  }
  return choices;
}

export function sourceChoices(reports: Sighting[]): Array<{ value: string; label: string }> {
  const present = new Set<string>(['city', ...reports.map((report) => report.sourceType)]);
  const order = ['city', 'x', 'reddit', 'news', 'tracker', 'instagram', 'tiktok', 'other'] as const;
  return [
    { value: 'all', label: 'All sources' },
    ...order.filter((type) => present.has(type)).map((type) => ({ value: type, label: sourceLabel(type) })),
  ];
}

function linkHtml(url: string, label: string): string {
  return `<a href="${escapeHtml(url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(label)}<span class="sr-only"> (opens in a new tab)</span></a>`;
}

export function renderShootItem(item: ShootItem): string {
  const bits = [
    `<li id="${escapeHtml(item.id)}" data-shoot data-source="${escapeHtml(item.source)}" data-area="${escapeHtml(item.area)}" data-edge="${item.edge ? '1' : '0'}" data-bucket="${item.bucket}">`,
    `<p class="shoot-badge shoot-badge-${item.badgeTone}">${escapeHtml(item.badge)}</p>`,
  ];
  if (item.kicker) bits.push(`<p class="kicker">${escapeHtml(item.kicker)}</p>`);
  if (item.title) bits.push(`<p class="shoot-title">${escapeHtml(item.title)}</p>`);
  if (item.when) bits.push(`<p class="shoot-when">${escapeHtml(item.when)}</p>`);
  if (item.location) bits.push(`<p class="where">${escapeHtml(item.location)}</p>`);
  if (item.area) {
    const edge = item.edge ? '<span class="edge-flag">South edge</span> ' : '';
    bits.push(`<p class="where">${edge}${escapeHtml(item.area)}</p>`);
  }
  if (item.signageCode) bits.push(`<p class="where">Sign code ${escapeHtml(item.signageCode)}</p>`);
  if (item.summary) bits.push(`<p>${escapeHtml(item.summary)}</p>`);
  bits.push(`<p class="shoot-links">${linkHtml(item.sourceUrl, item.sourceLinkLabel)}</p>`);
  if (item.permitHtml) bits.push(`<p class="where">${item.permitHtml}</p>`);
  if (item.extras.length > 0) {
    const links = item.extras.map((extra) => linkHtml(extra.url, extra.label)).join('<span aria-hidden="true"> · </span>');
    bits.push(`<p class="shoot-links">Also ${links}</p>`);
  }
  if (item.notes) bits.push(`<p class="shoot-note">${escapeHtml(item.notes)}</p>`);
  bits.push('</li>');
  return bits.join('');
}

export function renderTimeline(groups: { upcoming: ShootItem[]; recent: ShootItem[] }): string {
  const block = (items: ShootItem[], bucket: 'upcoming' | 'recent', label: string) => {
    if (items.length === 0) return '';
    return `<div data-shoot-group="${bucket}"><h3 class="shoot-label">${label}</h3><ul class="shoot-list">${items.map(renderShootItem).join('')}</ul></div>`;
  };
  const html = `${block(groups.upcoming, 'upcoming', 'Upcoming')}${block(groups.recent, 'recent', 'Recent')}`;
  return html || '<p class="empty">No resident reports are filed, and no Washington Heights permits are on the calendar for the next stretch or the last four months.</p>';
}

export function pinsForShoots(items: ShootItem[]): MapPin[] {
  const pins: MapPin[] = [];
  for (const item of items) {
    if (item.lat == null || item.lng == null) continue;
    pins.push({
      lat: item.lat,
      lng: item.lng,
      name: item.title,
      href: item.sourceUrl,
      category: item.badgeTone,
      categoryLabel: item.badge,
    });
  }
  return pins;
}
