import { reference } from 'astro:content';
import { z } from 'astro/zod';
import { assertAreaSlug } from './area-slugs';
import { connections } from './connections';
import { optionalText } from './schema-helpers';

export const personSchema = z
  .strictObject({
    name: z.string().trim().min(2).max(80).describe('Name as it should appear on the page.'),
    knownFor: z
      .string()
      .trim()
      .min(2)
      .max(140)
      .describe('Short line for what they are known for, or what the event was.'),
    connection: z
      .enum(connections)
      .describe('One of: current-resident, former-resident, worked-here, historic-event.'),
    years: optionalText(z.string().trim().min(2).max(80)).describe(
      'Optional years, as text, such as "1900–1901" or "1965". Omit it rather than guessing.',
    ),
    place: optionalText(z.string().trim().min(2).max(160)).describe(
      'Optional building, address, or other place name tied to the note.',
    ),
    area: reference('areas')
      .optional()
      .describe('Optional area slug from src/content/areas/. The build fails if the file does not exist.'),
    summary: z
      .string()
      .trim()
      .min(40, 'summary must be at least 40 characters, one or two sentences.')
      .max(300, 'summary must be 300 characters or fewer, one or two sentences.')
      .describe('One or two sentences. Used as the page summary and the meta description.'),
    sources: z
      .array(z.httpUrl())
      .min(1, 'List at least one source URL.')
      .describe('Pages or other http(s) URLs that support the note. At least one.'),
    example: z
      .boolean()
      .default(false)
      .describe('True for placeholder entries. Production builds omit these unless INCLUDE_EXAMPLES=true.'),
    draft: z
      .boolean()
      .default(false)
      .describe('True hides the entry from production. Local dev still shows it.'),
  })
  .superRefine((data, ctx) => {
    if (data.example && !/\bEXAMPLE\b/.test(data.name)) {
      ctx.addIssue({
        code: 'custom',
        path: ['name'],
        input: data.name,
        message:
          'Example entries must include the word EXAMPLE in the name so they cannot be mistaken for a real person or event.',
      });
    }

    if (!data.example && /\bEXAMPLE\b/.test(data.name)) {
      ctx.addIssue({
        code: 'custom',
        path: ['name'],
        input: data.name,
        message: 'Name still contains EXAMPLE. Replace it for a real entry, or set example: true for a placeholder.',
      });
    }

    assertAreaSlug(data.area, ctx, 'area');
  });
