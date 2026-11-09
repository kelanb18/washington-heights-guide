import { getCollection } from 'astro:content';
import snapshot from '../data/parks-events-snapshot.json';

/**
 * Neighborhood events from two sources:
 * - NYC Parks public events, next 14 days (NYC Open Data, dataset w3wp-dpdi), fetched at build time.
 *   If the request fails, the committed snapshot in src/data/parks-events-snapshot.json is used.
 * - Venue events added by hand in src/content/events/.
 * All times are local New York time ("YYYY-MM-DDTHH:MM").
 */

export interface NeighborhoodEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  place: string;
  detail?: string;
  listingId?: string;
  label: string;
  kids: boolean;
  summary: string;
  cost?: string;
  sourceUrl: string;
  sourceName: string;
  note?: string;
}

export interface RecurringEvent {
  key: string;
  title: string;
  place: string;
  listingId?: string;
  label: string;
  kids: boolean;
  sourceUrl: string;
  sourceName: string;
  occurrences: NeighborhoodEvent[];
}

const parksEndpoint = 'https://data.cityofnewyork.us/resource/w3wp-dpdi.json?$limit=5000';

/** Manhattan parks inside the guide's area, mapped to their listing when there is one. */
const neighborhoodParks: Record<string, string | undefined> = {
  'Fort Tryon Park': 'fort-tryon-park',
  'Highbridge Park': 'highbridge-park',
  'J. Hood Wright Park': 'j-hood-wright-park',
  'Bennett Park': 'bennett-park',
  'Fort Washington Park': undefined,
  'Roger Morris Park': 'morris-jumel-mansion',
  'Jumel Terrace': undefined,
  'Mitchel Square': undefined,
  'Gorman Park': undefined,
  'Quisqueya Playground': undefined,
};

interface ParksRecord {
  title?: string;
  guid?: string;
  link?: { url?: string } | string;
  description?: string;
  parkids?: string;
  parknames?: string;
  starttime?: string;
  endtime?: string;
  location?: string;
  categories?: string;
}

const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—' };

function decode(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => entities[name.toLowerCase()] ?? match);
}

function plain(html: string | undefined): string {
  return decode((html ?? '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** The first sentence or two, at most about 220 characters, ending on a sentence. */
function shortSummary(text: string): string {
  if (text.length <= 220) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  let out = '';
  for (const sentence of sentences) {
    if ((out + sentence).length > 220) break;
    out += sentence;
  }
  return (out || `${text.slice(0, 217).trimEnd()}…`).trim();
}

function localMinute(value: string | undefined): string | undefined {
  const match = value?.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return match?.[1];
}

function labelFor(categories: string): { label: string; kids: boolean } {
  const list = categories.split('|').map((part) => part.trim()).filter(Boolean);
  const kids = list.some((part) => /best for kids|kids|family/i.test(part));
  const order: Array<[RegExp, string]> = [
    [/history/i, 'History'],
    [/birding|wildlife|nature|forest|garden/i, 'Nature'],
    [/volunteer/i, 'Volunteer'],
    [/art|craft|music|dance|film|theater/i, 'Arts'],
    [/tour/i, 'Tour'],
    [/fitness|exercise|shape up|yoga|running|jogging/i, 'Fitness'],
    [/sport/i, 'Sports'],
  ];
  for (const [pattern, label] of order) {
    if (list.some((part) => pattern.test(part))) return { label, kids };
  }
  return { label: kids ? 'Kids' : 'Parks', kids };
}

function parksEvents(records: ParksRecord[]): NeighborhoodEvent[] {
  const events: NeighborhoodEvent[] = [];
  for (const record of records) {
    if (!record.parkids?.startsWith('M')) continue;
    const parks = (record.parknames ?? '').split(',').map((name) => name.trim());
    const park = parks.find((name) => name in neighborhoodParks);
    const start = localMinute(record.starttime);
    const title = plain(record.title);
    const url = typeof record.link === 'string' ? record.link : record.link?.url;
    if (!park || !start || !title || !url) continue;
    const location = plain(record.location);
    let listingId = neighborhoodParks[park];
    if (park === 'Highbridge Park' && /recreation cent|pool/i.test(`${location} ${record.categories ?? ''}`)) {
      listingId = 'highbridge-recreation-center-and-pool';
    }
    const { label, kids } = labelFor(record.categories ?? '');
    events.push({
      id: `parks-${record.guid ?? `${start}-${title}`}`,
      title,
      start,
      end: localMinute(record.endtime),
      place: listingId === 'highbridge-recreation-center-and-pool' ? 'Highbridge Recreation Center' : park,
      detail: location && !location.startsWith(park) ? location.replace(/\s*\(in [^)]*\)\s*$/, '') : undefined,
      listingId,
      label,
      kids: kids || /\bkids?\b|ages?:/i.test(title),
      summary: shortSummary(plain(record.description)),
      sourceUrl: url.replace(/^http:/, 'https:'),
      sourceName: 'NYC Parks',
    });
  }
  return events;
}

let cachedParks: Promise<NeighborhoodEvent[]> | undefined;

async function loadParksEvents(): Promise<NeighborhoodEvent[]> {
  cachedParks ??= (async () => {
    try {
      const response = await fetch(parksEndpoint, { signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const records = (await response.json()) as ParksRecord[];
      if (!Array.isArray(records) || records.length === 0) throw new Error('empty response');
      return parksEvents(records);
    } catch (error) {
      console.warn(`[events] NYC Parks feed unavailable (${(error as Error).message}); using the saved snapshot.`);
      return parksEvents(snapshot as ParksRecord[]);
    }
  })();
  return cachedParks;
}

const venueLabels: Record<string, string> = {
  music: 'Music',
  film: 'Film',
  theater: 'Theater',
  talk: 'Talk',
  history: 'History',
  arts: 'Arts',
  family: 'Family',
  outdoors: 'Outdoors',
  market: 'Market',
  community: 'Community',
};

async function loadVenueEvents(): Promise<NeighborhoodEvent[]> {
  const entries = await getCollection('events');
  return entries
    .filter((entry) => !entry.data.draft || import.meta.env.DEV)
    .map((entry) => ({
      id: `venue-${entry.id}`,
      title: entry.data.title,
      start: entry.data.start,
      end: entry.data.end,
      place: entry.data.place,
      detail: entry.data.listing ? undefined : entry.data.address,
      listingId: entry.data.listing,
      label: venueLabels[entry.data.category] ?? 'Event',
      kids: entry.data.category === 'family',
      summary: entry.data.summary,
      cost: entry.data.cost,
      sourceUrl: entry.data.sourceUrl,
      sourceName: entry.data.sourceName,
      note: entry.data.note,
    }));
}

/** The current local New York time, "YYYY-MM-DDTHH:MM". */
export function nowInNewYork(now = new Date()): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** Local New York time with its UTC offset, for schema.org and for the browser's past-event check. */
export function withOffset(local: string): string {
  const [date, time] = local.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const guess = new Date(Date.UTC(year, month - 1, day, hour + 5, minute));
  const zone =
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'shortOffset' })
      .formatToParts(guess)
      .find((part) => part.type === 'timeZoneName')?.value ?? 'GMT-5';
  const match = zone.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  const sign = match?.[1] ?? '-';
  const hours = (match?.[2] ?? '5').padStart(2, '0');
  return `${date}T${time}:00${sign}${hours}:${match?.[3] ?? '00'}`;
}

/** Upcoming events, soonest first: one-offs, plus repeating classes grouped by title and place. */
export async function loadEvents(now = new Date()): Promise<{ oneOff: NeighborhoodEvent[]; recurring: RecurringEvent[] }> {
  const cutoff = nowInNewYork(now);
  const all = [...(await loadParksEvents()), ...(await loadVenueEvents())]
    .filter((event) => (event.end ?? event.start) >= cutoff)
    .sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title, 'en'));

  const groups = new Map<string, NeighborhoodEvent[]>();
  for (const event of all) {
    const key = `${event.title.toLowerCase()}|${event.place.toLowerCase()}`;
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }

  const oneOff: NeighborhoodEvent[] = [];
  const recurring: RecurringEvent[] = [];
  for (const [key, events] of groups) {
    if (events.length === 1 || events[0].sourceName !== 'NYC Parks') {
      oneOff.push(...events);
      continue;
    }
    const first = events[0];
    recurring.push({
      key,
      title: first.title,
      place: first.place,
      listingId: first.listingId,
      label: first.label,
      kids: first.kids,
      sourceUrl: first.sourceUrl,
      sourceName: first.sourceName,
      occurrences: events,
    });
  }
  oneOff.sort((a, b) => a.start.localeCompare(b.start));
  recurring.sort((a, b) => a.title.localeCompare(b.title, 'en'));
  return { oneOff, recurring };
}

const weekdayFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric' });
const shortDayFormat = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', weekday: 'short' });

function asUtcDate(local: string): Date {
  const [date, time = '00:00'] = local.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

/** "Sunday, November 15" */
export function dayHeading(local: string): string {
  return weekdayFormat.format(asUtcDate(local));
}

/** "1pm", "7:30am" */
export function clock(local: string): string {
  const [hour, minute] = local.slice(11, 16).split(':').map(Number);
  const suffix = hour >= 12 ? 'pm' : 'am';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${twelve}${suffix}` : `${twelve}:${String(minute).padStart(2, '0')}${suffix}`;
}

/** "1–4pm", "10am–12:30pm", or just the start. */
export function timeRange(start: string, end?: string): string {
  if (!end || end.slice(0, 10) !== start.slice(0, 10) || end === start) return clock(start);
  const a = clock(start);
  const b = clock(end);
  return a.slice(-2) === b.slice(-2) ? `${a.slice(0, -2)}–${b}` : `${a}–${b}`;
}

/** "Tue, Thu 7:30am · Sat 8:30am" from a set of occurrences. */
export function scheduleLine(occurrences: NeighborhoodEvent[]): string {
  const byTime = new Map<string, Set<string>>();
  for (const event of occurrences) {
    const time = clock(event.start);
    const day = shortDayFormat.format(asUtcDate(event.start));
    byTime.set(time, (byTime.get(time) ?? new Set()).add(day));
  }
  const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return [...byTime.entries()]
    .map(([time, days]) => `${[...days].sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)).join(', ')} ${time}`)
    .join(' · ');
}
