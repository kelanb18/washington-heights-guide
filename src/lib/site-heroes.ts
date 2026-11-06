import type { CreditedImage } from './picture-schema';

export interface SiteFrame {
  picture: CreditedImage;
  label: string;
  href: string;
}

export const siteHeroes: CreditedImage[] = [
  {
    src: '/images/site/hero/1.webp',
    alt: 'Driving across the George Washington Bridge beneath its suspension cables',
    credit: 'Michael Vadon',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File%3AGeorge_Washington_Bridge%2C_New_York%2C_NY_by_Michael_Vadon_01.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 1067,
  },
  {
    src: '/images/site/hero/10.webp',
    alt: 'Fall foliage along Cabrini Boulevard at W 190th Street in Hudson Heights',
    credit: 'Beyond My Ken',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File%3A2014_Fall_foliage_Cabrini_Boulevard_Hudson_Heights.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 958,
  },
  {
    src: '/images/site/hero/2.webp',
    alt: 'The Little Red Lighthouse at the foot of the George Washington Bridge on the Hudson',
    credit: 'Beyond My Ken',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File%3A2014_Little_Red_Lighthouse_and_George_Washington_Bridge_landscape.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 1183,
  },
  {
    src: '/images/site/hero/3.webp',
    alt: 'The George Washington Bridge in winter fog seen from Castle Village in Hudson Heights',
    credit: 'Beyond My Ken',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File%3A2013_George_Washington_Bridge_in_winter_fog_seen_from_Castle_Village.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 931,
  },
  {
    src: '/images/site/hero/4.webp',
    alt: 'A barge on the Hudson passing the wooded cliffs of Fort Tryon Park and Hudson Heights',
    credit: 'Beyond My Ken',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File%3A2014_Barge_on_Hudson_River_passing_Fort_Tryon_Park_and_Hudson_Heights.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 616,
  },
  {
    src: '/images/site/hero/5.webp',
    alt: 'Castle Village apartments atop the Hudson Heights bluff, seen across the Hudson River',
    credit: 'Beyond My Ken',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File%3ACastle_Village_from_Ross_Dock_Picnic_Area.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 684,
  },
  {
    src: '/images/site/hero/6.webp',
    alt: 'Sunset over the Hudson Palisades seen from Chittenden Avenue in Hudson Heights',
    credit: 'Beyond My Ken',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File%3A2021_Sunset_over_the_Palisades.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 982,
  },
  {
    src: '/images/site/hero/7.webp',
    alt: 'The High Bridge crossing the Harlem River toward Highbridge Park and Washington Heights',
    credit: 'Famartin',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File%3A2024-05-30_12_44_02_View_west_across_the_High_Bridge_as_it_crosses_the_Harlem_River_to_Manhattan_from_the_Bronx%2C_New_York_City%2C_New_York.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 1200,
  },
  {
    src: '/images/site/hero/8.webp',
    alt: 'View north from Fort Tryon Park over the Inwood lowlands toward the Harlem River',
    credit: 'Beyond My Ken',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File%3A2014_Fort_Tryon_Park_tour_view_of_Inwood_Lowlands.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 808,
  },
  {
    src: '/images/site/hero/9.webp',
    alt: 'Early morning on W 175th Street at Broadway in Washington Heights',
    credit: 'NevinThompson',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File%3ABroadway_and_175th_Street%2C_October_29th%2C_2025.jpg',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    width: 1600,
    height: 1067,
  },
];

export function siteHeroFor(id: string): CreditedImage {
  let hash = 0;
  for (const char of id) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return siteHeroes[hash % siteHeroes.length];
}

function heroByFile(file: string): CreditedImage {
  const found = siteHeroes.find((hero) => hero.src.endsWith(`/${file}`));
  if (!found) throw new Error(`[site-heroes] Missing ${file}.`);
  return found;
}

export const siteFrames: SiteFrame[] = [
  {
    label: 'George Washington Bridge',
    href: '/areas/hudson-heights',
    picture: heroByFile('1.webp'),
  },
  {
    label: 'Cabrini Boulevard',
    href: '/areas/hudson-heights',
    picture: heroByFile('10.webp'),
  },
  {
    label: 'Little Red Lighthouse',
    href: '/places/little-red-lighthouse',
    picture: heroByFile('2.webp'),
  },
  {
    label: 'Hudson Heights',
    href: '/areas/hudson-heights',
    picture: heroByFile('3.webp'),
  },
  {
    label: 'Fort Tryon Park',
    href: '/places/fort-tryon-park',
    picture: heroByFile('4.webp'),
  },
  {
    label: 'Castle Village',
    href: '/areas/hudson-heights',
    picture: heroByFile('5.webp'),
  },
  {
    label: 'Chittenden Avenue',
    href: '/areas/hudson-heights',
    picture: heroByFile('6.webp'),
  },
  {
    label: 'High Bridge',
    href: '/places/the-high-bridge',
    picture: heroByFile('7.webp'),
  },
  {
    label: 'Fort Tryon Park',
    href: '/places/fort-tryon-park',
    picture: heroByFile('8.webp'),
  },
  {
    label: 'Broadway & W 175th St',
    href: '/areas/broadway-175th',
    picture: heroByFile('9.webp'),
  },
];

/** One landscape from the site set for each section index. The homepage shows the full set. */
export const placesHero = heroByFile('9.webp');
export const areasHero = heroByFile('10.webp');
export const peopleHero = heroByFile('6.webp');
