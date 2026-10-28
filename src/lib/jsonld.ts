import type { Listing } from './listings';
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

export function listingJsonLd(listing: Listing, pageUrl: string, site: URL) {
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
    priceRange: data.priceLevel,
  };

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

  return json;
}
