import type { Listing } from './listings';
import { referenceId } from './refs';

/**
 * Google Maps directions links, built from the Maps URLs API (no key needed):
 * https://developers.google.com/maps/documentation/urls/get-started
 *
 * On a phone these open the Google Maps app. Leaving out `origin` makes Maps start
 * from the viewer's current location. Mobile browsers allow at most three waypoints,
 * so a route is split into legs of up to four stops each.
 */

const base = 'https://www.google.com/maps/dir/?api=1';
const mobileWaypointLimit = 3;

/** "Name, street address, New York, NY 10033". The name helps Maps pick the right place. */
export function placeQuery(listing: Listing): string {
  const { name, address, postalCode } = listing.data;
  const parts = [name];
  if (address && !address.toLowerCase().includes(name.toLowerCase())) parts.push(address);
  parts.push(postalCode ? `New York, NY ${postalCode}` : 'New York, NY');
  return parts.join(', ');
}

function param(key: string, value: string): string {
  return `&${key}=${encodeURIComponent(value)}`;
}

/** Directions from wherever the viewer is to this place. Maps picks the travel mode. */
export function directionsHref(listing: Listing): string {
  return `${base}${param('destination', placeQuery(listing))}`;
}

/** The place itself in Google Maps (photos, reviews, live hours), not directions. */
export function mapSearchHref(listing: Listing): string {
  return `https://www.google.com/maps/search/?api=1${param('query', placeQuery(listing))}`;
}

export interface RouteLeg {
  href: string;
  /** 1-based stop numbers covered by this leg, inclusive. */
  from: number;
  to: number;
  /** True when the leg starts from the viewer's current location. */
  fromHere: boolean;
}

/** Walking directions through every stop in order, split so each link works on a phone. */
export function walkingRoute(stops: Listing[]): RouteLeg[] {
  const legs: RouteLeg[] = [];
  const perLeg = mobileWaypointLimit + 1;
  // Spread stops evenly so a route never ends with a one-stop part.
  const legCount = Math.ceil(stops.length / perLeg);
  const sizes = Array.from({ length: legCount }, (_, leg) =>
    Math.floor(stops.length / legCount) + (leg < stops.length % legCount ? 1 : 0),
  );
  let index = 0;
  for (const size of sizes) {
    const fromHere = index === 0;
    const origin = fromHere ? undefined : stops[index - 1];
    const chunk = stops.slice(index, index + size);
    const destination = chunk[chunk.length - 1]!;
    const waypoints = chunk.slice(0, -1);
    let url = base;
    if (origin) url += param('origin', placeQuery(origin));
    url += param('destination', placeQuery(destination));
    if (waypoints.length > 0) url += param('waypoints', waypoints.map(placeQuery).join('|'));
    url += '&travelmode=walking';
    legs.push({ href: url, from: fromHere ? 1 : index, to: index + chunk.length, fromHere });
    index += chunk.length;
  }
  return legs;
}

/** The lowest West street number a listing names (W 181st St → 181), for north–south ordering. */
export function streetNumber(listing: Listing): number | undefined {
  const text = `${listing.data.crossStreets ?? ''} ${listing.data.address ?? ''}`;
  const numbers = [...text.matchAll(/\bW(?:est)?\.?\s+(\d{3})(?:st|nd|rd|th)?\b/gi)].map((match) => Number(match[1]));
  return numbers.length > 0 ? Math.min(...numbers) : undefined;
}

function median(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

/**
 * Orders stops north to south so a walk does not double back. A stop with no street
 * number (a park, a lighthouse) takes the typical street number of its area, worked out
 * from every listing in `all`; failing that, it keeps the position of the stop before it.
 */
export function northToSouth(stops: Listing[], all: Listing[] = stops): Listing[] {
  // Prefer real latitude. Without it, convert a street number to an approximate latitude
  // using the listings that have both (Manhattan's grid runs close to north–south here).
  const pairs = all
    .map((listing) => ({ number: streetNumber(listing), lat: listing.data.latitude }))
    .filter((pair): pair is { number: number; lat: number } => pair.number != null && pair.lat != null);
  const latFromStreet = (number: number): number | undefined => {
    if (pairs.length < 2) return undefined;
    const meanN = pairs.reduce((sum, pair) => sum + pair.number, 0) / pairs.length;
    const meanL = pairs.reduce((sum, pair) => sum + pair.lat, 0) / pairs.length;
    const slope =
      pairs.reduce((sum, pair) => sum + (pair.number - meanN) * (pair.lat - meanL), 0) /
      pairs.reduce((sum, pair) => sum + (pair.number - meanN) ** 2, 0);
    return Number.isFinite(slope) ? meanL + slope * (number - meanN) : undefined;
  };
  const byArea = new Map<string, number[]>();
  for (const listing of all) {
    const area = referenceId(listing.data.area);
    if (!area || listing.data.latitude == null) continue;
    byArea.set(area, [...(byArea.get(area) ?? []), listing.data.latitude]);
  }
  let last = Number.POSITIVE_INFINITY;
  const keyed = stops.map((listing, index) => {
    const area = referenceId(listing.data.area);
    const number = streetNumber(listing);
    const key =
      listing.data.latitude ??
      (number != null ? latFromStreet(number) : undefined) ??
      (area ? median(byArea.get(area) ?? []) : undefined);
    if (key != null) last = key;
    return { listing, index, key: key ?? last };
  });
  return keyed
    .sort((a, b) => b.key - a.key || a.index - b.index)
    .map((item) => item.listing);
}
