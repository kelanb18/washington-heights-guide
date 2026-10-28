---
name: "EXAMPLE Resident"
knownFor: "A fictional placeholder, not a real person"
connection: former-resident
years: "1900–1901"
place: "000 Example Avenue"
area: example-quarter
summary: "A fictional entry used to preview the people pages. This is not a real resident, and the years are made up."
sources:
  - https://example.com/sources/example-resident
example: true
draft: true
---

> This is an example person. They are not real. The address, the years, and the source URL are placeholders, not research.

EXAMPLE Resident shows the people page: a name, a short line for what they are known for, how they connect to the neighborhood, and at least one source. The connection on this file is `former-resident`. The other allowed values are `current-resident`, `worked-here`, and `historic-event`. Use `historic-event` for an event rather than a biography.

`years` and `place` are optional. Omit them instead of guessing. `area` is optional and must be the slug of a file in `src/content/areas/`. This example points at EXAMPLE Quarter so the area page can list a person in local preview. A published entry cannot point at an example or draft area.

The summary is one or two sentences. The body is the longer note. Keep claims tied to the source list. This file has a single fake source on example.com so the sidebar has a link to render. Replace it, and remove EXAMPLE from the name, before the page is allowed on the production site.
