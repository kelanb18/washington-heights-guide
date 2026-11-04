import { reference } from 'astro:content';
import { z } from 'astro/zod';
import { assertAreaSlug } from './area-slugs';
import { assertListingSlug } from './listing-slugs';
import { assertCreditedImages, creditedImageSchema } from './picture-schema';
import { categories } from './taxonomy';

export const guideSchema = z
  .strictObject({
    title: z.string().trim().min(8).max(120).describe('Guide title, such as "The best Dominican food in Washington Heights".'),
    description: z
      .string()
      .trim()
      .min(40, 'description must be at least 40 characters.')
      .max(160, 'description must be 160 characters or fewer. It is the meta description.')
      .describe('Search and social summary. Not a ranking sentence you have not earned.'),
    picks: z
      .array(
        z.strictObject({
          listing: reference('listings').describe('Slug of a file in src/content/listings/.'),
          blurb: z.string().trim().min(12).max(280).describe('Why this place is on the list, in one or two sentences.'),
          badge: z.string().trim().min(2).max(80).optional().describe('Optional label, such as "Best overall".'),
        }),
      )
      .min(1, 'A guide needs at least one pick.')
      .max(12),
    area: reference('areas').optional().describe('Optional area slug this guide is about.'),
    category: z.enum(categories).optional().describe('Optional listing category this guide is about.'),
    updated: z.coerce.date().describe('Date the ranking was last updated. YAML date: 2026-10-01.'),
    image: creditedImageSchema.optional(),
    sources: z.array(z.httpUrl()).default([]).describe('Source URLs. May be empty.'),
    example: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.example && !/\bEXAMPLE\b/.test(data.title)) {
      ctx.addIssue({
        code: 'custom',
        path: ['title'],
        input: data.title,
        message: 'Example guides must include the word EXAMPLE in the title.',
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
    data.picks.forEach((pick, index) => {
      assertListingSlug(pick.listing, ctx, ['picks', index, 'listing']);
    });
    assertAreaSlug(data.area, ctx, 'area');
    if (data.image) assertCreditedImages([data.image], ctx, ['image']);
    const verified = Date.UTC(data.updated.getUTCFullYear(), data.updated.getUTCMonth(), data.updated.getUTCDate());
    const now = new Date();
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    if (verified > today) {
      ctx.addIssue({
        code: 'custom',
        path: ['updated'],
        input: data.updated,
        message: 'updated cannot be in the future.',
      });
    }
  });
