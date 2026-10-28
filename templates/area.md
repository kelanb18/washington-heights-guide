---
# yaml-language-server: $schema=../.astro/collections/areas.schema.json
# Copy to src/content/areas/<slug>.md — the filename is the URL.
# Example: src/content/areas/sample-area.md → /areas/sample-area/
# Slug rules: lowercase letters, numbers, hyphens. No spaces, no subfolders.
# To publish: set example and draft to false, replace every EXAMPLE value, and commit this one file.
# Omit optional keys you do not know. Do not leave them blank, and do not guess.

name: "EXAMPLE Area Name"
summary: "One or two sentences, 40 to 300 characters. This is the page lede and the meta description. This line is still placeholder copy."
# parent: sample-area
boundaries: "Sample Street to Placeholder Avenue"
# order: 1
sources: []
# sources:
#   - https://example.com/sources/area
example: true
draft: true
---

> Replace this blockquote. If this file is still an example, say so in the first lines.

## What this section is

A short description of the section: where it sits, and what a reader uses it for. Stick to what you checked. Do not invent a history to make the page sound finished.

## What belongs here

Say which kinds of places and notes should point at this slug. If a smaller section has its own file, set that file's `parent` to this slug instead of repeating it here.

## Sources

The `sources` list is the citation sidebar. An empty list is allowed. Do not paste URLs into the prose that you are not willing to stand behind.
