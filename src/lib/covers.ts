import type { Area } from './areas';
import { ancestorAreas } from './areas';
import { findArea } from './catalog';
import type { Guide } from './guides';
import type { Listing } from './listings';
import type { CreditedImage } from './picture-schema';
import { claimFirstPicture, claimPicture } from './pictures';
import { referenceId } from './refs';

interface CoverCandidate {
  picture: CreditedImage;
  name: string;
}

function uniqueCover(candidates: CoverCandidate[], usedSources: Set<string>): CoverCandidate | undefined {
  for (const candidate of candidates) {
    if (claimPicture(candidate.picture, usedSources)) return candidate;
  }
  return undefined;
}

function areaCandidates(area: Area, listings: Listing[], areas: Area[]): CoverCandidate[] {
  const candidates: CoverCandidate[] = [];
  const add = (picture: CreditedImage | undefined, name: string) => {
    if (picture) candidates.push({ picture, name });
  };
  const addArea = (entry: Area) => {
    add(entry.data.image, entry.data.name);
    for (const picture of entry.data.gallery) add(picture, entry.data.name);
  };

  addArea(area);

  const signatureListingId =
    area.id === 'highbridge-park' ? 'the-high-bridge' : undefined;
  const signature = signatureListingId && listings.find((listing) => listing.id === signatureListingId);
  if (signature) {
    add(signature.data.image, signature.data.name);
    for (const picture of signature.data.gallery) add(picture, signature.data.name);
  }

  for (const parent of [...ancestorAreas(area, areas)].reverse()) addArea(parent);

  return candidates;
}

export function coverForListing(listing: Listing, usedSources: Set<string>): CreditedImage | undefined {
  return claimFirstPicture(
    [...(listing.data.image ? [listing.data.image] : []), ...listing.data.gallery],
    usedSources,
  );
}

/** An unused photo of the area, preferring its own image and gallery. */
export function coverForArea(
  area: Area,
  areas: Area[],
  listings: Listing[],
  usedSources: Set<string> = new Set(),
): CoverCandidate | undefined {
  return uniqueCover(areaCandidates(area, listings, areas), usedSources);
}

/** An unused photo of a place named in the guide, or of its area. */
export function coverForGuide(
  guide: Guide,
  listings: Listing[],
  areas: Area[],
  usedSources: Set<string> = new Set(),
): CoverCandidate | undefined {
  if (guide.data.image && claimPicture(guide.data.image, usedSources)) {
    return { picture: guide.data.image, name: guide.data.title };
  }

  const picks = guide.data.picks.flatMap((pick) => {
    const listing = listings.find((entry) => entry.id === referenceId(pick.listing));
    if (!listing) return [];

    return [
      ...(listing.data.image ? [{ picture: listing.data.image, name: listing.data.name }] : []),
      ...listing.data.gallery.map((picture) => ({ picture, name: listing.data.name })),
    ];
  });
  const pickCover = uniqueCover(picks, usedSources);
  if (pickCover) return pickCover;

  for (const pick of guide.data.picks) {
    const listing = listings.find((entry) => entry.id === referenceId(pick.listing));
    const area = listing ? findArea(areas, listing.data.area) : undefined;
    if (!area) continue;

    const areaCover = uniqueCover(areaCandidates(area, listings, areas), usedSources);
    if (areaCover) return areaCover;
  }

  return undefined;
}
