import { z } from 'astro/zod';
import { assertListingSlug } from './listing-slugs';
import { optionalNumber, optionalText } from './schema-helpers';

/**
 * A place you can stand today: a filming location, or a site tied to a historic event.
 * Give either `listing` (a place on this site, which supplies the pin) or both coordinates.
 */
export const stopSchema = z
  .strictObject({
    name: z.string().trim().min(2).max(100).describe('Short name, such as "Highbridge Pool".'),
    where: optionalText(z.string().trim().min(3).max(120)).describe(
      'Optional street corner or address, such as "W 175th St & Audubon Ave".',
    ),
    note: z
      .string()
      .trim()
      .min(10)
      .max(400)
      .describe('One or two sentences: what happened or was filmed here, and what you see today.'),
    listing: optionalText(z.string().trim()).describe('Optional slug of a place in src/content/listings/.'),
    latitude: optionalNumber(z.number().min(40.4).max(41.1)),
    longitude: optionalNumber(z.number().min(-74.3).max(-73.6)),
  })
  .superRefine((data, ctx) => {
    assertListingSlug(data.listing, ctx, ['listing']);
    const hasCoords = data.latitude != null && data.longitude != null;
    if (!data.listing && !hasCoords) {
      ctx.addIssue({
        code: 'custom',
        path: ['latitude'],
        message: 'Give a listing slug, or both latitude and longitude, so the stop can go on the map.',
      });
    }
  });

export type Stop = z.infer<typeof stopSchema>;

export const stopsField = z
  .array(stopSchema)
  .max(12)
  .default([])
  .describe('Optional places to visit today, shown as a numbered list with a map.');
