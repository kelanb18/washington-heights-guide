# Sightings: weekly update

Resident reports and press reports of film shoots live in `src/data/sightings.json`. `/filmed-here/` merges them with NYC film permits. Do not add an example row. Dedupe against `sourceUrl` before adding a record.

## Fields

| Field | Required | What to put |
| --- | --- | --- |
| `date` | yes | `YYYY-MM-DD`. The shoot date when a sign or permit gives it. Otherwise the post date, and say so in `summary`. |
| `endDate` | no | Last day, when the shoot runs more than one day. |
| `location` | yes | Cross streets, or the most specific place the source gives. |
| `area` | no | A short place label, not an area-page slug. Records at the guide’s southern boundary (about West 155th to 158th Street) keep an `area` that starts with `south edge`. The page marks those South edge and does not drop them. |
| `title` | yes | The production name when a post, sign, news item, or the OLV list names it. Otherwise `unidentified shoot`. |
| `kind` | no | As the source describes it, such as `TV series`, `feature film`, `short film`, `music video`, or `unknown`. |
| `summary` | yes | What was reported, including dates that are only the post date and any disagreement between sources. |
| `sourceUrl` | yes | The post, article, or tracker doc. |
| `sourceType` | yes | `x`, `instagram`, `reddit`, `tiktok`, `news`, `tracker`, or `other`. |
| `poster` | no | Who posted it. |
| `confidence` | yes | `confirmed` when a news item or a same-day `tg4x-b46p` permit covers the stated block. `multiple reports` when more than one report agrees and a permit does not settle it. `resident-reported` for a single neighbor’s post. |
| `signageCode` | no | The project name printed on a no-parking sign. The page shows it as “Sign code” plus that name. |
| `permitMatch` | no | The `tg4x-b46p` event id, dates, and category, or a sentence that none was found. Six-digit event ids become links to that permit record. |
| `additionalSources` | no | Extra links: `{ "url", "sourceType", "poster" }`. |
| `notes` | no | A caveat that should stay visible, such as an ambiguous location. |
| `latitude`, `longitude` | no | Only if both are known. Otherwise the page pins a corner only when the cross streets match a corner already saved in `src/lib/cross-streets.ts`. It does not geocode at build time or in the browser. |

## Weekly update recipe

About ten tool calls.

1. X: `from:olv "Filming Locations" -is:retweet` with start_time = last Sunday. Take the doc link, run `tools/scan_olv_docs.py <ID>`.
2. X: `@olv ("washington heights" OR "fort washington" OR "181st" OR "wadsworth" OR "audubon" OR "bennett" OR "cabrini" OR "dyckman" OR "w 18" OR "w 17" OR "157th" OR "155th" OR "hudson heights" OR "united palace" OR "fort tryon")` with start_time = last 7–14 days. Also `from:d_Tez56 OR from:RubyQ1213 OR from:hits_boredom` with the same window.
3. X: `"no parking" "film shoot" ("washington heights" OR "hudson heights")` and `filming ("washington heights" OR "fort tryon") has:images -is:retweet -ICE -shooting`. Add `-ICE -police -Chicago` filters; "shooting" means gunfire in most hits.
4. Web: `reddit r/WashingtonHeights filming` and `r/AskNYC filming washington heights`.
5. Read each sign photo (download the image, then read it) to get dates and code names; run `tools/permit_check.py` for that window.
6. Dedupe against `sourceUrl` in `src/data/sightings.json` before adding.

`tools/scan_olv_docs.py` downloads a public OLV weekly Google Doc and prints lines that mention Heights streets. `tools/permit_check.py START END` lists `tg4x-b46p` permits whose ZIP field includes 10032, 10033, or 10040.
