import { getCollection, type CollectionEntry } from 'astro:content';
import { assertWriteUp, isPublic, ships } from './publish';
import { referenceId } from './refs';

export type Area = CollectionEntry<'areas'>;

export interface AreaNode {
  area: Area;
  children: AreaNode[];
}

export function compareAreas(a: Area, b: Area): number {
  const ao = a.data.order;
  const bo = b.data.order;
  if (ao != null && bo != null && ao !== bo) return ao - bo;
  if (ao != null && bo == null) return -1;
  if (ao == null && bo != null) return 1;
  return a.data.name.localeCompare(b.data.name, 'en');
}

function parentOf(area: Area): string | undefined {
  return referenceId(area.data.parent);
}

export function assertAreaGraph(areas: Area[]) {
  const byId = new Map(areas.map((area) => [area.id, area]));

  for (const area of areas) {
    const parentId = parentOf(area);
    if (!parentId) continue;

    if (parentId === area.id) {
      throw new Error(`[areas] "${area.id}.md" cannot list itself as parent.`);
    }

    const parent = byId.get(parentId);
    if (!parent) {
      throw new Error(
        `[areas] "${area.id}.md" parent "${parentId}" does not match a file in src/content/areas/.`,
      );
    }

    if (ships(area.data) && !ships(parent.data)) {
      throw new Error(
        `[areas] "${area.id}.md" is published, but parent "${parentId}" is an example or draft. Publish the parent, or hide this file with example or draft.`,
      );
    }

    if (isPublic(area.data) && !isPublic(parent.data)) {
      throw new Error(
        `[areas] "${area.id}.md" parent "${parentId}" is hidden on this build. Publish the parent, or remove the field.`,
      );
    }
  }

  for (const area of areas) {
    const seen: string[] = [];
    const visiting = new Set<string>();
    let current: string | undefined = area.id;
    while (current) {
      if (visiting.has(current)) {
        throw new Error(
          `[areas] Parent links loop (${[...seen, current].join(' → ')}). An area cannot be nested inside itself.`,
        );
      }
      visiting.add(current);
      seen.push(current);
      const entry = byId.get(current);
      current = entry ? parentOf(entry) : undefined;
    }
  }
}

export function areaTree(areas: Area[]): AreaNode[] {
  const ids = new Set(areas.map((area) => area.id));
  const byParent = new Map<string | undefined, Area[]>();

  for (const area of areas) {
    const parent = parentOf(area);
    const key = parent && ids.has(parent) ? parent : undefined;
    const list = byParent.get(key) ?? [];
    list.push(area);
    byParent.set(key, list);
  }

  for (const list of byParent.values()) list.sort(compareAreas);

  const build = (parent: string | undefined): AreaNode[] =>
    (byParent.get(parent) ?? []).map((area) => ({
      area,
      children: build(area.id),
    }));

  return build(undefined);
}

export function hasNestedAreas(nodes: AreaNode[]): boolean {
  return nodes.some((node) => node.children.length > 0 || hasNestedAreas(node.children));
}

export function findAreaNode(nodes: AreaNode[], id: string): AreaNode | undefined {
  for (const node of nodes) {
    if (node.area.id === id) return node;
    const found = findAreaNode(node.children, id);
    if (found) return found;
  }
  return undefined;
}

export function descendantIds(rootId: string, areas: Area[]): Set<string> {
  const ids = new Set(areas.map((area) => area.id));
  const children = new Map<string, string[]>();

  for (const area of areas) {
    const parent = parentOf(area);
    if (!parent || !ids.has(parent)) continue;
    const list = children.get(parent) ?? [];
    list.push(area.id);
    children.set(parent, list);
  }

  const collected = new Set<string>();
  const stack = [rootId];
  while (stack.length > 0) {
    const id = stack.pop();
    if (id == null || collected.has(id)) continue;
    collected.add(id);
    for (const child of children.get(id) ?? []) stack.push(child);
  }
  return collected;
}

export function ancestorAreas(area: Area, areas: Area[]): Area[] {
  const byId = new Map(areas.map((entry) => [entry.id, entry]));
  const chain: Area[] = [];
  const seen = new Set<string>([area.id]);
  let parentId = parentOf(area);

  while (parentId) {
    if (seen.has(parentId)) break;
    seen.add(parentId);
    const parent = byId.get(parentId);
    if (!parent) break;
    chain.unshift(parent);
    parentId = parentOf(parent);
  }

  return chain;
}

export async function loadAreas(): Promise<Area[]> {
  const entries = await getCollection('areas');
  for (const entry of entries) {
    assertWriteUp('areas', entry.id, entry.body, 'Describe the section in the Markdown below the frontmatter.');
  }
  assertAreaGraph(entries);
  return entries.filter((entry) => isPublic(entry.data)).sort(compareAreas);
}
