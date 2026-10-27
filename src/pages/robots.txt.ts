import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Set SITE, or site in astro.config.mjs, so robots.txt can point at the sitemap.');
  }

  const sitemap = new URL('sitemap-index.xml', site);
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
