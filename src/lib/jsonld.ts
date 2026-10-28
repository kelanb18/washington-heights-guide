import type { Area } from './areas';
import type { Listing } from './listings';
import type { Person } from './people';
import type { Production } from './productions';
import { categoryInfo } from './taxonomy';

export interface Crumb {
  name: string;
  url: string;
}

function absoluteImage(site: URL, src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  return new URL(src, site).href;
}

export function websiteJsonLd(url: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Heights',
    description,
    url,
    inLanguage: 'en-US',
  };
}

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function itemListJsonLd(name: string, items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function listingJsonLd(
  listing: Listing,
  pageUrl: string,
  site: URL,
  area?: { name: string; url: string },
) {
  const data = listing.data;
  const address: Record<string, string> = {
    '@type': 'PostalAddress',
    streetAddress: data.address,
    addressLocality: 'New York',
    addressRegion: 'NY',
    addressCountry: 'US',
  };
  if (data.postalCode) address.postalCode = data.postalCode;

  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': categoryInfo[data.category].schemaType,
    name: data.name,
    description: data.description,
    url: data.website ?? pageUrl,
    mainEntityOfPage: pageUrl,
    address,
  };

  if (data.priceLevel) json.priceRange = data.priceLevel;
  if (data.phone) json.telephone = data.phone;
  if (data.cuisine) json.servesCuisine = data.cuisine;
  if (data.images.length > 0) {
    json.image = data.images.map((image) => absoluteImage(site, image.src));
  }
  if (data.latitude != null && data.longitude != null) {
    json.geo = {
      '@type': 'GeoCoordinates',
      latitude: data.latitude,
      longitude: data.longitude,
    };
  }
  if (area) {
    json.containedInPlace = {
      '@type': 'Place',
      name: area.name,
      url: area.url,
    };
  }

  return json;
}

export function areaJsonLd(area: Area, pageUrl: string, parent?: { name: string; url: string }) {
  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: area.data.name,
    description: area.data.summary,
    url: pageUrl,
    disambiguatingDescription: area.data.boundaries,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
    containedInPlace: parent
      ? { '@type': 'Place', name: parent.name, url: parent.url }
      : {
          '@type': 'Place',
          name: 'Washington Heights',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'New York',
            addressRegion: 'NY',
            addressCountry: 'US',
          },
        },
  };

  return json;
}

export function personJsonLd(
  person: Person,
  pageUrl: string,
  located?: { name: string; url?: string },
) {
  const data = person.data;
  const place = located
    ? {
        '@type': 'Place',
        name: located.name,
        ...(located.url ? { url: located.url } : {}),
      }
    : undefined;

  if (data.connection === 'historic-event') {
    const json: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.name,
      description: data.summary,
      url: pageUrl,
      mainEntityOfPage: pageUrl,
      citation: data.sources.map((url) => ({ '@type': 'CreativeWork', url })),
    };
    if (place) json.about = place;
    return json;
  }

  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    description: data.summary,
    url: pageUrl,
    knowsAbout: data.knownFor,
  };

  if (place && data.connection === 'worked-here') json.workLocation = place;
  if (place && (data.connection === 'current-resident' || data.connection === 'former-resident')) {
    json.homeLocation = place;
  }

  return json;
}

const productionTypes = {
  film: 'Movie',
  tv: 'TVSeries',
  'music-video': 'MusicVideoObject',
  other: 'CreativeWork',
} as const;

export function productionJsonLd(production: Production, pageUrl: string) {
  const data = production.data;
  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': productionTypes[data.kind],
    name: data.title,
    description: data.summary,
    url: data.watchUrl ?? pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: typeof data.year === 'number' ? String(data.year) : data.year,
    contentLocation: data.locations.map((name) => ({ '@type': 'Place', name })),
    citation: data.sources.map((url) => ({ '@type': 'CreativeWork', url })),
  };
  if (data.artist) json.byArtist = { '@type': 'Person', name: data.artist };
  return json;
}
