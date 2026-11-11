import { getCollection, type CollectionEntry } from 'astro:content';
import { assertWriteUp } from './publish';
import { loadAreas, type Area } from './areas';

export type AreaTranslation = CollectionEntry<'barrios'>;

/** Spanish translations whose English area is public, keyed by area id. */
export async function loadSpanishAreas(): Promise<Map<string, { area: Area; es: AreaTranslation }>> {
  const areas = await loadAreas();
  const byId = new Map(areas.map((area) => [area.id, area]));
  const pairs = new Map<string, { area: Area; es: AreaTranslation }>();
  for (const es of await getCollection('barrios')) {
    const area = byId.get(es.id);
    if (!area) continue;
    assertWriteUp('barrios', es.id, es.body, 'Translate the area write-up in the Markdown below the frontmatter.');
    pairs.set(es.id, { area, es });
  }
  return pairs;
}
