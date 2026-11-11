import snapshot from '../data/stairs-snapshot.json';

/**
 * Hills, stairs and step-free subway access.
 * Stations: MTA station accessibility (data.ny.gov 39hk-dx4f) and the MTA elevator and escalator
 * equipment list (nyct_ene_equipments.json), checked 2026-11-11. Equipment numbers match the MTA's live outage feed.
 * Stairways: OpenStreetMap via tools/fetch_stairs.py; climb heights from USGS elevation data.
 */

type Text = { en: string; es: string };

export interface Station {
  name: string;
  lines: string[];
  stepFree: boolean;
  entrance: Text;
  note?: Text;
  /** MTA equipment numbers for live outage checks. */
  equipment: string[];
  lat: number;
  lon: number;
}

export const stations: Station[] = [
  {
    name: '168 St',
    lines: ['A', 'C'],
    stepFree: true,
    entrance: { en: 'Elevator at 168 St & St Nicholas Ave (southeast corner)', es: 'Ascensor en la calle 168 y St Nicholas Ave (esquina sureste)' },
    note: {
      en: 'Elevators run to both A/C platforms. The 1 train platforms at this station are not rated accessible.',
      es: 'Hay ascensores a los dos andenes del A/C. Los andenes del tren 1 en esta estación no se consideran accesibles.',
    },
    equipment: ['EL139', 'EL140', 'EL141'],
    lat: 40.840719,
    lon: -73.939561,
  },
  {
    name: '175 St',
    lines: ['A'],
    stepFree: true,
    entrance: { en: 'Elevator at 177 St & Fort Washington Ave (northeast corner)', es: 'Ascensor en la calle 177 y Fort Washington Ave (esquina noreste)' },
    equipment: ['EL123', 'EL124'],
    lat: 40.847391,
    lon: -73.939704,
  },
  {
    name: '181 St',
    lines: ['A'],
    stepFree: true,
    entrance: { en: 'Elevators at 184 St & Fort Washington Ave', es: 'Ascensores en la calle 184 y Fort Washington Ave' },
    note: {
      en: 'The entrance at 181 St & Fort Washington Ave has escalators, not elevators. Use the 184 St entrance.',
      es: 'La entrada de la calle 181 y Fort Washington Ave tiene escaleras mecánicas, no ascensores. Usa la entrada de la calle 184.',
    },
    equipment: ['EL117', 'EL118', 'EL119', 'EL517', 'EL518'],
    lat: 40.851695,
    lon: -73.937969,
  },
  {
    name: 'Dyckman St',
    lines: ['1'],
    stepFree: true,
    entrance: { en: 'Elevators at Nagle Ave & Dyckman St, one for each direction', es: 'Ascensores en Nagle Ave y Dyckman St, uno para cada dirección' },
    equipment: ['EL178', 'EL179'],
    lat: 40.860531,
    lon: -73.925536,
  },
  {
    name: 'Inwood-207 St',
    lines: ['A'],
    stepFree: true,
    entrance: { en: 'Elevator at 207 St & Broadway (northwest corner)', es: 'Ascensor en la calle 207 y Broadway (esquina noroeste)' },
    equipment: ['EL148', 'EL149'],
    lat: 40.868072,
    lon: -73.919899,
  },
  {
    name: '190 St',
    lines: ['A'],
    stepFree: false,
    entrance: { en: 'Elevators from Fort Washington Ave down to the mezzanine', es: 'Ascensores desde Fort Washington Ave hasta el entresuelo' },
    note: {
      en: 'There are still stairs between the mezzanine and the platform.',
      es: 'Todavía hay escaleras entre el entresuelo y el andén.',
    },
    equipment: ['EL115', 'EL116', 'EL120'],
    lat: 40.859022,
    lon: -73.93418,
  },
  {
    name: '191 St',
    lines: ['1'],
    stepFree: false,
    entrance: { en: 'Elevators at 191 St & St Nicholas Ave (southwest corner)', es: 'Ascensores en la calle 191 y St Nicholas Ave (esquina suroeste)' },
    note: {
      en: 'The elevators reach the mezzanine, but the station is not rated accessible.',
      es: 'Los ascensores llegan al entresuelo, pero la estación no se considera accesible.',
    },
    equipment: ['EL103', 'EL104', 'EL105', 'EL106'],
    lat: 40.855225,
    lon: -73.929412,
  },
  {
    name: '181 St',
    lines: ['1'],
    stepFree: false,
    entrance: { en: 'Elevators inside, but not step-free', es: 'Ascensores adentro, pero no sin escalones' },
    note: {
      en: 'Elevators connect the mezzanine and the platform bridge, but the station is not rated accessible.',
      es: 'Los ascensores conectan el entresuelo con el puente sobre las vías, pero la estación no se considera accesible.',
    },
    equipment: ['EL107', 'EL108', 'EL109', 'EL110'],
    lat: 40.849505,
    lon: -73.933596,
  },
];

/** Stations with stairs only, per the MTA. */
export const stairsOnlyStations = [
  { name: '155 St', lines: ['C'] },
  { name: '155 St', lines: ['B', 'D'] },
  { name: '157 St', lines: ['1'] },
  { name: '163 St-Amsterdam Av', lines: ['C'] },
  { name: 'Dyckman St', lines: ['A'] },
  { name: '207 St', lines: ['1'] },
  { name: '215 St', lines: ['1'] },
];

export interface Shortcut {
  id: string;
  title: Text;
  bottom: Text;
  top: Text;
  climb: Text;
  how: Text;
  equipment: string[];
}

/** Station elevators that carry you between two street levels. Heights from USGS elevation data. */
export const shortcuts: Shortcut[] = [
  {
    id: 'shortcut-191',
    title: { en: 'Broadway to St Nicholas Ave, at 191 St', es: 'De Broadway a St Nicholas Ave, en la calle 191' },
    bottom: { en: 'Broadway & 191 St, at the mouth of the 191 St tunnel', es: 'Broadway y la calle 191, en la entrada del túnel de la 191' },
    top: { en: '191 St & St Nicholas Ave', es: 'La calle 191 y St Nicholas Ave' },
    climb: { en: 'about 150 feet of hill', es: 'unos 150 pies (45 metros) de cuesta' },
    how: {
      en: 'Walk east through the 191 St tunnel, a city street that runs under the hill, to the station. The elevators come up at St Nicholas Ave.',
      es: 'Camina hacia el este por el túnel de la calle 191, una calle de la ciudad que pasa por debajo de la colina, hasta la estación. Los ascensores salen en St Nicholas Ave.',
    },
    equipment: ['EL103', 'EL104', 'EL105', 'EL106'],
  },
  {
    id: 'shortcut-190',
    title: { en: 'Bennett Ave to Fort Washington Ave, at 190 St', es: 'De Bennett Ave a Fort Washington Ave, en la calle 190' },
    bottom: { en: 'Bennett Ave & 190 St', es: 'Bennett Ave y la calle 190' },
    top: { en: 'Fort Washington Ave, by Fort Tryon Park', es: 'Fort Washington Ave, junto a Fort Tryon Park' },
    climb: { en: 'more than 100 feet of hill', es: 'más de 100 pies (30 metros) de cuesta' },
    how: {
      en: 'Take the passageway from the Bennett Ave entrance into the 190 St A station. The elevators come up on Fort Washington Ave.',
      es: 'Entra por el pasillo de Bennett Ave a la estación de la calle 190 del tren A. Los ascensores salen en Fort Washington Ave.',
    },
    equipment: ['EL115', 'EL116', 'EL120'],
  },
];

export interface Stairway {
  osm: string;
  name: string | null;
  lat: number;
  lon: number;
  lengthM: number;
  steps: number | null;
  handrail: boolean | null;
  climbFt: number | null;
  near: string | null;
}

export const stairsFetched: string = snapshot.fetched;
/** Upper Manhattan stairways, tallest climb first. Marble Hill (north of the Harlem River) is left out. */
export const stairways: Stairway[] = (snapshot.stairs as Stairway[]).filter((stair) => stair.lat < 40.873);

const abbreviations: Record<string, string> = {
  "B'WAY": 'Broadway',
  RVRSIDE: 'Riverside',
  PK: 'Park',
  MEM: 'Memorial',
  ST: 'St',
  AVE: 'Ave',
  AVENUE: 'Ave',
  STREET: 'St',
  DRIVE: 'Drive',
  J: 'J.',
  WEST: 'W',
  RSD: 'Riverside Drive',
  MALLS: '',
};

/** "RVRSIDE DRIVE" -> "Riverside Drive". */
export function tidyStreet(value: string | null): string | null {
  if (!value) return null;
  if (/^FORT TRYON PK/.test(value)) return 'Fort Tryon Park';
  return value
    .replace(/^(\d+ )?(\d+) STREET$/, '$1W $2 STREET')
    .split(/\s+/)
    .map((word) => abbreviations[word] ?? (/^\d/.test(word) ? word : word.charAt(0) + word.slice(1).toLowerCase()))
    .filter(Boolean)
    .join(' ');
}

export function stairName(stair: Stairway, lang: 'en' | 'es'): string {
  if (stair.name) return stair.name;
  const near = tidyStreet(stair.near);
  if (lang === 'es') return near ? `Escalera cerca de ${near}` : 'Escalera';
  return near ? `Stairs near ${near}` : 'Stairs';
}

export function stairMapsHref(stair: Stairway): string {
  return `https://www.google.com/maps/search/?api=1&query=${stair.lat},${stair.lon}`;
}

