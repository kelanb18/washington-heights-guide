export const categories = ['restaurant', 'cafe', 'bakery', 'bar', 'shop', 'service', 'landmark'] as const;

export type Category = (typeof categories)[number];

export const categoriesThatNeedCuisine: readonly Category[] = ['restaurant', 'cafe', 'bakery', 'bar'];

export interface CategoryInfo {
  singular: string;
  plural: string;
  blurb: string;
  schemaType: string;
}

export const categoryInfo = {
  restaurant: {
    singular: 'Restaurant',
    plural: 'Restaurants',
    blurb: 'A meal worth sitting down for.',
    schemaType: 'Restaurant',
  },
  cafe: {
    singular: 'Cafe',
    plural: 'Cafés',
    blurb: 'Coffee, tea, and somewhere to sit.',
    schemaType: 'CafeOrCoffeeShop',
  },
  bakery: {
    singular: 'Bakery',
    plural: 'Bakeries',
    blurb: 'Bread, pastry, and sweets.',
    schemaType: 'Bakery',
  },
  bar: {
    singular: 'Bar',
    plural: 'Bars',
    blurb: 'A drink after the hill.',
    schemaType: 'BarOrPub',
  },
  shop: {
    singular: 'Shop',
    plural: 'Shops',
    blurb: 'Stores worth leaving the avenue for.',
    schemaType: 'Store',
  },
  service: {
    singular: 'Service',
    plural: 'Services',
    blurb: 'Practical places locals actually use.',
    schemaType: 'LocalBusiness',
  },
  landmark: {
    singular: 'Landmark',
    plural: 'Landmarks',
    blurb: 'Parks, museums, and places worth the walk.',
    schemaType: 'TouristAttraction',
  },
} as const satisfies Record<Category, CategoryInfo>;

export const priceLevels = ['$', '$$', '$$$', '$$$$'] as const;

export type PriceLevel = (typeof priceLevels)[number];

export const priceInfo: Record<PriceLevel, string> = {
  $: 'Inexpensive',
  $$: 'Moderate',
  $$$: 'Expensive',
  $$$$: 'Very expensive',
};

export function isCategory(value: string): value is Category {
  return (categories as readonly string[]).includes(value);
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
