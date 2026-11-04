import { z } from 'astro/zod';
import rawSightings from '../data/sightings.json';

export const sightingSourceTypes = ['x', 'instagram', 'reddit', 'tiktok', 'news', 'tracker', 'other'] as const;

export type SightingSourceType = (typeof sightingSourceTypes)[number];

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.');

function realDay(value: string): boolean {
  const [year, month, date] = value.split('-').map(Number);
  if (!year || !month || !date) return false;
  const utc = new Date(Date.UTC(year, month - 1, date));
  return utc.getUTCFullYear() === year && utc.getUTCMonth() === month - 1 && utc.getUTCDate() === date;
}

const sourceLink = z.strictObject({
  url: z.httpUrl(),
  sourceType: z.enum(sightingSourceTypes),
  poster: z.string().trim().min(2).max(120).optional(),
});

export const sightingSchema = z
  .strictObject({
    date: day,
    endDate: day.optional(),
    location: z.string().trim().min(3).max(200),
    area: z.string().trim().min(2).max(120).optional(),
    title: z.string().trim().min(2).max(120),
    kind: z.string().trim().min(2).max(40).optional(),
    summary: z.string().trim().min(40).max(500),
    sourceUrl: z.httpUrl(),
    sourceType: z.enum(sightingSourceTypes),
    poster: z.string().trim().min(2).max(120).optional(),
    confidence: z.enum(['confirmed', 'resident-reported', 'multiple-reports', 'multiple reports']),
    signageCode: z.string().trim().min(2).max(40).optional(),
    permitMatch: z.string().trim().min(2).max(300).optional(),
    additionalSources: z.array(sourceLink).max(8).optional(),
    notes: z.string().trim().min(2).max(240).optional(),
    latitude: z.number().gte(40.82).lte(40.88).optional(),
    longitude: z.number().gte(-73.97).lte(-73.91).optional(),
  })
  .superRefine((data, ctx) => {
    if (!realDay(data.date)) {
      ctx.addIssue({ code: 'custom', path: ['date'], input: data.date, message: 'date is not a real calendar day.' });
    }
    if (data.endDate && !realDay(data.endDate)) {
      ctx.addIssue({ code: 'custom', path: ['endDate'], input: data.endDate, message: 'endDate is not a real calendar day.' });
    }
    if (data.endDate && data.endDate < data.date) {
      ctx.addIssue({ code: 'custom', path: ['endDate'], input: data.endDate, message: 'endDate is before date.' });
    }
    const hasLat = data.latitude != null;
    const hasLng = data.longitude != null;
    if (hasLat !== hasLng) {
      ctx.addIssue({
        code: 'custom',
        path: ['latitude'],
        input: data.latitude,
        message: 'latitude and longitude must be set together.',
      });
    }
  });

export type Sighting = z.infer<typeof sightingSchema>;

export const sightings: Sighting[] = z.array(sightingSchema).min(1).parse(rawSightings);

/** The guide's southern boundary is about W 155th. These stay in the list and are labeled, not dropped. */
export function isSouthEdge(area: string | undefined): boolean {
  return !!area && area.toLowerCase().startsWith('south edge');
}
