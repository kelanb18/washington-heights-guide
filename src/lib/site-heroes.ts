import type { CreditedImage } from './picture-schema';

export const siteHeroes: CreditedImage[] = [
  {
    src: "/images/site/hero/1.webp",
    alt: "Driving across the George Washington Bridge beneath its suspension cables",
    credit: "Michael Vadon",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3AGeorge_Washington_Bridge%2C_New_York%2C_NY_by_Michael_Vadon_01.jpg",
  },
  {
    src: "/images/site/hero/10.webp",
    alt: "Fall foliage along Cabrini Boulevard at W 190th Street in Hudson Heights",
    credit: "Beyond My Ken",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3A2014_Fall_foliage_Cabrini_Boulevard_Hudson_Heights.jpg",
  },
  {
    src: "/images/site/hero/2.webp",
    alt: "The Little Red Lighthouse at the foot of the George Washington Bridge on the Hudson",
    credit: "Beyond My Ken",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3A2014_Little_Red_Lighthouse_and_George_Washington_Bridge_landscape.jpg",
  },
  {
    src: "/images/site/hero/3.webp",
    alt: "The George Washington Bridge in winter fog seen from Castle Village in Hudson Heights",
    credit: "Beyond My Ken",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3A2013_George_Washington_Bridge_in_winter_fog_seen_from_Castle_Village.jpg",
  },
  {
    src: "/images/site/hero/4.webp",
    alt: "A barge on the Hudson passing the wooded cliffs of Fort Tryon Park and Hudson Heights",
    credit: "Beyond My Ken",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3A2014_Barge_on_Hudson_River_passing_Fort_Tryon_Park_and_Hudson_Heights.jpg",
  },
  {
    src: "/images/site/hero/5.webp",
    alt: "Castle Village apartments atop the Hudson Heights bluff, seen across the Hudson River",
    credit: "Beyond My Ken",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3ACastle_Village_from_Ross_Dock_Picnic_Area.jpg",
  },
  {
    src: "/images/site/hero/6.webp",
    alt: "Sunset over the Hudson Palisades seen from Chittenden Avenue in Hudson Heights",
    credit: "Beyond My Ken",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3A2021_Sunset_over_the_Palisades.jpg",
  },
  {
    src: "/images/site/hero/7.webp",
    alt: "The High Bridge crossing the Harlem River toward Highbridge Park and Washington Heights",
    credit: "Famartin",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3A2024-05-30_12_44_02_View_west_across_the_High_Bridge_as_it_crosses_the_Harlem_River_to_Manhattan_from_the_Bronx%2C_New_York_City%2C_New_York.jpg",
  },
  {
    src: "/images/site/hero/8.webp",
    alt: "View north from Fort Tryon Park over the Inwood lowlands toward the Harlem River",
    credit: "Beyond My Ken",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3A2014_Fort_Tryon_Park_tour_view_of_Inwood_Lowlands.jpg",
  },
  {
    src: "/images/site/hero/9.webp",
    alt: "Early morning on W 175th Street at Broadway in Washington Heights",
    credit: "NevinThompson",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File%3ABroadway_and_175th_Street%2C_October_29th%2C_2025.jpg",
  },
];

export function siteHeroFor(id: string): CreditedImage {
  let hash = 0;
  for (const char of id) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return siteHeroes[hash % siteHeroes.length];
}
