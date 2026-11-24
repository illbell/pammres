import type { TextFieldSingleValidation } from 'payload'

/**
 * Links entered by editors end up in <a href>. Allow only http(s) URLs and
 * site-relative paths, so values like "javascript:..." can't be saved.
 */
export const validateUrl: TextFieldSingleValidation = (value) => {
  if (!value) return true
  if (value.startsWith('/') && !value.startsWith('//')) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? true
      : 'Use a link starting with https:// (or a site path like /events).'
  } catch {
    return 'Enter a full link starting with https:// (or a site path like /events).'
  }
}
