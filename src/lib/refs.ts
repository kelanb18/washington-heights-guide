/** Area links are stored as a slug, or as Astro's `{ collection, id }` reference. */
export function referenceId(ref: unknown): string | undefined {
  if (ref == null || ref === '') return undefined;
  if (typeof ref === 'string') return ref;
  if (typeof ref === 'object' && 'id' in ref && typeof (ref as { id: unknown }).id === 'string') {
    const id = (ref as { id: string }).id;
    return id === '' ? undefined : id;
  }
  return undefined;
}
