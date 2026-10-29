/*
 * cx — joins CSS Module class names, skipping empty ones.
 *
 * Vue 3 equivalent: the array/object syntax of `:class="[a, isOn && b]"`,
 * which Vue does for you. React's `className` only takes a string.
 */

/** Join truthy class names with a space: cx('a', false, 'b') → "a b". */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
