/** NYC Open Data, Mayor's Office of Media and Entertainment. */
export const filmPermitDatasetUrl = 'https://data.cityofnewyork.us/City-Government/Film-Permits/tg4x-b46p';

export const filmPermitEndpoint = 'https://data.cityofnewyork.us/resource/tg4x-b46p.json';

/** Washington Heights. 10031 is mostly south of 155th; 10034 is Inwood. */
export const heightsZips = ['10032', '10033', '10040'] as const;

const recentDays = 120;

export interface FilmPermit {
  id: string;
  eventType: string;
  category: string;
  subcategory: string;
  start: string;
  end: string;
  parkingHeld: string;
  zips: string[];
}

export interface PermitLists {
  upcoming: FilmPermit[];
  recent: FilmPermit[];
  error: string | undefined;
  fetchedAt: string | undefined;
}

interface RawPermit {
  eventid?: string;
  eventtype?: string;
  startdatetime?: string;
  enddatetime?: string;
  category?: string;
  subcategoryname?: string;
  zipcode_s?: string;
  parkingheld?: string;
  borough?: string;
}

export function nycStamp(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;
}

function addDays(stamp: string, days: number): string {
  const [datePart] = stamp.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

export function zipTokens(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => /^\d{5}$/.test(part));
}

export function touchesHeights(value: string | undefined): boolean {
  const wanted = new Set<string>(heightsZips);
  return zipTokens(value).some((zip) => wanted.has(zip));
}

export function permitQuery(now = new Date()): string {
  const cutoff = addDays(nycStamp(now), -recentDays);
  const zips = heightsZips.map((zip) => `zipcode_s like '%${zip}%'`).join(' OR ');
  const where = `upper(borough)='MANHATTAN' AND enddatetime >= '${cutoff}T00:00:00' AND (${zips})`;
  const params = new URLSearchParams({
    $select: 'eventid,eventtype,startdatetime,enddatetime,category,subcategoryname,zipcode_s,parkingheld,borough',
    $where: where,
    $order: 'startdatetime DESC',
    $limit: '200',
  });
  return `${filmPermitEndpoint}?${params.toString()}`;
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

export function formatPermitStamp(stamp: string): string {
  const match = stamp.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return stamp;
  let hour = Number(match[4]);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${months[Number(match[2]) - 1]} ${Number(match[3])}, ${match[1]}, ${hour}:${match[5]} ${ampm}`;
}

export function formatPermitSpan(start: string, end: string): string {
  if (!start) return formatPermitStamp(end);
  if (!end) return formatPermitStamp(start);
  const startDay = start.slice(0, 10);
  const endDay = end.slice(0, 10);
  if (startDay === endDay) {
    const day = formatPermitStamp(start).replace(/, \d{1,2}:\d{2} [AP]M$/, '');
    const startTime = formatPermitStamp(start).split(', ').slice(-1)[0];
    const endTime = formatPermitStamp(end).split(', ').slice(-1)[0];
    return `${day}, ${startTime} – ${endTime}`;
  }
  return `${formatPermitStamp(start)} – ${formatPermitStamp(end)}`;
}

function normalize(row: RawPermit): FilmPermit | undefined {
  if (!row.eventid || !touchesHeights(row.zipcode_s)) return undefined;
  const end = row.enddatetime ?? '';
  const start = row.startdatetime ?? end;
  if (!start && !end) return undefined;
  return {
    id: row.eventid,
    eventType: row.eventtype ?? 'Permit',
    category: row.category ?? 'Permit',
    subcategory: row.subcategoryname ?? '',
    start,
    end: end || start,
    parkingHeld: (row.parkingheld ?? '').replace(/\s+/g, ' ').trim(),
    zips: zipTokens(row.zipcode_s).filter((zip) => (heightsZips as readonly string[]).includes(zip)),
  };
}

export function splitPermits(rows: FilmPermit[], now = new Date()): Pick<PermitLists, 'upcoming' | 'recent'> {
  const stamp = nycStamp(now);
  const upcoming = rows
    .filter((row) => row.end >= stamp)
    .sort((a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id));
  const recent = rows
    .filter((row) => row.end < stamp)
    .sort((a, b) => b.start.localeCompare(a.start) || a.id.localeCompare(b.id));
  return { upcoming, recent };
}

export async function loadFilmPermits(now = new Date()): Promise<PermitLists> {
  const url = permitQuery(now);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      return { upcoming: [], recent: [], error: `The permit feed answered ${response.status}.`, fetchedAt: undefined };
    }
    const json = (await response.json()) as RawPermit[];
    const seen = new Set<string>();
    const permits: FilmPermit[] = [];
    for (const row of json) {
      const permit = normalize(row);
      if (!permit || seen.has(permit.id)) continue;
      seen.add(permit.id);
      permits.push(permit);
    }
    return { ...splitPermits(permits, now), error: undefined, fetchedAt: nycStamp(now) };
  } catch {
    return {
      upcoming: [],
      recent: [],
      error: 'The permit feed could not be reached while this page was built.',
      fetchedAt: undefined,
    };
  } finally {
    clearTimeout(timer);
  }
}
