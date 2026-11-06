import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ImageMetadata } from 'astro';
import type { CreditedImage } from './picture-schema';

const assets = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png,gif,webp,avif,svg}', {
  eager: true,
  import: 'default',
});

export type ResolvedPicture =
  | { kind: 'asset'; image: ImageMetadata }
  | { kind: 'remote'; src: string }
  | { kind: 'public'; src: string };

const identityCache = new Map<string, string[]>();

interface PictureReference {
  src: string;
  sourceUrl?: string;
}

function pictureIdentity(picture: PictureReference): string[] {
  const cached = identityCache.get(picture.src);
  if (cached) return picture.sourceUrl ? [...cached, `source:${picture.sourceUrl}`] : cached;

  const keys = [`src:${picture.src}`];
  if (picture.src.startsWith('/')) {
    const file = join(process.cwd(), 'public', picture.src.slice(1));
    if (!existsSync(file)) {
      throw new Error(`[pictures] Public image "${picture.src}" does not exist.`);
    }
    keys.push(`content:${createHash('sha256').update(readFileSync(file)).digest('hex')}`);
  }
  identityCache.set(picture.src, keys);
  return picture.sourceUrl ? [...keys, `source:${picture.sourceUrl}`] : keys;
}

export function reservePicture(picture: PictureReference, used: Set<string>) {
  for (const key of pictureIdentity(picture)) used.add(key);
}

export function claimPicture(picture: PictureReference, used: Set<string>): boolean {
  const keys = pictureIdentity(picture);
  if (keys.some((key) => used.has(key))) return false;
  for (const key of keys) used.add(key);
  return true;
}

export function claimFirstPicture<T extends PictureReference>(pictures: T[], used: Set<string>): T | undefined {
  return pictures.find((picture) => claimPicture(picture, used));
}

export function uniquePictures<T extends PictureReference>(pictures: T[]): T[] {
  const used = new Set<string>();
  return pictures.filter((picture) => claimPicture(picture, used));
}

function isImageMetadata(value: unknown): value is ImageMetadata {
  if (!value || (typeof value !== 'object' && typeof value !== 'function')) return false;
  const record = value as { src?: unknown; width?: unknown; height?: unknown };
  return typeof record.src === 'string' && typeof record.width === 'number' && typeof record.height === 'number';
}

export function resolvePicture(src: string): ResolvedPicture {
  if (/^https?:\/\//.test(src)) return { kind: 'remote', src };
  if (src.startsWith('/')) {
    const file = join(process.cwd(), 'public', src.slice(1));
    if (!existsSync(file)) throw new Error(`[pictures] Public image "${src}" does not exist.`);
    return { kind: 'public', src };
  }
  const key = src.startsWith('/') ? src : `/${src}`;
  const found = assets[key] ?? assets[src] ?? Object.entries(assets).find(([path]) => path.endsWith(`/${src.split('/').pop()}`))?.[1];
  if (isImageMetadata(found)) return { kind: 'asset', image: found };
  if (typeof found === 'string') return { kind: 'public', src: found };
  if (found && typeof found === 'object' && 'src' in found && typeof (found as { src: unknown }).src === 'string') {
    return { kind: 'public', src: (found as { src: string }).src };
  }
  const detail = found == null ? 'missing' : `${typeof found} ${JSON.stringify(found).slice(0, 300)}`;
  throw new Error(`[pictures] Could not load "${src}" (${detail}).`);
}

export function heroPicture(image: CreditedImage | undefined): CreditedImage | undefined {
  return image;
}

/** A path the Open Graph tag can use. Asset imports are optimized in the page, not as a stable public URL. */
export function shareableSrc(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith('/') || /^https?:\/\//.test(src)) return src;
  return undefined;
}
