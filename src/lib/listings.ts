import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './taxonomy';

export type Listing = CollectionEntry<'listings'>;

const minimumBodyLength = 200;

export function placeholdersEnabled(): boolean {
  return import.meta.env.DEV || __INCLUDE_EXAMPLES__;
}

export function isPublic(data: Listing['data']): boolean {
  if (data.example) return placeholdersEnabled();
  if (data.draft) return import.meta.env.DEV;
  return true;
}

function assertWriteUp(entry: Listing) {
  const body = entry.body?.trim() ?? '';
  if (body.length < minimumBodyLength) {
    throw new Error(
      `[listings] "${entry.id}.md" needs a write-up of at least ${minimumBodyLength} characters. Cover what it is, who it is for, standout details, and an honest verdict.`,
    );
  }
}

function assertImages(entry: Listing) {
  for (const [index, image] of entry.data.images.entries()) {
    if (!image.src.startsWith('/')) continue;
    const file = join(process.cwd(), 'public', image.src.slice(1));
    if (!existsSync(file)) {
      throw new Error(
        `[listings] "${entry.id}.md" images[${index}].src points at "${image.src}", but public${image.src} does not exist.`,
      );
    }
  }
}

export function compareListings(a: Listing, b: Listing): number {
  if (a.data.pick !== b.data.pick) return a.data.pick ? -1 : 1;
  const byDate = b.data.lastVerified.getTime() - a.data.lastVerified.getTime();
  if (byDate !== 0) return byDate;
  return a.data.name.localeCompare(b.data.name, 'en');
}

export async function loadListings(): Promise<Listing[]> {
  const entries = await getCollection('listings');
  for (const entry of entries) {
    assertWriteUp(entry);
    assertImages(entry);
  }
  return entries.filter((entry) => isPublic(entry.data)).sort(compareListings);
}

export interface TagGroup {
  slug: string;
  label: string;
  listings: Listing[];
}

export function collectTags(listings: Listing[]): TagGroup[] {
  const groups = new Map<string, TagGroup>();

  for (const listing of listings) {
    const labels = [...listing.data.tags];
    if (listing.data.cuisine) labels.push(listing.data.cuisine);
    const seen = new Set<string>();

    for (const label of labels) {
      const slug = slugify(label);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      const existing = groups.get(slug);
      if (existing) {
        existing.listings.push(listing);
      } else {
        groups.set(slug, { slug, label, listings: [listing] });
      }
    }
  }

  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label, 'en'));
}
