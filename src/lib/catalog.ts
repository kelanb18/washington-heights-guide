import { descendantIds, type Area } from './areas';
import type { Listing } from './listings';
import type { Person } from './people';
import { referenceId } from './refs';

export function listingsInArea(areaId: string, areas: Area[], listings: Listing[]): Listing[] {
  const ids = descendantIds(areaId, areas);
  return listings.filter((listing) => {
    const id = referenceId(listing.data.area);
    return id != null && ids.has(id);
  });
}

export function peopleInArea(areaId: string, areas: Area[], people: Person[]): Person[] {
  const ids = descendantIds(areaId, areas);
  return people.filter((person) => {
    const id = referenceId(person.data.area);
    return id != null && ids.has(id);
  });
}

export function listingCounts(areas: Area[], listings: Listing[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const area of areas) counts[area.id] = listingsInArea(area.id, areas, listings).length;
  return counts;
}

export function findArea(areas: Area[], link: unknown): Area | undefined {
  const id = referenceId(link);
  if (!id) return undefined;
  return areas.find((area) => area.id === id);
}
