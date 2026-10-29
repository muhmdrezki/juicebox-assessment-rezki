/*
 * Icon (atom) — the small line icons used across the app.
 *
 * Vue 3 equivalent: atoms/Icon/index.vue with a `name` prop and a v-if per
 * icon. In React it is simpler to export one tiny component per icon.
 * Icons are always decorative (aria-hidden): the button around them carries
 * the accessible name.
 */

type IconProps = {
  size?: number;
};

/** Left arrow — back button. */
export function ArrowLeftIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M14 8H2m0 0 5-5M2 8l5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Two circular arrows — restart button. */
export function RestartIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M13 6.5A5.5 5.5 0 0 0 3.2 4.6M3 9.5a5.5 5.5 0 0 0 9.8 1.9M3 2v3h3m7 9v-3h-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
