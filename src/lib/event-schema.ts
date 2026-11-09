import { z } from 'astro/zod';
import { assertListingSlug } from './listing-slugs';

/** "2026-12-05T15:00": local New York time, no offset. */
const localDateTime = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Use local New York time as YYYY-MM-DDTHH:MM, for example 2026-12-05T15:00.');

export const eventCategories = ['music', 'film', 'theater', 'talk', 'history', 'arts', 'family', 'outdoors', 'market', 'community'] as const;

/**
 * A neighborhood event added by hand, from a venue's own calendar.
 * One file per event in src/content/events/. Parks events come from NYC Open Data and need no file.
 */
export const eventSchema = z
  .strictObject({
    title: z.string().trim().min(4).max(140).describe('Event name as the venue lists it.'),
    start: localDateTime.describe('Start, local New York time.'),
    end: localDateTime.optional().describe('End, local New York time. Optional.'),
    place: z.string().trim().min(3).max(120).describe('Venue name, for example "United Palace".'),
    address: z.string().trim().max(160).optional().describe('Street address, if the place has no listing.'),
    listing: z.string().trim().optional().describe('Slug of the venue in src/content/listings/, when it has one.'),
    category: z.enum(eventCategories),
    summary: z
      .string()
      .trim()
      .min(20)
      .max(240)
      .describe('One or two sentences in your own words. Do not copy the venue’s description.'),
    cost: z.string().trim().max(80).optional().describe('"Free", "Ticketed", "$20". Leave out if unknown.'),
    sourceUrl: z.httpUrl().describe('The official event or ticket page. Required: every event links to its source.'),
    sourceName: z.string().trim().min(2).max(80).describe('Who publishes the source page, for example "United Palace".'),
    note: z.string().trim().max(200).optional().describe('Anything a reader should check, such as conflicting times.'),
    draft: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.listing) assertListingSlug(data.listing, ctx, ['listing']);
    if (data.end && data.end < data.start) {
      ctx.addIssue({ code: 'custom', path: ['end'], input: data.end, message: 'end is before start.' });
    }
  });
