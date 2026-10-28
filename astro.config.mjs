import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = (process.env.SITE ?? 'https://theheights.guide').replace(/\/$/, '');
const includeExamples = process.env.INCLUDE_EXAMPLES === 'true';

function unpublishedSlugs() {
  const dir = join(process.cwd(), 'src/content/listings');
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

const hiddenPlaces = new Set(unpublishedSlugs());

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
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
        if (parts[0] === 'places' && parts[1] && hiddenPlaces.has(parts[1])) return false;
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
