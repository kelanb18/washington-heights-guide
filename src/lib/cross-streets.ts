/** Corners looked up once from the US Census geocoder and saved here.
 * The site does not geocode while it builds or in the browser. */

export interface KnownCorner {
  label: string;
  latitude: number;
  longitude: number;
}

export const knownCorners: KnownCorner[] = [
  { label: 'W 181ST ST & MAGAW PL', latitude: 40.850645, longitude: -73.937365 },
  { label: 'BROADWAY & W 155TH ST', latitude: 40.832766, longitude: -73.945824 },
  { label: 'W 176TH ST & BROADWAY', latitude: 40.84691, longitude: -73.938235 },
  { label: 'W 181ST ST & FORT WASHINGTON AVE', latitude: 40.850909, longitude: -73.938284 },
  { label: 'W 187TH ST & BROADWAY', latitude: 40.854169, longitude: -73.933705 },
  { label: 'W 157TH ST & AMSTERDAM AVE', latitude: 40.832865, longitude: -73.942032 },
  { label: 'W 176TH ST & HAVEN AVE', latitude: 40.847666, longitude: -73.942184 },
  { label: 'W 155TH ST & AMSTERDAM AVE', latitude: 40.831568, longitude: -73.94298 },
  { label: 'W 177TH ST & WADSWORTH AVE', latitude: 40.847249, longitude: -73.936857 },
  { label: 'W 182ND ST & ST NICHOLAS AVE', latitude: 40.849895, longitude: -73.93331 },
  { label: 'BROADWAY & W 190TH ST', latitude: 40.856503, longitude: -73.932761 },
  { label: 'W 180TH ST & FORT WASHINGTON AVE', latitude: 40.849994, longitude: -73.938654 },
  { label: 'W 189TH ST & BENNETT AVE', latitude: 40.855581, longitude: -73.934266 },
];

function normPart(raw: string): string {
  return raw
    .replace(/^\s*near\s+/i, '')
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/(\d+)(?:st|nd|rd|th)\b/g, '$1')
    .replace(/\bwest\b/g, 'w')
    .replace(/\beast\b/g, 'e')
    .replace(/\bsaint\b/g, 'st')
    .replace(/\bstreet\b/g, 'st')
    .replace(/\bavenue\b/g, 'ave')
    .replace(/\bplace\b/g, 'pl')
    .replace(/\s+/g, ' ')
    .trim();
}

export function intersectionKey(left: string, right: string): string {
  return [normPart(left), normPart(right)].sort().join('|');
}

const byKey = new Map<string, KnownCorner>();
for (const corner of knownCorners) {
  const [left, right] = corner.label.split('&');
  if (!left || !right) continue;
  byKey.set(intersectionKey(left, right), corner);
}

/** First "Street & Street" in a location line, if this site already knows that corner. */
export function cornerForLocation(location: string): KnownCorner | undefined {
  const pattern = /([A-Za-z0-9.'’\- ]{2,48}?)\s+&\s+([A-Za-z0-9.'’\- ]{2,48})/g;
  for (const match of location.matchAll(pattern)) {
    const found = byKey.get(intersectionKey(match[1] ?? '', match[2] ?? ''));
    if (found) return found;
  }
  return undefined;
}
