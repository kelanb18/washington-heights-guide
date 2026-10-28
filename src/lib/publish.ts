export interface PublishFlags {
  example: boolean;
  draft: boolean;
}

export function placeholdersEnabled(): boolean {
  return import.meta.env.DEV || __INCLUDE_EXAMPLES__;
}

/** Shown on this dev server or this build. */
export function isPublic(data: PublishFlags): boolean {
  if (data.example) return placeholdersEnabled();
  if (data.draft) return import.meta.env.DEV;
  return true;
}

/** Shipped when INCLUDE_EXAMPLES is unset. */
export function ships(data: PublishFlags): boolean {
  return !data.example && !data.draft;
}

const minimumBodyLength = 200;

export function assertWriteUp(collection: string, id: string, body: string | undefined, detail: string) {
  const text = body?.trim() ?? '';
  if (text.length < minimumBodyLength) {
    throw new Error(
      `[${collection}] "${id}.md" needs a write-up of at least ${minimumBodyLength} characters. ${detail}`,
    );
  }
}
