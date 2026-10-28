---
name: "EXAMPLE Quarter"
summary: "A fictional section used to preview the area page. The streets and the name are placeholders, not a real place."
boundaries: "Sample Street to Placeholder Avenue, between Example Terrace and Fictional Lane"
order: 1
sources: []
example: true
draft: true
---

> This is an example area. It does not describe a real section of any neighborhood. The streets and the name are placeholders.

EXAMPLE Quarter exists so the area pages have a shape before any real section is written up. Nothing here was researched. Do not treat the boundaries or the summary as facts.

A real area file names the section, says in a sentence or two what it is like, and gives approximate streets. Set `parent` to another area's slug only when this section sits inside that one. The build fails if the parent slug does not match a file, and it fails if areas refer to each other in a loop.

`order` is optional. Lower numbers are listed first. Omit it to sort by name. `sources` may be an empty list when you have nothing to cite yet. This file leaves the list empty so the sidebar can say so. People and places that set `area` to this file's slug show up on the page, including those filed under a smaller section nested inside it.

Delete the example flags when the file is real, and remove the word EXAMPLE from the name. Until then, production builds leave this page out.
