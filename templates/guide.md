---
# yaml-language-server: $schema=../.astro/collections/guides.schema.json
# Copy to src/content/guides/<slug>.md — the filename is the URL.
# Example: src/content/guides/sample-guide.md → /best/sample-guide/
# picks.listing is a slug in src/content/listings/, without .md.
# The order of picks is the ranking. Do not invent a rank you have not checked.

title: "EXAMPLE Guide Title"
description: "One or two sentences, 40 to 160 characters, for search and social cards. This line is still placeholder copy for a guide that is not a real ranking."
picks:
  - listing: example-kitchen
    blurb: "Why this placeholder is first. Replace this sentence with a checked reason."
    badge: "Best overall"
updated: 2026-10-01
sources: []
example: true
draft: true
---

> Replace this blockquote. Say what the list is for, and what it leaves out.

The order above is the ranking. Each `blurb` is the reason that place is here. A `badge` is optional. `area` and `category` are optional filters, not extra claims.
