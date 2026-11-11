import { z } from 'astro/zod';

/**
 * A Spanish translation of a neighborhood (area) page. The file name must match the English area
 * (src/content/barrios/fort-george.md translates src/content/areas/fort-george.md).
 * Photos, sources, maps and nesting come from the English area.
 */
export const areaTranslationSchema = z.strictObject({
  name: z.string().trim().min(2).max(80).describe('Translated name. Keep proper nouns as they are.'),
  summary: z
    .string()
    .trim()
    .min(40)
    .max(300, 'summary must be 300 characters or fewer.')
    .describe('Translated summary. Used as the meta description.'),
  boundaries: z.string().trim().min(3).max(400).describe('Translated approximate streets.'),
  translated: z.coerce.date().describe('Date this translation was last checked against the English area.'),
});
