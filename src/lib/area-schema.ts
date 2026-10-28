import { reference } from 'astro:content';
import { z } from 'astro/zod';
import { assertAreaSlug } from './area-slugs';
import { optionalNumber } from './schema-helpers';

export const areaSchema = z
  .strictObject({
    name: z.string().trim().min(2).max(80).describe('Name as it should appear on the page.'),
    parent: reference('areas')
      .optional()
      .describe(
        'Slug of a larger area this section sits inside. Omit it for a top-level area. The build fails if that file does not exist, or if areas refer to each other in a loop.',
      ),
    summary: z
      .string()
      .trim()
      .min(40, 'summary must be at least 40 characters, one or two sentences.')
      .max(300, 'summary must be 300 characters or fewer, one or two sentences.')
      .describe('One or two sentences. Used as the page summary and the meta description.'),
    boundaries: z
      .string()
      .trim()
      .min(3)
      .max(200)
      .describe('Approximate streets, such as "Sample Street to Placeholder Avenue".'),
    order: optionalNumber(z.number()).describe(
      'Optional sort position. Lower numbers are listed first. Omit it to sort by name after the numbered areas.',
    ),
    sources: z
      .array(z.httpUrl())
      .default([])
      .describe('Source URLs. An empty list is allowed.'),
    example: z
      .boolean()
      .default(false)
      .describe('True for placeholder areas. Production builds omit these unless INCLUDE_EXAMPLES=true.'),
    draft: z
      .boolean()
      .default(false)
      .describe('True hides the area from production. Local dev still shows it.'),
  })
  .superRefine((data, ctx) => {
    if (data.example && !/\bEXAMPLE\b/.test(data.name)) {
      ctx.addIssue({
        code: 'custom',
        path: ['name'],
        input: data.name,
        message: 'Example areas must include the word EXAMPLE in the name so they cannot be mistaken for a real section.',
      });
    }

    if (!data.example && /\bEXAMPLE\b/.test(data.name)) {
      ctx.addIssue({
        code: 'custom',
        path: ['name'],
        input: data.name,
        message: 'Name still contains EXAMPLE. Replace it for a real area, or set example: true for a placeholder.',
      });
    }

    assertAreaSlug(data.parent, ctx, 'parent');
  });
