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

function isImageMetadata(value: unknown): value is ImageMetadata {
  if (!value || (typeof value !== 'object' && typeof value !== 'function')) return false;
  const record = value as { src?: unknown; width?: unknown; height?: unknown };
  return typeof record.src === 'string' && typeof record.width === 'number' && typeof record.height === 'number';
}

export function resolvePicture(src: string): ResolvedPicture {
  if (/^https?:\/\//.test(src)) return { kind: 'remote', src };
  if (src.startsWith('/')) return { kind: 'public', src };
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
