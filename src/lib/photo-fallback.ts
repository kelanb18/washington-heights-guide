import { ancestorAreas, type Area } from './areas';
import type { CreditedImage } from './picture-schema';

/** The listing's own area photo, then the nearest parent that has one. */
export function nearestAreaPhoto(
  area: Area | undefined,
  areas: Area[],
): { picture: CreditedImage; placeName: string } | undefined {
  if (!area) return undefined;
  const chain = [area, ...[...ancestorAreas(area, areas)].reverse()];
  for (const entry of chain) {
    if (entry.data.image) return { picture: entry.data.image, placeName: entry.data.name };
  }
  return undefined;
}
