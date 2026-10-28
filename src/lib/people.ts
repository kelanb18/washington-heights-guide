import { getCollection, type CollectionEntry } from 'astro:content';
import { assertLinkedAreas } from './area-links';
import { assertWriteUp, isPublic } from './publish';

export type Person = CollectionEntry<'people'>;

export function comparePeople(a: Person, b: Person): number {
  return a.data.name.localeCompare(b.data.name, 'en');
}

export async function loadPeople(): Promise<Person[]> {
  const entries = await getCollection('people');
  for (const entry of entries) {
    assertWriteUp(
      'people',
      entry.id,
      entry.body,
      'Describe the person or event in the Markdown below the frontmatter.',
    );
  }
  await assertLinkedAreas(
    'people',
    'area',
    entries.map((entry) => ({ id: entry.id, data: entry.data, link: entry.data.area })),
  );
  return entries.filter((entry) => isPublic(entry.data)).sort(comparePeople);
}
