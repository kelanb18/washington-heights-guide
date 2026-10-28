import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { listingSchema } from './lib/listing-schema';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const listings = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/listings',
    generateId: ({ entry }) => {
      const file = entry.replace(/\\/g, '/');
      if (file.includes('/')) {
        throw new Error(
          `[listings] "${file}" is in a subfolder. Put the Markdown file directly in src/content/listings/.`,
        );
      }
      const id = file.replace(/\.md$/i, '');
      if (!slugPattern.test(id)) {
        throw new Error(
          `[listings] Rename "${file}" to a lowercase slug such as "fort-washington-cafe.md". Use letters, numbers, and hyphens only.`,
        );
      }
      return id;
    },
  }),
  schema: listingSchema,
});

export const collections = { listings };
