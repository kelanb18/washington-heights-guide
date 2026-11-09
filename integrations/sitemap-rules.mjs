import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

/**
 * Runs after @astrojs/sitemap and makes the sitemap follow each built page's own head:
 * - pages whose robots meta says noindex are dropped, so a page rejoins the sitemap
 *   as soon as it stops being noindexed (for example, a category that reaches 3 listings);
 * - pages with article:modified_time get <lastmod> (a listing's "Checked" date, or the
 *   newest "Checked" date of the listings a category or area page shows).
 *
 * List this integration after sitemap() in astro.config.mjs.
 */
export default function sitemapRules() {
  return {
    name: 'sitemap-rules',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const sitemapPath = join(outDir, 'sitemap-0.xml');
        let xml;
        try {
          xml = await readFile(sitemapPath, 'utf8');
        } catch {
          logger.warn('sitemap-0.xml not found; skipping sitemap rules.');
          return;
        }

        let dropped = 0;
        let dated = 0;
        const entries = [];
        for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
          const body = match[1];
          const loc = body.match(/<loc>([^<]+)<\/loc>/)?.[1];
          if (!loc) continue;
          const pathname = decodeURI(new URL(loc).pathname);
          let html = '';
          try {
            html = await readFile(join(outDir, pathname, 'index.html'), 'utf8');
          } catch {
            entries.push(`<url>${body}</url>`);
            continue;
          }
          const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? '';
          if (/\bnoindex\b/i.test(robots)) {
            dropped += 1;
            continue;
          }
          const modified = html.match(/<meta property="article:modified_time" content="([^"]+)"/)?.[1];
          let entry = body.replace(/<lastmod>[^<]*<\/lastmod>/, '');
          if (modified) {
            entry = entry.replace(/(<loc>[^<]+<\/loc>)/, `$1<lastmod>${modified}</lastmod>`);
            dated += 1;
          }
          entries.push(`<url>${entry}</url>`);
        }

        const head = xml.slice(0, xml.indexOf('<url>'));
        const tail = xml.slice(xml.lastIndexOf('</url>') + '</url>'.length);
        await writeFile(sitemapPath, head + entries.join('') + tail);
        logger.info(`Sitemap: ${entries.length} URLs, ${dropped} noindexed pages left out, ${dated} with lastmod.`);
      },
    },
  };
}
