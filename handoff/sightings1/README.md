# sightings1: resident-reported & press-reported shoots in Washington Heights (2023 to 2026-10-28)

Compiled 2026-10-28. No READY file (the site needs a schema first). `sightings.json` = 28 records, sorted by date.

## Fields
Requested: `date`, `endDate?`, `location`, `area?`, `title`, `kind?`, `summary`, `sourceUrl`, `sourceType` (x | reddit | news | tracker), `poster?`, `confidence` (confirmed | resident-reported | multiple reports).
Extra optional fields (drop or map as the schema needs): `signageCode` (project name printed on a no-parking sign), `permitMatch` (tg4x-b46p eventid + dates + category), `additionalSources` [{url, sourceType, poster}], `notes`.
- `title` is "unidentified shoot" unless a post, sign, news item or the OLV list names it. Where a sign shows only a code name, it is in `signageCode`.
- `confirmed` = a news item or a same-day tg4x-b46p permit covering the stated block. All 16 are permit and/or news matches, listed in `permitMatch`.
- `date` is the shoot date where a sign/permit gives it, otherwise the post date (noted in the summary). Records sourced from OLV weekly docs give the week and say so.
- Boundary records (`area` says "south edge") sit at W 153rd to 158th, the W 155th edge of the guide. Keep or drop as you like.

## Methods and what worked
1. **X full-archive search** (`search_posts_all`, start 2023-01-01). Broad phrase queries ("filming washington heights", "film shoot 181st", "united palace filming", etc.) are very noisy: crime, ICE, Chicago's Washington Heights and Premier League hits swamp them. Better:
   - **Replies to @olv** (On Location Vacations, 90k followers): `@olv ("washington heights" OR "181st" OR "fort washington" OR "wadsworth" OR "audubon" OR "bennett" OR "cabrini" OR "dyckman" OR "157th" OR ...)`. Residents reply to OLV with sign photos, cross streets and code names. This was the single best source.
   - `from:olv "Filming Locations" -is:retweet` in quarterly windows, to list OLV's Sunday "Week of ..." posts. Many results lack `entities`; re-fetch those ids with `get_posts_by_ids` + `post.fields=created_at,entities` to get the Google Doc link.
   - Show-title queries combined with Heights terms (SVU, Elsbeth, "only murders", FBI, etc.).
   - Spotters' own timelines: `from:RubyQ1213` (frequent Heights/Inwood spotter), `from:d_Tez56` (lives in WaHi; posts signs), `from:hits_boredom`, `from:katiehoulis`, `from:KarenDonna`, `from:eanubis89`, `from:kucksuelwhan`.
2. **OLV weekly Google Docs**: public; export with `https://docs.google.com/document/d/<ID>/export?format=txt`. Each lists project / location / credit per day for NYC. I pulled about 160 weekly docs (Jan 2023 to Oct 25, 2026; OLV paused during the 2023 strikes) and grepped for Heights streets using `tools/scan_olv_docs.py`. Gaps: some weeks were not found by search, and OLV only lists what people report to it.
3. **Sign photos**: downloaded the images from replies (`pbs.twimg.com/media/<key>.jpg?name=medium`) and read them for exact dates, project/code names and tow times (The Bench, The Raven, Rock Hill, Celeb Sub, CJFY, Wurtzle Brothers, ELSBETH, MOST WANTED, FBI).
4. **NYC Open Data cross-check**: `tools/permit_check.py START END` (Socrata tg4x-b46p; zips 10032/10033/10040). Local pull of 279 permits from 2023-01-01 to 2026-07-10 was matched to sightings by date and parkingheld streets. The dataset has no show titles, only category/subcategory.
5. **Web search**: Reddit (r/WashingtonHeights, r/AskNYC, r/OnlyMurdersHulu) is indexed and gave two records. Instagram, TikTok, Facebook and Threads gave nothing linkable: results were only AI summaries or no URL. Manhattan Times, Patch and Uptown Collective had no 2023 to 2026 shoot coverage (only the 2019-20 In the Heights shoot). Press was useful for SVU at Fort Tryon (ABC, People) and Tokischa/A$AP Rocky (Listin Diario, RD Musica).
6. reddit.com's `.json` endpoints and Facebook were not usable from the box (HTML wall). I did not log in or contact anyone.

## Most useful sources
1. Replies to @olv on X (sign photos with cross streets and code names).
2. OLV weekly Google Docs (tracker).
3. NYC permit data (turns reports into "confirmed").
4. Reddit r/WashingtonHeights (one 2026 hit) and r/AskNYC.
5. News: only for celebrity/music-video shoots.

## Leads found but NOT included (couldn't link a clean source, or out of area)
- A web summary mentioned a Facebook post (Oct 7, 2026) reporting a shoot on W 187th between Bennett and Overlook; no URL was returned. It lines up with the @RubyQ1213 post on 10/7 (189th & Bennett). Worth checking by hand.
- NYC permitted-events feed (tvpp-9vvx) lists "Everybody Eats Joe Friends", Broadway between W 158th and 159th, Sat 2026-10-31 8 AM, category "Production Event" (curb lane). That category covers brand events/production parking, not necessarily filming. Unverified.
- Out of area: The Gilded Age (W 150th & St Nicholas Pl, Mar 2026 and Jul 2026; permits 959789/959676), The Penguin at 150th/138th (2023), SVU at W 207th & Broadway (Mar 2024) and at Broadway & Arden (Apr 2024), DJ Khaled/Fat Joe/Anitta music video at an Inwood CityMD (Sep 2024; location unverified), OLV weekly items at Edgecombe & 155th (Dec 2023) and Boss/Penguin at Broadway & 155th (Dec 4-5, 2023), FBI at Amsterdam & 153rd-155th (Aug 2024).
- Not shoots: 2023 Tony Awards at the United Palace (broadcast), In the Heights (2019-20), fan reposts of 2022-23 OMITB photos, Grok replies about the SVU playground story.
- Permit-only (no sighting found): Film/Feature at Fort Washington/Bennett/W 190th (Nov 18-19, 2024); TV at 170th/171st & Broadway/Ft Washington (Apr 8-10, 2024); commercial at Audubon 175-177th (Sep 5, 2025); web series on W 169th (Apr 2023, 2024, 2025); Nagle Ave (Mar 2025). The site's tracker already shows permits.
- Not picked up as sightings: @nemenwa7 (2026-06-12) and similar recollections without dates.

## Upcoming
Nothing announced for the Heights found. OLV's Oct 26-30, 2026 doc has no Heights entries. The only forward-looking items are the vague 10/7 "filming in dyckman soon" post and the code-named CJFY sign (shoot 9/26, already past). The permit feed lags (newest Heights permit Jul 2026).

## Weekly update recipe (about 10 tool calls)
1. X: `from:olv "Filming Locations" -is:retweet` with start_time = last Sunday. Take the doc link, run `tools/scan_olv_docs.py <ID>`.
2. X: `@olv ("washington heights" OR "fort washington" OR "181st" OR "wadsworth" OR "audubon" OR "bennett" OR "cabrini" OR "dyckman" OR "w 18" OR "w 17" OR "157th" OR "155th" OR "hudson heights" OR "united palace" OR "fort tryon")` with start_time = last 7-14 days. Also `from:d_Tez56 OR from:RubyQ1213 OR from:hits_boredom` with the same window.
3. X: `"no parking" "film shoot" ("washington heights" OR "hudson heights")` and `filming ("washington heights" OR "fort tryon") has:images -is:retweet -ICE -shooting`. Add `-ICE -police -Chicago` filters; "shooting" means gunfire in most hits.
4. Web: `reddit r/WashingtonHeights filming` and `r/AskNYC filming washington heights`.
5. Read each sign photo (download the image, then Read it) to get dates and code names; run `tools/permit_check.py` for that window.
6. Dedupe against `sourceUrl` in this file before adding.
