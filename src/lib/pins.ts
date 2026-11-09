import { directionsHref } from './directions';
import type { Listing } from './listings';
import { href } from './site';
import { categoryInfo } from './taxonomy';

export interface MapPin {
  lat: number;
  lng: number;
  name: string;
  href: string;
  category: string;
  categoryLabel: string;
  sponsored?: boolean;
  directions?: string;
}

export function pinsFor(listings: Listing[]): MapPin[] {
  const pins: MapPin[] = [];
  for (const listing of listings) {
    const { latitude, longitude, name, category, sponsored } = listing.data;
    if (latitude == null || longitude == null) continue;
    pins.push({
      lat: latitude,
      lng: longitude,
      name,
      href: href(`/places/${listing.id}`),
      category,
      categoryLabel: categoryInfo[category].singular,
      sponsored,
      directions: directionsHref(listing),
    });
  }
  return pins;
}
