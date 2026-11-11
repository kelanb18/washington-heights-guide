import snapshot from '../data/living-here-snapshot.json';
import { mapsHref } from './site';

/**
 * Everyday places from OpenStreetMap, saved by tools/fetch_living_here.py.
 * Data © OpenStreetMap contributors (ODbL); credit OSM wherever these are shown.
 */
export interface EverydayPlace {
  category: string;
  name: string;
  address: string | null;
  hours: string | null;
  lat: number;
  lon: number;
  osm: string;
}

export const everydayCategories = [
  { id: 'pharmacy', label: 'Pharmacies', singular: 'Pharmacy' },
  { id: 'health', label: 'Hospitals and clinics', singular: 'Hospital or clinic' },
  { id: 'grocery', label: 'Supermarkets and produce', singular: 'Grocery' },
  { id: 'laundry', label: 'Laundromats and dry cleaners', singular: 'Laundry' },
  { id: 'hardware', label: 'Hardware and locksmiths', singular: 'Hardware' },
  { id: 'post', label: 'Post offices', singular: 'Post office' },
  { id: 'library', label: 'Libraries', singular: 'Library' },
  { id: 'gym', label: 'Gyms', singular: 'Gym' },
  { id: 'dogs', label: 'Dog runs', singular: 'Dog run' },
] as const;

export const everydayFetched: string = snapshot.fetched;
export const everydayPlaces: EverydayPlace[] = snapshot.places as EverydayPlace[];

/** Google Maps search for the place, which shows current hours and reviews. */
export function everydayMapsHref(place: EverydayPlace): string {
  return mapsHref([place.name, place.address ?? undefined]);
}
