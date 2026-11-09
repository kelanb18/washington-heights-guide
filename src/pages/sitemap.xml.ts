import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Set SITE, or site in astro.config.mjs, so the sitemap can point at its URL list.');
  }

  const sitemap = new URL('sitemap-0.xml', site);
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    `<sitemap><loc>${sitemap.href}</loc></sitemap>` +
    '</sitemapindex>';

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
