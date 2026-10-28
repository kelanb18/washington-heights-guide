import { getCollection } from 'astro:content';
import type { PublishFlags } from './publish';
import { isPublic, ships } from './publish';
import { referenceId } from './refs';

export async function assertLinkedAreas(
  collection: string,
  field: 'area' | 'parent',
  entries: Array<{ id: string; data: PublishFlags; link: unknown }>,
): Promise<void> {
  const areas = await getCollection('areas');
  const byId = new Map(areas.map((area) => [area.id, area]));

  for (const entry of entries) {
    const id = referenceId(entry.link);
    if (!id) continue;

    const area = byId.get(id);
    if (!area) {
      throw new Error(
        `[${collection}] "${entry.id}.md" ${field} "${id}" does not match a file in src/content/areas/.`,
      );
    }

    if (ships(entry.data) && !ships(area.data)) {
      throw new Error(
        `[${collection}] "${entry.id}.md" is published, but ${field} "${id}" is an example or draft. Publish that area, or hide this file with example or draft.`,
      );
    }

    if (isPublic(entry.data) && !isPublic(area.data)) {
      throw new Error(
        `[${collection}] "${entry.id}.md" ${field} "${id}" is hidden on this build. Publish that area, or remove the field.`,
      );
    }
  }
}
