import { z } from 'astro/zod';
import { categories, categoriesThatNeedCuisine, priceLevels, slugify } from './taxonomy';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function optionalText<T extends z.ZodType>(schema: T) {
  return z
    .union([schema, z.literal(''), z.null()])
    .optional()
    .transform((value) => (value == null || value === '' ? undefined : value));
}

function optionalNumber(schema: z.ZodNumber) {
  return z
    .union([schema, z.null()])
    .optional()
    .transform((value) => (value == null ? undefined : value));
}

const imageSrc = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => {
      if (value.includes('..') || /\s/.test(value)) return false;
      if (value.startsWith('/') && !value.startsWith('//')) return true;
      return /^https?:\/\//.test(value);
    },
    'Image src must be a site path starting with / (a file in public/) or an http(s) URL.',
  );

export const listingSchema = z
  .strictObject({
    name: z
      .string()
      .trim()
      .min(2)
      .max(80)
      .describe('Name as it should appear on the page.'),
    description: z
      .string()
      .trim()
      .min(40, 'description must be at least 40 characters so the page summary is useful.')
      .max(170, 'description must be 170 characters or fewer. It is the SEO and social summary.')
      .describe('One or two sentences for the meta description and social cards. Not the verdict.'),
    example: z
      .boolean()
      .default(false)
      .describe('True for placeholder listings. Production builds omit these unless INCLUDE_EXAMPLES=true.'),
    draft: z
      .boolean()
      .default(false)
      .describe('True hides the listing from production. Local dev still shows it.'),
    sponsored: z
      .boolean()
      .default(false)
      .describe('True when the placement was paid. The site labels it. This does not change the verdict.'),
    pick: z
      .boolean()
      .default(false)
      .describe('True features the listing on the home page as an editor’s pick.'),
    rating: optionalNumber(z.number().min(1).max(5).multipleOf(0.5)).describe(
      'Optional editorial note from 1 to 5, halves allowed. Omit it if you are not using scores. Not a review count.',
    ),
    category: z.enum(categories).describe(`One of: ${categories.join(', ')}.`),
    cuisine: optionalText(z.string().trim().min(2).max(40)).describe(
      'Required for restaurant, cafe, bakery, and bar. What they are known for serving. Omit for shops and services unless it truly applies.',
    ),
    tags: z
      .array(z.string().trim().min(1).max(40))
      .max(8, 'Use at most 8 tags.')
      .default([])
      .describe('Short filters such as espresso, dinner, or hardware. Lowercase is fine.'),
    priceLevel: z.enum(priceLevels).describe('$, $$, $$$, or $$$$. Quote the value in YAML.'),
    address: z
      .string()
      .trim()
      .min(5)
      .max(120)
      .describe('Street address only. Do not include city or state; the site adds New York, NY.'),
    crossStreets: z
      .string()
      .trim()
      .min(3)
      .max(80)
      .describe('Nearest cross streets, such as "W 181st St & St. Nicholas Ave".'),
    neighborhood: z
      .string()
      .trim()
      .min(2)
      .max(60)
      .default('Washington Heights')
      .describe('Washington Heights, or a local name such as Hudson Heights.'),
    postalCode: optionalText(z.string().regex(/^\d{5}$/, 'postalCode must be a 5-digit ZIP code.')).describe(
      'Optional 5-digit ZIP code.',
    ),
    latitude: optionalNumber(z.number().gte(-90).lte(90)).describe(
      'Optional decimal latitude. Set longitude too, or omit both.',
    ),
    longitude: optionalNumber(z.number().gte(-180).lte(180)).describe(
      'Optional decimal longitude. Set latitude too, or omit both.',
    ),
    website: optionalText(z.httpUrl()).describe('The business’s own website, not an affiliate link.'),
    phone: optionalText(
      z
        .string()
        .trim()
        .regex(/^[0-9+().\-\s]{7,24}$/, 'phone may contain digits, spaces, parentheses, plus, and dashes only.'),
    ).describe('Optional phone number.'),
    hours: optionalText(z.string().trim().min(3).max(160)).describe(
      'Optional human-readable hours, such as "Tue–Sun, 11am–10pm". Shown on the page, not as schema.org opening hours.',
    ),
    lastVerified: z.coerce
      .date()
      .describe('Date the address, hours, and open/closed status were last checked. YAML date: 2026-10-01.'),
    verdict: z
      .string()
      .trim()
      .min(12, 'verdict must be a one-line opinion of at least 12 characters.')
      .max(160, 'verdict must be one line, 160 characters or fewer.')
      .describe('The one-line opinion shown under the name. Not for sale.'),
    affiliateLinks: z
      .array(
        z.strictObject({
          label: z.string().trim().min(2).max(80),
          url: z.httpUrl(),
        }),
      )
      .max(4)
      .default([])
      .describe('Optional referral links. Each is labeled "Affiliate link" on the page. Do not put these in the body.'),
    images: z
      .array(
        z.strictObject({
          src: imageSrc,
          alt: z.string().trim().min(8).max(180),
        }),
      )
      .max(4)
      .default([])
      .describe('Optional images. src is /images/... under public/, or an http(s) URL. alt is required.'),
  })
  .superRefine((data, ctx) => {
    if (data.example && !/\bEXAMPLE\b/.test(data.name)) {
      ctx.addIssue({
        code: 'custom',
        path: ['name'],
        input: data.name,
        message: 'Example listings must include the word EXAMPLE in the name so they cannot be mistaken for a real business.',
      });
    }

    if (!data.example && /\bEXAMPLE\b/.test(data.name)) {
      ctx.addIssue({
        code: 'custom',
        path: ['name'],
        input: data.name,
        message: 'Name still contains EXAMPLE. Replace it for a real listing, or set example: true for a placeholder.',
      });
    }

    if (categoriesThatNeedCuisine.includes(data.category) && !data.cuisine) {
      ctx.addIssue({
        code: 'custom',
        path: ['cuisine'],
        input: data.cuisine,
        message: `A ${data.category} listing must set cuisine (what they are known for serving).`,
      });
    }

    const labels = [...data.tags];
    if (data.cuisine) labels.push(data.cuisine);
    for (const [index, label] of data.tags.entries()) {
      if (!slugify(label) || !slugPattern.test(slugify(label))) {
        ctx.addIssue({
          code: 'custom',
          path: ['tags', index],
          input: label,
          message: `Tag "${label}" cannot become a URL slug. Use letters or numbers.`,
        });
      }
    }
    if (data.cuisine && !slugPattern.test(slugify(data.cuisine))) {
      ctx.addIssue({
        code: 'custom',
        path: ['cuisine'],
        input: data.cuisine,
        message: 'cuisine cannot become a URL slug. Use letters or numbers.',
      });
    }

    const hasLatitude = data.latitude != null;
    const hasLongitude = data.longitude != null;
    if (hasLatitude !== hasLongitude) {
      ctx.addIssue({
        code: 'custom',
        path: [hasLatitude ? 'longitude' : 'latitude'],
        input: hasLatitude ? data.longitude : data.latitude,
        message: 'Set both latitude and longitude, or omit both.',
      });
    }

    const verifiedDay = Date.UTC(
      data.lastVerified.getUTCFullYear(),
      data.lastVerified.getUTCMonth(),
      data.lastVerified.getUTCDate(),
    );
    const now = new Date();
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    if (verifiedDay > today) {
      ctx.addIssue({
        code: 'custom',
        path: ['lastVerified'],
        input: data.lastVerified,
        message: 'lastVerified cannot be in the future.',
      });
    }
  });
