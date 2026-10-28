---
# yaml-language-server: $schema=../.astro/collections/people.schema.json
# Copy to src/content/people/<slug>.md — the filename is the URL.
# Example: src/content/people/sample-person.md → /people/sample-person/
# Slug rules: lowercase letters, numbers, hyphens. No spaces, no subfolders.
# To publish: set example and draft to false, replace every EXAMPLE value, and commit this one file.
# Omit optional keys you do not know. Do not leave them blank, and do not guess.
# connection: current-resident, former-resident, worked-here, or historic-event.

name: "EXAMPLE Person Name"
knownFor: "Short line, a role or an event, not a biography"
connection: former-resident
# years: "1900–1901"
# place: "000 Example Avenue"
# area: sample-area
summary: "One or two sentences, 40 to 300 characters, for the page lede and the meta description. This line is still placeholder copy."
sources:
  - https://example.com/sources/person
example: true
draft: true
---

> Replace this blockquote. If this file is still an example, say so in the first lines. Use `historic-event` when the subject is an event rather than a person.

## What the note is

Who this is, or what happened, in plain language. Only include what the sources support. Do not invent years, addresses, or motives to fill the page.

## Connection to the neighborhood

Say how this connects: living here, having lived here, working here, or an event that happened here. The `connection` field is what groups the index. The prose can be more specific.

## Sources

Every entry needs at least one http(s) URL in `sources`. The sidebar lists them. Keep the claim and the citation next to each other.
