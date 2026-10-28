import { reference } from 'astro:content';
import { z } from 'astro/zod';
import { assertAreaSlug } from './area-slugs';
import { assertCreditedImages, creditedImageSchema } from './picture-schema';
import { optionalText } from './schema-helpers';

export const productionKinds = ['film', 'tv', 'music-video', 'other'] as const;

export type ProductionKind = (typeof productionKinds)[number];

export const productionKindInfo: Record<ProductionKind, { label: string; plural: string }> = {
  film: { label: 'Film', plural: 'Films' },
  tv: { label: 'Television', plural: 'Television' },
  'music-video': { label: 'Music video', plural: 'Music videos' },
  other: { label: 'Other', plural: 'Other' },
};

const yearSchema = z.union([
  z.number().int().min(1800).max(2100),
  z.string().trim().min(2).max(40),
]);

export const productionSchema = z
  .strictObject({
    title: z.string().trim().min(2).max(120).describe('Title of the film, episode, or video.'),
    kind: z.enum(productionKinds).describe('One of: film, tv, music-video, other.'),
    year: yearSchema.describe('A year, or a short span such as "2019–2021".'),
    artist: optionalText(z.string().trim().min(2).max(120)).describe('Optional. The artist, for a music video.'),
    locations: z
      .array(z.string().trim().min(3).max(160))
      .min(1, 'List at least one place where it was filmed.')
      .max(12)
      .describe('Streets or places, such as "W 181st St & Fort Washington Ave".'),
    area: reference('areas')
      .optional()
      .describe('Optional area slug. The note is linked from that area page.'),
    summary: z
      .string()
      .trim()
      .min(40, 'summary must be at least 40 characters.')
      .max(300, 'summary must be 300 characters or fewer.')
      .describe('One or two sentences for the page lede and the meta description.'),
    watchUrl: optionalText(z.httpUrl()).describe('Optional official trailer, episode, or music video URL.'),
    sources: z.array(z.httpUrl()).min(1, 'List at least one source URL.'),
    image: creditedImageSchema.optional().describe('Optional hero image, with credit and a source link.'),
    example: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.example && !/\bEXAMPLE\b/.test(data.title)) {
      ctx.addIssue({
        code: 'custom',
        path: ['title'],
        input: data.title,
        message: 'Example productions must include the word EXAMPLE in the title.',
      });
    }
    if (!data.example && /\bEXAMPLE\b/.test(data.title)) {
      ctx.addIssue({
        code: 'custom',
        path: ['title'],
        input: data.title,
        message: 'Title still contains EXAMPLE. Replace it, or set example: true.',
      });
    }
    assertAreaSlug(data.area, ctx, 'area');
    if (data.image) assertCreditedImages([data.image], ctx, ['image']);
  });
