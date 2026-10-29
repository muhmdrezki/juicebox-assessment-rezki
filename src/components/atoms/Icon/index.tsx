/*
 * Icon (atom) — the small icons used across the app, exported from Figma
 * (20 × 20 components "Arrow left" and "Refresh").
 *
 * Vue 3 equivalent: atoms/Icon/index.vue with a `name` prop and a v-if per
 * icon. In React it is simpler to export one tiny component per icon.
 * Icons are always decorative (aria-hidden): the button around them carries
 * the accessible name. Colour comes from CSS via `currentColor`.
 */

/** Figma icon frame size (20 × 20). */
const ICON_SIZE = 20;

/** Left arrow — back button. Figma "Arrow left". */
export function ArrowLeftIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.70711 16.7071C9.31659 17.0976 8.68342 17.0976 8.2929 16.7071L2.29289 10.7071C1.90237 10.3166 1.90237 9.68342 2.29289 9.29289L8.2929 3.29289C8.68342 2.90237 9.31659 2.90237 9.70712 3.29289C10.0976 3.68342 10.0976 4.31658 9.70712 4.70711L5.41422 9H17C17.5523 9 18 9.44772 18 10C18 10.5523 17.5523 11 17 11L5.41422 11L9.70711 15.2929C10.0976 15.6834 10.0976 16.3166 9.70711 16.7071Z"
      />
    </svg>
  );
}

/** Two circular arrows — restart button. Figma "Refresh". */
export function RestartIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M3.33325 3.33325V7.49992H3.81785M16.615 9.16658C16.2049 5.87799 13.3996 3.33325 9.99992 3.33325C7.2021 3.33325 4.80683 5.05673 3.81785 7.49992M3.81785 7.49992H7.49992M16.6666 16.6666V12.4999H16.182M16.182 12.4999C15.193 14.9431 12.7977 16.6666 9.99992 16.6666C6.60024 16.6666 3.79491 14.1218 3.38483 10.8333M16.182 12.4999H12.4999"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
