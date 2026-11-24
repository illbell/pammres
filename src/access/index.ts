import type { Access, FieldAccess } from 'payload'

/** Public: anyone, including signed-out site visitors. */
export const anyone: Access = () => true

/** Any signed-in admin user. Every user in `users` is a site editor. */
export const authenticated: Access = ({ req }) => Boolean(req.user)

export const authenticatedField: FieldAccess = ({ req }) => Boolean(req.user)

/**
 * Drafts-enabled collections: visitors see published documents only,
 * signed-in editors see drafts too.
 */
export const publishedOrAuthenticated: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }
