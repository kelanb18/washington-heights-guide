import { getCollection, type CollectionEntry } from 'astro:content';
import { assertWriteUp, isPublic, ships } from './publish';
import { referenceId } from './refs';

export type Guide = CollectionEntry<'guides'>;

export async function loadGuides(): Promise<Guide[]> {
  const guides = await getCollection('guides');
  const listings = await getCollection('listings');
  const byId = new Map(listings.map((listing) => [listing.id, listing]));

  for (const guide of guides) {
    assertWriteUp('guides', guide.id, guide.body, 'Introduce the list in the Markdown below the frontmatter. Do not invent a ranking you have not checked.');
    for (const [index, pick] of guide.data.picks.entries()) {
      const id = referenceId(pick.listing);
      const listing = id ? byId.get(id) : undefined;
      if (!listing) {
        throw new Error(`[guides] "${guide.id}.md" picks[${index}] listing does not match a file in src/content/listings/.`);
      }
      if (ships(guide.data) && !ships(listing.data)) {
        throw new Error(
          `[guides] "${guide.id}.md" is published, but pick "${listing.id}" is an example or draft. Publish that listing or hide this guide.`,
        );
      }
    }
  }

  return guides
    .filter((guide) => isPublic(guide.data))
    .sort((a, b) => b.data.updated.getTime() - a.data.updated.getTime() || a.data.title.localeCompare(b.data.title, 'en'));
}

export function guidesFeaturing(guides: Guide[], listingId: string): Guide[] {
  return guides.filter((guide) => guide.data.picks.some((pick) => referenceId(pick.listing) === listingId));
}
