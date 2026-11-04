import { z } from 'astro/zod';
import raw from '../data/site-images.json';
import { creditedImageSchema, type CreditedImage } from './picture-schema';

const siteImageSchema = creditedImageSchema.extend({
  id: z.string().trim().min(3),
  slot: z.enum(['home', 'places', 'areas', 'people', 'strip']),
});

const siteImages = z.array(siteImageSchema).parse(raw);

function pictureOf(slot: 'home' | 'places' | 'areas' | 'people'): CreditedImage {
  const found = siteImages.find((image) => image.slot === slot);
  if (!found) throw new Error(`[site-images] No photograph is assigned to "${slot}".`);
  return found;
}

export const homeHero = pictureOf('home');
export const placesHero = pictureOf('places');
export const areasHero = pictureOf('areas');
export const peopleHero = pictureOf('people');

export const homeStrip: CreditedImage[] = siteImages.filter((image) => image.slot === 'strip');
