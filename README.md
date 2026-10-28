# The Heights

A fast, static guide to Washington Heights, NYC — roughly West 155th Street to the Dyckman edge of Inwood. Restaurants, cafes, bakeries, bars, shops, services, and landmarks, plus notes on smaller areas and on people and events tied to the neighborhood. Listings, areas, and people are Markdown files. Adding one is a new file and a commit.

The site is [Astro](https://astro.build) with fully static output, TypeScript, and no UI framework. A bad listing fails `npm run build`.

## Local development

Requires Node.js `22.23.4` or newer (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open the URL Astro prints (usually `http://localhost:4321`).

Dev shows entries marked `example: true` or `draft: true`, with a banner. The EXAMPLE places, the EXAMPLE area, and the EXAMPLE person are fiction: `example.com` URLs and `555` phone numbers where a listing has them. They are not real places, sections, or people.

## Build

```bash
npm run build
```

That runs `astro check` and then `astro build`. Output is the `dist/` folder.

`example: true` and `draft: true` entries are left out of this build. Category, area, and people pages still exist so the first real file has somewhere to land.

```bash
npm run preview
```

Serves `dist/` locally.

To preview a production build that still includes the placeholder entries (do not deploy this):

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

Frontmatter is YAML between `---` lines. The schema is strict: an unknown key fails the build. Use `true` and `false`, not `yes` and `no`. When you set `priceLevel`, quote it because of the dollar signs. Omit optional keys you do not know. Do not leave them empty, and do not guess.

### Required fields

| Field | What to put |
| --- | --- |
| `name` | Page title. Placeholder listings must contain the word `EXAMPLE`. A real listing must not. |
| `description` | Search and social summary. 40–170 characters. This is not the verdict. |
| `category` | `restaurant`, `cafe`, `bakery`, `bar`, `shop`, `service`, or `landmark`. Use `landmark` for a park, museum, or other place that is not one of the other categories. |
| `cuisine` | Required for restaurant, cafe, bakery, and bar. What they are known for serving, such as `Coffee` or `Dominican`. Omit on shops, services, and landmarks unless it truly applies. It also becomes a tag page. |
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
| `priceLevel` | `"$"`, `"$$"`, `"$$$"`, or `"$$$$"`. Omit it when the place is free or a price does not apply. Do not invent a dollar sign, and do not write `Free`. The card and the page leave the price off when the key is absent. |
| `rating` | Editorial note from 1 to 5, halves allowed (`4.5`). Omit it if you are not using scores. It is not a count of reviews, and it is not emitted as review structured data. |
| `area` | Slug of a file in `src/content/areas/`, without `.md`. The build fails if that file does not exist. Omit it if you do not know the section. A published listing cannot point at an example or draft area. |
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
- `priceLevel` set to anything other than `$`, `$$`, `$$$`, or `$$$$`
- `area` set to a slug that is not a file in `src/content/areas/`
- A published listing whose `area` is still an example or a draft
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

To file the place under a section, set `area` to a slug from `src/content/areas/`. Parks, museums, and similar places use `category: landmark`. Leave `priceLevel` off when there is no price.

To add a category later, edit `src/lib/taxonomy.ts`: add the id to `categories`, add a `categoryInfo` entry, and, if the place serves food or drink, add the id to `categoriesThatNeedCuisine`. The schema, nav, and category pages follow that file. A new category typed only in Markdown fails the build.

## Area format

One section, one file:

```text
src/content/areas/<slug>.md
```

The filename is the slug and the URL. `src/content/areas/sample-area.md` becomes `/areas/sample-area/`. Filename rules match listings: lowercase letters, numbers, and single hyphens, directly in `src/content/areas/`, not in a subfolder.

Copy `templates/area.md`. After the first `npm run dev` or `npm run build`, Astro writes `.astro/collections/areas.schema.json`.

`example` and `draft` default to `false` and behave like they do on a listing: dev shows them, production omits them.

### Required fields

| Field | What to put |
| --- | --- |
| `name` | Page title. Placeholder areas must contain the word `EXAMPLE`. A real area must not. |
| `summary` | One or two sentences, 40–300 characters. The page lede and the meta description. |
| `boundaries` | Approximate streets. This is not a surveyed line. |

### Optional fields

| Field | What to put |
| --- | --- |
| `parent` | Slug of a larger area this section sits inside. Omit it for a top-level area. The build fails if that file does not exist, or if areas refer to each other in a loop. |
| `order` | A number. Lower numbers are listed first. Omit it to sort by name after any numbered areas. |
| `sources` | `http(s)` URLs. An empty list is allowed. Defaults to none when omitted. |
| `example` | `true` only for obvious placeholders. Hidden on production builds. |
| `draft` | `true` hides a real area from production. Still visible in `npm run dev`. |

### Body

Markdown after the frontmatter is the write-up. The build rejects a body shorter than 200 characters.

A listing or a person appears on an area page when its `area` is that area, or a section nested inside it. The areas index nests each area under its `parent`.

### What fails the build

- Unknown frontmatter key, missing required field, or wrong type
- `parent` set to a slug that is not a file in `src/content/areas/`
- A parent chain that loops, including an area listing itself as parent
- A published area whose `parent` is still an example or a draft
- `example: true` without `EXAMPLE` in the name, or `EXAMPLE` left in the name of a real area
- A filename that is not a lowercase slug, or a file in a subfolder
- A write-up under 200 characters
- A source URL that is not `http(s)`

### Publish a new area

1. Copy `templates/area.md` to `src/content/areas/<slug>.md`.
2. Replace every placeholder, including the name, summary, boundaries, and body.
3. Set `example: false` and `draft: false`, or omit them.
4. Set `parent` only when this section sits inside another area that already has a file.
5. Run `npm run build` and commit that one Markdown file.

## People format

One person or historic event, one file:

```text
src/content/people/<slug>.md
```

`src/content/people/sample-person.md` becomes `/people/sample-person/`. Filename rules match listings. Copy `templates/person.md`. The schema file is `.astro/collections/people.schema.json` after the first build.

`example` and `draft` work the same way as on listings and areas.

### Required fields

| Field | What to put |
| --- | --- |
| `name` | Page title. Placeholder entries must contain the word `EXAMPLE`. A real entry must not. |
| `knownFor` | A short line, up to 140 characters. A role, a work, or what the event was. |
| `connection` | `current-resident`, `former-resident`, `worked-here`, or `historic-event`. This groups the index. Use `historic-event` when the subject is an event rather than a biography. |
| `summary` | One or two sentences, 40–300 characters. The page lede and the meta description. |
| `sources` | At least one `http(s)` URL. The page lists them. Do not publish a note you cannot point at. |

### Optional fields

| Field | What to put |
| --- | --- |
| `years` | Text, such as `1965` or `1900–1901`. Omit it rather than guessing. |
| `place` | A building, address, or other place name. |
| `area` | Area slug, same rules as on a listing. The note is linked from that area page, and from parent areas. |
| `example` | `true` only for obvious placeholders. Hidden on production builds. |
| `draft` | `true` hides a real note from production. Still visible in `npm run dev`. |

### Body

Markdown after the frontmatter is the note. The build rejects a body shorter than 200 characters. Only include what the sources support.

The index title is “Notable residents & history”. Notes are grouped by `connection`, then alphabetical by name.

### What fails the build

- Unknown frontmatter key, missing required field, or wrong type
- `connection` outside the list above
- `sources` missing, empty, or not `http(s)` URLs
- `area` set to a slug that is not a file in `src/content/areas/`
- A published note whose `area` is still an example or a draft
- `example: true` without `EXAMPLE` in the name, or `EXAMPLE` left in the name of a real entry
- A filename that is not a lowercase slug, or a file in a subfolder
- A write-up under 200 characters

### Publish a new person or event

1. Copy `templates/person.md` to `src/content/people/<slug>.md`.
2. Replace every placeholder, including the name, summary, sources, and body.
3. Set `example: false` and `draft: false`, or omit them.
4. Run `npm run build` and commit that one Markdown file.

## Best of guides

One ranking, one file:

```text
src/content/guides/<slug>.md
```

`src/content/guides/sample-guide.md` becomes `/best/sample-guide/`. Copy `templates/guide.md`. Filename rules match listings. `example` and `draft` work the same way. A published guide cannot point at an example or draft listing.

| Field | What to put |
| --- | --- |
| `title` | The guide title. Placeholder titles must contain `EXAMPLE`. |
| `description` | Search and social summary, 40–160 characters. |
| `picks` | Ordered list. Each item has `listing` (a slug in `src/content/listings/`), `blurb` (why it is here), and an optional `badge`. The first pick is number one. An unknown slug fails the build. |
| `updated` | Date the list was last checked. `2026-10-01`. Not in the future. |
| `sources` | `http(s)` URLs. May be empty. |

Optional: `area`, `category`, `image`, `example`, `draft`. The Markdown body is the introduction. It must be at least 200 characters.

`/best/` is the index. A guide page shows ranked cards, a map of picks that have coordinates, an updated date, and `ItemList` structured data. Listing pages say “Featured in” when a guide includes them. Area pages list guides about that area or its places.

`/category/<category>/in/<area>/` is generated only when at least two published places of that category sit in the area or a smaller section of it. Those pages are alphabetical. They are not rankings.

Listings may set `links` with `reserve`, `order`, `tickets`, and `website`. Each one that is present becomes a labeled button. `sponsored: true` still prints a Sponsored label. Neither is required, and neither is turned on for a real listing in this repo.

## Photos

Listings, areas, people, and productions can carry an optional `image`, and listings, areas, and people can also carry a `gallery`. Both use the same object:

| Field | What to put |
| --- | --- |
| `src` | `src/assets/...` (optimized at build time), a path starting with `/` for a file in `public/`, or an `http(s)` URL. |
| `alt` | What a person sees. At least 8 characters. |
| `credit` | Who made the picture. Printed beside it. |
| `license` | Short name, such as `CC BY-SA 4.0` or `Public domain`. |
| `sourceUrl` | The page the picture came from. The credit links here. Required so a Creative Commons picture stays attributed. |

Pages with no image stay as they are. A hero is shown on the detail page. Cards show a thumbnail when `image` is set. The credit and license stay visible, including on the thumbnail.

Do not add a picture you cannot credit. The repo ships one placeholder drawing, `src/assets/example-photo.svg`, on the EXAMPLE overlook and the EXAMPLE production. It is not a photograph.

## Filmed here

One production, one file:

```text
src/content/productions/<slug>.md
```

`src/content/productions/sample-picture.md` becomes `/filmed-here/sample-picture/`. Copy `templates/production.md`. Filename rules match listings. `example` and `draft` work the same way.

| Field | What to put |
| --- | --- |
| `title` | The film, episode, or video. Placeholder titles must contain `EXAMPLE`. |
| `kind` | `film`, `tv`, `music-video`, or `other`. This groups the index. |
| `year` | A number, or a short span such as `2019–2021`. |
| `locations` | At least one street or place. |
| `summary` | One or two sentences, 40–300 characters. |
| `sources` | At least one `http(s)` URL. |

Optional: `artist` (music videos), `area` (an area slug), `watchUrl`, `image`, `example`, `draft`. The body is Markdown of at least 200 characters.

The index can be grouped by kind or sorted by year. Area pages list productions whose `area` is that area or a section inside it.

`/filmed-here/` also lists film permits from [NYC Open Data](https://data.cityofnewyork.us/City-Government/Film-Permits/tg4x-b46p) (dataset `tg4x-b46p`, Mayor’s Office of Media and Entertainment). Records include a ZIP field, `zipcode_s`, often with a trailing comma or several ZIPs, plus the streets in `parkingheld`. The page keeps Manhattan permits that list 10032, 10033, or 10040 — the Washington Heights ZIPs. 10031 is mostly south of 155th Street, and 10034 is Inwood, so those are left out unless the same permit also lists one of the three. The list is fetched when the site is built and again in the browser. If the feed is down, the page says so and keeps the last built list when it has one. Permits do not name the production.

## Maps

A listing with both `latitude` and `longitude` gets a map and the Google Maps link. A listing with neither has no Map block. The home page and `/areas/` map every published listing that has coordinates. An area page maps the places filed under it and its smaller sections. Pins link to the place. The tiles are OpenStreetMap, loaded when the map is near the screen. No API key.

## Pages

| URL | Page |
| --- | --- |
| `/` | Intro, principles, editor’s picks, categories, a map of places with coordinates, areas, people, and filmed here |
| `/places/` | Every published listing, grouped by category, with links by area when areas exist |
| `/places/<slug>/` | One listing, with JSON-LD (`Restaurant`, `CafeOrCoffeeShop`, `Bakery`, `BarOrPub`, `Store`, `LocalBusiness`, or `TouristAttraction` for a landmark). The area is linked when `area` is set. Price is omitted when `priceLevel` is absent. |
| `/category/<category>/` | One category, including `landmark` |
| `/tags/<tag>/` | Static pages for each cuisine and tag in use |
| `/areas/` | Areas, nested by `parent` |
| `/areas/<slug>/` | One area: the write-up, child areas, and the places and notes filed under it or a nested section |
| `/people/` | Notable residents & history, grouped by `connection` |
| `/people/<slug>/` | One person or historic event, with `Person` or `Article` JSON-LD |
| `/filmed-here/` | Productions, grouped by kind or sorted by year, plus film permits |
| `/filmed-here/<slug>/` | One production |
| `/best/` | Editorial guides |
| `/best/<slug>/` | One ranked guide, with `ItemList` structured data |
| `/category/<category>/in/<area>/` | Alphabetical places of one category in one area, only when there are at least two |
| `/search/` | Site search |
| `/about/` | Editorial policy, affiliate disclosure, sponsorships, corrections |
| `/404.html` | Missing pages |

Each HTML page sets a title, meta description, canonical URL, Open Graph and Twitter tags, and JSON-LD where it helps. `robots.txt` points at `sitemap-index.xml`. Example and draft URLs are kept out of the sitemap. Placeholder pages are `noindex` if a preview build includes them.

## Example entries

These files are placeholders so the design and the schema can be reviewed before any real place, area, or person is added:

- `src/content/listings/example-cafe.md` — cafe, editor’s pick, sample image
- `src/content/listings/example-bakery.md` — bakery, editor’s pick, sample rating, optional fields left off
- `src/content/listings/example-kitchen.md` — sponsored restaurant with a sample affiliate link, not an editor’s pick
- `src/content/listings/example-overlook.md` — landmark with `priceLevel` omitted
- `src/content/areas/example-quarter.md` — area with an empty `sources` list
- `src/content/people/example-resident.md` — former resident, one fake source

Leave them in the repo or delete them once real files exist. Production builds omit them either way. The `/areas/` and `/people/` indexes, and every category page, still render an empty state.

## Still needs a person

- Buy or connect a domain, then set `SITE` in Vercel to that origin and redeploy.
- Import the repo in Vercel (or another static host). This repository does not deploy itself.
- Replace `corrections@example.com` in `src/lib/site.ts`. The footer and About page currently say that mailbox is not real.
- Write real listings, area notes, and people notes. The public production build is the guide’s shell until those files exist.
- Confirm `https://theheights.guide` is the name you want, if you use the default instead of `SITE`.
