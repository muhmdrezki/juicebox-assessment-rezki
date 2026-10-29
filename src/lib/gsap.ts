/*
 * GSAP set-up in one place: registers the React hook once and re-exports
 * both, so components import from here instead of repeating the setup.
 *
 * Vue 3 equivalent: a plugin file (`plugins/gsap.js`) imported by components.
 *
 * useGSAP() ≈ onMounted + onUnmounted in one: animations created inside it
 * are reverted automatically when the component unmounts (no leaks).
 */
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };
