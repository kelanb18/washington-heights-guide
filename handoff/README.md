# Handoff

Unpublished content staged for the site. Nothing in this folder is wired into pages, content collections, or `public/`. It is here so the files live in GitHub until a later change publishes them.

Astro only loads Markdown from `src/content/` and static files from `public/`. `handoff/` is outside both, so `npm run build` does not pick it up.

`queue/media-batch1/` was not copied. That batch is already on `main` via PR #7.

## Folders

| Folder | Files | What it is |
| --- | ---: | --- |
| `guides1/` | 12 | Best-of guides in `guides1/guides/`. No `gen.py` in this folder. |
| `guides1-generator/` | 2 | `gen.py` and `data.py`, copied from `heights/guides1-generator/`. |
| `photos2/` | 209 | `photos.json` (206 records), `coverage.json`, `README.md`, and 206 WebP files under `images/`, including 10 in `images/site/hero/`. Wikimedia Commons only (CC0, public domain, CC BY, or CC BY-SA). |
| `daily-2026-11-04/` | 7 | Three new listings plus source notes and an empty `READY` marker: `the-plug`, `kismat-indian-restaurant`, `cabrini-wines-and-spirits`. Cabrini’s photo is the Wikimedia URL in that listing’s frontmatter. There is no local image file for these three. |
| `sightings1/` | 4 | `sightings.json` (28 records, compiled 2026-10-28), its `README.md`, and `tools/permit_check.py` and `tools/scan_olv_docs.py`. |

## Open pull requests

- **#9** ([Add Best of guides](https://github.com/kelanb18/washington-heights-guide/pull/9)) is already one commit ahead of current `main` (it includes #7). It does not need a rebase.
- **#10** ([Refresh the site as a local publication](https://github.com/kelanb18/washington-heights-guide/pull/10)) is still based on the guides branch from before #7, and GitHub reports a conflict. It needs a rebase onto `main`.
- **#8** ([Add resident film-shoot sightings to Filmed here](https://github.com/kelanb18/washington-heights-guide/pull/8)) was closed without merging. `main` already has `src/data/sightings.json` from #7, so this staged `sightings1/` set may duplicate what #7 shipped.

## Listings still missing photos

`photos2/coverage.json` counts 65 listings, 26 with a thumbnail, and **39 missing**:

- `anthony-flowers`
- `bike-by-gato`
- `boogie-bakery-and-bistro`
- `burger-heights`
- `buunni-coffee-pinehurst`
- `carrot-top-pastries`
- `club-deportivo-dominicano`
- `el-floridita`
- `el-manantial-bakery`
- `el-panadero-bakery`
- `falafel-crunch`
- `georges-pizzaria`
- `guac-time-mexican-grill`
- `hilltop-park-alehouse`
- `l-chingon-mexican-cuisine`
- `la-casa-del-mofongo`
- `la-dinastia`
- `la-reina-del-chicharron`
- `le-cheile`
- `legacy-bar-and-grill`
- `lulo-restaurant`
- `malecon`
- `mannys-bicycle`
- `manolo-tapas`
- `marilu-and-daysi`
- `native-noodles`
- `niccolo-pizzeria`
- `radio-restaurant`
- `saggio`
- `salento-colombian-coffee-and-kitchen`
- `sisters-uptown-bookstore`
- `studio-in-the-heights`
- `sushi-heights`
- `talkin-tacos`
- `tampopo-ramen`
- `tasty-deli`
- `the-uptown-garrison`
- `tinto-tapas`
- `word-up-community-bookshop`
