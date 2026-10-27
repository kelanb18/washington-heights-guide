# The Heights

A fast, static guide to the best spots in Washington Heights, NYC — roughly West 155th Street to the Dyckman edge of Inwood. Restaurants, cafes, bakeries, bars, shops, and services. Listings are Markdown files. Adding a place is one new file and a commit.

The site is [Astro](https://astro.build) with fully static output, TypeScript, and no UI framework. A bad listing fails `npm run build`.

## Local development

Requires Node.js `22.23.4` or newer (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open the URL Astro prints (usually `http://localhost:4321`).

Dev shows listings marked `example: true` or `draft: true`, with a banner. The three EXAMPLE places are fiction: `example.com` URLs and `555` phone numbers. They are not real businesses.

## Build

```bash
npm run build
```

That runs `astro check` and then `astro build`. Output is the `dist/` folder.

`example: true` and `draft: true` listings are left out of this build. Category pages still exist so the first real file has somewhere to land.

```bash
npm run preview
```

Serves `dist/` locally.

To preview a production build that still includes the placeholder listings (do not deploy this):

```bash
npm run build:examples
```

## Deploy on Vercel

The project is ready for a static deploy. Nothing here is connected to Vercel.

1. Import this repository in Vercel.
2. Framework preset: **Astro**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Node.js 22.23.4 or newer.
6. Set the `SITE` environment variable to the public origin, with no trailing slash, for Production (and Preview, if you want those URLs to match). Example: `https://theheights.guide`.
7. Leave `INCLUDE_EXAMPLES` unset.

No `vercel.json` and no adapter. Astro’s static output is the whole site. Canonical URLs, Open Graph tags, `robots.txt`, and the sitemap are baked in at build time, so change `SITE` and rebuild when the domain changes.

The default origin, when `SITE` is unset, is `https://theheights.guide`. That domain is a placeholder until someone owns it and sets `SITE`.

## Listing format

One place, one file:

```text
src/content/listings/<slug>.md
```

The filename is the slug and the URL. `src/content/listings/fort-washington-cafe.md` becomes `/places/fort-washington-cafe/`.

Filename rules:

- Lowercase letters, numbers, and single hyphens: `fort-washington-cafe.md`
- No spaces, underscores, or uppercase
- The file sits directly in `src/content/listings/`, not in a subfolder
- Keep the slug stable after publish. Renaming the file changes the URL

Copy `templates/listing.md` rather than inventing the shape. After the first `npm run dev` or `npm run build`, Astro writes a JSON Schema to `.astro/collections/listings.schema.json`. The template points at it for editor hints.

Frontmatter is YAML between `---` lines. The schema is strict: an unknown key fails the build. Use `true` and `false`, not `yes` and `no`. Quote `priceLevel` because of the dollar signs. Omit optional keys you do not know. Do not leave them empty, and do not guess.

### Required fields

| Field | What to put |
| --- | --- |
| `name` | Page title. Placeholder listings must contain the word `EXAMPLE`. A real listing must not. |
| `description` | Search and social summary. 40–170 characters. This is not the verdict. |
| `category` | `restaurant`, `cafe`, `bakery`, `bar`, `shop`, or `service`. |
| `cuisine` | Required for restaurant, cafe, bakery, and bar. What they are known for serving, such as `Coffee` or `Dominican`. Omit on shops and services unless it truly applies. It also becomes a tag page. |
| `priceLevel` | `"$"`, `"$$"`, `"$$$"`, or `"$$$$"`. |
| `address` | Street address only. The site adds New York, NY. |
| `crossStreets` | Nearest crossing, such as `W 181st St & St. Nicholas Ave`. |
| `lastVerified` | Date you checked the address, hours, and that it was open. `2026-10-01`. Not in the future. |
| `verdict` | One-line opinion, 12–160 characters. Shown under the name. Not for sale. |

`neighborhood` defaults to `Washington Heights` when omitted. `example`, `draft`, `sponsored`, and `pick` default to `false`.

### Optional fields

| Field | What to put |
| --- | --- |
| `example` | `true` only for obvious placeholders. Hidden on production builds. |
| `draft` | `true` hides a real listing from production. Still visible in `npm run dev`. |
| `sponsored` | `true` when the placement was paid. The site prints **Sponsored** on the listing and on every list that includes it. Do not soften the verdict. |
| `pick` | `true` features it on the home page as an editor’s pick. Payment does not earn this. |
| `rating` | Editorial note from 1 to 5, halves allowed (`4.5`). Omit it if you are not using scores. It is not a count of reviews, and it is not emitted as review structured data. |
| `tags` | Up to 8 short labels (`espresso`, `dinner`). Each becomes `/tags/<slug>/`. |
| `postalCode` | 5-digit ZIP, if you know it. |
| `latitude`, `longitude` | Decimal degrees of the entrance. Set both, or omit both. |
| `website` | The business’s own `https://` URL. Not a referral link. |
| `phone` | Digits, spaces, parentheses, plus, or dashes. |
| `hours` | Human text, such as `Tue–Sun, 11am–10pm`. Shown on the page. It is not converted into schema.org opening hours. |
| `affiliateLinks` | Up to 4 objects: `label` and `url`. Rendered separately and labeled **Affiliate link** with `rel="sponsored"`. |
| `images` | Up to 4 objects: `src` and `alt`. `src` is `/images/...` (a file in `public/`) or an `http(s)` URL. `alt` is a real description, at least 8 characters. |

### Body

Markdown after the frontmatter is the write-up. The build rejects a body shorter than 200 characters.

Cover four things, in this order, as in the template:

1. What it is
2. Who it's for
3. Standout details
4. Honest verdict

Only include what was checked. Do not invent hours, dishes, or history to make a page sound finished. Keep referral links in `affiliateLinks`, not in the prose.

### What fails the build

Astro validates every file in `src/content/listings/` when you build or run dev. The command exits non-zero. Typical failures:

- Unknown frontmatter key, missing required field, or wrong type
- `category` outside the list above
- Restaurant, cafe, bakery, or bar with no `cuisine`
- `description` or `verdict` too short or too long
- `website` or an affiliate URL that is not `http(s)`
- `lastVerified` in the future
- `example: true` without `EXAMPLE` in the name, or `EXAMPLE` left in the name of a real listing
- Only one of `latitude` / `longitude`
- A filename that is not a lowercase slug, or a file in a subfolder
- A write-up under 200 characters
- An image `src` pointing at a file that is not in `public/`

`npm run dev` surfaces the same schema errors. `npm run build` is the check to run before you commit.

## Publish a new listing

1. Copy `templates/listing.md` to `src/content/listings/<slug>.md`.
2. Pick a stable lowercase slug. The filename is the public URL.
3. Replace every placeholder value, including the address, phone, links, verdict, and body.
4. Set `example: false` and `draft: false`. Omit them if you prefer; both default to false. A file still named like the template, or still containing `EXAMPLE` in the name, will not pass as a real listing.
5. Set `sponsored: true` only when someone paid for the placement. Leave the verdict as the honest one. The templates and the About page describe the label the site adds; you do not badge it by hand.
6. Put any referral URL in `affiliateLinks`. Put the business’s own site in `website`.
7. Set `lastVerified` to the day you checked the details.
8. Write the body (what it is, who it is for, standout details, honest verdict).
9. Optional: add an image under `public/images/` and point `images` at it. Or delete the `images` key.
10. Run `npm run build` from the repository root and fix every reported error.
11. Commit that Markdown file, plus the image if you added one, and push to the branch that deploys.

Do not edit unrelated listings in the same commit.

To add a category later, edit `src/lib/taxonomy.ts`: add the id to `categories`, add a `categoryInfo` entry, and, if the place serves food or drink, add the id to `categoriesThatNeedCuisine`. The schema, nav, and category pages follow that file. A new category typed only in Markdown fails the build.

## Pages

| URL | Page |
| --- | --- |
| `/` | Intro, principles, editor’s picks, categories |
| `/places/` | Every published listing, grouped by category |
| `/places/<slug>/` | One listing, with `LocalBusiness` JSON-LD (Restaurant, CafeOrCoffeeShop, Bakery, BarOrPub, Store, or LocalBusiness) |
| `/category/<category>/` | One category |
| `/tags/<tag>/` | Static pages for each cuisine and tag in use |
| `/about/` | Editorial policy, affiliate disclosure, sponsorships, corrections |
| `/404.html` | Missing pages |

Each HTML page sets a title, meta description, canonical URL, Open Graph and Twitter tags, and JSON-LD where it helps. `robots.txt` points at `sitemap-index.xml`. Example and draft URLs are kept out of the sitemap. Placeholder pages are `noindex` if a preview build includes them.

## Example listings

These three files are placeholders so the design and the schema can be reviewed before any real place is added:

- `src/content/listings/example-cafe.md` — cafe, editor’s pick, sample image
- `src/content/listings/example-bakery.md` — bakery, editor’s pick, sample rating, optional fields left off
- `src/content/listings/example-kitchen.md` — sponsored restaurant with a sample affiliate link, not an editor’s pick

Leave them in the repo or delete them once real listings exist. Production builds omit them either way.

## Still needs a person

- Buy or connect a domain, then set `SITE` in Vercel to that origin and redeploy.
- Import the repo in Vercel (or another static host). This repository does not deploy itself.
- Replace `corrections@example.com` in `src/lib/site.ts`. The footer and About page currently say that mailbox is not real.
- Write real listings. The public production build is the guide’s shell until those files exist.
- Confirm `https://theheights.guide` is the name you want, if you use the default instead of `SITE`.
