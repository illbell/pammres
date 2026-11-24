import { revalidatePath } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Frontend pages are prerendered, so content edits in the admin need to
 * refresh the pages that show them. revalidatePath throws outside a Next.js
 * request (e.g. in the seed script), so that case is ignored. Pass
 * `context: { disableRevalidate: true }` to skip it explicitly.
 */
function safeRevalidate(path: string, type?: 'layout' | 'page') {
  try {
    revalidatePath(path, type)
  } catch {
    // Not running inside Next.js; nothing to revalidate.
  }
}

/**
 * afterChange + afterDelete hooks that revalidate the given page paths.
 * `docPaths` adds per-document pages, e.g. (doc) => [`/events/${doc.slug}`].
 * On change it also revalidates the previous document's paths (e.g. a changed slug).
 */
export function revalidatePages(
  paths: string[],
  docPaths?: (doc: Record<string, unknown>) => string[],
): {
  afterChange: CollectionAfterChangeHook[]
  afterDelete: CollectionAfterDeleteHook[]
} {
  const run = (
    context: { disableRevalidate?: unknown },
    docs: (Record<string, unknown> | undefined)[],
  ) => {
    if (context.disableRevalidate) return
    const all = new Set(paths)
    if (docPaths) docs.forEach((d) => d && docPaths(d).forEach((p) => all.add(p)))
    all.forEach((p) => safeRevalidate(p))
  }
  return {
    afterChange: [
      ({ doc, previousDoc, context }) => {
        run(context, [doc, previousDoc])
        return doc
      },
    ],
    afterDelete: [
      ({ doc, context }) => {
        run(context, [doc])
        return doc
      },
    ],
  }
}

/** afterChange hook for site-wide globals: refreshes every page (header/footer live in the root layout). */
export const revalidateAllPages: GlobalAfterChangeHook = ({ doc, context }) => {
  if (!context.disableRevalidate) safeRevalidate('/', 'layout')
  return doc
}
