import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'astro/zod';

const pictureSrc = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => {
      if (value.includes('..') || /\s/.test(value)) return false;
      if (/^https?:\/\//.test(value)) return true;
      if (value.startsWith('/') && !value.startsWith('//')) return true;
      return value.startsWith('src/assets/');
    },
    'Image src must be src/assets/..., a site path starting with / (a file in public/), or an http(s) URL.',
  );

export const creditedImageSchema = z
  .strictObject({
    src: pictureSrc.describe('src/assets/... for an optimized local file, /images/... in public/, or an http(s) URL.'),
    alt: z.string().trim().min(8).max(180).describe('What a person sees in the picture.'),
    credit: z.string().trim().min(2).max(160).describe('Who made the picture. Shown next to it.'),
    license: z
      .string()
      .trim()
      .min(2)
      .max(60)
      .describe('License name, such as "CC BY-SA 4.0" or "Public domain".'),
    sourceUrl: z.httpUrl().describe('Page the picture came from. The credit links here.'),
  })
  .describe('One photograph or drawing, with credit and a link to the source.');

export type CreditedImage = z.infer<typeof creditedImageSchema>;

type IssueCtx = {
  addIssue: (issue: { code: 'custom'; path: (string | number)[]; message: string; input?: unknown }) => void;
};

function localFile(src: string): string | undefined {
  if (/^https?:\/\//.test(src)) return undefined;
  if (src.startsWith('/')) return join(process.cwd(), 'public', src.slice(1));
  return join(process.cwd(), src);
}

export function assertCreditedImages(images: CreditedImage[], ctx: IssueCtx, path: (string | number)[]) {
  images.forEach((image, index) => {
    const file = localFile(image.src);
    if (!file || existsSync(file)) return;
    const where = image.src.startsWith('/') ? `public${image.src}` : image.src;
    ctx.addIssue({
      code: 'custom',
      path: [...path, index, 'src'],
      input: image.src,
      message: `Image src "${image.src}" does not exist. Expected ${where}.`,
    });
  });
}
