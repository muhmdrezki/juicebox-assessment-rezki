/*
 * The hexagon morph between screens (Figma prototype "smart animate").
 *
 * Every screen marks ONE element as "the hexagon" (CSS view-transition-name,
 * classes in globals.css), and the browser morphs it into the next screen's
 * hexagon during a page change. Which element that is can depend on the
 * screen width: on phones the form/results show only the small icon; on
 * desktop they also show the big hexagon on the left, and that one must carry
 * the name instead (two elements with the same name would cancel the transition).
 *
 * Vue 3 equivalent: a shared-element (FLIP) transition between two routes;
 * Vue has none built in, the browser's View Transitions API does it here.
 * Global class names (not CSS Modules), so the name isn't renamed per file.
 */

/** When an element is "the hexagon": at every width, only on phones, or only on desktop. */
export const HEXAGON_MORPH = {
  always: 'vt-hexagon',
  mobile: 'vt-hexagon-mobile',
  desktop: 'vt-hexagon-desktop',
} as const;
