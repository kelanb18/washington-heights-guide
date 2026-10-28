import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = (process.env.SITE ?? 'https://theheights.guide').replace(/\/$/, '');
const includeExamples = process.env.INCLUDE_EXAMPLES === 'true';

function unpublishedSlugs(folder) {
  const dir = join(process.cwd(), 'src/content', folder);
  let files = [];
  try {
    files = readdirSync(dir);
  } catch {
    return [];
  }

  const slugs = [];
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const text = readFileSync(join(dir, file), 'utf8');
    const fence = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const frontmatter = fence?.[1] ?? '';
    if (/^(?:example|draft):\s*true\s*$/m.test(frontmatter)) {
      slugs.push(file.replace(/\.md$/i, ''));
    }
  }
  return slugs;
}

const hidden = {
  places: new Set(unpublishedSlugs('listings')),
  areas: new Set(unpublishedSlugs('areas')),
  people: new Set(unpublishedSlugs('people')),
  'filmed-here': new Set(unpublishedSlugs('productions')),
};

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  image: {
    remotePatterns: [{ protocol: 'https' }],
  },
  integrations: [
    sitemap({
      filter: (page) => {
        let url;
        try {
          url = new URL(page);
        } catch {
          return true;
        }
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[0] === '404') return false;
        const hiddenSlugs = hidden[parts[0]];
        if (hiddenSlugs && parts[1] && hiddenSlugs.has(parts[1])) return false;
        return true;
      },
    }),
  ],
  vite: {
    define: {
      __INCLUDE_EXAMPLES__: JSON.stringify(includeExamples),
    },
  },
});
