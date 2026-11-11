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
          affiliate: z
            .strictObject({
              href: z.httpUrl().describe('Exact affiliate URL, with every tracking parameter kept.'),
              label: z.string().trim().min(4).max(80).describe('Anchor text for the link.'),
            })
            .optional()
            .describe('Optional affiliate link shown after the blurb. Set affiliateDisclosure: true on the guide when used.'),
        }),
      )
      .max(12)
      .default([]),
    stays: z
      .array(
        z.strictObject({
          name: z.string().trim().min(2).max(80).describe('Hotel or inn name.'),
          address: z.string().trim().min(5).max(120).describe('Street address as the official site gives it, such as "2420 Amsterdam Ave".'),
          neighborhood: z.string().trim().min(2).max(60).describe('Neighborhood the place is in, such as "Harlem".'),
          nearby: z.boolean().default(false).describe('True for places outside Washington Heights; labeled "Nearby".'),
          blurb: z.string().trim().min(12).max(480).describe('What to know, from the official site or a named source.'),
          website: z.httpUrl().describe('The official website.'),
          badge: z.string().trim().min(2).max(80).optional(),
          image: creditedImageSchema.optional().describe('A freely licensed, credited photo of the place.'),
          linkPlaceholder: z
            .string()
            .trim()
            .min(4)
            .max(120)
            .optional()
            .describe('Marks where an unapproved booking link will go. Shown only in local dev, never in production.'),
        }),
      )
      .max(12)
      .default([])
      .describe('Places to stay. Hotels are not listings, so they live here instead of in picks.'),
    route: z
      .enum(['north-to-south', 'as-listed'])
      .default('north-to-south')
      .describe(
        'Stop order for the Google Maps walking route. "north-to-south" sorts by cross street so a ranked list walks without doubling back; "as-listed" keeps the picks order, for itineraries.',
      ),
    area: reference('areas').optional().describe('Optional area slug this guide is about.'),
    category: z.enum(categories).optional().describe('Optional listing category this guide is about.'),
    updated: z.coerce.date().describe('Date the ranking was last updated. YAML date: 2026-10-01.'),
    image: creditedImageSchema.optional(),
    sources: z.array(z.httpUrl()).default([]).describe('Source URLs. May be empty.'),
    affiliateDisclosure: z
      .boolean()
      .default(false)
      .describe('Show the affiliate commission disclosure near the top of the page.'),
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
    if (data.picks.length === 0 && data.stays.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['picks'],
        input: data.picks,
        message: 'A guide needs at least one pick or one stay.',
      });
    }
    data.picks.forEach((pick, index) => {
      assertListingSlug(pick.listing, ctx, ['picks', index, 'listing']);
    });
    if (data.picks.some((pick) => pick.affiliate) && !data.affiliateDisclosure) {
      ctx.addIssue({
        code: 'custom',
        path: ['affiliateDisclosure'],
        input: data.affiliateDisclosure,
        message: 'A guide with an affiliate link needs affiliateDisclosure: true.',
      });
    }
    assertAreaSlug(data.area, ctx, 'area');
    if (data.image) assertCreditedImages([data.image], ctx, ['image']);
    data.stays.forEach((stay, index) => {
      if (stay.image) assertCreditedImages([stay.image], ctx, ['stays', index, 'image']);
    });
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
