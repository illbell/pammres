import type { Access, FieldAccess, PayloadRequest } from 'payload'

/*
 * Two kinds of signed-in user exist:
 *   - editors: the `users` collection, who sign in to /admin
 *   - members: the `members` collection, who sign in on the site (/login)
 * Content access must check for an editor, never just "someone is signed in",
 * or members would be able to edit the site.
 */

/** True when the request comes from a signed-in editor (`users` collection). */
export const isEditor = (req: PayloadRequest): boolean => req.user?.collection === 'users'

/** Public: anyone, including signed-out site visitors. */
export const anyone: Access = () => true

/** Signed-in editors only. (Named for history: it used to mean any signed-in user.) */
export const authenticated: Access = ({ req }) => isEditor(req)

export const authenticatedField: FieldAccess = ({ req }) => isEditor(req)

/**
 * Drafts-enabled collections: visitors and members see published documents
 * only; editors see drafts too.
 */
export const publishedOrAuthenticated: Access = ({ req }) =>
  isEditor(req) ? true : { _status: { equals: 'published' } }

/** Editors see every member; a signed-in member sees only their own record. */
export const editorOrSelf: Access = ({ req }) => {
  if (isEditor(req)) return true
  if (req.user?.collection === 'members') return { id: { equals: req.user.id } }
  return false
}

/** Editors see every member photo; a member sees only the photos they own. */
export const editorOrOwner: Access = ({ req }) => {
  if (isEditor(req)) return true
  if (req.user?.collection === 'members') return { owner: { equals: req.user.id } }
  return false
}
