---
# yaml-language-server: $schema=../.astro/collections/listings.schema.json
# Copy to src/content/listings/<slug>.md — the filename is the URL.
# Example: src/content/listings/fort-washington-cafe.md → /places/fort-washington-cafe/
# Slug rules: lowercase letters, numbers, hyphens. No spaces, no subfolders.
# To publish: set example and draft to false, replace every EXAMPLE value, and commit this one file.
# Omit optional keys you do not know. Do not leave them blank, and do not guess.

name: "EXAMPLE Place Name"
description: "One or two sentences, 40 to 170 characters, for search and social cards. Say what it is and where. This line is still placeholder copy."
example: true
draft: true
sponsored: false
pick: false
# rating: 4.5
category: restaurant
# restaurant, cafe, bakery, bar, shop, service, or landmark
# cuisine is required for restaurant, cafe, bakery, and bar. Omit it for shop, service, and landmark unless it truly applies.
cuisine: Example plates
tags:
  - dinner
priceLevel: "$$"
# Omit priceLevel when the place is free or a price does not apply. Do not invent a value, and do not write Free.
address: "000 Example Avenue"
crossStreets: "Example Avenue & Sample Street"
neighborhood: Washington Heights
# area: sample-area
# postalCode: "10033"
# latitude: 0
# longitude: 0
website: https://example.com/place
phone: "(212) 555-0100"
hours: "Tue–Sun, 11am–10pm"
lastVerified: 2026-10-01
verdict: "One sentence, your opinion, 160 characters or fewer. This placeholder verdict is not about a real business."
affiliateLinks: []
# affiliateLinks:
#   - label: Reserve a table
#     url: https://example.com/ref/place
images: []
# images:
#   - src: /images/your-file.jpg
#     alt: "What a person sees in the picture, in a full sentence."
---

> Replace this blockquote. If this file is still an example, say so in the first lines.

## What it is

A short description of the place: the room, the offer, and where it sits in the neighborhood. Stick to what you checked.

## Who it's for

Who should go, and who should skip it. Be specific about the occasion.

## Standout details

Two or three things a reader could verify on a visit. Leave out anything you did not see.

## Honest verdict

The opinion, in plain language. It matches the one-line `verdict` above and it does not change because someone paid for a placement or a referral link.
