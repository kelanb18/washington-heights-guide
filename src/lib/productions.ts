import { getCollection, type CollectionEntry } from 'astro:content';
import { assertLinkedAreas } from './area-links';
import { productionKindInfo, type ProductionKind } from './production-schema';
import { assertWriteUp, isPublic } from './publish';

export type Production = CollectionEntry<'productions'>;

export function yearSortValue(year: number | string): number {
  if (typeof year === 'number') return year;
  const match = year.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

export function formatYear(year: number | string): string {
  return String(year);
}

export function compareProductionsByYear(a: Production, b: Production): number {
  const byYear = yearSortValue(b.data.year) - yearSortValue(a.data.year);
  if (byYear !== 0) return byYear;
  return a.data.title.localeCompare(b.data.title, 'en');
}

export async function loadProductions(): Promise<Production[]> {
  const entries = await getCollection('productions');
  for (const entry of entries) {
    assertWriteUp(
      'productions',
      entry.id,
      entry.body,
      'Say what was filmed and where, in the Markdown below the frontmatter.',
    );
  }
  await assertLinkedAreas(
    'productions',
    'area',
    entries.map((entry) => ({ id: entry.id, data: entry.data, link: entry.data.area })),
  );
  return entries.filter((entry) => isPublic(entry.data)).sort(compareProductionsByYear);
}

export function productionsByKind(productions: Production[]): Array<{
  kind: ProductionKind;
  label: string;
  items: Production[];
}> {
  const order = ['film', 'tv', 'music-video', 'other'] as const;
  return order
    .map((kind) => ({
      kind,
      label: productionKindInfo[kind].plural,
      items: productions.filter((item) => item.data.kind === kind).sort(compareProductionsByYear),
    }))
    .filter((group) => group.items.length > 0);
}
