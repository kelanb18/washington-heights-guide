import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { referenceId } from './refs';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function listingSlugsOnDisk(): Set<string> {
  const dir = join(process.cwd(), 'src/content/listings');
  let files: string[] = [];
  try {
    files = readdirSync(dir);
  } catch {
    return new Set();
  }
  const slugs = new Set<string>();
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const id = file.replace(/\.md$/i, '');
    if (slugPattern.test(id)) slugs.add(id);
  }
  return slugs;
}

type IssueCtx = {
  addIssue: (issue: { code: 'custom'; path: (string | number)[]; message: string; input?: unknown }) => void;
};

export function assertListingSlug(link: unknown, ctx: IssueCtx, path: (string | number)[]) {
  const id = referenceId(link);
  if (id == null) return;
  if (!slugPattern.test(id) || !listingSlugsOnDisk().has(id)) {
    ctx.addIssue({
      code: 'custom',
      path,
      input: id,
      message: `listing "${id}" does not match a file in src/content/listings/.`,
    });
  }
}
