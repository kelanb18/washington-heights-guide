import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { areaSchema } from './lib/area-schema';
import { listingSchema } from './lib/listing-schema';
import { personSchema } from './lib/person-schema';
import { productionSchema } from './lib/production-schema';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function markdownFiles(collection: string, folder: string, sample: string) {
  return glob({
    pattern: '*.md',
    base: `./src/content/${folder}`,
    generateId: ({ entry }) => {
      const file = entry.replace(/\\/g, '/');
      if (file.includes('/')) {
        throw new Error(
          `[${collection}] "${file}" is in a subfolder. Put the Markdown file directly in src/content/${folder}/.`,
        );
      }
      const id = file.replace(/\.md$/i, '');
      if (!slugPattern.test(id)) {
        throw new Error(
          `[${collection}] Rename "${file}" to a lowercase slug such as "${sample}". Use letters, numbers, and hyphens only.`,
        );
      }
      return id;
    },
  });
}

const listings = defineCollection({
  loader: markdownFiles('listings', 'listings', 'fort-washington-cafe.md'),
  schema: listingSchema,
});

const areas = defineCollection({
  loader: markdownFiles('areas', 'areas', 'sample-area.md'),
  schema: areaSchema,
});

const people = defineCollection({
  loader: markdownFiles('people', 'people', 'sample-person.md'),
  schema: personSchema,
});

const productions = defineCollection({
  loader: markdownFiles('productions', 'productions', 'sample-picture.md'),
  schema: productionSchema,
});

export const collections = { listings, areas, people, productions };
