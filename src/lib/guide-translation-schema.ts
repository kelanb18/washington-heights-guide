import { z } from 'astro/zod';

/**
 * A translation of a best-of guide. The file name must match the English guide
 * (src/content/guias/best-brunch-washington-heights.md translates
 * src/content/guides/best-brunch-washington-heights.md), and picks must name the same
 * listings in the same order. Listings, hours, and routes come from the English guide.
 */
export const guideTranslationSchema = z.strictObject({
  title: z.string().trim().min(8).max(120).describe('Translated guide title.'),
  description: z
    .string()
    .trim()
    .min(40)
    .max(160, 'description must be 160 characters or fewer. It is the meta description.')
    .describe('Translated search and social summary.'),
  picks: z
    .array(
      z.strictObject({
        listing: z.string().trim().describe('Same listing slug as the English pick at this position.'),
        blurb: z.string().trim().min(12).max(320).describe('Translated blurb.'),
        badge: z.string().trim().min(2).max(80).optional().describe('Translated badge.'),
      }),
    )
    .min(1),
  translated: z.coerce.date().describe('Date this translation was last checked against the English guide.'),
});
