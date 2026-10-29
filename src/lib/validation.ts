/*
 * Form validation — plain functions, no regular expressions (owner's rule).
 * Each validator returns an error message, or null when the value is fine.
 *
 * Vue 3 equivalent: helper/validation.js used by a form composable
 * (the same shape as a VeeValidate / Vuelidate rule: value → message | true).
 */

/** Longest first name we accept (also set as the input's maxLength). */
export const FIRST_NAME_MAX = 50;

/** A validator: returns an error message, or null when valid. */
export type Validator = (value: string) => string | null;

/** First name: required, at most FIRST_NAME_MAX characters. */
export const validateFirstName: Validator = (value) => {
  const name = value.trim();
  if (name === '') return 'Please enter your first name.';
  if (name.length > FIRST_NAME_MAX) return `Please use ${FIRST_NAME_MAX} characters or fewer.`;
  return null;
};

/** Email: required, and shaped like an email address. */
export const validateEmail: Validator = (value) => {
  const email = value.trim();
  if (email === '') return 'Please enter your email address.';
  if (!isEmailShape(email)) return 'Please enter a valid email address, e.g. name@example.com.';
  return null;
};

/**
 * Checks the basic shape name@domain.tld with string methods only:
 * - no whitespace anywhere (spaces, tabs, non-breaking spaces…)
 * - exactly one "@", with text before it
 * - the part after "@" has a "." that is neither its first nor last
 *   character, and no empty parts ("..")
 */
export function isEmailShape(email: string): boolean {
  // A character is whitespace when trimming it leaves nothing.
  for (const ch of email) {
    if (ch.trim() === '') return false;
  }

  const at = email.indexOf('@');
  if (at < 1 || at !== email.lastIndexOf('@')) return false;

  const domain = email.slice(at + 1);
  if (domain.includes('..')) return false;
  return domain.indexOf('.') > 0 && domain.lastIndexOf('.') < domain.length - 1;
}
