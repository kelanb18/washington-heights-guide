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

export type GuideTranslation = CollectionEntry<'guias'>;

/** Spanish translations whose English guide is public. Fails the build if a translation's picks drift from the English guide. */
export async function loadSpanishGuides(): Promise<Array<{ guide: Guide; es: GuideTranslation }>> {
  const guides = await loadGuides();
  const byId = new Map(guides.map((guide) => [guide.id, guide]));
  const translations = await getCollection('guias');
  const pairs: Array<{ guide: Guide; es: GuideTranslation }> = [];
  for (const es of translations) {
    const guide = byId.get(es.id);
    if (!guide) continue;
    assertWriteUp('guias', es.id, es.body, 'Translate the guide introduction in the Markdown below the frontmatter.');
    const english = guide.data.picks.map((pick) => referenceId(pick.listing));
    const spanish = es.data.picks.map((pick) => pick.listing);
    if (english.join('|') !== spanish.join('|')) {
      throw new Error(
        `[guias] "${es.id}.md" picks (${spanish.join(', ')}) no longer match the English guide (${english.join(', ')}). Update the translation.`,
      );
    }
    pairs.push({ guide, es });
  }
  return pairs;
}

export function guidesFeaturing(guides: Guide[], listingId: string): Guide[] {
  return guides.filter((guide) => guide.data.picks.some((pick) => referenceId(pick.listing) === listingId));
}
