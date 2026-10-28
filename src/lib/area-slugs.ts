import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { referenceId } from './refs';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function areaSlugsOnDisk(): Set<string> {
  const dir = join(process.cwd(), 'src/content/areas');
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

/** Fail the content schema when an area slug does not match a file. */
export function assertAreaSlug(link: unknown, ctx: IssueCtx, path: string) {
  const id = referenceId(link);
  if (id == null) return;

  if (!slugPattern.test(id)) {
    ctx.addIssue({
      code: 'custom',
      path: [path],
      input: id,
      message: `${path} must be an area slug: lowercase letters, numbers, and hyphens, matching a filename in src/content/areas/.`,
    });
    return;
  }

  if (!areaSlugsOnDisk().has(id)) {
    ctx.addIssue({
      code: 'custom',
      path: [path],
      input: id,
      message: `${path} "${id}" does not match a file in src/content/areas/. Add src/content/areas/${id}.md or fix the slug.`,
    });
  }
}
