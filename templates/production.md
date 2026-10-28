---
# yaml-language-server: $schema=../.astro/collections/productions.schema.json
# Copy to src/content/productions/<slug>.md — the filename is the URL.
# Example: src/content/productions/sample-picture.md → /filmed-here/sample-picture/
# kind: film, tv, music-video, or other.
# Omit optional keys you do not know. Do not leave them blank, and do not guess.

title: "EXAMPLE Picture Title"
kind: film
year: 1901
# artist: "Example Artist"
locations:
  - "Sample Street & Placeholder Avenue"
# area: sample-area
summary: "One or two sentences, 40 to 300 characters, for the page lede. This line is still placeholder copy about a production that does not exist."
# watchUrl: https://example.com/videos/example
sources:
  - https://example.com/sources/example-picture
# image:
#   src: src/assets/your-file.jpg
#   alt: "What a person sees in the picture, in a full sentence."
#   credit: "Photographer Name"
#   license: "CC BY-SA 4.0"
#   sourceUrl: https://example.com/photos/example
example: true
draft: true
---

> Replace this blockquote. If this file is still an example, say so in the first lines.

## What was filmed

Name the production and the scene a reader would recognize. Only include what the sources support.

## Where

The corners, buildings, or parks, in plain language. The `locations` list is what the page prints. Do not invent a street to fill the line.
