import type { Area } from './areas';
import { ancestorAreas } from './areas';
import { findArea } from './catalog';
import type { Guide } from './guides';
import type { Listing } from './listings';
import type { CreditedImage } from './picture-schema';
import { referenceId } from './refs';

/** The photograph people use for the neighborhood, when we have one that is actually of it. */
const signatureListing: Record<string, string> = {
  'hudson-heights': 'fort-tryon-park',
  'highbridge-park': 'the-high-bridge',
};

export function coverForArea(area: Area, areas: Area[], listings: Listing[]): CreditedImage | undefined {
  if (area.id === 'fort-george') {
    const hill = area.data.gallery.find((picture) => /Fort George Hill/i.test(picture.alt));
    if (hill) return hill;
  }

  const signature = listings.find((listing) => listing.id === signatureListing[area.id]);
  if (signature?.data.image) return signature.data.image;

  if (area.data.image) return area.data.image;

  for (const parent of [...ancestorAreas(area, areas)].reverse()) {
    if (parent.data.image) return parent.data.image;
  }
  return undefined;
}

/** A photograph of a place the guide actually names, or that place’s area. */
export function coverForGuide(
  guide: Guide,
  listings: Listing[],
  areas: Area[],
): { picture: CreditedImage; name: string } | undefined {
  for (const pick of guide.data.picks) {
    const listing = listings.find((entry) => entry.id === referenceId(pick.listing));
    if (listing?.data.image) return { picture: listing.data.image, name: listing.data.name };
  }

  for (const pick of guide.data.picks) {
    const listing = listings.find((entry) => entry.id === referenceId(pick.listing));
    const area = listing ? findArea(areas, listing.data.area) : undefined;
    if (area?.data.image) return { picture: area.data.image, name: area.data.name };
  }

  return undefined;
}
