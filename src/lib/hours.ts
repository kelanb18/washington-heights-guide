/** Minutes from midnight. An end of 26:00 is 2:00 the next morning. */

const dayIndex: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

export interface HoursStatus {
  open: boolean;
  label: 'Open now' | 'Closed now';
}

interface Span {
  days: number[];
  start: number;
  end: number;
}

function minutes(token: string): number | undefined {
  const value = token.trim().toLowerCase().replace(/\./g, '');
  if (value === 'midnight') return 24 * 60;
  if (value === 'noon') return 12 * 60;
  const match = value.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
  if (!match) return undefined;
  let hour = Number(match[1]);
  const minute = Number(match[2] ?? '0');
  const meridiem = match[3];
  if (hour > 12 || minute > 59) return undefined;
  if (meridiem === 'am') {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }
  return hour * 60 + minute;
}

function expandDays(label: string): number[] | undefined {
  const text = label.trim().toLowerCase().replace(/\./g, '').replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
  if (text === 'daily' || text === 'every day') return [0, 1, 2, 3, 4, 5, 6];
  if (text === 'weekdays') return [1, 2, 3, 4, 5];
  if (text === 'weekends') return [0, 6];
  const parts = text.split(/\s+(?:and|&)\s+|\s+/);
  const days: number[] = [];
  for (const part of parts) {
    const range = part.split(/\s*(?:–|—|-|to)\s*/);
    if (range.length === 1) {
      const day = dayIndex[range[0]];
      if (day == null) return undefined;
      days.push(day);
      continue;
    }
    if (range.length !== 2) return undefined;
    const start = dayIndex[range[0]];
    const end = dayIndex[range[1]];
    if (start == null || end == null) return undefined;
    for (let day = start; day !== end; day = (day + 1) % 7) days.push(day);
    days.push(end);
  }
  return [...new Set(days)];
}

function parseChunk(chunk: string): Span | undefined {
  const match = chunk
    .trim()
    .match(/^([a-z][a-z ,&–—-]*?)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)|noon|midnight)\s*[–—-]\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)|noon|midnight)$/i);
  if (!match) return undefined;
  const days = expandDays(match[1]);
  const start = minutes(match[2]);
  let end = minutes(match[3]);
  if (!days || start == null || end == null) return undefined;
  if (end <= start) end += 24 * 60;
  return { days, start, end };
}

/** Returns a status only when the hours string is unambiguous. */
export function hoursStatus(hours: string | undefined, now = new Date()): HoursStatus | undefined {
  if (!hours) return undefined;
  const text = hours.trim();
  if (/vary|check|per |about|until|listing|site|approx/i.test(text)) return undefined;
  if (/24\s*hours/i.test(text)) return { open: true, label: 'Open now' };

  const parts = text
    .split(/\s*;\s*|\s*,\s*(?=(?:mon|tue|wed|thu|fri|sat|sun|daily|weekdays|weekends)\b)/i)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return undefined;
  const spans: Span[] = [];
  for (const part of parts) {
    const span = parseChunk(part);
    if (!span) return undefined;
    spans.push(span);
  }

  const clock = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const weekday = clock.find((part) => part.type === 'weekday')?.value.slice(0, 3).toLowerCase() ?? '';
  const day = dayIndex[weekday];
  const hour = Number(clock.find((part) => part.type === 'hour')?.value);
  const minute = Number(clock.find((part) => part.type === 'minute')?.value);
  if (day == null || Number.isNaN(hour) || Number.isNaN(minute)) return undefined;
  const nowMinutes = hour * 60 + minute;
  const yesterday = (day + 6) % 7;
  const open = spans.some((span) => {
    if (span.days.includes(day) && nowMinutes >= span.start && nowMinutes < span.end) return true;
    return span.days.includes(yesterday) && span.end > 24 * 60 && nowMinutes + 24 * 60 < span.end && nowMinutes < span.start;
  });
  return { open, label: open ? 'Open now' : 'Closed now' };
}
